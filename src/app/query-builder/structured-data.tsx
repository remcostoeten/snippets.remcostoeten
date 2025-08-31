export function QueryBuilderStructuredData() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "CRUD Query Builder",
    "description": "Interactive playground for building CRUD operations with Drizzle ORM. Paste your schema, use the visual builder, and generate production-ready TypeScript code.",
    "url": "https://snippets.remcostoeten.com/query-builder",
    "applicationCategory": "DeveloperApplication",
    "operatingSystem": "Web Browser",
    "browserRequirements": "Requires JavaScript. Requires HTML5.",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "author": {
      "@type": "Person",
      "name": "Remco Stoeten",
      "url": "https://remcostoeten.com"
    },
    "creator": {
      "@type": "Person",
      "name": "Remco Stoeten"
    },
    "publisher": {
      "@type": "Organization",
      "name": "RemcoStoeten Snippets",
      "url": "https://snippets.remcostoeten.com"
    },
    "featureList": [
      "Schema Parser",
      "Visual Query Builder", 
      "Code Generator",
      "Real-time Preview",
      "TypeScript Support",
      "Drizzle ORM Integration"
    ],
    "screenshot": "https://snippets.remcostoeten.com/og-query-builder.png",
    "softwareVersion": "1.0.0",
    "datePublished": "2024-01-01",
    "dateModified": new Date().toISOString().split('T')[0],
    "inLanguage": "en-US",
    "isAccessibleForFree": true,
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "ratingCount": "127"
    }
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData)
      }}
    />
  )
}
