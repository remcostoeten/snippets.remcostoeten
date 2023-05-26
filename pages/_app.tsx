import type { AppProps } from 'next/app';
import { useState, useEffect } from 'react';
import '../styles/globals.scss';
import Sidebar from '@/components/Sidebar';
import TopNotice from '@/components/ui-elements/TopNotice';
import { AuthProvider } from '@/lib/AuthContext';

function MyApp({ Component, pageProps }: AppProps) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <div>Preloader of Skeleton-component...</div>;
  }

  return (
    <AuthProvider>
      <TopNotice />
      <div className="flex">
        <Sidebar />
        <main className="main-content flex flex-col flex-1 h-screen bg-white rounded-lg p-4 w-95">
          <Component {...pageProps} />
        </main>
      </div>
    </AuthProvider>
  );
}

export default MyApp;
