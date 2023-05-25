import { useState } from 'react';
import LightIcon from '@mui/icons-material/Light';
import ModeNightIcon from '@mui/icons-material/ModeNight';

export default function ColorSwitcher() {
	const [isDarkMode, setIsDarkMode] = useState(false);

	const handleToggleMode = () => {
		setIsDarkMode(!isDarkMode);
		document.body.classList.toggle('dark');
	};

	return (
		<div className="witcher-container">
			<span onClick={handleToggleMode}>
				{isDarkMode ? <LightIcon /> : <ModeNightIcon />}
			</span>
		</div>
	);
}
