import React, { useContext } from 'react';
import { AuthContext } from '@/lib/AuthContext';
import Aside from '@/components/Dashboard/Aside';
import DashboardPage from '@/components/Dashboard/Intro';
import LoginPage from './login';

export default function Index() {
	const { currentUser } = useContext(AuthContext);

	return (
		<>
			<div className="flex w-full">
				{currentUser ? <DashboardPage /> : <LoginPage />}
			</div>
		</>
	);
}
