import React, { useContext } from 'react';
import { AuthContext, AuthContextProps } from '../lib/AuthContext';
import Aside from '@/components/Dashboard/Aside';
import DashboardPage from '@/components/Dashboard/Intro';
import Login from '../app/login/page';

export default function Index() {

	return (
		<>
			<div className="flex w-full">
<Login/>
			</div>
		</>
	);
}
