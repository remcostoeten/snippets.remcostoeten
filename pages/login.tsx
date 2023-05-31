import { useEffect, useState, ChangeEvent, useContext } from 'react';
import { useRouter } from 'next/router';
import { auth, googleAuthProvider } from '../lib/firebase';
import Image from 'next/image';
import { AuthContext } from '@/lib/AuthContext';
import { signInWithPopup } from 'firebase/auth';
import IconButton from '@/components/ui-elements/IconButton';
import { GitHub, Google } from '@mui/icons-material';
import Dropdown from '@/components/authentication/Dropdown';

const LoginPage = () => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const router = useRouter();
	const { currentUser, setCurrentUser } = useContext(AuthContext);
	const [success, setSuccess] = useState(false);

	const items = [
		{ name: 'Register', href: '/register' },
		{ name: 'remcostoeten.com', href: 'https://remcostoeten.com' },
		{ name: 'Dutch', href: '.nl' },
	];

	const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
		setEmail(e.target.value);
	};

	const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
		setPassword(e.target.value);
	};

	useEffect(() => {
		const unsubscribe = auth.onAuthStateChanged(
			(user) => setCurrentUser(user), // Set the user instead of currentUser
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

	useEffect(() => {
		const shapesContainer = document.querySelector('.shapes');
		const parallaxStrength = 50; // Adjust this value to control the parallax effect strength

		const handleMouseMove = (e: MouseEvent) => {
			const { clientX, clientY } = e;
			const centerX = window.innerWidth / 2;
			const centerY = window.innerHeight / 2;
			const moveX = (clientX - centerX) / parallaxStrength;
			const moveY = (clientY - centerY) / parallaxStrength;

			(
				shapesContainer as HTMLElement
			).style.transform = `translate(${moveX}px, ${moveY}px)`;
		};
		window.addEventListener('mousemove', handleMouseMove);

		return () => {
			window.removeEventListener('mousemove', handleMouseMove);
		};
	}, []);

	useEffect(() => {
		const shapesContainerTwo = document.querySelector(
			'.shape',
		) as HTMLElement;
		const parallaxStrengthTwo = 50; // Adjust this value to control the parallax effect strength

		const handleMouseMove = (e: MouseEvent) => {
			const { clientX, clientY } = e;
			const centerX = window.innerWidth / 2;
			const centerY = window.innerHeight / 2;
			const moveX = (clientX - centerX) / parallaxStrengthTwo;
			const moveY = (clientY - centerY) / parallaxStrengthTwo;

			shapesContainerTwo.style.transform = `translate(${-moveX}px, ${moveY}px)`;
		};

		window.addEventListener('mousemove', handleMouseMove);

		return () => {
			window.removeEventListener('mousemove', handleMouseMove);
		};
	}, []);

	return (
		<>
			<main className="flex bg-white w-full">
				<aside className="wrapper xl:w-1/5 bg-dark-purple rounded-br-3xl rounded-tr-3xl h-screen pl-6 pt-12 flex flex-col">
					<div className="h-1/3 pr-24 text-9xl">
						<h1 className="h-1/3 pr-24 text-2xl text-offWhite p-9 pl-2 pt-2">
							Hey... why not just login? it`s super easy nowdays
							with username and password, google or discord.
						</h1>
					</div>
					<div className="flex relative shapes scale-125">
						<Image
							src="/shapetwo.png"
							alt="Remco Stoeten login page"
							width={256}
							height={160}
							className="shapes__four"
						/>
						<Image
							src="/shapeThree.png"
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
							className="shapes__one"
						/>
						<Image
							src="/ball.png"
							alt="Remco Stoeten login page"
							width={235}
							height={235}
							className="shapes__two"
						/>
					</div>
				</aside>
				<article className="bg-white rounded-bl-3xl rounded-tl-3xl rounded-r-md  p-32 w-2/3">
					<Dropdown
						href="absolute r-0 custom-dropdown"
						items={items}
					/>

					<div className="screen-one">
						<h1 className="text-back text-size[128px]">
							Welcome !!
						</h1>
					</div>
					<div className="screen-two">
						<div className="flex justify-between">
							<IconButton
								color="text-slate-400"
								icon={<Google />}
								text="Sign in with Google"
							/>
							<IconButton
								color="text-slate-400"
								icon={<GitHub />}
								text="Sign in with Github"
							/>
						</div>
						<span className="uppercase text-trueGray-400">or</span>
					</div>
				</article>
			</main>
		</>
	);
};

export default LoginPage;
