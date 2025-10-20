import type { StructureResolver } from 'sanity/structure';

const hiddenDocTypes = new Set(['category', 'product']);

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      S.listItem()
        .title('Categories')
        .schemaType('category')
        .child(S.documentTypeList('category').title('Categories')),
      S.listItem()
        .title('Products')
        .schemaType('product')
        .child(S.documentTypeList('product').title('Products')),
      ...S.documentTypeListItems().filter(
        (listItem) => !hiddenDocTypes.has(String(listItem.getId()))
      ),
    ]);
