export default function JsonLd() {
    const schema = {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: 'RemcoStoeten Snippets',
        alternateName: 'Code Snippets & Documentation',
        url: 'https://snippets.remcostoeten.com',
        description: 'A comprehensive collection of code snippets, documentation, and programming resources.',
        author: {
            '@type': 'Person',
            name: 'Remco Stoeten',
            url: 'https://remcostoeten.com'
        },
        publisher: {
            '@type': 'Organization',
            name: 'Remco Stoeten',
            logo: {
                '@type': 'ImageObject',
                url: 'https://snippets.remcostoeten.com/logo.png'
            }
        },
        inLanguage: 'en-US',
        isFamilyFriendly: true,
        keywords: 'code snippets, programming, documentation, development, tutorials'
    }

    // biome-ignore lint/security/noDangerouslySetInnerHTML: JSON-LD requires innerHTML for SEO
    return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
}
