import React, { useContext } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
	AddHome as AddHomeIcon,
	FormatListNumberedRtl as FormatListNumberedRtlIcon,
	SpeakerNotes as SpeakerNotesIcon,
	AttachMoney as AttachMoneyIcon,
	IntegrationInstructionsSharp,
	Logout,
	BuildCircle,
	MarkUnreadChatAlt,
	Home,
	ViewKanban,
	Login,
} from '@mui/icons-material';
import { AuthContext, AuthContextProps } from '@/lib/AuthContext';
import { User } from 'firebase/auth';
import { auth } from '@/lib/firebase';

interface NavigationItem {
	href: string;
	label: string;
	icon: JSX.Element;
}

interface UserProps {
	user: Partial<User> | null;
}

const navigationItems: NavigationItem[] = [
	{
		href: '/',
		label: 'Dashboard',
		icon: <Home />,
	},
	{
		href: 'todos',
		label: 'Todos',
		icon: <FormatListNumberedRtlIcon />,
	},
	{
		href: 'diary',
		label: 'Diary',
		icon: <SpeakerNotesIcon />,
	},
	{
		href: 'expenses',
		label: 'Expenses',
		icon: <AttachMoneyIcon />,
	},
	{
		href: 'docs',
		label: 'Docs',
		icon: <IntegrationInstructionsSharp />,
	},
	{
		href: 'login',
		label: 'Login',
		icon: <Login />,
	},
];

const navigationItemsTwo: NavigationItem[] = [
	{
		href: 'url-extract',
		label: 'Url extract tool',
		icon: <BuildCircle />,
	},
	{
		href: 'whataspp-demo',
		label: 'Whatsapp export demo',
		icon: <MarkUnreadChatAlt />,
	},
	{
		href: 'kanban-board',
		label: 'Kanban board',
		icon: <ViewKanban />,
	},
];

const Navigation = () => {
	return (
		<ul className="space-y-2 tracking-wide mt-8">
			{navigationItems.map((item) => (
				<li key={item.href}>
					<Link
						href={item.href}
						className="px-4 py-3 flex items-center space-x-4 rounded-md text-gray-600 group"
					>
						{item.icon}
						<span className="group-hover:text-gray-700">
							{item.label}
						</span>
					</Link>
				</li>
			))}
		</ul>
	);
};

const skeletonProfile = (
	<div className="mt-8 text-center">
		<div className="w-10 h-10 m-auto rounded-full bg-gray-300 animate-pulse"></div>
		<div className="w-20 h-5 mt-4 bg-gray-300 animate-pulse"></div>
		<div className="w-12 h-4 mt-2 bg-gray-300 animate-pulse"></div>
	</div>
);

const skeletonNavigationItems = (
	<ul className="space-y-2 tracking-wide mt-8">
		{[1, 2, 3, 4].map((index) => (
			<li key={index}>
				<div className="px-4 py-3 flex items-center space-x-4 rounded-md text-gray-600 group bg-gray-200 animate-pulse">
					<div className="w-6 h-6 bg-gray-300"></div>
					<div className="w-16 h-4 bg-gray-300"></div>
				</div>
			</li>
		))}
		<li>
			<div className="px-4 py-3 flex items-center space-x-4 rounded-md text-gray-600 group bg-gray-200 animate-pulse">
				<Link
					className="font-bold text-lg text-gray-900 align-right"
					href="tests"
				>
					Infinite preloader
				</Link>
			</div>
		</li>
	</ul>
);

const UserProfile = ({ user }: UserProps) => {
	return (
		<div className="mt-8 text-center">
			<Image
				width={100}
				height={100}
				src={user?.photoURL || '/buu.png'}
				alt={user?.displayName || 'Django wagner'}
				className="w-10 h-10 m-auto rounded-full object-cover lg:w-28 lg:h-28"
			/>
			<h5 className="hidden mt-4 text-xl font-semibold text-gray-600 lg:block">
				{user?.displayName || 'Unknown User'}
			</h5>
			<span className="hidden text-gray-400 lg:block">Admin</span>
		</div>
	);
};

export default function Aside({ user }: UserProps): JSX.Element {
	const router = useRouter();
	const { currentUser } = useContext(AuthContext) as AuthContextProps;

	const handleLogout = () => {
		auth.signOut();
		router.push('/');
	};

	return (
		<aside className="ml-[-100%] z-10 pb-3 px-6 w-full flex flex-col justify-between  border-r bg-background transition duration-300 md:w-3/12 lg:ml-0 lg:w-[15%] h-screen bg-white">
			<div>
				<div className="-mx-6 px-6 py-4">
					<Link
						className="flex justify-between w-full align-middle"
						href="#"
						title="home"
					></Link>
				</div>
				{currentUser ? (
					<>
						{/* <div className="mt-8 text-center">
							<Image
								width={100}
								height={100}
								src={
									currentUser.photoURL ||
									'https://tailus.io/sources/blocks/stats-cards/preview/images/second_user.webp'
								}
								alt={currentUser.displayName || 'Unknown User'}
								className="w-10 h-10 m-auto rounded-full object-cover lg:w-28 lg:h-28"
							/>
							<h5 className="hidden mt-4 text-xl font-semibold text-gray-600 lg:block">
								{currentUser.displayName || 'Unknown User'} as
								string
							</h5>
							<span className="hidden text-gray-400 lg:block">
								Admin
							</span>
						</div> */}
						<Navigation />
					</>
				) : (
					<>
						{skeletonProfile}
						{skeletonNavigationItems}
					</>
				)}
			</div>
			<div className="px-6 -mx-6 pt-4 flex justify-between items-center border-t"></div>
		</aside>
	);
}
