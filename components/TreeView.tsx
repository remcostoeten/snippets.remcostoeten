import Link from 'next/link';
import { useRouter } from 'next/router';
import { DocumentData } from '../lib/firestore';

interface TreeViewProps {
	documents: DocumentData[];
}

const TreeView: React.FC<TreeViewProps> = ({ documents }) => {
	const router = useRouter();

	return (
		<div className="h-full overflow-y-auto bg-gray-800">
			{documents &&
				documents.map((doc) => (
					<Link href={`/doc/${doc.id}`} key={doc.id}>
						<a
							className={`block px-4 py-2 text-white ${
								router.pathname === `/doc/${doc.id}`
									? 'bg-blue-500'
									: ''
							}`}
						>
							{doc.title}
						</a>
					</Link>
				))}
		</div>
	);
};

export default TreeView;
