export async function GET() {
    const baseUrl = 'https://snippets.remcostoeten.com'

    const feed = `<?xml version="1.0" encoding="UTF-8" ?>
    <rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/">
      <channel>
        <title>RemcoStoeten Snippets</title>
        <link>${baseUrl}</link>
        <description>A comprehensive collection of code snippets, documentation, and programming resources.</description>
        <language>en</language>
        <item>
          <title>Documentation</title>
          <link>${baseUrl}/snippets</link>
          <guid>${baseUrl}/snippets</guid>
          <description>Browse all documentation and code snippets</description>
          <pubDate>${new Date().toUTCString()}</pubDate>
        </item>
        <item>
          <title>CRUD Query Builder - Interactive Drizzle ORM Playground</title>
          <link>${baseUrl}/query-builder</link>
          <guid>${baseUrl}/query-builder</guid>
          <description>Build and test CRUD operations with our interactive playground. Paste your Drizzle schema, use the visual builder, and generate production-ready TypeScript code instantly.</description>
          <pubDate>${new Date().toUTCString()}</pubDate>
        </item>
      </channel>
    </rss>`

    return new Response(feed, {
        headers: {
            'Content-Type': 'application/xml',
            'Cache-Control': 's-maxage=3600, stale-while-revalidate'
        }
    })
}
