export default function StructuredData() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'DevCommons',
    description: 'Kod snippet\'lar, AI prompt\'lar va tajriba almashish platformasi. Bepul, ochiq, hammaga.',
    url: 'https://devcommons.uz',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://devcommons.uz/search?q={search_term_string}',
      'query-input': 'required name=search_term_string',
    },
    publisher: {
      '@type': 'Organization',
      name: 'DevCommons',
      url: 'https://devcommons.uz',
      logo: 'https://devcommons.uz/icon-512.png',
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  )
}
