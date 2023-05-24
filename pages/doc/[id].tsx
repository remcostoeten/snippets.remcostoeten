import { GetServerSideProps } from 'next';
import { getDocuments, getDocument, CustomDocumentData } from '@/lib/firestore';
import TreeView from '@/components/TreeView';

interface DocumentPageProps {
	document: CustomDocumentData | null;
	documents: CustomDocumentData[];
}

const DocumentPage: React.FC<DocumentPageProps> = ({ document, documents }) => {
	if (!document) {
		return <div>Document not found.</div>;
	}

	return (
		<div className="flex h-screen">
			<div className="w-64 bg-gray-800">
				<TreeView documents={documents} />
			</div>
			<div className="flex-1 bg-gray-100 p-6">
				<h1 className="text-2xl font-bold mb-4">{document.title}</h1>
				<div dangerouslySetInnerHTML={{ __html: document.content }} />
			</div>
		</div>
	);
};

export const getServerSideProps: GetServerSideProps = async (context) => {
	const id = context.params?.id as string;
	const document = await getDocument(id);
	const documents = await getDocuments();

	return {
		props: {
			document,
			documents,
		},
	};
};

export default DocumentPage;
