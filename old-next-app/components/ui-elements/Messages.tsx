import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface MessageProps {
	toastMessage: string;
	Icon: JSX.Element;
	iconBackgroundColor: string;
	backgroundColor?: string;
	textColor?: string;
	onClose?: () => void;
}

const Message: React.FC<MessageProps> = ({
	toastMessage,
	Icon,
	iconBackgroundColor,
	backgroundColor = 'bg-gray-100',
	textColor = 'text-gray-900',
	onClose,
}) => {
	const [showMessage, setShowMessage] = useState(true);

	const handleClose = () => {
		setShowMessage(false);
		if (onClose) {
			onClose();
		}
	};

	useEffect(() => {
		const timer = setTimeout(() => {
			handleClose();
		}, 5000);

		return () => {
			clearTimeout(timer);
		};
	}, [handleClose]);

	return (
		<>
			{showMessage && (
				<div className="fixed bottom-5 w-full flex items-end justify-center">
					<motion.div
						initial={{ y: '110%', opacity: 0 }}
						animate={{ y: 0, opacity: 1 }}
						exit={{ y: '110%', opacity: 0 }}
						transition={{ duration: 0.3 }}
						className={`max-w-2xl mx-4 p-4 rounded-lg shadow-md bg-white dark:bg-gray-800 ${backgroundColor} ${textColor} rounded-lg dark:text-blue-200`}
					>
						<div className="flex items-center">
							<div
								className={`flex items-center justify-center flex-shrink-0 w-8 h-8 text-blue-500 ${iconBackgroundColor} rounded-lg dark:text-blue-200`}
							>
								<svg
									className="w-5 h-5"
									fill="currentColor"
									viewBox="0 0 20 20"
									xmlns="http://www.w3.org/2000/svg"
								>
									{Icon}
								</svg>
							</div>
							<div className="ml-3 text-sm font-normal">
								{toastMessage}
							</div>
							<button
								type="button"
								className="ml-auto -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex h-8 w-8 dark:text-gray-500 dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700"
								onClick={handleClose}
								aria-label="Close"
							>
								<span className="sr-only">Close</span>
								<svg
									className="w-5 h-5"
									fill="currentColor"
									viewBox="0 0 20 20"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path
										fillRule="evenodd"
										d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
										clipRule="evenodd"
									></path>
								</svg>
							</button>
						</div>
					</motion.div>
				</div>
			)}
		</>
	);
};

export default Message;
