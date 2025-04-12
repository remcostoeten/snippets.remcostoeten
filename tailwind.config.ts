import type { Config } from 'tailwindcss'

const config: Config = {
    content: [
        './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
        './src/app/**/*.{js,ts,jsx,tsx,mdx}'
    ],
    theme: {
        extend: {
            backgroundSize: {
                '300%': '300%'
            },
            animation: {
                'gradient-x': 'gradient-x 15s ease infinite'
            },
            keyframes: {
                'gradient-x': {
                    '0%, 100%': {
                        'background-position': 'left center'
                    },
                    '50%': {
                        'background-position': 'right center'
                    }
                }
            },
            container: {
                center: true,
                padding: '1rem',
                screens: {
                    '2xl': '1400px'
                }
            }
        }
    },
    plugins: []
}

export default config
