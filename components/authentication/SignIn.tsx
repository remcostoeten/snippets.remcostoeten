import { auth, googleAuthProvider } from '@/lib/firebase';
import { useState } from 'react';
import SignInButton from './SignIn';

export default function SignInButton() {
  const user = null;
  const username = null;

  return (
    <main>
      {user ? 
        !username ? <UsernameForm /> : <SignOutButton /> 
        : 
        <SignInBtn />
      }
    </main>
  );
}

function SignInButton() {
	    const signInWithGoogle = async () => {
			try {
	 
				await auth.signInWithPopup(googleAuthProvider);
			}
		}  catch (error) {
			console.error(error);

		} 	
	};



  return (
    <>
      {error && <p>{error}</p>}
      <button className="btn-google" onClick={signInWithGoogle}>
        <img src={'/google.png'} /> Sign in with Google
      </button>
    </>
  );
}

function SignOutButton() {
  return <button onClick={() => auth.signOut()}>Sign Out</button>;
}

function UsernameForm() {
  return null;
}