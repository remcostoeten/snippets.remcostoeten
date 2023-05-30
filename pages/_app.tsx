import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { AuthProvider } from '@/lib/AuthContext';
import Preloader from '@/components/ui-elements/Preloader';
import TopNotice from '@/components/ui-elements/TopNotice';
import Aside from '@/components/Dashboard/Aside';

import '../styles/globals.scss';

function MyApp({ Component, pageProps }) {
	const router = useRouter();
	const [firstVisit, setFirstVisit] = useState(false);

	useEffect(() => {
		let mounted = true;

		if (typeof window !== 'undefined') {
			const visitedBefore = localStorage.getItem('visitedBefore');
			setTimeout(() => {
				// i; This line seems to be an error and can be removed
			}, 3500);

			if (!visitedBefore && mounted) {
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
			<TopNotice />
			<AuthProvider>
				<div className="flex content">
					<Aside user={undefined} />
					<Component {...pageProps} />
				</div>
			</AuthProvider>
		</>
	);
}

export default MyApp;
