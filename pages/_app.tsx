import { User } from 'firebase/auth';
import { AuthContext, AuthProvider } from '@/lib/AuthContext';
import { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import { useEffect, useState, useContext } from 'react';
import Aside from '@/components/Dashboard/Aside';
import TopNotice from '@/components/ui-elements/TopNotice';
import Preloader from './tests/preloader';
function MyApp({ Component, pageProps }: AppProps) {
	const router = useRouter();
	const [firstVisit, setFirstVisit] = useState(false);
	const authContext = useContext(AuthContext);
	const currentUser: Partial<User> = authContext?.currentUser || null;

	useEffect(() => {
		let mounted = true;

		if (typeof window !== 'undefined') {
			const visitedBefore = localStorage.getItem('visitedBefore');
			document.body.classList.add('loading');
			setTimeout(() => {
				document.body.classList.remove('loading');
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
					<Aside user={currentUser} />
					<Component {...pageProps} />
				</div>
			</AuthProvider>
		</>
	);
}

export default MyApp;
