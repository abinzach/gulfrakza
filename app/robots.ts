import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/admin/',
        '/studio/',
        '/studio',
        '/api/',
      ],
    },
    sitemap: 'https://www.gulfrakza.com/sitemap.xml',
    host: 'https://www.gulfrakza.com',
  }
}
