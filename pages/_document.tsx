import { Html, Head, Main, NextScript } from 'next/document';
import { Roboto } from '@next/font/google';

const roboto = Roboto({
	weight: ['500', '400', '900'],
});

export default function Document() {
	return (
		<Html className={roboto.className}>
			<Head />
			<body>
				<Main />
				<NextScript />
			</body>
		</Html>
	);
}
