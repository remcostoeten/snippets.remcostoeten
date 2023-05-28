import { useState } from 'react';
import Link from 'next/link';
import {
	firestore,
	handleAddDocument,
	handleToggleDocument,
} from '../lib/firebase';
import firebase from 'firebase/compat/app';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import Head from 'next/head';
import Badge from '@/components/ui-elements/Badge';
import { GetServerSideProps } from 'next';

const todoCategories = [
	'snippets.remcostoeten',
	'remcostoeten.com',
	'portfolio.remcostoeten.com',
];

type Task = {
	id: string;
	title: string;
	done: boolean;
	date: any;
	category: string;
};

const fetchTasks = async () => {
	const taskCollection = await firestore.collection('tasks').get();
	return taskCollection.docs.map((doc) => {
		const taskData = doc.data();
		return {
			...taskData,
			id: doc.id,
			date: taskData.date.toDate().toISOString(), // Convert date to ISO string
		};
	});
};

export const getServerSideProps: GetServerSideProps = async () => {
	const tasks = await fetchTasks();
	return {
		props: { tasks },
	};
};

export default function Todo({ tasks: initialTasks }) {
	const [tasks, setTasks] = useState<Task[]>(initialTasks);
	const [newTask, setNewTask] = useState('');
	const [selectedCategory, setSelectedCategory] = useState('');

	const addTask = async (): Promise<void> => {
		if (newTask) {
			const newTaskData: Task = {
				id: `${tasks.length}`,
				title: newTask,
				done: false,
				date: firebase.firestore.Timestamp.now(),
				category: selectedCategory,
			};

			await handleAddDocument(newTaskData);

			setTasks([...tasks, newTaskData]);
			setNewTask('');
		}
	};

	const toggleTask = async (id: string) => {
		const updatedTasks = tasks.map((task) => {
			if (task.id === id) {
				const updatedTask = { ...task, done: !task.done };
				handleToggleDocument(id, updatedTask);
				return updatedTask;
			}
			return task;
		});

		setTasks(updatedTasks);
	};

	const deleteTask = async (id: string) => {
		await firestore.collection('tasks').doc(id).delete();
		const updatedTasks = tasks.filter((task) => task.id !== id);
		setTasks(updatedTasks);
	};

	return (
		<div className="h-screen bg-white rounded-lg p-4">
			<Head>
				<title>Todo List</title>
				<meta
					name="description"
					content="A simple todo list built with Next.js and Firebase."
				/>
			</Head>
			<h1 className="text-2xl text-slate-950 font-bold mb-4">
				Roadmap for the Site
			</h1>
			<p className="mb-6 text-slate-800 top-nav relative isolate items-center gap-x-6 overflow-hidden text-gray-400 px-6 py-1.5 sm:px-1.5 sm:before:flex-1 md:w-2/4">
				This To-Do list outlines the upcoming features and to-dos I have
				lined up for all my sites and other random projects related to
				development. Mainly working on{' '}
				<Link
					className="font-bold underline"
					href="https://remcostoeten.com"
					target="_blank"
				>
					remcostoeten.com
				</Link>{' '}
				There are multiple subdomains such as
				<Link
					className="font-bold underline"
					href="https://snippets.remcostoeten.com"
					target="_blank"
				>
					{' '}
					snippets.remcostoeten.com{' '}
				</Link>
				which has some snippets and other tools I use on a day-to-day
				basis, so purely personal and{''}{' '}
				<Link
					className="font-bold underline"
					href="https://experiments.remcostoeten.com"
					target="_blank"
				>
					experiments.remcostoeten.com
				</Link>
				{''} which is my staging environment where I am building my new
				portfolio site. Besides that, I have some other projects I have
				laying around such as several browser extensions and NPM
				packages, which I want to finish someday.
			</p>

			<div className="mt-3 text-sm text-[#8ea6c8] flex justify-between items-center"></div>
			<div className="flex">
				<div className="flex flex-col">
					<p className="text-xl font-semibold mb-1 text-[#063c76]">
						To-do List
					</p>
					<input
						type="text"
						className="border rounded text-gray-700 px-3 py-2 mr-2"
						value={newTask}
						placeholder="Add a new task..."
						onChange={(e) => setNewTask(e.target.value)}
					/>
				</div>
				<div className="flex flex-col">
					<p className="text-xl font-semibold mb-1 text-[#063c76]">
						Category
					</p>
					<select
						className="border inline-flex items-center px-3 py-0.5 h-full pr-2 mr-2 text-sm font-medium border text-slate-900"
						value={selectedCategory}
						onChange={(e) => setSelectedCategory(e.target.value)}
					>
						{todoCategories.map((category) => (
							<option key={category} value={category}>
								{category}
							</option>
						))}
					</select>
				</div>
			</div>
			<button
				onClick={addTask}
				className="bg-blue-500 mt-2 text-white rounded px-3 py-2"
			>
				Add
			</button>
			{todoCategories.map((category) => (
				<div key={category}>
					<ul>
						{tasks.map((task) => (
							<li className="mt-4" key={task.id}>
								<div className="flex gap-2">
									<div className="w-9/12 h-12 bg-[#e0ebff] rounded-[7px] flex justify-between items-center px-3">
										<div className="flex relative">
											<span
												className="w-7 h-7 bg-white rounded-full border border-white transition-all cursor-pointer hover:border-[#36d344] flex justify-center items-center"
												onClick={() =>
													toggleTask(task.id)
												}
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
										<div className="flex relative">
											<Badge category={category} />
											<span className="rounded-full flex items-center bg-white text-xs text-black px-2.5 py-0.5">
												{new Date(
													task.date.seconds * 1000,
												).toLocaleTimeString()}
											</span>
										</div>{' '}
									</div>
									<button onClick={() => deleteTask(task.id)}>
										<DeleteForeverIcon className="text-black" />
									</button>
								</div>
							</li>
						))}
					</ul>
				</div>
			))}
		</div>
	);
}
