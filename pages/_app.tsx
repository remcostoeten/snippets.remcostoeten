import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { getSession } from 'next-auth/react'; // Update the import statement
import { AuthProvider } from '@/lib/AuthContext';
import Preloader from '@/components/ui-elements/Preloader';
import TopNotice from '@/components/ui-elements/TopNotice';
import Aside from '@/components/Dashboard/Aside';
import '../styles/globals.scss';
import Head from 'next/head';
import { motion } from 'framer-motion';

function MyApp({ Component, pageProps }) {
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(true);
	const [hasVisited, setHasVisited] = useState(false);

	useEffect(() => {
		const visited = localStorage.getItem('hasVisited');
		if (visited) {
			setHasVisited(true);
			setIsLoading(false);
		} else {
			localStorage.setItem('hasVisited', 'true');
		}
	}, []);

	useEffect(() => {
		const fetchSession = async () => {
			const session = await getSession();
			console.log(session);

			if (session) {
				setIsLoading(false); // Set isLoading to false if session exists
			}
		};

		fetchSession();
	}, []);

	return (
		<>
			{(!hasVisited || isLoading) && <Preloader />}{' '}
			{/* Show loader if hasVisited is false or isLoading is true */}
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
					<motion.div
						className="flex content"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ duration: 1 }}
					>
						{/* {shouldRenderAside && <Aside user={undefined} />} */}
						<div className="h-screen bg-white w-full">
							<Component {...pageProps} />
						</div>
					</motion.div>
				</AuthProvider>
			</div>
		</>
	);
}

export default MyApp;
