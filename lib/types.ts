export interface user {
	name: string;
	user: string;
}

export interface document {
	id: string;
	title: string;
	category: string;
	content: string;
  }

  export interface HomeProps {
	user: user;
	documents: DocumentData[]; // Verander 'document' naar 'DocumentData'
  }
  
export interface  DocumentData {
	id: string;
	title: string;
	content: string;
  };

