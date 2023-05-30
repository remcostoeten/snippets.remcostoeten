import { useEffect, useState } from 'react';
import { firestore } from '@/lib/firebase';
import {
	collection,
	onSnapshot,
	query,
	doc,
	deleteDoc,
} from 'firebase/firestore';
import { SearchBar } from './SearchBar';

export const EntriesList: React.FC<{ user: any }> = ({ user }) => {
	const [entries, setEntries] = useState([]);
	const [searchTerm, setSearchTerm] = useState('');

	useEffect(() => {
		const entriesCollection = collection(firestore, 'entries');
		const q = query(entriesCollection);

		const unsubscribe = onSnapshot(q, (snapshot) => {
			const docs = snapshot.docs.map((doc) => ({
				id: doc.id,
				...doc.data(),
			}));
			setEntries(docs);
		});

		return () => unsubscribe();
	}, []);

	const deleteEntry = async (id) => {
		const docRef = doc(firestore, 'entries', id);
		await deleteDoc(docRef);
	};

	const filteredEntries = entries.filter(
		(entry) =>
			entry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
			entry.content.toLowerCase().includes(searchTerm.toLowerCase()),
	);

	return (
		<div className="max-w-lg mx-auto mt-4">
			<SearchBar onSearch={setSearchTerm} />
			{filteredEntries.map((entry) => (
				<div key={entry.id} className="p-4 mb-2 border rounded">
					<h2 className="text-lg font-semibold">{entry.title}</h2>
					<p className="text-sm">{entry.content}</p>
					<div className="flex">
						<button
							onClick={() => deleteEntry(entry.id)}
							className="px-4 py-2 bg-red-600 text-white rounded"
						>
							Delete
						</button>
					</div>
				</div>
			))}
		</div>
	);
};
