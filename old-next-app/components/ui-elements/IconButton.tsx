import React from 'react';

type ButtonProps = {
	color?: string;
	icon?: React.ReactNode;
	text?: string;
	svg?: React.ReactNode;
	onClick?: (
		e?: React.MouseEvent<HTMLButtonElement, MouseEvent>,
	) => void | Promise<void>;
};

const IconButton: React.FC<ButtonProps> = ({
	color = 'blue',
	svg,
	text,
	onClick,
}) => {
	return (
		<button
			onClick={(e) => onClick && onClick(e)}
			className={`icon-button relative mb-4 flex bg-white items-center mr-6 rounded-md shadow-md justify-center px-12 py-8 border border-${color}-500 shadow-sm transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-110 hover:bg-${color}-100`}
		>
			{svg && <span className="mr-2">{svg}</span>}
			{text && <span>{text}</span>}
		</button>
	);
};

export default IconButton;
