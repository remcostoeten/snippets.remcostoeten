import React, { useContext } from 'react';
import { AuthContext, AuthContextProps } from '../lib/AuthContext';
import Aside from '@/components/Dashboard/Aside';
import DashboardPage from '@/components/Dashboard/Intro';
import LoginPage from '../app/login/page';
import { Login } from '@mui/icons-material';

export default function Index() {

	return (
		<>
			<div className="flex w-full">
<LoginPage />
			</div>
		</>
	);
}
