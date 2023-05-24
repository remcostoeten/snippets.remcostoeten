import { firestore } from './firebase';

export interface DocumentData {
	  id: string;
	    title: string;
	      content: string;
}

export async function getDocuments(): Promise<DocumentData[]> {
	  const snapshot = await firestore.collection('documents').get();
	    
	    const documents = snapshot.docs.map(doc => ({
		        id: doc.id,
			    title: doc.data().title,
			        content: doc.data().content
				  }));

				    return documents;
}

