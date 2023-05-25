import { Dispatch, SetStateAction, useState } from 'react';
import { EntryForm } from './EntryForm';
import { firestore } from '@/lib/firebase';

type Entry = {
	id: string;
	title: string;
	content: string;
};

type EntryDetailProps = {
	entry: Entry;
	title: string;
	setIsEditing: Dispatch<SetStateAction<boolean>>;
};

export const EntryDetail = ({ entry, setIsEditing }: EntryDetailProps) => {
	const [isEditingState, setIsEditingState] = useState(false);

	const deleteEntry = async (id: string) => {
		await firestore.collection('entries').doc(id).delete();
	};

	return entry ? (
		isEditingState ? (
			<EntryForm entry={entry} />
		) : (
			<div className="max-w-lg mx-auto mt-4">
				<h1 className="mb-2 text-xl font-bold">{entry.title}</h1>
				<p className="mb-2">{entry.content}</p>
				<div className="flex">
					<button
						onClick={() => setIsEditingState(true)}
						className="px-4 py-2 bg-blue-600 text-white rounded mr-2"
					>
						Edit
					</button>
					<button
						onClick={() => deleteEntry(entry.id)}
						className="px-4 py-2 bg-red-600 text-white rounded"
					>
						Delete
					</button>
				</div>
			</div>
		)
	) : (
		<div>Loading...</div>
	);
};
