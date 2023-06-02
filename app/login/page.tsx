'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth, googleAuthProvider } from '@/lib/firebase';
import Image from 'next/image';
import IconButton from '@/components/ui-elements/IconButton';
import GithubLogo from '@/components/ui-elements/GithubLogo';
import Googlelogo from '@/components/ui-elements/Googlelogo';
import { motion, AnimatePresence } from 'framer-motion';

const Login = () => {
	const [email, setEmail] = useState('');
	const [name, setName] = useState('');
	const [password, setPassword] = useState('');
	const [showPassword, setShowPassword] = useState(false);
	const [showRegister, setShowRegister] = useState(false);
	const [loading, setLoading] = useState(false);
	const router = useRouter();

	const handleLogin = async () => {
		try {
			setLoading(true);
			const authInstance = getAuth();
			await signInWithPopup(authInstance, googleAuthProvider);
			setLoading(false);
			router.push('/dashboard'); // Redirect to dashboard after successful login
		} catch (error) {
			setLoading(false);
			console.error('Error logging in:', error);
		}
	};

	const handleEmailChan = () => {
		setEmail(e.target.value);
	};

	const handlePasswordChange = () => {
		setPassword(e.target.value);
	};

	const handleRegisterForm = () => {
		setShowRegister((prevShowRegister) => !prevShowRegister);
	};

	const handleShowPassword = () => {
		setShowPassword((prevShowPassword) => !prevShowPassword);
	};

	return (
		<>
			<div>
				<h1>Login Page</h1>
				<button onClick={handleLogin} disabled={loading}>
					{loading ? 'Logging in...' : 'Login with Google'}
				</button>
			</div>
			<motion.main
				className="flex bg-white w-full"
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ duration: 1 }}
			>
				<aside className="wrapper xl:w-1/5 bg-dark-purple rounded-tr-3xl h-screen pl-6 pt-12 flex flex-col">
					<div className="h-1/3  text-9xl">
						<h1 className="h-1/3 pr-8 text-xl text-offWhite p-9 pl-6 pt-6">
							olah. why not just login? it`s super easy nowdays
							with username and password, google or discord.
						</h1>
					</div>
					<div className="flex relative shapes -right-16">
						<Image
							src="/authentication/pinkoval.png"
							alt="Remco Stoeten login page"
							width={256}
							height={160}
							className="shapes__four shapes"
						/>
						<Image
							src="/authentication/ball.png"
							alt="Remco Stoeten login page"
							width={235}
							height={235}
							className="shapes__two"
						/>
					</div>
					<div className="flex relative shape right-16">
						<Image
							src="/authentication/triangle.png"
							alt="Remco Stoeten login page"
							width={74}
							height={79}
							className="shapes__three"
						/>
						<Image
							src="/authentication/shapes.png"
							alt="Remco Stoeten login page"
							width={524}
							height={503}
							className="shapes__one right-4"
						/>
					</div>
				</aside>
			</motion.main>
		</>
	);
};

export default Login;
