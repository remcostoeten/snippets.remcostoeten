import type { AppProps } from 'next/app'
import Navbar from '../components/Navbar'
import '../styles/globals.scss'
import Loader from '@/components/ui-elements/Loader';
function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Navbar />
	  <Loader show={true} />
      <Component {...pageProps} />
    </>
  )
}

export default MyApp
