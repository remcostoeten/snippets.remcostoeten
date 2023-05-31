import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '@/lib/useAuth';
import { handleAddNote } from '@/lib/firebase';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

type FormInputs = {
	title: string;
	description: string;
	date: string;
	category: string;
};

const AddNote = () => {
	const { register, handleSubmit } = useForm<FormInputs>();
	const [categories, setCategories] = useState(['Personal', 'Work']);
	const { currentUser } = useAuth();

	const onSubmit = async (data: FormInputs) => {
		if (currentUser) {
			await handleAddNote(currentUser.uid, {
				...data,
				date: new Date(data.date).toISOString(),
			});
			toast.success('Note added successfully');
		}
	};

	return (
		<motion.div
			className="p-4 border rounded-lg shadow-sm bg-white dark:bg-gray-800"
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
		>
			<form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
				<div className="flex flex-wrap -mx-3 mb-6">
					<div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
						<label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
							Title
						</label>
						<input
							{...register('title')}
							type="text"
							required
							className="appearance-none block w-full bg-stone-100text-gray-700 border border-slate-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
						/>
					</div>
				</div>
				<div className="flex flex-wrap -mx-3 mb-6">
					<div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
						<label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
							Description
						</label>
						<textarea
							{...register('description')}
							required
							className="appearance-none block w-full bg-stone-100text-gray-700 border border-slate-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
						/>
					</div>
				</div>
				<div className="flex flex-wrap -mx-3 mb-6">
					<div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
						<label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
							Date
						</label>
						<input
							{...register('date')}
							type="date"
							required
							className="appearance-none block w-full bg-stone-100text-gray-700 border border-slate-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
						/>
					</div>
				</div>
				<div className="flex flex-wrap -mx-3 mb-6">
					<div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
						<label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
							Category
						</label>
						<select
							{...register('category')}
							required
							className="appearance-none block w-full bg-stone-100text-gray-700 border border-slate-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
						>
							{categories.map((category) => (
								<option key={category} value={category}>
									{category}
								</option>
							))}
						</select>
					</div>
				</div>
				<div className="flex flex-wrap -mx-3 mb-6">
					<div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
						<button
							type="submit"
							className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none"
						>
							Add Note
						</button>
					</div>
				</div>
			</form>
		</motion.div>
	);
};

export default AddNote;
