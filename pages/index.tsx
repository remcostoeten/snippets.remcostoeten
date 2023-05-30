import Aside from '@/components/Dashboard/Aside';
import DashboardPage from '@/components/Dashboard/Intro';
import React from 'react';

export default function index() {
	return (
		<>
			<div className="flex w-full">
				<DashboardPage />
			</div>
		</>
	);
}
