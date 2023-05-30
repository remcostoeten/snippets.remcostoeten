import Link from 'next/link';
import { User, signInWithPopup } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { auth, googleAuthProvider } from '@/lib/firebase';
import { useContext } from 'react';
import { AuthContext } from '@/lib/AuthContext';
import Message from '../ui-elements/Messages';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
export default function TopNotice() {
	const { currentUser, setCurrentUser } = useContext(AuthContext);
	const [error, setError] = useState(false);
	const [success, setSuccess] = useState(false);
	useEffect(() => {
		const unsubscribe = auth.onAuthStateChanged((user) => {
			setCurrentUser(user);
		});

		return () => unsubscribe();
	}, []);

	const signOut = async () => {
		await auth.signOut();
		setCurrentUser(null);
		setSuccess(true);
	};

	const signIn = async () => {
		await signInWithPopup(auth, googleAuthProvider);
		setSuccess(true);
	};

	{
		success && (
			<Message
				toastMessage="Note successfully created!"
				iconBackgroundColor="bg-gray-800"
				textColor="text-gray-500"
				Icon={<CheckCircleOutlineIcon />}
			/>
		);
	}

	return (
		<>
			<div className="top-nav relative isolate flex md:items-center gap-x-6 overflow-hidden text-gray-400 bg-gray-900  px-6 py-1.5 sm:px-1.5 sm:before:flex-1 flex-col just md:flex-row">
				<div
					className="absolute left-[max(-7rem,calc(50%-52rem))] top-1/2 -z-10 -translate-y-1/2 transform-gpu blur-2xl"
					aria-hidden="true"
				></div>
				<div
					className="absolute left-[max(45rem,calc(50%+8rem))] top-1/2 -z-10 -translate-y-1/2 transform-gpu blur-2xl"
					aria-hidden="true"
				></div>
				<div className="flex md: flex-wrap items-center gap-x-2 gap-y-1 items-center">
					<p className="text-sm leading-6 text-gray-400">
						You’re currently on{' '}
						<span className="font-semibold">
							<Link href="/">docs.remcostoeten.com</Link>
						</span>
						<svg
							viewBox="0 0 2 2"
							className="mx-2 inline h-0.5 w-0.5 fill-current"
							aria-hidden="true"
						>
							<circle cx={1} cy={1} r={1} />
						</svg>
						Click{' '}
						<Link className="font-bold" href="/">
							here{' '}
						</Link>
						to navigate to the main site. or to view my experimental{' '}
						<Link
							href="https://experiment.remcostoeten.com"
							className="flex-none rounded-full bg-gray-900 px-3.5 py-1 text-sm font-semibold text-white shadow-sm link link--arrow"
						>
							Click here <span aria-hidden="true">&rarr;</span>
						</Link>{' '}
					</p>
				</div>
				<div className="flex flex-1 justify-end">
					<button
						type="button"
						className="-m-3 p-3 focus-visible:outline-offset-[-4px]"
					>
						<span className="sr-only">Dismiss</span>
					</button>
				</div>{' '}
				{currentUser ? (
					<div className="flex items-center">
						<span className="text-white">
							{currentUser.displayName}
						</span>
						<button
							onClick={signOut}
							className="ml-4 px-4 py-2 text-sm font-medium text-blue-500 rounded  bg-grey-400 hover:bg-blue-200"
						>
							Sign Out
						</button>
					</div>
				) : (
					<button
						onClick={signIn}
						className="px-4 py-2 text-sm font-medium text-white bg-indigo-800 rounded-xl mr-4 hover:bg-blue-200"
					>
						Sign In with Google
					</button>
				)}
			</div>
			{success && (
				<Message
					toastMessage="Signed in succesfully!"
					iconBackgroundColor="transparent"
					textColor="text-gray-500"
					Icon={<CheckCircleOutlineIcon />}
				/>
			)}
		</>
	);
}
