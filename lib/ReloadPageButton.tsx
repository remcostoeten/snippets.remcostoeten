import React from 'react';
import { useRouter } from 'next/router';

const ReloadPage: React.FC = () => {
	const router = useRouter();

	const handleReload = () => {
		router.reload();
	};

	const removeBodyclassAndReAddClass = () => {
		document.body.classList.remove('animationPartTwo');

		setTimeout(() => {
			document.body.classList.add('animationPartTwo');
		}, 2000);
	};

	const removeBodyClass = () => {
		document.body.classList.remove('overflow-hidden');
	};

	return (
		<>
			<button
				className=" absolute bg-indigo-400 r-0 top-20 z-50"
				onClick={handleReload}
			>
				Reload classes Page
			</button>
		</>
	);
};

export default ReloadPage;
