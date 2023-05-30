import { useState } from 'react';
import { firestore } from '@/lib/firebase';
import Message from '../ui-elements/Messages';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { User } from '@/lib/types';
import { doc, updateDoc, collection, addDoc } from 'firebase/firestore';

type EntryFormProps = {
	entry?: Entry;
	user: User;
};

type Entry = {
	id?: string;
	title?: string;
	content?: string;
	category?: string;
};

export const EntryForm: React.FC<EntryFormProps> = ({ entry, user }) => {
	const [title, setTitle] = useState(entry?.title || '');
	const [content, setContent] = useState(entry?.content || '');
	const [category, setCategory] = useState(entry?.category || '');
	const [error, setError] = useState(false);
	const [success, setSuccess] = useState(false);

	const handleSubmit = async (event: React.FormEvent) => {
		event.preventDefault();

		if (!title || !content) {
			setError(true);
			return;
		} else {
			setSuccess(true);
		}

		const categoriesArray = category.split(',').map((item) => item.trim());

		if (entry?.id) {
			const docRef = doc(firestore, 'entries', entry.id);
			await updateDoc(docRef, {
				title,
				content,
				category: categoriesArray,
			});
		} else {
			const entriesCollection = collection(firestore, 'entries');
			await addDoc(entriesCollection, {
				title,
				content,
				category: categoriesArray,
				date: new Date(),
			});
		}

		setTitle('');
		setContent('');
		setCategory('');
	};

	return (
		<>
			<form onSubmit={handleSubmit} className="max-w-lg mx-auto">
				<input
					className="block w-full p-2 rounded mt-2 border-gray-300"
					type="text"
					value={title}
					onChange={(e) => setTitle(e.target.value)}
					placeholder="Title"
				/>
				<textarea
					className="block w-full p-2 rounded mt-2 border-gray-300 h-40"
					value={content}
					onChange={(e) => setContent(e.target.value)}
					placeholder="Content"
				/>
				<input
					className="block w-full p-2 rounded mt-2 border-gray-300"
					type="text"
					value={category}
					onChange={(e) => setCategory(e.target.value)}
					placeholder="Category (comma separated)"
				/>
				<button
					type="submit"
					className="mt-4 w-full p-2 rounded bg-blue-600 text-white"
				>
					Submit
				</button>
			</form>
			{error && (title === '' || content === '') && (
				<Message
					toastMessage={
						title === '' && content === ''
							? 'You should fill in both the title and content fields!'
							: title === ''
							? 'You should fill in the title field!'
							: 'You should fill in the content field!'
					}
					iconBackgroundColor="bg-gray-800"
					textColor="text-gray-500"
					Icon={<WarningAmberIcon />}
				/>
			)}
			{success && (
				<Message
					toastMessage="Note successfully created!"
					iconBackgroundColor="bg-gray-800"
					textColor="text-gray-500"
					Icon={<CheckCircleOutlineIcon />}
				/>
			)}
		</>
	);
};
