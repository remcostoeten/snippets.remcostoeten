import type { AppProps } from 'next/app';
import '../styles/globals.scss';
import Loader from '@/components/ui-elements/Loader';
import Sidebar from '@/components/Sidebar';
import TopNotice from '@/components/ui-elements/TopNotice';
function MyApp({ Component, pageProps }: AppProps) {
	return (
		<>
			<TopNotice />
			<div className="flex">
				<Sidebar />
				<main className="main-content flex flex-col flex-1 h-screen bg-white rounded-lg p-4 w-95">
					<Component {...pageProps} />
				</main>
			</div>
		</>
	);
}

export default MyApp;
