import React, { useState, useEffect, createContext } from 'react';
import { auth } from './firebase';
import { AppUser } from './types';

interface AuthContextProps {
	currentUser: AppUser | null;
	setCurrentUser: React.Dispatch<React.SetStateAction<AppUser | null>>;
}

export const AuthContext = createContext<AuthContextProps | null>(null);

interface AuthProviderProps {
	children: React.ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
	const [currentUser, setCurrentUser] = useState<AppUser | null>(null);
	const [pending, setPending] = useState(true);

	useEffect(() => {
		const unsubscribe = auth.onAuthStateChanged((user: any) => {
			if (user) {
				setCurrentUser({
					uid: user.uid,
					displayName: user.displayName || '',
					email: user.email || '',
					photoURL: user.photoURL || '',
				});
			} else {
				setCurrentUser(null);
			}
			setPending(false);
		});

		return () => unsubscribe();
	}, []);

	if (pending) {
		return <>Loading...</>;
	}

	return (
		<AuthContext.Provider value={{ currentUser, setCurrentUser }}>
			{children}
		</AuthContext.Provider>
	);
};
