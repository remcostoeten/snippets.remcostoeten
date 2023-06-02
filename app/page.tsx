import TopNotice from '@/components/ui-elements/TopNotice';
import Image from 'next/image';
import Link from 'next/link';
export default function Home() {
	return (
		<>
			<TopNotice />
			<Link href="login">login</Link>
		</>
	);
}
