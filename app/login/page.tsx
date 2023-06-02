'use client';import { useEffect, useState, ChangeEvent } from 'react';
import { useRouter } from 'next/router';
import { auth, googleAuthProvider } from '../../lib/firebase';
import Image from 'next/image';
import {
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
	signInWithPopup,
	updateProfile,
} from 'firebase/auth';
import IconButton from '@/components/ui-elements/IconButton';
import Dropdown from '@/components/authentication/Dropdown';
import Link from 'next/link';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import GithubLogo from '@/components/ui-elements/GithubLogo';
import Googlelogo from '@/components/ui-elements/Googlelogo';

const Login = () => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const router = useRouter();
	const [currentUser, setCurrentUser] = useState(null);
	const [success, setSuccess] = useState(false);
	const [showPassword, setShowPassword] = useState(false);
	const [showRegister, setShowRegister] = useState(false);
	const [isRegistered, setIsRegistered] = useState(false);
	const [showConfetti, setShowConfetti] = useState(false);
	const [name, setName] = useState('');

	if (!router.isReady) return null;
	
	const signInWithGoogle = async () => {
		try {
			await signInWithPopup(auth, googleAuthProvider);
			setSuccess(true);
		} catch (error) {
			console.error('Error signing in with Google', error);
		}
	};

	const items = [
		{ name: 'Register', href: '/register' },
		{ name: 'remcostoeten.com', href: 'https://remcostoeten.com' },
		{ name: 'Dutch', href: '.nl' },
	];

	const handleLoginFormSubmit = async (e) => {
		e.preventDefault();
		try {
			const credentials = await signInWithEmailAndPassword(
				auth,
				email,
				password,
			);
			if (credentials.user) {
				setCurrentUser(credentials.user as any);
				setSuccess(true);
			}
		} catch (error) {
			console.error('Error signing in with email and password', error);
		}
	};

	const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
		setEmail(e.target.value);
	};

	const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
		setPassword(e.target.value);
	};

	const handleRegisterForm = () => {
		setShowRegister((prevShowRegister) => !prevShowRegister);
	};

	const handleSignup = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		try {
			const result = await createUserWithEmailAndPassword(
				auth,
				email,
				password,
			);
			console.log(result);
			setIsRegistered(true);

			if (auth.currentUser) {
				await updateProfile(auth.currentUser, {
					displayName: name,
				});
				if (auth.currentUser.displayName) {
					toast.success(
						`Welcome aboard ${auth.currentUser.displayName}!`,
					);
				} else {
					toast.success(`Welcome aboard ${auth.currentUser.email}!`);
				}
			}
		} catch (error) {
			console.error(error);
			toast.error(
				'Something went wrong, probably a typo or already got an account? If this keeps happening contact the admin.',
			);
		}
	};

	// useEffect(() => {
	// 	const unsubscribe = auth.onAuthStateChanged((user) =>
	// 		setCurrentUser(user as any),
	// 	);
	
	// 	return () => unsubscribe();
	// }, []);
	
	const signIn = async () => {
		try {
			await signInWithPopup(auth, googleAuthProvider);
			setSuccess(true);
		} catch (error) {
			console.error('Error signing in with Google', error);
		}
	};

	return (
		<motion.main
			className="flex bg-white w-full"
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			transition={{ duration: 1 }}
		>
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
			
			<article className="bg-white rounded-tl-3xl rounded-r-md borderbottom p-48 w-full grid content-center justify-start text-4xl">
				<div className="custom-dropdown">
					<Dropdown items={items} href={undefined} />
				</div>

				<AnimatePresence>
					{showRegister ? (
						<motion.form
							className="flex flex-col"
							initial={{ opacity: 0, scale: 0.8 }}
							animate={{ opacity: 1, scale: 1 }}
							exit={{ opacity: 0, scale: 0.8 }}
							transition={{ duration: 0.5 }}
							key="registerForm"
							onSubmit={handleSignup}
						>
							<h2 className="text-7xl mb-24 font-bold">
								Register here
							</h2>
							<div className="flex flex-col sm:flex-row mb-6 justify-between">
								<IconButton
									color="text-slate-400"
									svg={<Googlelogo />}
									onClick={handleLoginFormSubmit}
									text="Sign in with Google"
								/>
								<IconButton
									color="text-slate-400"
									svg={<GithubLogo />}
									text="Sign in with Github"
								/>
							</div>
							<div className="flex text-center text-4xl justify-center font-normal py-12 text-gray-400">
								-or-
							</div>
							<div className="flex flex-col">
								<input
									type="text"
									className="input p-6 my-15 border"
									placeholder="your display name"
									value={name}
									onChange={(event) =>
										setName(event.target.value)
									}
								/>
								<input
									type="email"
									className="input p-6 my-15 border"
									name="email"
									placeholder="your email to sign in with"
									value={email}
									onChange={handleEmailChange}
								/>
								<input
									type={showPassword ? 'text' : 'password'}
									className="input p-6 my-15 border"
									name="password"
									placeholder="your password to sign in with"
									value={password}
									onChange={handlePasswordChange}
								/>
								<button
									className="font-medium mr-6 bg-[#bb93e2] rounded-xl py-6 text-white max-w-full pxjustify-center w-full font-medium mr-6 bg-[#bb93e2] rounded-xl py-6 text-white max-w-full px-42 hover:scale-105 cursor-pointer duration-300 p-14 mt-10 flex-42 hover:scale-105 cursor-pointer duration-300 mb-8"
									type="submit"
								>
									Register
								</button>
								<span>
									Already registered? Login{' '}
									<Link
										onClick={handleRegisterForm}
										className="text-blue-200"
										href="#"
									>
										here
									</Link>
								</span>
							</div>
						</motion.form>
					) : (
						<motion.form
							className="flex flex-col"
							initial={{ opacity: 0, scale: 0.8 }}
							animate={{ opacity: 1, scale: 1 }}
							exit={{ opacity: 0, scale: 0.8 }}
							transition={{ duration: 0.5 }}
							key="loginForm"
							onSubmit={handleLoginFormSubmit}
						>
							<h2 className="text-7xl mb-24 font-bold">
								Login here!
							</h2>
							<div className="flex flex-col sm:flex-row mb-6 justify-between">
								<div className="flex flex-col sm:flex-row mb-6 justify-between">
									<IconButton
										color="text-slate-400"
										svg={<Googlelogo />}
										onClick={signInWithGoogle}
										text="Sign in with Google"
									/>
									<IconButton
										color="text-slate-400"
										svg={<GithubLogo />}
										// TODO: Handle GitHub authentication here
										text="Sign in with Github"
									/>
								</div>
							</div>
							<div className="flex text-center text-4xl justify-center font-normal py-12 text-gray-400">
								-or-
							</div>

							<input
								type="email"
								className="input p-2 my-5  border"
								name="email"
								placeholder="Enter Username/email"
								value={email}
								onChange={handleEmailChange}
							/>
							<input
								type={showPassword ? 'text' : 'password'}
								className="input p-6 my-15 border"
								name="password"
								placeholder="your password to sign in with"
								value={password}
								onChange={handlePasswordChange}
							/>
							<button
								className="font-medium mr-6 bg-[#bb93e2] rounded-xl py-6 text-white max-w-full pxjustify-center w-full font-medium mr-6 bg-[#bb93e2] rounded-xl py-6 text-white max-w-full px-42 hover:scale-105 cursor-pointer duration-300 p-14 mt-10 flex-42 hover:scale-105 cursor-pointer duration-300 mb-8"
								type="submit"
							>
								Login
							</button>
							<span>
								Not registered? Register{' '}
								<Link
									onClick={handleRegisterForm}
									className="text-blue-200"
									href="#"
								>
									here
								</Link>
							</span>
						</motion.form>
					)}
				</AnimatePresence>
			</article>
			<div className="borderbottom"></div>
		</motion.main>
	);
};

export default Login;
