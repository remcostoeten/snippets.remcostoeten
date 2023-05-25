// components/EntryDetail.tsx
import { useState } from 'react';

export const EntryDetail = ({ entry }) => {
	const [isEditing, setIsEditing] = useState(false);

	return entry ? (
		isEditing ? (
			<EntryForm entry={entry} setIsEditing={setIsEditing} />
		) : (
			<div className="max-w-lg mx-auto mt-4">
				<h1 className="mb-2 text-xl font-bold">{entry.title}</h1>
				<p className="mb-2">{entry.content}</p>
				<div className="flex">
					<button
						onClick={() => setIsEditing(true)}
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
