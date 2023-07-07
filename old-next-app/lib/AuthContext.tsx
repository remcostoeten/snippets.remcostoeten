import React, { useState, useEffect, createContext } from 'react';
import { auth } from './firebase';
import { AppUser } from './types';
import { User } from 'next-auth/core/types';

export interface IUser {
	uid: string;
	displayName: string | null;
	email: string | null;
	photoURL: string | null;
  }
  
	  
	  export interface AuthContextProps {
		currentUser: IUser | null;
		setCurrentUser: (user: IUser | null) => void;
	  }

export const AuthContext = createContext<AuthContextProps | null>(null);

interface AuthProviderProps {
	children: React.ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
	const [currentUser, setCurrentUser] = useState<IUser | null>(null);
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
