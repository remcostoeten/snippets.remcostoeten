import { useState } from 'react';

export const SearchBar = ({ onSearch }) => {
	const [term, setTerm] = useState('');

	const handleChange = (event) => {
		setTerm(event.target.value);
		onSearch(event.target.value);
	};

	return (
		<input
			className="block w-full p-2 rounded mt-2 border-gray-300"
			type="text"
			value={term}
			onChange={handleChange}
			placeholder="Search entries..."
		/>
	);
};
