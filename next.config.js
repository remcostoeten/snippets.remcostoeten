/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
};
nextConfig.images = {
	domains: [
		'images.prismic.io',
		'img.freepik.com',
		'images.unsplash.com',
		'tailus.io',
		' tailus.io/',
		'lh3.googleusercontent.com',
	],
};

module.exports = nextConfig;
