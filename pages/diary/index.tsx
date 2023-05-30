import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { EntriesList } from '@/components/Diary/EntriesList';
import { EntryForm } from '@/components/Diary/EntryForm';
import { User } from '@/lib/types';

export default function Index({ user }: { user: User | null }) {
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/login');
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
  const user = req.locals?.user || null;
  return { props: { user } };
};
