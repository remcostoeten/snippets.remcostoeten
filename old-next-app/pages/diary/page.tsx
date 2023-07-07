'use client';
import { useState, useEffect } from 'react';
import { NextPage } from 'next';
import { motion, Variants } from 'framer-motion';
// import AddNote from '@/components/Diary/AddNote';
// import CalendarView from '@/components/Diary/CalendarView';

interface Note {
    id: number;
    title: string;
    content: string;
    createdAt: Date;
    category: string;
}

interface AddNoteProps {
    setNotes: React.Dispatch<React.SetStateAction<Note[]>>;
}

interface CalendarViewProps {
    notes: Note[];
}

interface DashboardProps {}

const containerVariants: Variants = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
};

const Dashboard: NextPage<DashboardProps> = () => {
    const [isAddingNote, setIsAddingNote] = useState(false);
    const [notes, setNotes] = useState<Note[]>([]);

    useEffect(() => {
        // Fetch client data here using the appropriate hook or function
    }, []);

    return (
        <motion.div className="container mx-auto p-4 space-y-4" initial="initial" animate="animate" variants={containerVariants}>
            <button
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none"
                onClick={() => setIsAddingNote(!isAddingNote)}
            >
                {isAddingNote ? 'Close' : 'Add Note'}
            </button>
            {/* {isAddingNote && <AddNote setNotes={setNotes} />} */}
            {/* <CalendarView notes={notes as Note[]} /> */}
        </motion.div>
    );
};

export default Dashboard;
