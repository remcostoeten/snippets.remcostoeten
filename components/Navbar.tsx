import { auth, googleAuthProvider } from '@/lib/firebase';
import { useState, useContext } from 'react';
import { UserContext } from '../lib/context';

export default function SignInButton() {
  const userData = useContext(UserContext);

  return (
    <main>
      {userData ? 
        !userData.username ? <UsernameForm /> : <SignOutButton /> 
        : 
        <SignInBtn />
      }
    </main>
  );
}

function SignInBtn() {
  const [error, setError] = useState(null);

  const signInWithGoogle = async () => {
    try {
      await auth.signInWithPopup(googleAuthProvider);
    } catch (error) {
      setError(error);
    }
  };

  return (
    <>
      {error && <p>{error.message}</p>}
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
