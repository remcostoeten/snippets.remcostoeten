/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		'./pages/**/*.{js,ts,jsx,tsx,mdx}',
		'./components/**/*.{js,ts,jsx,tsx,mdx}',
		'./app/**/*.{js,ts,jsx,tsx,mdx}',
	],
	darkMode: 'class',
	theme: {
		extend: {
			backgroundImage: {
				'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
				'gradient-conic':
					'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
			},
			colors: {
				offWhite: '#f5f5f5',
				'light-purple': '#66328e',
				'dark-purple': '#1a0b26',
			},
			backgroundColor: {
				'dark-purple': '#1a0b26',
				'light-purple': '#66328e',
			},
			width: {
				'95vw': '95vw',
				'93vh': '93vh',
			},
			animation: {
				'spin-slow': 'spin 3s linear infinite',
			},
		},
	},
	plugins: [],
};
