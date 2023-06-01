import { useEffect, useState, ChangeEvent, useContext } from 'react';
import { useRouter } from 'next/router';
import { auth, googleAuthProvider } from '../lib/firebase';
import Image from 'next/image';
import { AuthContext } from '@/lib/AuthContext';
import { signInWithPopup } from 'firebase/auth';
import IconButton from '@/components/ui-elements/IconButton';
import { GitHub, Google } from '@mui/icons-material';
import Dropdown from '@/components/authentication/Dropdown';
import Link from 'next/link';
import { motion } from 'framer-motion';

const LoginPage = () => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const router = useRouter();
	const { currentUser, setCurrentUser } = useContext(AuthContext);
	const [success, setSuccess] = useState(false);
	const [showSecondArticle, setShowSecondArticle] = useState(false);
	const [showPassword, setShowPassword] = useState(false); // Add this state

	const items = [
		{ name: 'Register', href: '/register' },
		{ name: 'remcostoeten.com', href: 'https://remcostoeten.com' },
		{ name: 'Dutch', href: '.nl' },
	];

	const handleLoginFormSubmit = (e) => {
		e.preventDefault();
		signIn();
	};

	const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
		setEmail(e.target.value);
	};

	const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
		setPassword(e.target.value);
	};

	useEffect(() => {
		const unsubscribe = auth.onAuthStateChanged((user) =>
			setCurrentUser(user),
		);

		return () => unsubscribe();
	}, [setCurrentUser]);

	const signOut = async () => {
		await auth.signOut();
		setCurrentUser(null);
		setSuccess(true);
		router.push('/');
	};

	const signIn = async () => {
		await signInWithPopup(auth, googleAuthProvider);
		router.push('/');
		setSuccess(true);
	};

	useEffect(() => {
		if (currentUser && success) {
			router.push('/');
		}
	}, [currentUser, success, router]);

	return (
		<main className="flex bg-white w-full">
			<aside className="wrapper xl:w-1/5 bg-dark-purple rounded-tr-3xl h-screen pl-6 pt-12 flex flex-col">
				<div className="h-1/3  text-9xl">
					<h1 className="h-1/3 pr-8 text-xl text-offWhite p-9 pl-6 pt-6">
						olah. why not just login? it`s super easy nowdays with
						username and password, google or discord.
					</h1>
				</div>
				<div className="flex relative shapes scale-125 -right-16">
					<Image
						src="/authentication/pinkoval.png"
						alt="Remco Stoeten login page"
						width={256}
						height={160}
						className="shapes__four shapes"
					/>
					<Image
						src="/ball.png"
						alt="Remco Stoeten login page"
						width={235}
						height={235}
						className="shapes__two"
					/>
				</div>
				<div className="flex relative shape scale-125 -right-16">
					<Image
						src="/authentication/triangle.png"
						alt="Remco Stoeten login page"
						width={74}
						height={79}
						className="shapes__three"
					/>
					<Image
						src="/shapes.png"
						alt="Remco Stoeten login page"
						width={524}
						height={503}
						className="shapes__one right-4"
					/>
				</div>
			</aside>
			<article className="bg-white  rounded-tl-3xl rounded-r-md borderbottom  p-32 w-full	 grid content-center justify-start">
				<div className="custom-dropdown">
					<Dropdown items={items} href={undefined} />
				</div>
				<div className="screen-one flex ">
					<form className="screen-two">
						<h2 className="text-3xl mb-8 font-bold ">Welcome!</h2>
						<div className="flex flex-col lg:flex-row mb-2 justify-between">
							<IconButton
								color="text-red-400"
								icon={<Google />}
								onClick={handleLoginFormSubmit}
								text="Sign in with Google"
							/>
							<IconButton
								color="text-slate-400"
								icon={<GitHub />}
								text="Sign in with Github"
							/>
						</div>
						<div className="flex text-center text-xl justify-center font-normal py-8 text-gray-400">
							-or-
						</div>
						<div className="flex flex-col">
							<div className="flex text-gray-400 flex-col">
								<input
									type="email"
									className="input p-2 my-5  border"
									name="email"
									placeholder="Enter Username/email"
									value={email}
									onChange={handleEmailChange}
								/>
							</div>
							<div className="flex text-gray-400 flex-col relative">
								<input
									type={showPassword ? 'text' : 'password'}
									className="input p-2 my-5  border"
									name="password"
									placeholder="Password"
									value={password}
									onChange={handlePasswordChange}
								/>
								<span
									onClick={() =>
										setShowPassword(!showPassword)
									}
									className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5 text-gray-500"
								>
									{showPassword ? 'Hide' : 'Show'}
								</span>
							</div>
						</div>
						<div className="flex">
							<button
								className="font-medium mr-2 bg-[#bb93e2] rounded-xl py-2 text-white max-w-full px-14 hover:scale-105 cursor-pointer duration-300"
								onClick={signIn}
							>
								Login
							</button>
							<span>
								Not registered? Click <Link href="#">here</Link>
							</span>
						</div>
					</form>
				</div>
			</article>
		</main>
	);
};

export default LoginPage;
