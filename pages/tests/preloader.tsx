import Preloader from '@/components/ui-elements/Preloader';
import ReloadDivNext from '@/lib/Reload__Next';
import React from 'react';
import ReloadPage from './../../lib/ReloadPageButton';

export default function Loader() {
	return (
		<>
			<ReloadPage /> <Preloader />
		</>
	);
}
