import { useState } from 'react';

export default function Witcher() {
	const [isDarkMode, setIsDarkMode] = useState(false);

	const handleToggleMode = () => {
		setIsDarkMode(!isDarkMode);
		document.body.classList.toggle('dark');
	};

	return (
		<div className="witcher-container">
			<h1 className="witcher-title">
				{isDarkMode ? 'Dark Mode' : 'Light Mode'}
			</h1>
			<button className="witcher-button" onClick={handleToggleMode}>
				Toggle Mode
			</button>
		</div>
	);
}
