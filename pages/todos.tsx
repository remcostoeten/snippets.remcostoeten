import { useState, useEffect } from 'react';
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

type Task = {
	id: string;
	title: string;
	done: boolean;
	date: any;
	category: string;
};

async function loadTasks() {
	const taskCollection = await firestore
		.collection('tasks')
		.orderBy('date')
		.limit(10)
		.get();

	return taskCollection.docs.map(
		(doc) => ({ ...doc.data(), id: doc.id } as Task),
	);
}

export async function getServerSideProps(context) {
	const tasks = await loadTasks();

	const serializedTasks = tasks.map((task) => ({
		...task,
		date: task.date.toMillis(),
	}));

	return {
		props: {
			initialTasks: serializedTasks,
		},
	};
}

export default function Todo({ initialTasks }) {
	const [tasks, setTasks] = useState<Task[]>(initialTasks);
	const [newTask, setNewTask] = useState('');
	const [loading, setLoading] = useState(false);
	const [selectedCategory, setSelectedCategory] = useState('');
	const [searchQuery, setSearchQuery] = useState('');
	const [sortedTasks, setSortedTasks] = useState<Task[]>([]);

	useEffect(() => {
		const fetchAdditionalTasks = async () => {
			setLoading(true);
			const moreTasks = await loadTasks();
			setTasks((currentTasks) => [...currentTasks, ...moreTasks]);
			setLoading(false);
		};
		fetchAdditionalTasks();
	}, []);

	useEffect(() => {
		if (searchQuery === '') {
			setSortedTasks([...tasks]);
		} else {
			const filteredTasks = tasks.filter((task) =>
				task.title.toLowerCase().includes(searchQuery.toLowerCase()),
			);
			setSortedTasks(filteredTasks);
		}
	}, [searchQuery, tasks]);

	const addTask = async (): Promise<void> => {
		const newTaskData: Task = {
			id: `${tasks.length}`,
			title: newTask,
			done: false,
			date: firebase.firestore.Timestamp.now(),
			category: selectedCategory,
		};

		await handleAddDocument({
			...newTaskData,
			id: parseInt(newTaskData.id, 10), // parsing the id to a number
		});

		setTasks((prevTasks) => [...prevTasks, newTaskData]); // Add the task to the global tasks state

		// Check if the new task belongs to the selected category
		if (selectedCategory === newTaskData.category) {
			setSortedTasks((prevTasks) => [...prevTasks, newTaskData]); // Add the task to the sortedTasks state for the selected category
		}

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

	const deleteTask = async (id: string) => {
		const updatedTasks = tasks.filter((task) => task.id !== id);
		await firestore.collection('tasks').doc(id).delete();
		setTasks(updatedTasks);
	};

	const sortAlphabetically = () => {
		const sortedAlphabetically = [...sortedTasks].sort((a, b) =>
			a.title.localeCompare(b.title),
		);
		setSortedTasks(sortedAlphabetically);
	};

	const sortByDate = () => {
		const sortedByDate = [...sortedTasks].sort(
			(a, b) => a.date.seconds - b.date.seconds,
		);
		setSortedTasks(sortedByDate);
	};

	if (loading) {
		return (
			<div className="flex justify-center items-center h-screen">
				<div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
			</div>
		);
	}

	const todoCategories = [
		'snippets.remcostoeten',
		'remcostoeten.com',
		'portfolio.remcostoeten.com',
	];

	return (
		<>
			<Head>
				<title>Todo List</title>
				<script type="application/ld+json">
					{JSON.stringify({
						'@context': 'https://schema.org',
						'@type': 'WebPage',
						name: 'Todo List',
						description:
							'A simple todo list built with Next.js and Firebase.',
					})}
				</script>
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
				{''} which is my "staging" environment where I am building my
				new portfolio site. Besides that, I have some other projects I
				have laying around such as several browser extensions and NPM
				packages, which I want to finish someday.
			</p>

			<div className="mt-3 text-sm text-[#8ea6c8] flex justify-between items-center">
				<div>
					<button
						onClick={sortAlphabetically}
						className="bg-blue-500 mt-2 text-white rounded px-3 py-2 mr-2"
					>
						Sort Alphabetically
					</button>
					<button
						onClick={sortByDate}
						className="bg-blue-500 mt-2 text-white rounded px-3 py-2"
					>
						Sort by Date
					</button>
				</div>
				<div>
					<input
						type="text"
						className="border rounded text-gray-700 px-3 py-2"
						value={searchQuery}
						placeholder="Search tasks..."
						onChange={(e) => setSearchQuery(e.target.value)}
					/>
				</div>
			</div>
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
						className="bordefinline-flex items-center px-3 py-0.5 h-full pr-2 mr-2 text-sm font-medium border text-slate-900"
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
					<h2>{category}</h2>
					<ul>
						{sortedTasks
							.filter((task) => task.category === category)
							.map((task) => (
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
														task.date.seconds *
															1000,
													).toLocaleTimeString()}
												</span>
											</div>{' '}
										</div>
										<button
											onClick={() => deleteTask(task.id)}
										>
											<DeleteForeverIcon className="text-black" />
										</button>
									</div>
								</li>
							))}
					</ul>
				</div>
			))}
		</>
	);
}
