import { useEffect, useState } from 'react';
import { auth, googleAuthProvider } from '../lib/firebase';
import user from '@/lib/types';

export default function Navbar() {
	const [user, setUser] = useState<User | null>(null);

	useEffect(() => {
		const unsubscribe = auth.onAuthStateChanged((user) => {
			setUser(user);
		});

		// Cleanup subscription on unmount
		return () => unsubscribe();
	}, []);

	const signInWithGoogle = async () => {
		await auth.signInWithPopup(googleAuthProvider);
	};

	const signOut = async () => {
		await auth.signOut();
		setUser(null);
	};

	return (
		<nav className="flex items-center justify-between p-6 bg-blue-500">
			<span className="text-xl font-semibold text-white">My App</span>
			<div>
				{user ? (
					<div className="flex items-center">
						<span className="text-white">{user.displayName}</span>
						<button
							onClick={signOut}
							className="ml-4 px-4 py-2 text-sm font-medium text-blue-500 rounded bg-white hover:bg-blue-200"
						>
							Sign Out
						</button>
					</div>
				) : (
					<button
						onClick={signInWithGoogle}
						className="px-4 py-2 text-sm font-medium text-blue-500 rounded bg-white hover:bg-blue-200"
					>
						Sign In with Google
					</button>
				)}
			</div>
		</nav>
	);
}
