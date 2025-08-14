export function StructuredData() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "RemcoStoeten Snippets",
    description: "A comprehensive collection of code snippets, documentation, and programming resources.",
    url: "https://snippets.remcostoeten.com",
    author: {
      "@type": "Person",
      name: "Remco Stoeten",
      url: "https://remcostoeten.com"
    },
    sameAs: [
      "https://github.com/remcostoeten",
      "https://twitter.com/remcostoeten",
      // Add other social profiles
    ],
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: "https://snippets.remcostoeten.com/search?q={search_term_string}"
      },
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
