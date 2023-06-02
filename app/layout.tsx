import TopNotice from '@/components/ui-elements/TopNotice';
import '@/styles/globals.scss';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
	title: 'Remco Stoeten',
	description: 'Hello, my name is remco 🔥 ',
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en">
			<TopNotice />
			<body className={inter.className}>{children}</body>
		</html>
	);
}
