import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import { AppProps } from 'next/app';
import '../styles/globals.scss';
import Preloader from '@/components/ui-elements/Preloader';
import { AuthProvider } from '@/lib/AuthContext';
import TopNotice from '@/components/ui-elements/TopNotice';

const Sidebar = dynamic(() => import('@/components/Sidebar'), {
	ssr: false,
	loading: () => <Preloader />,
});

const Aside = dynamic(() => import('@/components/Dashboard/Aside'), {
	ssr: false,
	loading: () => <Preloader />,
});

function MyApp({ Component, pageProps }: AppProps) {
	const [isLoading, setIsLoading] = useState(true);
	const router = useRouter();

	useEffect(() => {
		const handleRouteChangeComplete = () => {
			setIsLoading(false);
		};

		router.events.on('routeChangeComplete', handleRouteChangeComplete);

		return () => {
			router.events.off('routeChangeComplete', handleRouteChangeComplete);
		};
	}, []);

	return (
		<AuthProvider>
			{isLoading ? (
				<Preloader />
			) : (
				<>
					<TopNotice />
					<Component {...pageProps} />
				</>
			)}
		</AuthProvider>
	);
}

export default MyApp;
