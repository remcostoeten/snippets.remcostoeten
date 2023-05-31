import { useState } from 'react';
import AddNote from '@/components/Diary/AddNote';
import CalendarView from '@/components/Diary/CalendarView';
import { motion } from 'framer-motion';
import { useAuth } from '@/lib/useAuth';

export default function Dashboard() {
	const [isAddingNote, setIsAddingNote] = useState(false);
	const { currentUser } = useAuth();
	const [notes, setNotes] = useState([]);

	return (
		<motion.div
			className="container mx-auto p-4 space-y-4"
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
		>
			<button
				className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none"
				onClick={() => setIsAddingNote(!isAddingNote)}
			>
				{isAddingNote ? 'Close' : 'Add Note'}
			</button>
			{isAddingNote && <AddNote />}
			<CalendarView />
		</motion.div>
	);
}
