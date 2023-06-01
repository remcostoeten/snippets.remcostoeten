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
			className={`icon-button relative flex bg-white items-center mr-6 rounded-md shadow-md justify-center px-6 py-4  border border-${color}-500 shadow-sm`}
		>
			{icon && <span className="mr-2">{icon}</span>}
			{text && <span>{text}</span>}
		</button>
	);
};

export default IconButton;
