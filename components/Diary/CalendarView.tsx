import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/useAuth';
import { Calendar } from 'react-calendar';
import { motion } from 'framer-motion';

const CalendarView = () => {
	const { currentUser } = useAuth();
	const [notes, setNotes] = useState([]);
	const [selectedDate, setSelectedDate] = useState(null);

	// Fetch notes from Firebase when currentUser or selectedDate changes

	useEffect(() => {
		// fetchNotes function is placeholder
		// You need to implement fetching notes from Firebase
		async function fetchNotes() {
			if (currentUser) {
				// Fetch notes from Firebase using currentUser.uid
				// setNotes(fetchedNotes);
			}
		}

		fetchNotes();
	}, [currentUser, selectedDate]);

	return (
		<motion.div
			className="p-4 border rounded-lg shadow-sm bg-white dark:bg-gray-800"
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
		>
			<Calendar
				className="mb-4"
				onChange={setSelectedDate}
				value={selectedDate}
			/>
			{notes.map((note, index) => (
				<div key={index} className="mb-4">
					<p className="text-lg font-semibold text-indigo-600">
						{note.title}
					</p>
					<p className="text-gray-600">{note.description}</p>
				</div>
			))}
		</motion.div>
	);
};

export default CalendarView;
