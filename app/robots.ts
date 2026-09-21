import { MetadataRoute } from 'next'

// The catalog filters are a combinatorial space — category x features x brands
// x search x sort — and every permutation renders the same ~2 MB product grid
// under a different URL. None of them should be crawled: the canonical on
// /products already points at the unfiltered page. The leading `*` after `?`
// matches the parameter wherever it lands in the query string.
const disallowedFilterUrls = [
  '/*?*category=',
  '/*?*features=',
  '/*?*brands=',
  '/*?*search=',
  '/*?*sort=',
]

// Repeated into every group on purpose: a crawler that matches its own
// User-agent group ignores the `*` group entirely, so the AI crawlers below
// would otherwise inherit none of these rules.
const disallowed = ['/admin/', '/studio/', '/studio', '/api/', ...disallowedFilterUrls]

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: disallowed },
      { userAgent: 'OAI-SearchBot', allow: '/', disallow: disallowed },
      { userAgent: 'ChatGPT-User', allow: '/', disallow: disallowed },
      { userAgent: 'PerplexityBot', allow: '/', disallow: disallowed },
      { userAgent: 'ClaudeBot', allow: '/', disallow: disallowed },
    ],
    sitemap: 'https://www.gulfrakza.com/sitemap.xml',
    host: 'https://www.gulfrakza.com',
  }
}
