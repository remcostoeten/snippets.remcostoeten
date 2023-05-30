import { useEffect, useState } from 'react';
import { auth } from '@/lib/firebase';
import { motion } from 'framer-motion';
import { useRouter } from 'next/router';
import { Suspense } from 'react';
import Aside from './Aside';

const DashboardPage = () => {
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);
	const router = useRouter();
	useEffect(() => {
		const unsubscribe = auth.onAuthStateChanged((currentUser) => {
			setUser(currentUser);
			setLoading(false);
		});

		return () => unsubscribe();
	}, []);

	useEffect(() => {
		if (user === null) {
			router.push('/login');
		}
	}, [user, router]);

	const skeletonContent = (
		<div className="flex flex-col items-center justify-center h-screen bg-gray-100 w-full">
			<motion.h1
				initial={{ opacity: 0, y: -20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
				className="text-4xl font-bold mb-4"
			>
				Welcome to Your Dashboard
			</motion.h1>
			<div className="text-xl mb-2">Loading...</div>
			<motion.p
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ duration: 0.5 }}
				className="text-gray-500"
			>
				Current date: {new Date().toLocaleDateString()}
			</motion.p>
		</div>
	);

	return (
		<div className="flex flex-1">
			<div className="flex flex-col items-center justify-center h-screen bg-gray-100 w-full">
				{loading ? (
					skeletonContent
				) : (
					<>
						<motion.h1
							initial={{ opacity: 0, y: -20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.5 }}
							className="text-4xl font-bold mb-4"
						>
							Welcome to Your Dashboard
						</motion.h1>
						{user ? (
							<Suspense
								fallback={
									<div className="text-xl mb-2">
										Loading...
									</div>
								}
							>
								<motion.div
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ duration: 0.5 }}
								>
									<p className="text-xl mb-2">
										Name: {user.displayName}
									</p>
									<p className="text-xl mb-2">
										Email: {user.email}
									</p>
								</motion.div>
							</Suspense>
						) : (
							<div className="text-xl mb-2">Loading...</div>
						)}
						<motion.p
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ duration: 0.5 }}
							className="text-gray-500"
						>
							Current date: {new Date().toLocaleDateString()}
						</motion.p>
					</>
				)}
			</div>
		</div>
	);
};

export default DashboardPage;
