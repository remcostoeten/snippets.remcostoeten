import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { collection, getFirestore, getDocs, addDoc, doc, updateDoc } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyB_OxFAbOowfYUU9v730OONfdj0ch1MuSE",
  authDomain: "remcostoeten-docs.firebaseapp.com",
  projectId: "remcostoeten-docs",
  storageBucket: "remcostoeten-docs.appspot.com",
  messagingSenderId: "457325786920",
  appId: "1:457325786920:web:782eb6f05bb419f900c21d"
};


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);
const storage = getStorage(app);
const googleAuthProvider = new GoogleAuthProvider();

export async function getDocuments() {
  const documentsCollection = collection(firestore, 'documents');
  const snapshot = await getDocs(documentsCollection);

  const documents = snapshot.docs.map((doc) => ({
    id: doc.id,
    title: doc.data().title,
    content: doc.data().content,
  }));

  return documents;
}

export async function getNotes(userId) {
  const notesCollection = collection(firestore, `users/${userId}/notes`);
  const snapshot = await getDocs(notesCollection);

  const notes = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  return notes;
}

export async function handleAddNote(userId, note) {
  try {
    const docRef = await addDoc(collection(firestore, `users/${userId}/notes`), note);
    console.log('Note added with ID:', docRef.id);
  } catch (error) {
    console.error('Error adding note:', error);
  }
}

export async function handleAddDocument(newDocument) {
  try {
    const docRef = await addDoc(collection(firestore, 'tasks'), newDocument);
    console.log('Document added with ID:', docRef.id);
  } catch (error) {
    console.error('Error adding document:', error);
  }
}

export async function handleToggleDocument(docId, task) {
  try {
    const docRef = doc(firestore, 'tasks', docId);
    const taskData = { ...task };
    await updateDoc(docRef, taskData);
  } catch (error) {
    console.error('Error updating document:', error);
  }
}

export {
  auth,
  firestore,
  storage,
  googleAuthProvider
};