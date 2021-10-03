import { AppProps } from 'next/app'
import Router from 'next/router'
import { Provider as NextAuthProvider } from 'next-auth/client'
import NProgress from 'nprogress'

import { Header } from '../components/Header'

import '../../styles/globa.scss'
import "animate.css"

Router.events.on('routeChangeStart', () => NProgress.start() )

Router.events.on('routeChangeComplete', () => NProgress.done())
Router.events.on('routeChangeError', () => NProgress.done())

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <NextAuthProvider session={pageProps.session}>
        <Header />
        <Component {...pageProps} />
      </NextAuthProvider>
    </>
  )
}

export default MyApp
