import { createMDX } from 'fumadocs-mdx/next'

const withMDX = createMDX()

/** @type {import('next').NextConfig} */
const config = {
    reactStrictMode: true,
    poweredByHeader: false,
    compress: true,
    images: {
        formats: ['image/avif', 'image/webp'],
        deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
        minimumCacheTTL: 60
    },
    headers: async () => [
        {
            source: '/:path*',
            headers: [
                {
                    key: 'X-DNS-Prefetch-Control',
                    value: 'on'
                },
                {
                    key: 'X-XSS-Protection',
                    value: '1; mode=block'
                },
                {
                    key: 'X-Frame-Options',
                    value: 'SAMEORIGIN'
                },
                {
                    key: 'X-Content-Type-Options',
                    value: 'nosniff'
                },
                {
                    key: 'Referrer-Policy',
                    value: 'strict-origin-when-cross-origin'
                }
            ]
        }
    ]
}

export default withMDX(config)
