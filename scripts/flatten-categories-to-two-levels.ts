import { getCliClient } from 'sanity/cli';

type Category = {
  _id: string;
  parentId?: string | null;
  slug?: string | null;
  title?: { en?: string | null } | null;
};

type Product = {
  _id: string;
  slug?: string | null;
  title?: { en?: string | null } | null;
  categoryPath?: Array<{ _key?: string; _ref?: string }> | null;
};

const apiVersion = '2025-01-01';
const applyChanges = process.argv.includes('--apply');
const client = getCliClient({ apiVersion });
const publishedId = (id: string) => id.replace(/^drafts\./, '');

const main = async () => {
const categories = await client.fetch<Category[]>(
  `*[_type == "category"]{
    _id,
    "parentId": parent._ref,
    "slug": slug.current,
    title
  }`,
);

const products = await client.fetch<Product[]>(
  `*[_type == "product"]{
    _id,
    "slug": slug.current,
    title,
    categoryPath[]{ _key, _ref }
  }`,
);

const publishedCategories = new Map<string, Category>();
for (const category of categories) {
  const id = publishedId(category._id);
  if (!publishedCategories.has(id) || !category._id.startsWith('drafts.')) {
    publishedCategories.set(id, category);
  }
}

const depthOf = (category: Category) => {
  let depth = 1;
  let current = category;
  const visited = new Set<string>();

  while (current.parentId) {
    const parentId = publishedId(current.parentId);
    if (visited.has(parentId)) {
      throw new Error(`Circular category parent relationship detected at ${parentId}.`);
    }
    visited.add(parentId);

    const parent = publishedCategories.get(parentId);
    if (!parent) {
      throw new Error(`Category ${current._id} points to missing parent ${current.parentId}.`);
    }

    depth += 1;
    current = parent;
  }

  return depth;
};

const thirdLevelCategories = categories.filter((category) => depthOf(category) >= 3);
const thirdLevelIds = new Set(thirdLevelCategories.map((category) => publishedId(category._id)));

const productMigrations = products.flatMap((product) => {
  const referencedThirdLevels = (product.categoryPath ?? [])
    .map((reference) => reference._ref && publishedCategories.get(publishedId(reference._ref)))
    .filter((category): category is Category => Boolean(category && depthOf(category) >= 3));

  if (referencedThirdLevels.length === 0) return [];

  const secondLevelIds = new Set(
    referencedThirdLevels
      .map((category) => category.parentId && publishedId(category.parentId))
      .filter((id): id is string => Boolean(id)),
  );
  if (secondLevelIds.size !== 1) {
    throw new Error(`Product ${product._id} references third-level categories from multiple branches.`);
  }

  const secondLevelId = [...secondLevelIds][0];
  const secondLevel = publishedCategories.get(secondLevelId);
  const topLevelId = secondLevel?.parentId ? publishedId(secondLevel.parentId) : null;
  if (!secondLevel || !topLevelId || depthOf(secondLevel) !== 2) {
    throw new Error(`Could not resolve a valid two-level path for product ${product._id}.`);
  }

  return [{
    product,
    secondLevel,
    categoryPath: [
      { _type: 'reference', _key: 'category-level-1', _ref: topLevelId },
      { _type: 'reference', _key: 'category-level-2', _ref: secondLevelId },
    ],
  }];
});

console.log(JSON.stringify({
  mode: applyChanges ? 'apply' : 'dry-run',
  thirdLevelCategoryCount: thirdLevelCategories.length,
  affectedProductCount: productMigrations.length,
  productMigrations: productMigrations.map(({ product, secondLevel, categoryPath }) => ({
    id: product._id,
    product: product.title?.en ?? product.slug ?? product._id,
    destination: secondLevel.title?.en ?? secondLevel.slug ?? secondLevel._id,
    categoryPath: categoryPath.map((reference) => reference._ref),
  })),
}, null, 2));

if (!applyChanges) {
  console.log('Dry run only. Re-run with --apply after reviewing this output.');
  process.exit(0);
}

for (let index = 0; index < productMigrations.length; index += 50) {
  const transaction = client.transaction();
  for (const migration of productMigrations.slice(index, index + 50)) {
    transaction.patch(migration.product._id, { set: { categoryPath: migration.categoryPath } });
  }
  await transaction.commit();
}

const categoryIdsToDelete = thirdLevelCategories.map((category) => category._id);
const remainingReferences = await client.fetch<Array<{ _id: string; _type: string }>>(
  `*[!(_id in $categoryIds) && references($publishedCategoryIds)]{ _id, _type }`,
  {
    categoryIds: categoryIdsToDelete,
    publishedCategoryIds: [...thirdLevelIds],
  },
);

if (remainingReferences.length > 0) {
  throw new Error(
    `Refusing to delete categories because references remain: ${JSON.stringify(remainingReferences)}`,
  );
}

for (let index = 0; index < categoryIdsToDelete.length; index += 50) {
  const transaction = client.transaction();
  for (const categoryId of categoryIdsToDelete.slice(index, index + 50)) {
    transaction.delete(categoryId);
  }
  await transaction.commit();
}

const verification = await client.fetch<{ thirdLevelCategories: number; affectedProducts: number }>(
  `{
    "thirdLevelCategories": count(*[_type == "category" && defined(parent->parent)]),
    "affectedProducts": count(*[_type == "product" && count(categoryPath[@->parent->parent._ref != null]) > 0])
  }`,
);

if (verification.thirdLevelCategories !== 0 || verification.affectedProducts !== 0) {
  throw new Error(`Post-migration verification failed: ${JSON.stringify(verification)}`);
}

console.log(JSON.stringify({
  migrated: productMigrations.length,
  deleted: categoryIdsToDelete.length,
  verification,
}, null, 2));
};

main().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});
