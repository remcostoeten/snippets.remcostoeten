import Preloader from '@/components/ui-elements/Preloader';
import '../styles/globals.scss';
import TopNotice from '@/components/ui-elements/TopNotice';
import { AuthProvider } from '@/lib/AuthContext';
import { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import { useEffect, useState, useCallback } from 'react';

function MyApp({ Component, pageProps }: AppProps) {
	const router = useRouter();
	const [firstVisit, setFirstVisit] = useState(false);

	useEffect(() => {
		let mounted = true;

		if (typeof window !== 'undefined') {
			const visitedBefore = localStorage.getItem('visitedBefore');
			if (visitedBefore && mounted) {
				setFirstVisit(true);
				localStorage.setItem('visitedBefore', 'true');
			}
		}

		return () => {
			mounted = false;
		};
	}, []);

	return (
		<>
			{firstVisit && <Preloader />}
			<AuthProvider>
				<TopNotice />
				<Component {...pageProps} />
			</AuthProvider>
		</>
	);
}

export default MyApp;
