
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';
import { firestore } from './firebase';

const firebaseConfig = {
	apiKey: "AIzaSyB_OxFAbOowfYUU9v730OONfdj0ch1MuSE",
	authDomain: "remcostoeten-docs.firebaseapp.com",
	projectId: "remcostoeten-docs",
	storageBucket: "remcostoeten-docs.appspot.com",
	messagingSenderId: "457325786920",
	appId: "1:457325786920:web:782eb6f05bb419f900c21d"
  };

  if (!firebase.apps.length) {
	firebase.initializeApp(firebaseConfig);
  }
  
  type Task = {
	id: string;
	title: string;
	done: boolean;
  };
  
  const handleAddDocument = async (newDocument: Task) => {
	try {
	  const docRef = await firebase.firestore().collection('tasks').add(newDocument);
	  console.log('Document added with ID:', docRef.id);
	} catch (error) {
	  console.error('Error adding document:', error);
	}
  };
  
  const handleToggleDocument = async (docId: string, task: Task) => {
	try {
	  await firebase.firestore().collection('tasks').doc(docId).update(task);
	} catch (error) {
	  console.error('Error updating document:', error);
	}
  };
  
  export const auth = firebase.auth();
  export const googleAuthProvider = new firebase.auth.GoogleAuthProvider();
  export const storage = firebase.storage();
  export { handleAddDocument, handleToggleDocument };
  