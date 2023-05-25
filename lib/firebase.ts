
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';
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

const handleAddDocument = async (newDocument: { id: number, title: string, done: boolean }) => {
	try {
		const docRef = await firestore.collection('tasks').add(newDocument);
		console.log('Document toegevoegd met ID:', docRef.id);
	} catch (error) {
		console.error('Fout bij het toevoegen van document:', error);
	}
};

 const handleToggleDocument = async (id: string, updatedDocument: { id: number, title: string, done: boolean }) => {
	try {
		await firestore.collection('tasks').doc(id).update(updatedDocument);
		console.log('Document bijgewerkt met ID:', id);
	} catch (error) {
		console.error('Fout bij het bijwerken van document:', error);
	}
};
export const auth = firebase.auth();
export const googleAuthProvider = new firebase.auth.GoogleAuthProvider();

export const firestore = firebase.firestore();
export const storage = firebase.storage();
 export { handleAddDocument, handleToggleDocument };