/// <reference types="node" />
import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://snippets.remcostoeten.com'
    const today = new Date().toISOString()

    // Define static pages and docs pages
    const pages: MetadataRoute.Sitemap = [
        {
            url: baseUrl,
            lastModified: today,
            changeFrequency: 'daily' as const,
            priority: 1
        },
        {
            url: `${baseUrl}/snippets`,
            lastModified: today,
            changeFrequency: 'weekly' as const,
            priority: 0.8
        },
        {
            url: `${baseUrl}/about`,
            lastModified: today,
            changeFrequency: 'monthly' as const,
            priority: 0.5
        },
        {
            url: `${baseUrl}/query-builder`,
            lastModified: today,
            changeFrequency: 'weekly' as const,
            priority: 0.9
        }
    ]

    return pages
}
