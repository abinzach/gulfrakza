import { MetadataRoute } from 'next';
import productsData from './Product_Categories.json';

export default function sitemap(): MetadataRoute.Sitemap {
  const urls: MetadataRoute.Sitemap = [];

  // Add homepage and about page
  urls.push({
    url: 'https://gulfrakza.com',
    lastModified: new Date(),
    changeFrequency: 'yearly',
    priority: 1,
  });
  urls.push({
    url: 'https://gulfrakza.com/about',
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.8,
  });

  // Helper function to add a URL
  const addUrl = (
    path: string,
    priority: number = 0.7,
    frequency: "yearly" | "always" | "hourly" | "daily" | "weekly" | "monthly" | "never" = "monthly"
  ) => {
    urls.push({
      url: `https://gulfrakza.com${path}`,
      lastModified: new Date(),
      changeFrequency: frequency,
      priority,
    });
  };

  // Loop through categories, subcategories, and items to add their routes
  productsData.categories.forEach(category => {
    if (category.link) {
      addUrl(category.link, 0.9);
    }
    if (category.subcategories) {
      category.subcategories.forEach(subcat => {
        // Check if the subcategory has items to process
        if (subcat.items) {
          subcat.items.forEach(item => {
            // If an item has a link, add it.
            if (item.link) {
              addUrl(item.link, 0.85);
            }
            addUrl(item.link, 0.7);
          });
        }
      });
    }
  });

  return urls;
}
