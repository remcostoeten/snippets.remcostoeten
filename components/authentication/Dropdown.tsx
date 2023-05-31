import { useState } from 'react';

const Dropdown = () => {
	const [isVisible, setIsVisible] = useState(false);

	const handleMouseOver = () => {
		setIsVisible(true);
	};

	const handleMouseLeave = () => {
		setIsVisible(false);
	};

	const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
		if (event.key === 'Enter') {
			setIsVisible(!isVisible);
		}
	};

	return (
		<div id="app" className="antialiased font-sans py-16">
			{/* This empty div is only for demo purposes and it's used so you can close the menu on a touchscreen device. Normally you'd handle it differently by not using hover states on mobile, but by using real clicks. */}
			<div
				className="fixed inset-0"
				onClick={() => setIsVisible(false)}
			></div>
			<div
				className="relative inline-block"
				onMouseOver={handleMouseOver}
				onMouseLeave={handleMouseLeave}
				onKeyDown={handleKeyDown}
				tabIndex={0}
			>
				<button
					type="button"
					className="inline-flex items-center justify-between px-2 py-1 font-medium text-gray-700 transition-all duration-500 rounded-md focus:outline-none focus:text-brand-900 sm:focus:shadow-outline"
				>
					<span className="flex-shrink-0">Menu</span>
					<svg
						fill="currentColor"
						viewBox="0 0 20 20"
						className="flex-shrink-0 w-5 h-5 ml-1"
					>
						<path
							className={`${
								isVisible ? 'rotate-180' : ''
							} transition duration-300 ease-in-out origin-center transform`}
							fillRule="evenodd"
							d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
							clipRule="evenodd"
						></path>
					</svg>
				</button>
				{isVisible && (
					<div className="absolute pt-2">
						<div className="relative py-1 bg-white border border-gray-200 rounded-md shadow-xl">
							<div className="absolute top-0 w-4 h-4 origin-center transform rotate-45 translate-x-5 -translate-y-2 bg-white border-t border-l border-gray-200 rounded-sm pointer-events-none"></div>
							<div className="relative">
								<a
									href="#"
									className="block w-full px-4 py-2 font-medium text-gray-700 whitespace-no-wrap hover:bg-gray-100 focus:outline-none hover:text-gray-900 focus:text-gray-900 focus:shadow-outline transition duration-300 ease-in-out"
								>
									Submenu Link #1
								</a>
								<a
									href="#"
									className="block w-full px-4 py-2 font-medium text-gray-700 whitespace-no-wrap hover:bg-gray-100 focus:outline-none hover:text-gray-900 focus:text-gray-900 focus:shadow-outline transition duration-300 ease-in-out"
								>
									Submenu Link #2
								</a>
								<a
									href="#"
									className="block w-full px-4 py-2 font-medium text-gray-700 whitespace-no-wrap hover:bg-gray-100 focus:outline-none hover:text-gray-900 focus:text-gray-900 focus:shadow-outline transition duration-300 ease-in-out"
								>
									Submenu Link #3
								</a>
								<a
									href="#"
									className="block w-full px-4 py-2 font-medium text-gray-700 whitespace-no-wrap hover:bg-gray-100 focus:outline-none hover:text-gray-900 focus:text-gray-900 focus:shadow-outline transition duration-300 ease-in-out"
								>
									Submenu Link #4
								</a>
							</div>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default Dropdown;
