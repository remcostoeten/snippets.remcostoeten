'use client';
import { useState } from 'react';
import {
	getAuth,
	signInWithPopup,
	GoogleAuthProvider,
	GithubAuthProvider,
} from 'firebase/auth';
import { auth, googleAuthProvider } from '@/lib/firebase';
import Image from 'next/image';
import IconButton from '@/components/ui-elements/IconButton';
import GithubLogo from '@/components/ui-elements/GithubLogo';
import Googlelogo from '@/components/ui-elements/Googlelogo';
import LoginAside from './../../components/ui-elements/authentication/aside';
import Dropdown from '@/components/menus/Dropdown';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const Login = () => {
	const [email, setEmail] = useState('');
	const [name, setName] = useState('');
	const [password, setPassword] = useState('');
	const [showPassword, setShowPassword] = useState(false);
	const [showRegister, setShowRegister] = useState(false);
	const [loading, setLoading] = useState(false);
	const router = useRouter();

	const items = [
		{ name: 'Register', href: '/register' },
		{ name: 'remcostoeten.com', href: 'https://remcostoeten.com' },
		{ name: 'Dutch', href: '.nl' },
	];

	const handleRegister = async (event) => {
		event.preventDefault();
		try {
			setLoading(true);
			const authInstance = getAuth();
			// Perform the registration logic here
			setLoading(false);
			// Optionally, you can redirect to another page after successful registration
			router.push('/');
		} catch (error) {
			setLoading(false);
			console.error('Error registering:', error);
		}
	};

	const handleGitHubLogin = async () => {
		try {
			const authInstance = getAuth();
			const provider = new GithubAuthProvider();
			await signInWithPopup(authInstance, provider);
			// Handle the success case after GitHub login
		} catch (error) {
			// Handle the error case
			console.error('Error logging in with GitHub:', error);
		}
	};

	const handleLogin = async (event: React.FormEvent) => {
		event.preventDefault();
		try {
			setLoading(true);
			const authInstance = getAuth();
			await signInWithPopup(authInstance, googleAuthProvider);
			setLoading(false);

			const formContainer = document.querySelector('.form-container');
			const asideLogin = document.querySelector('.asideLogin');
			formContainer.classList.add('slide-out-blurred-right');
			asideLogin.classList.add('slide-out-blurred-tr');
			console.log(asideLogin);
			setTimeout(() => {
				router.push('/'); // Redirect to dashboard after successful login
			}, 500);
		} catch (error) {
			setLoading(false);
			console.error('Error logging in:', error);
		}
	};

	const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setEmail(event.target.value);
	};

	const handlePasswordChange = (
		event: React.ChangeEvent<HTMLInputElement>,
	) => {
		setPassword(event.target.value);
	};

	const handleRegisterForm = () => {
		setShowRegister((prevShowRegister) => !prevShowRegister);
	};

	const handleShowPassword = () => {
		setShowPassword((prevShowPassword) => !prevShowPassword);
	};

	return (
		<>
			<main className="flex bg-white w-full">
				<LoginAside />
				<article className="bg-white rounded-tl-3xl rounded-r-md borderbottom p-48 w-full grid content-center justify-start text-4xl">
					<div className="custom-dropdown">
						<Dropdown items={items} href={undefined} />
					</div>
					<div
						className={`form-container ${
							showRegister ? 'form-register' : ''
						}`}
					>
						<form
							className="flex flex-col"
							onSubmit={
								showRegister ? handleRegister : handleLogin
							}
						>
							{showRegister ? (
								<>
									<h2 className="text-7xl mb-24 font-bold">
										Register here
									</h2>
									<div className="flex flex-col sm:flex-row mb-6 justify-between">
										<IconButton
											color="text-slate-400"
											svg={<Googlelogo />}
											onClick={handleLogin}
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
											type={
												showPassword
													? 'text'
													: 'password'
											}
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
								</>
							) : (
								<>
									<h2 className="text-7xl mb-24 font-bold">
										Login here!
									</h2>
									<div className="flex flex-col sm:flex-row mb-6 justify-between">
										<IconButton
											color="text-slate-400"
											svg={<Googlelogo />}
											onClick={() =>
												signInWithPopup(
													auth,
													googleAuthProvider,
												)
											}
											text="Sign in with Google"
										/>
										<IconButton
											color="text-slate-400"
											svg={<GithubLogo />}
											onClick={handleGitHubLogin}
											text="Sign in with Github"
										/>
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
										type={
											showPassword ? 'text' : 'password'
										}
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
										<span
											onClick={handleRegisterForm}
											className="text-blue-200 cursor-pointer underline"
										>
											here
										</span>
									</span>
								</>
							)}
						</form>
					</div>
				</article>
			</main>
		</>
	);
};

export default Login;
