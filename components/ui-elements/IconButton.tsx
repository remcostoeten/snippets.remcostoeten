import React from 'react';
import { Icon } from '@mui/material';

type ButtonProps = {
	color?: string;
	icon?: React.ReactNode;
	text?: string;
};

const IconButton: React.FC<ButtonProps> = ({ color = 'blue', icon, text }) => {
	return (
		<button
			className={`relative flex items-center justify-center px-4 py-2 rounded-md border border-${color}-500 shadow-sm`}
		>
			{icon && <span className="mr-2">{icon}</span>}
			{text && <span>{text}</span>}
		</button>
	);
};

export default IconButton;
