import { useContext } from 'react';
import { AuthContext } from '@/lib/AuthContext';
import { User } from '@/lib/types';

import { EntriesList } from '@/components/Diary/EntriesList';
import { EntryForm } from '@/components/Diary/EntryForm';
export default function Index() {
	const { currentUser } = useContext(AuthContext);

	if (!currentUser) {
		return <div>Please log in to view this page.</div>;
	}

	const user: User = currentUser;

	return (
		<div>
			<EntryForm user={user} />
			<EntriesList user={user} />
		</div>
	);
}
