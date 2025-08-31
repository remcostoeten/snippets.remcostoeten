import QueryBuilderPage from '@/components/query-builder'
import type { Metadata } from 'next'
import { QueryBuilderStructuredData } from './structured-data'

export const metadata: Metadata = {
  title: 'CRUD Query Builder - Interactive Drizzle ORM Playground | RemcoStoeten Snippets',
  description: 'Build and test CRUD operations with our interactive playground. Paste your Drizzle schema, use the visual builder, and generate production-ready TypeScript code instantly. Perfect for Next.js developers.',
  keywords: [
    'CRUD query builder',
    'Drizzle ORM',
    'TypeScript',
    'Next.js',
    'database operations',
    'code generator',
    'schema parser',
    'visual query builder',
    'database playground',
    'ORM tools',
    'server functions',
    'database abstraction'
  ],
  authors: [{ name: 'Remco Stoeten' }],
  creator: 'Remco Stoeten',
  publisher: 'RemcoStoeten Snippets',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://snippets.remcostoeten.com'),
  alternates: {
    canonical: '/query-builder',
  },
  openGraph: {
    title: 'CRUD Query Builder - Interactive Drizzle ORM Playground',
    description: 'Build and test CRUD operations with our interactive playground. Paste your Drizzle schema, use the visual builder, and generate production-ready TypeScript code instantly.',
    url: 'https://snippets.remcostoeten.com/query-builder',
    siteName: 'RemcoStoeten Snippets',
    images: [
      {
        url: '/og-query-builder.png',
        width: 1200,
        height: 630,
        alt: 'CRUD Query Builder - Interactive Drizzle ORM Playground',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CRUD Query Builder - Interactive Drizzle ORM Playground',
    description: 'Build and test CRUD operations with our interactive playground. Paste your Drizzle schema, use the visual builder, and generate production-ready TypeScript code instantly.',
    images: ['/og-query-builder.png'],
    creator: '@remcostoeten',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
    yahoo: 'your-yahoo-verification-code',
  },
  category: 'technology',
  classification: 'Developer Tools',
}

export default function Page() {
  return (
    <>
      <QueryBuilderStructuredData />
      <QueryBuilderPage />
    </>
  )
}
