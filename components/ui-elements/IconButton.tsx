import React from 'react';
import { Icon } from '@mui/material';

type ButtonProps = {
	color?: string;
	icon?: React.ReactNode;
	text?: string;
	onClick?: () => void;
};

const IconButton: React.FC<ButtonProps> = ({
	color = 'blue',
	icon,
	text,
	onClick,
}) => {
	return (
		<button
			onClick={onClick}
			className={`icon-button relative mb-4 flex bg-white items-center mr-6 rounded-md shadow-md justify-center px-6 py-4 border border-${color}-500 shadow-sm transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-110 hover:bg-${color}-100`}
		>
			{icon && <span className="mr-2">{icon}</span>}
			{text && <span>{text}</span>}
		</button>
	);
};

export default IconButton;
