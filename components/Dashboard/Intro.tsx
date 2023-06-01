'use client';
import { useEffect, useState } from 'react';
import { auth } from '@/lib/firebase';
import { motion } from 'framer-motion';
import { useRouter } from 'next/router';
import { Suspense } from 'react';

const DashboardPage = () => {
	const [user, setUser] = useState(null);
	const router = useRouter();

	useEffect(() => {
		const unsubscribe = auth.onAuthStateChanged((currentUser) => {
			setUser(currentUser);
		});

		return () => unsubscribe();
	}, []);

	return (
		<div className="flex flex-col items-center justify-center h-screen bg-gray-100">
			<motion.h1
				initial={{ opacity: 0, y: -20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
				className="text-4xl font-bold mb-4"
			>
				Welcome to Your Dashboard
			</motion.h1>
			{user ? (
				<Suspense fallback={<p className="text-xl mb-2">Loading...</p>}>
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5 }}
					>
						<p className="text-xl mb-2">Name: {user.displayName}</p>
						<p className="text-xl mb-2">Email: {user.email}</p>{' '}
					</motion.div>
				</Suspense>
			) : (
				<p className="text-xl mb-2">Loading...</p>
			)}
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
};

export default DashboardPage;
