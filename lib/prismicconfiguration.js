import Prismic from 'prismic-javascript';

export const apiEndpoint = 'https://remcostoeten.cdn.prismic.io/api/v2';
export const accessToken = ''; // Invoegen indien gebruikt

export const Client = (req = null) => {
	return Prismic.client(apiEndpoint, createClientOptions(req, accessToken));
};

const createClientOptions = (req = null, prismicAccessToken = null) => {
	const reqOption = req ? { req } : {};
	const accessTokenOption = prismicAccessToken
		? { accessToken: prismicAccessToken }
		: {};
	return {
		...reqOption,
		...accessTokenOption,
	};
};
