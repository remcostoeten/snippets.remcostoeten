import type { AppProps } from 'next/app';
import Navbar from '../components/Navbar';
import '../styles/globals.scss';
import Loader from '@/components/ui-elements/Loader';
import Sidebar from '@/components/Sidebar';
function MyApp({ Component, pageProps }: AppProps) {
	return (
		<>
			<Navbar />
			<div className="flex">
				<Sidebar />
				<main>
					<Component {...pageProps} />
				</main>
			</div>
		</>
	);
}

export default MyApp;
