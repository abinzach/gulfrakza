import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/admin/',
    },
    sitemap: 'https://www.gulfrakza.com/sitemap.xml',
    host: 'https://www.gulfrakza.com',
  }
}
