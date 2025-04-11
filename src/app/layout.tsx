import './global.css'
import { Providers } from '@/components/core/providers'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

const inter = Inter({
    subsets: ['latin']
})

export const metadata: Metadata = {
    metadataBase: new URL('https://snippets.remcostoeten.com'),
    title: {
        template: '%s | RemcoStoeten Snippets',
        default: 'RemcoStoeten Code Snippets & Documentation'
    },
    description:
        'A comprehensive collection of code snippets, documentation, and programming resources by Remco Stoeten.',
    keywords: ['code snippets', 'programming', 'documentation', 'development', 'tutorials', 'remco stoeten'],
    authors: [{ name: 'Remco Stoeten' }],
    creator: 'Remco Stoeten',
    publisher: 'Remco Stoeten',
    formatDetection: {
        email: false,
        address: false,
        telephone: false
    },
    openGraph: {
        type: 'website',
        locale: 'en_US',
        url: 'https://snippets.remcostoeten.com',
        siteName: 'RemcoStoeten Snippets',
        title: 'RemcoStoeten Code Snippets & Documentation',
        description: 'A comprehensive collection of code snippets, documentation, and programming resources.',
        images: [
            {
                url: '/og-image.png',
                width: 1200,
                height: 630,
                alt: 'RemcoStoeten Snippets'
            }
        ]
    },
    twitter: {
        card: 'summary_large_image',
        title: 'RemcoStoeten Code Snippets & Documentation',
        description: 'A comprehensive collection of code snippets, documentation, and programming resources.',
        images: ['/og-image.png'],
        creator: '@remcostoeten'
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1
        }
    },
    verification: {
        google: 'your-google-site-verification'
    }
}

export default function RootLayout({
    children
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en" className={inter.className} suppressHydrationWarning>
            <body className="flex flex-col min-h-screen">
                <Providers>{children}</Providers>
            </body>
        </html>
    )
}
