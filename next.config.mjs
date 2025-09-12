import { createMDX } from 'fumadocs-mdx/next'

const withMDX = createMDX()

/** @type {import('next').NextConfig} */
const config = {
    reactStrictMode: true,
    poweredByHeader: false,
    compress: true,
    // Performance optimizations
    experimental: {
        optimizePackageImports: ['lucide-react', '@radix-ui/react-icons', 'framer-motion'],
        turbo: {
            rules: {
                '*.svg': {
                    loaders: ['@svgr/webpack'],
                    as: '*.js',
                },
            },
        },
    },
    // Bundle optimization
    webpack: (config, { dev, isServer }) => {
        // Optimize bundle size
        if (!dev && !isServer) {
            config.optimization.splitChunks = {
                chunks: 'all',
                cacheGroups: {
                    vendor: {
                        test: /[\\/]node_modules[\\/]/,
                        name: 'vendors',
                        chunks: 'all',
                    },
                    three: {
                        test: /[\\/]node_modules[\\/](three|@react-three)[\\/]/,
                        name: 'three',
                        chunks: 'all',
                    },
                    framer: {
                        test: /[\\/]node_modules[\\/](framer-motion|motion)[\\/]/,
                        name: 'framer',
                        chunks: 'all',
                    },
                    shiki: {
                        test: /[\\/]node_modules[\\/](shiki|@shikijs)[\\/]/,
                        name: 'shiki',
                        chunks: 'all',
                    },
                    'react-icons': {
                        test: /[\\/]node_modules[\\/](react-icons)[\\/]/,
                        name: 'react-icons',
                        chunks: 'all',
                    },
                },
            };
        }
        return config;
    },
    images: {
        formats: ['image/avif', 'image/webp'],
        deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
        minimumCacheTTL: 60,
        dangerouslyAllowSVG: true,
        contentDispositionType: 'attachment',
        contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
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
