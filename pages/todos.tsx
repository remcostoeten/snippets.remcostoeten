import { useState, useEffect } from 'react';
import {
	firestore,
	handleAddDocument,
	handleToggleDocument,
} from '../lib/firebase';
import firebase from 'firebase/compat/app';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import Head from 'next/head';

type Task = {
	id: number;
	title: string;
	done: boolean;
	date: firebase.firestore.Timestamp;
};

export default function Todo() {
	const [tasks, setTasks] = useState<Task[]>([]);
	const [newTask, setNewTask] = useState('');
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const loadTasks = async () => {
			const taskCollection = await firestore.collection('tasks').get();
			setTasks(
				taskCollection.docs.map(
					(doc) => ({ ...doc.data(), id: doc.id } as unknown as Task),
				),
			);
			setLoading(false);
		};
		loadTasks();
	}, []);

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

	const toggleTask = async (id: string) => {
		const task = tasks.find((task) => task.id === id);
		if (task) {
			const updatedTask = { ...task, done: !task.done };
			await handleToggleDocument(id, updatedTask);
			const updatedTasks = tasks.map((task) =>
				task.id === id ? updatedTask : task,
			);
			setTasks(updatedTasks);
		}
	};

	const deleteTask = async (id: number) => {
		const updatedTasks = tasks.filter((task) => task.id !== id);
		await firestore.collection('tasks').doc(id.toString()).delete();
		setTasks(updatedTasks);
	};

	return (
		<div className="h-screen w-screen bg-white rounded-lg p-4">
			<Head>
				<title>Todo List</title>
				<meta
					name="description"
					content="A simple todo list built with Next.js and Firebase."
				/>
			</Head>
			<div className="mt-3 text-sm text-[#8ea6c8] flex justify-between items-center">
				<p className="set_date">{new Date().toLocaleDateString()}</p>
			</div>
			<p className="text-xl font-semibold mt-2 text-[#063c76]">
				To-do List
			</p>
			<input
				type="text"
				className="border rounded px-3 py-2 mr-2"
				value={newTask}
				onChange={(e) => setNewTask(e.target.value)}
			/>
			<button
				onClick={addTask}
				className="bg-blue-500 text-white rounded px-3 py-2"
			>
				Add
			</button>
			<ul className="my-4 ">
				{loading
					? Array.from({ length: 10 }).map((_, index) => (
							<li className="animate-pulse mt-4" key={index}>
								<div className="flex gap-2">
									<div className="w-9/12 h-12 bg-gray-400 rounded-[7px]"></div>
									<div className="w-1/4 h-12 bg-gray-400 rounded-[7px]"></div>
								</div>
							</li>
					  ))
					: tasks.map((task) => (
							<li className="mt-4" key={task.id}>
								<div className="flex gap-2">
									<div className="w-9/12 h-12 bg-[#e0ebff] rounded-[7px] flex justify-start items-center px-3">
										<span
											className="w-7 h-7 bg-white rounded-full border border-white transition-all cursor-pointer hover:border-[#36d344] flex justify-center items-center"
											onClick={() => toggleTask(task.id)}
										>
											<i className="text-white fa fa-check"></i>
										</span>
										<span
											className={
												task.done
													? 'line-through text-sm ml-4 text-[#5b7a9d] font-semibold'
													: 'text-sm ml-4 text-[#5b7a9d] font-semibold'
											}
										>
											{task.title}
										</span>
									</div>
									<button onClick={() => deleteTask(task.id)}>
										<DeleteForeverIcon color="red" />
									</button>
									<span className="w-1/4 h-12 bg-[#e0ebff] rounded-[7px] flex justify-center text-sm text-[#5b7a9d] font-semibold items-center ">
										{new Date(
											task.date.seconds * 1000,
										).toLocaleTimeString()}
									</span>
								</div>
							</li>
					  ))}
			</ul>
		</div>
	);
}
