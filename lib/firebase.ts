
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';

const firebaseConfig = {
		apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
			authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
				projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
					storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
						messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
							appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

if (!firebase.apps.length) {
		firebase.initializeApp(firebaseConfig);
}

const handleAddDocument = async (newDocument) => {
	try {
	  const docRef = await firestore.collection('documentatie').add(newDocument);
	  console.log('Document toegevoegd met ID:', docRef.id);
	} catch (error) {
	  console.error('Fout bij het toevoegen van document:', error);
	}
  };
  

export const auth = firebase.auth();
export const googleAuthProvider = new firebase.auth.GoogleAuthProvider();

export const firestore = firebase.firestore();
export const storage = firebase.storage();
