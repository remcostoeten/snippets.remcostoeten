import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { AuthProvider } from '@/lib/AuthContext';
import Preloader from '@/components/ui-elements/Preloader';
import TopNotice from '@/components/ui-elements/TopNotice';
import Aside from '@/components/Dashboard/Aside';
import '../styles/globals.scss';
import Head from 'next/head';

function MyApp({ Component, pageProps }) {
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		let mounted = true;

		if (typeof window !== 'undefined') {
			const visitedBefore = localStorage.getItem('visitedBefore');

			if (!visitedBefore && mounted) {
				localStorage.setItem('visitedBefore', 'false');
			}

			setTimeout(() => {
				setIsLoading(false);
			}, 3500);
		}

		return () => {
			mounted = false;
		};
	}, []);

	const shouldRenderAside = router.pathname !== '';

	return (
		<>
			<Preloader />
			<div
				className={`roboto content-wrapper ${
					isLoading ? 'loading' : ''
				}`}
			>
				<Head>
					<link
						rel="stylesheet"
						href="https://fonts.googleapis.com/css?family=Roboto:400,500,900&display=swap"
					/>
				</Head>
				{/* {shouldRenderAside && <TopNotice />} */}
				<TopNotice />
				<AuthProvider>
					<div className="flex content">
						{/* {shouldRenderAside && <Aside user={undefined} />} */}
						<div className="h-screen bg-white w-full">
							<Component {...pageProps} />
						</div>
					</div>
				</AuthProvider>
			</div>
		</>
	);
}

export default MyApp;
