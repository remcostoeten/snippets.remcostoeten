import { Suspense } from 'react';
import dynamic from 'next/dynamic';
import { AppProps } from 'next/app';
import '../styles/globals.scss';
import Preloader from '@/components/ui-elements/Preloader';
import { AuthProvider } from '@/lib/AuthContext';
import TopNotice from '@/components/ui-elements/TopNotice';

const Sidebar = dynamic(() => import('@/components/Sidebar'), { ssr: false });
const Aside = dynamic(() => import('@/components/Dashboard/Aside'), {
	ssr: false,
});

function MyApp({ Component, pageProps }: AppProps) {
	return (
		<>
			<Suspense fallback={<Preloader />}>
				<AuthProvider>
					<TopNotice />
					<div className="flex">
						<Aside />
						<main className="main-content flex flex-col flex-1 h-screen bg-white rounded-lg p-4 w-95">
							<Component {...pageProps} />
						</main>
					</div>
				</AuthProvider>
			</Suspense>
		</>
	);
}

export default MyApp;
