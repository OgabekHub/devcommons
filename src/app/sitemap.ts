import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://devcommons.uz'
  const locales = ['uz', 'en']

  const staticPages = [
    '',
    '/snippets',
    '/prompts',
    '/auth',
    '/profile',
    '/saved',
    '/feed',
    '/analytics',
    '/leaderboard',
    '/tags',
  ]

  const sitemap: MetadataRoute.Sitemap = []

  // Generate sitemap entries for each locale and static page
  for (const locale of locales) {
    for (const page of staticPages) {
      sitemap.push({
        url: `${baseUrl}/${locale}${page}`,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: page === '' ? 1 : 0.8,
      })
    }
  }

  return sitemap
}
