import { useState, useEffect } from 'react';
import {
	firestore,
	handleAddDocument,
	handleToggleDocument,
} from '../lib/firebase';
import firebase from 'firebase/compat/app';

type Task = {
	id: number;
	title: string;
	done: boolean;
	date: firebase.firestore.Timestamp;
};

export default function Todo() {
	const [tasks, setTasks] = useState<Task[]>([]);
	const [newTask, setNewTask] = useState('');
	const [darkMode, setDarkMode] = useState(false);

	useEffect(() => {
		if (typeof window !== 'undefined') {
			if (darkMode) {
				document.documentElement.classList.add('dark');
			} else {
				document.documentElement.classList.remove('dark');
			}
		}
	}, [darkMode]);

	const addTask = async () => {
		const newTaskData: Task = {
			id: tasks.length,
			title: newTask,
			done: false,
			date: firebase.firestore.Timestamp.now(),
		};
		await handleAddDocument(newTaskData);
		setTasks([...tasks, newTaskData]);
		setNewTask('');
	};

	const toggleTask = async (id: number) => {
		const updatedTasks = tasks.map((task) =>
			task.id === id ? { ...task, done: !task.done } : task,
		);
		await handleToggleDocument(id.toString(), updatedTasks[id]);
		setTasks(updatedTasks);
	};

	const deleteTask = async (id: number) => {
		const updatedTasks = tasks.filter((task) => task.id !== id);
		await firestore.collection('tasks').doc(id.toString()).delete();
		setTasks(updatedTasks);
	};

	useEffect(() => {
		const loadTasks = async () => {
			const taskCollection = await firestore.collection('tasks').get();
			setTasks(
				taskCollection.docs.map(
					(doc) => ({ ...doc.data(), id: doc.id } as Task),
				),
			);
		};
		loadTasks();
	}, []);

	return (
		<div className="p-6 dark:bg-gray-900 dark:text-white">
			<button
				onClick={() => setDarkMode(!darkMode)}
				className="bg-blue-500 text-white rounded px-3 py-2 mb-4"
			>
				Toggle Dark Mode
			</button>

			<h1 className="text-2xl mb-4">Todo List</h1>
			<input
				type="text"
				className="border rounded px-3 py-2 mr-2 text-gray-700"
				value={newTask}
				onChange={(e) => setNewTask(e.target.value)}
			/>
			<button
				onClick={addTask}
				className="bg-blue-500 text-white rounded px-3 py-2"
			>
				Add
			</button>

			<ul className="mt-6">
				{tasks.map((task) => (
					<li
						key={task.id}
						className={`flex justify-between ${
							task.done ? 'text-gray-300 line-through' : ''
						}`}
					>
						<div>
							{task.title}{' '}
							<span className="text-gray-500 text-sm">
								{task.date?.toDate()?.toLocaleDateString()}
							</span>
						</div>
						<div>
							<button onClick={() => toggleTask(task.id)}>
								Toggle
							</button>
							<button onClick={() => deleteTask(task.id)}>
								Delete
							</button>
						</div>
					</li>
				))}
			</ul>
		</div>
	);
}
