import React, { useState, useEffect, createContext } from 'react';
import { auth } from './firebase';
import { User } from './types';

interface AuthContextProps {
  currentUser: User | null;
}

export const AuthContext = createContext<AuthContextProps | null>(null);

interface AuthProviderProps {
    children: React.ReactNode;
  }
  
  export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [pending, setPending] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user: any) => {
      if (user) {
        setCurrentUser({
          ...user,
          name: user.name || "", //\
        }); 
      }
      setPending(false);
    });

    return () => unsubscribe();
  }, []);


  if (pending) {
    return <>Loading...</>;
  }

  return (
    <AuthContext.Provider value={{ currentUser }}>
      {children}
    </AuthContext.Provider>
  );
};
