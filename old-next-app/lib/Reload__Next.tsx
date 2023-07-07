import React, { useState } from 'react';

const ReloadDivNext: React.FC = () => {
	const [reloadKey, setReloadKey] = useState(0);

	const handleReload = () => {
		setReloadKey((prevKey) => prevKey + 1);
	};

	return (
		<div className="absolute left-0 top-0" key={reloadKey}>
			<button
				className="absolute bg-red-400 left-0 top-0"
				onClick={handleReload}
			>
				Reload Div
			</button>
			{/* The content you want to reload */}
			<div id="__next"></div>
		</div>
	);
};

export default ReloadDivNext;
