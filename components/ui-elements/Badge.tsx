import React from 'react';

type BadgeProps = {
	category: string;
};

const Badge: React.FC<BadgeProps> = ({ category }) => (
	<span className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
		{category}
	</span>
);

export default Badge;
