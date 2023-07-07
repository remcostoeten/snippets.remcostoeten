import Link from 'next/link';
import { useRouter } from 'next/router';
import { CustomDocumentData } from '../lib/firebase';

interface TreeViewProps {
	documents: CustomDocumentData[];
}

const TreeView: React.FC<TreeViewProps> = ({ documents }) => {
	const router = useRouter();

	return (
		<div className="h-full overflow-y-auto bg-gray-800">
			{documents &&
				documents.map((doc) => (
					<Link href={`/doc/${doc.id}`} key={doc.id}>
						{doc.title}
					</Link>
				))}
		</div>
	);
};

export default TreeView;
