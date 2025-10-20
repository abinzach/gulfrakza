const { createClient } = require('@sanity/client');
require('dotenv').config({ path: '.env' });

// Initialize Sanity client
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: process.env.SANITY_API_VERSION || '2024-01-01',
  token: process.env.SANITY_API_WRITE_TOKEN,
  useCdn: false,
});

async function checkParentAssociations() {
  console.log('🔍 Checking parent-child associations...\n');

  // Query to get all categories with their parent information
  const query = `*[_type == "category"] | order(order asc) {
    _id,
    "title": title.en,
    "slug": slug.current,
    "parentId": parent._ref,
    "parentTitle": parent->title.en,
    order
  }`;

  const categories = await client.fetch(query);

  // Organize by hierarchy level
  const mainCategories = categories.filter(cat => !cat.parentId);
  const subcategories = categories.filter(cat => {
    if (!cat.parentId) return false;
    const parent = categories.find(c => c._id === cat.parentId);
    return parent && !parent.parentId;
  });
  const itemCategories = categories.filter(cat => {
    if (!cat.parentId) return false;
    const parent = categories.find(c => c._id === cat.parentId);
    return parent && parent.parentId;
  });

  console.log('📊 Category Hierarchy Summary:');
  console.log(`   Main Categories: ${mainCategories.length}`);
  console.log(`   Subcategories: ${subcategories.length}`);
  console.log(`   Item Categories: ${itemCategories.length}`);
  console.log(`   Total: ${categories.length}\n`);

  // Check for orphaned categories (parent reference exists but parent not found)
  const orphaned = categories.filter(cat => {
    if (!cat.parentId) return false;
    return !categories.find(c => c._id === cat.parentId);
  });

  if (orphaned.length > 0) {
    console.log('⚠️  Orphaned Categories (parent reference broken):');
    orphaned.forEach(cat => {
      console.log(`   - ${cat.title} (${cat.slug})`);
    });
    console.log('');
  }

  // Sample check: Show a few examples from each level
  console.log('✅ Sample Parent Associations:\n');

  console.log('Main Categories (no parent):');
  mainCategories.slice(0, 3).forEach(cat => {
    console.log(`   - ${cat.title} (${cat.slug})`);
  });
  console.log('');

  console.log('Subcategories (with parent):');
  subcategories.slice(0, 5).forEach(cat => {
    console.log(`   - ${cat.title} → Parent: ${cat.parentTitle || 'NOT FOUND'}`);
  });
  console.log('');

  console.log('Item Categories (with parent):');
  itemCategories.slice(0, 5).forEach(cat => {
    console.log(`   - ${cat.title} → Parent: ${cat.parentTitle || 'NOT FOUND'}`);
  });
  console.log('');

  // Check if all parent references resolve
  const unresolvedParents = categories.filter(cat => cat.parentId && !cat.parentTitle);
  
  if (unresolvedParents.length > 0) {
    console.log('❌ Categories with unresolved parent references:');
    console.log(`   Found ${unresolvedParents.length} categories with broken parent links\n`);
    unresolvedParents.slice(0, 10).forEach(cat => {
      console.log(`   - ${cat.title} (parent ID: ${cat.parentId})`);
    });
  } else {
    console.log('✅ All parent references resolve correctly!');
  }

  console.log('\n' + '='.repeat(50));
  console.log('Check complete!');
  console.log('='.repeat(50));
}

checkParentAssociations().catch(error => {
  console.error('❌ Error checking associations:', error);
  process.exit(1);
});
