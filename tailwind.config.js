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
				'light-grey': '#6c7293',
				'border-color': '#2c2e33',
			},
			borderColor: {
				'border-color': '#2c2e33',
			},

			backgroundColor: {
				'background-accent': '#191c24',
				black: '#000000',
				'light-grey': '#6c7293',
				'dark-purple': '#1a0b26',
				'light-purple': '#66328e',
				'accent-color': '#22242e',
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
