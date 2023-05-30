import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { EntriesList } from '@/components/Diary/EntriesList';
import { EntryForm } from '@/components/Diary/EntryForm';
import { IncomingMessage } from 'http';
import { User } from 'firebase/auth';
interface CustomIncomingMessage extends IncomingMessage {
	locals?: {
		user?: User;
	};
}

export default function Index({ user }: { user: User | null }) {
	const router = useRouter();

	useEffect(() => {
		if (!user) {
			router.push('/');
		}
	}, [user]);

	return user ? (
		<div>
			<EntryForm user={user} />
			<EntriesList user={user} />
		</div>
	) : null;
}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
	const customReq = req as CustomIncomingMessage; // Cast 'req' to CustomIncomingMessage
	const user = customReq?.locals?.user || null;
	return { props: { user } };
};
