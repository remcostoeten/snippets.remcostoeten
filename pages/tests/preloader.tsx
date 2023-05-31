import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Preloader from '@/components/ui-elements/Preloader';

const Loader: React.FC = () => {
	const router = useRouter();
	const [isAnimating, setIsAnimating] = useState(false);

	useEffect(() => {
		if (isAnimating) {
			document.body.classList.add('animationPartTwo');
		} else {
			document.body.classList.remove('animationPartTwo');
		}
	}, [isAnimating]);

	const handleReload = () => {
		setIsAnimating(true);
		setTimeout(() => {
			setIsAnimating(false);
			router.reload();
		}, 1000);
	};

	return (
		<>
			<Preloader />
			<div className="mt-10">
				<button
					className="bg-gray-200 text-gray-800 px-4 py-2 rounded cursor-pointer"
					onClick={handleReload}
				>
					Reload animation
				</button>
			</div>
		</>
	);
};

export default Loader;
