// src/components/Navbar.js
import React from 'react';
import firebase from 'firebase/app';
import 'firebase/auth';

interface User {
  displayName: string;
  photoURL: string;
}

interface NavbarProps {
  user: User;
}

const Navbar: React.FC<NavbarProps> = ({ user }) => {
  const handleLogout = async () => {
    try {
      await firebase.auth().signOut();
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <nav>
      <div>
        <img src={user.photoURL} alt="User" />
        <span>{user.displayName}</span>
      </div>
      <button onClick={handleLogout}>Logout</button>
    </nav>
  );
  }
  export default Navbar
