import type { MetadataRoute } from 'next'

export const metadata = {
  metadataBase: new URL('https://remcostoeten.nl'),
  title: {
    default: 'Code Snippets & Development Tools | RemcoStoeten',
    template: '%s | RemcoStoeten'
  },
  description: 'Collection of useful code snippets, development tools, and programming resources. Find practical solutions for web development, React, TypeScript, and more.',
  keywords: ['code snippets', 'web development', 'react', 'typescript', 'development tools', 'programming resources'],
  openGraph: {
    description: 'Collection of useful code snippets, development tools, and programming resources. Find practical solutions for web development, React, TypeScript, and more.',
    title: 'Code Snippets & Development Tools | RemcoStoeten',
    url: 'https://remcostoeten.nl',
    siteName: 'RemcoStoeten Code Snippets',
    locale: 'en_US',
    type: 'website',
    images: [{
      url: 'https://remcostoeten.nl/api/og',
      width: 1200,
      height: 630,
      alt: 'RemcoStoeten Code Snippets'
    }]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Code Snippets & Development Tools | RemcoStoeten',
    description: 'Collection of useful code snippets, development tools, and programming resources.',
    images: ['https://remcostoeten.nl/api/og'],
  }
}

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: ['/api/', '/admin/', '/_next/']
        },
        sitemap: 'https://remcostoeten.nl/sitemap.xml'
    }
}
