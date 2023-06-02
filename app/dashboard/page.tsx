'use client';
import Aside from '@/components/Dashboard/Aside';
import DashboardPage from '@/components/Dashboard/Intro';
import React from 'react';

export default function Dashboard() {
	return (
		<>
			<div className="flex">
				<DashboardPage />
			</div>
		</>
	);
}
