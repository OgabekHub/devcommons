import { MetadataRoute } from 'next'
import { createSupabasePublic } from '@/lib/supabase-server'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://devcommons.uz'
  const locales = ['uz', 'en']

  // Public pages only — no private/auth pages
  const staticPages = [
    { path: '', priority: 1, changeFrequency: 'daily' as const },
    { path: '/snippets', priority: 0.9, changeFrequency: 'daily' as const },
    { path: '/prompts', priority: 0.9, changeFrequency: 'daily' as const },
    { path: '/feed', priority: 0.8, changeFrequency: 'daily' as const },
    { path: '/leaderboard', priority: 0.7, changeFrequency: 'weekly' as const },
    { path: '/tags', priority: 0.6, changeFrequency: 'weekly' as const },
    { path: '/pricing', priority: 0.6, changeFrequency: 'monthly' as const },
    { path: '/docs', priority: 0.7, changeFrequency: 'weekly' as const },
    { path: '/cli', priority: 0.6, changeFrequency: 'monthly' as const },
    { path: '/playground', priority: 0.7, changeFrequency: 'weekly' as const },
    { path: '/search', priority: 0.5, changeFrequency: 'daily' as const },
  ]

  const sitemap: MetadataRoute.Sitemap = []

  // Static pages with locale alternates
  for (const page of staticPages) {
    for (const locale of locales) {
      sitemap.push({
        url: `${baseUrl}/${locale}${page.path}`,
        lastModified: new Date(),
        changeFrequency: page.changeFrequency,
        priority: page.priority,
        alternates: {
          languages: Object.fromEntries(
            locales.map(l => [l, `${baseUrl}/${l}${page.path}`])
          ),
        },
      })
    }
  }

  // Dynamic pages: fetch recent snippets and prompts
  try {
    const supabase = createSupabasePublic()

    const [snippetsResult, promptsResult] = await Promise.all([
      supabase
        .from('snippets')
        .select('id, updated_at')
        .order('updated_at', { ascending: false })
        .limit(200),
      supabase
        .from('prompts')
        .select('id, updated_at')
        .order('updated_at', { ascending: false })
        .limit(200),
    ])

    // Snippet detail pages
    if (snippetsResult.data) {
      for (const snippet of snippetsResult.data) {
        for (const locale of locales) {
          sitemap.push({
            url: `${baseUrl}/${locale}/snippets/${snippet.id}`,
            lastModified: snippet.updated_at ? new Date(snippet.updated_at) : new Date(),
            changeFrequency: 'weekly',
            priority: 0.6,
            alternates: {
              languages: Object.fromEntries(
                locales.map(l => [l, `${baseUrl}/${l}/snippets/${snippet.id}`])
              ),
            },
          })
        }
      }
    }

    // Prompt detail pages
    if (promptsResult.data) {
      for (const prompt of promptsResult.data) {
        for (const locale of locales) {
          sitemap.push({
            url: `${baseUrl}/${locale}/prompts/${prompt.id}`,
            lastModified: prompt.updated_at ? new Date(prompt.updated_at) : new Date(),
            changeFrequency: 'weekly',
            priority: 0.6,
            alternates: {
              languages: Object.fromEntries(
                locales.map(l => [l, `${baseUrl}/${l}/prompts/${prompt.id}`])
              ),
            },
          })
        }
      }
    }
  } catch (error) {
    // If dynamic fetch fails, still return static pages
    console.error('Sitemap dynamic fetch error:', error)
  }

  return sitemap
}
