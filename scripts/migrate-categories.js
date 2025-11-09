const { createClient } = require('@sanity/client');
const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');
require('dotenv').config({ path: '.env' });

// Initialize Sanity client with write token
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: process.env.SANITY_API_VERSION || '2024-01-01',
  token: process.env.SANITY_API_WRITE_TOKEN,
  useCdn: false,
});

// Helper function to generate slug from title
function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .trim();
}

// Helper function to download image from URL
function downloadImage(url) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;
    protocol.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download image: ${response.statusCode}`));
        return;
      }
      const chunks = [];
      response.on('data', (chunk) => chunks.push(chunk));
      response.on('end', () => resolve(Buffer.concat(chunks)));
      response.on('error', reject);
    }).on('error', reject);
  });
}

// Helper function to upload image to Sanity
async function uploadImage(imagePath, isUrl = false) {
  try {
    let imageBuffer;
    let filename;

    if (isUrl) {
      // Download from URL
      console.log(`   Downloading: ${imagePath}`);
      imageBuffer = await downloadImage(imagePath);
      filename = path.basename(new URL(imagePath).pathname);
    } else {
      // Read from local file
      const fullPath = path.join(process.cwd(), 'public', imagePath);
      if (!fs.existsSync(fullPath)) {
        console.log(`   ⚠️  Image not found: ${fullPath}`);
        return null;
      }
      imageBuffer = fs.readFileSync(fullPath);
      filename = path.basename(imagePath);
    }

    // Upload to Sanity
    const asset = await client.assets.upload('image', imageBuffer, {
      filename: filename,
    });

    console.log(`   ✅ Uploaded: ${filename}`);
    return {
      _type: 'image',
      asset: {
        _type: 'reference',
        _ref: asset._id,
      },
    };
  } catch (error) {
    console.error(`   ❌ Error uploading image: ${error.message}`);
    return null;
  }
}

// Helper function to check if category exists
async function categoryExists(slug) {
  const query = `*[_type == "category" && slug.current == $slug][0]`;
  const result = await client.fetch(query, { slug });
  return result;
}

// Main migration function
async function migrateCategories() {
  console.log('🚀 Starting category migration...\n');

  // Read JSON file
  const jsonPath = path.join(process.cwd(), 'app', 'Product_Categories.json');
  const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

  const stats = {
    mainCategories: 0,
    subcategories: 0,
    itemCategories: 0,
    skipped: 0,
    errors: 0,
  };

  // Count categories
  console.log(`📦 Found ${data.categories.length} main categories`);
  let subcategoryCount = 0;
  let itemCount = 0;
  data.categories.forEach((cat) => {
    if (cat.subcategories) {
      subcategoryCount += cat.subcategories.length;
      cat.subcategories.forEach((sub) => {
        if (sub.items) {
          itemCount += sub.items.length;
        }
      });
    }
  });
  console.log(`📦 Found ${subcategoryCount} subcategories`);
  console.log(`📦 Found ${itemCount} item categories\n`);

  // Step 1: Create main categories
  console.log('📝 Creating main categories...');
  const mainCategoryMap = new Map();

  for (let i = 0; i < data.categories.length; i++) {
    const category = data.categories[i];
    const slug = generateSlug(category.title);

    // Check if already exists
    const existing = await categoryExists(slug);
    if (existing) {
      console.log(`   ⏭️  Skipped (exists): ${category.title}`);
      mainCategoryMap.set(category.title, existing._id);
      stats.skipped++;
      continue;
    }

    try {
      // Upload image if exists
      let heroImage = null;
      if (category.imageSrc) {
        heroImage = await uploadImage(category.imageSrc, false);
      }

      // Create category document
      const doc = {
        _type: 'category',
        title: {
          en: category.title,
          ar: '',
        },
        slug: {
          _type: 'slug',
          current: slug,
        },
        parent: null,
        summary: {
          en: category.description || '',
          ar: '',
        },
        order: i + 1,
        heroImage: heroImage,
      };

      const result = await client.create(doc);
      mainCategoryMap.set(category.title, result._id);
      console.log(`   ✅ Created: ${category.title}`);
      stats.mainCategories++;
    } catch (error) {
      console.error(`   ❌ Error creating ${category.title}: ${error.message}`);
      stats.errors++;
    }
  }

  console.log('');

  // Step 2: Create subcategories
  console.log('📝 Creating subcategories...');
  const subcategoryMap = new Map();

  for (const category of data.categories) {
    if (!category.subcategories) continue;

    const parentId = mainCategoryMap.get(category.title);
    if (!parentId) {
      console.log(`   ⚠️  Parent not found for subcategories of: ${category.title}`);
      continue;
    }

    for (let i = 0; i < category.subcategories.length; i++) {
      const subcategory = category.subcategories[i];
      const slug = generateSlug(subcategory.title);

      // Check if already exists
      const existing = await categoryExists(slug);
      if (existing) {
        console.log(`   ⏭️  Skipped (exists): ${subcategory.title}`);
        subcategoryMap.set(`${category.title}::${subcategory.title}`, existing._id);
        stats.skipped++;
        continue;
      }

      try {
        const doc = {
          _type: 'category',
          title: {
            en: subcategory.title,
            ar: '',
          },
          slug: {
            _type: 'slug',
            current: slug,
          },
          parent: {
            _type: 'reference',
            _ref: parentId,
          },
          summary: {
            en: subcategory.description || '',
            ar: '',
          },
          order: i + 1,
        };

        const result = await client.create(doc);
        subcategoryMap.set(`${category.title}::${subcategory.title}`, result._id);
        console.log(`   ✅ Created: ${subcategory.title}`);
        stats.subcategories++;
      } catch (error) {
        console.error(`   ❌ Error creating ${subcategory.title}: ${error.message}`);
        stats.errors++;
      }
    }
  }

  console.log('');

  // Step 3: Create item categories
  console.log('📝 Creating item categories...');

  for (const category of data.categories) {
    if (!category.subcategories) continue;

    for (const subcategory of category.subcategories) {
      if (!subcategory.items) continue;

      const parentId = subcategoryMap.get(`${category.title}::${subcategory.title}`);
      if (!parentId) {
        console.log(`   ⚠️  Parent not found for items of: ${subcategory.title}`);
        continue;
      }

      for (let i = 0; i < subcategory.items.length; i++) {
        const item = subcategory.items[i];
        const slug = generateSlug(item.title);

        // Check if already exists
        const existing = await categoryExists(slug);
        if (existing) {
          console.log(`   ⏭️  Skipped (exists): ${item.title}`);
          stats.skipped++;
          continue;
        }

        try {
          // Upload image if exists
          let heroImage = null;
          if (item.imageSrc) {
            const isUrl = item.imageSrc.startsWith('http');
            heroImage = await uploadImage(item.imageSrc, isUrl);
          }

          const doc = {
            _type: 'category',
            title: {
              en: item.title,
              ar: '',
            },
            slug: {
              _type: 'slug',
              current: slug,
            },
            parent: {
              _type: 'reference',
              _ref: parentId,
            },
            summary: {
              en: item.description || '',
              ar: '',
            },
            order: i + 1,
            heroImage: heroImage,
          };

          await client.create(doc);
          console.log(`   ✅ Created: ${item.title}`);
          stats.itemCategories++;
        } catch (error) {
          console.error(`   ❌ Error creating ${item.title}: ${error.message}`);
          stats.errors++;
        }
      }
    }
  }

  // Print summary
  console.log('\n' + '='.repeat(50));
  console.log('🎉 Migration complete!\n');
  console.log(`   Main categories created: ${stats.mainCategories}`);
  console.log(`   Subcategories created: ${stats.subcategories}`);
  console.log(`   Item categories created: ${stats.itemCategories}`);
  console.log(`   Total created: ${stats.mainCategories + stats.subcategories + stats.itemCategories}`);
  console.log(`   Skipped (already exist): ${stats.skipped}`);
  console.log(`   Errors: ${stats.errors}`);
  console.log('='.repeat(50));
}

// Run migration
migrateCategories().catch((error) => {
  console.error('❌ Migration failed:', error);
  process.exit(1);
});
