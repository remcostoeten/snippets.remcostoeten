import React from 'react';
import { Client } from '../lib/prismicconfiguration';

const Home = ({ home }) => {
	// ...
	return (
		<div className="flex h-screen">
			<div className="flex-1 bg-gray-100"></div>
		</div>
	);
};

export async function getStaticProps() {
	const client = Client();
	let home;

	try {
		home = await client.getSingle('home');
	} catch (error) {
		console.error('Fout bij het ophalen van de home data:', error);
	}

	if (!home) {
		return {
			notFound: true,
		};
	}

	return {
		props: {
			home,
		},
	};
}

export default Home;
