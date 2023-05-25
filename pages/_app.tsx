import type { AppProps } from 'next/app';
import Navbar from '../components/Navbar';
import '../styles/globals.scss';
import Loader from '@/components/ui-elements/Loader';
import Sidebar from '@/components/Sidebar';
import TopNotice from '@/components/ui-elements/TopNotice';
function MyApp({ Component, pageProps }: AppProps) {
	return (
		<>
			<TopNotice />
			<Navbar />
			<div className="flex">
				<Sidebar />
				<main className="flex flex-col flex-1">
					<Component {...pageProps} />
				</main>
			</div>
		</>
	);
}

export default MyApp;
