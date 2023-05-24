import { firestore } from '@/lib/firebase';
export interface CustomDocumentData {
  id: string;
  title: string;
  content: string;
}

export async function getDocuments(): Promise<CustomDocumentData[]> {
  const snapshot = await firestore.collection('documents').get();
  const documents = snapshot.docs.map((doc) => ({
    id: doc.id,
    title: doc.data().title,
    content: doc.data().content,
  }));

  return documents;
}

export interface CustomDocumentData {
  id: string;
  title: string;
  content: string;
}

export async function getDocument(id: string): Promise<CustomDocumentData | null> {
	const docRef = firestore.collection('documents').doc(id);
	const docSnapshot = await docRef.get();
  
	if (docSnapshot.exists) {
	  const documentData = docSnapshot.data();
	  if (documentData) {
		return {
		  id: docSnapshot.id,
		  title: documentData.title,
		  content: documentData.content,
		};
	  }
	}
  
	return null;
  }
  