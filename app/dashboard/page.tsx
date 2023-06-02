'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getDocuments, CustomDocumentData } from '@/lib/firebase';

const Dashboard = () => {
	const [documents, setDocuments] = useState<CustomDocumentData[]>([]);
	const [loading, setLoading] = useState(true);
	const router = useRouter();

	useEffect(() => {
		const fetchDocuments = async () => {
			try {
				const fetchedDocuments = await getDocuments();
				setDocuments(fetchedDocuments);
				setLoading(false);
			} catch (error) {
				console.error('Error fetching documents:', error);
			}
		};

		fetchDocuments();
	}, []);

	const handleLogout = () => {
		// Implement your logout logic here
		router.push('/login'); // Redirect to login page after logout
	};

	return (
		<div className="container mx-auto p-4">
			<h1 className="text-2xl font-bold mb-4">Dashboard</h1>
			{loading ? (
				<p>Loading...</p>
			) : (
				<ul>
					{documents.map((document) => (
						<li key={document.id} className="mb-2">
							<h3 className="text-lg font-medium">
								{document.title}
							</h3>
							<p>{document.content}</p>
						</li>
					))}
				</ul>
			)}
			<button
				className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 mt-4 rounded"
				onClick={handleLogout}
			>
				Logout
			</button>
		</div>
	);
};

export default Dashboard;
