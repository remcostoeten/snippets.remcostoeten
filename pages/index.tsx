import React, { useEffect, useState } from 'react';
import firebase from 'firebase/app';
import 'firebase/auth';
import Navbar from '../components/Navbar';

const Home = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div>
      {user ? (
        <Navbar user={user} />
      ) : (
        <button onClick={() => firebase.auth().signInWithPopup(new firebase.auth.GoogleAuthProvider())}>
          Login with Google
        </button>
      )}
      <h1>Welcome to the App</h1>
      {user && <p>Hello, {user.displayName}!</p>}
    </div>
  );
};

export default Home;
