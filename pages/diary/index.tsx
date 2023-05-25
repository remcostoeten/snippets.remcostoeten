import { EntryForm } from '@/components/Diary/EntryForm';
import { EntriesList } from '@/components/Diary/EntriesList';

export default function index() {
	return (
		<div>
			<EntryForm />
			<EntriesList />
		</div>
	);
}
