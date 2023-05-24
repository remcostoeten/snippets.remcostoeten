import '../styles/globals.css';

import { useUserData } from '../lib/hooks';
import { UserContext } from '../lib/context';
import Navbar from '@/components/Navbar';

export default function MyApp({ Component, pageProps }) {
  
  const userData = useUserData();

  return (
    <UserContext.Provider value={userData}>
      <Component {...pageProps} />
    </UserContext.Provider>
  );
}
