import { signIn, signOut, useSession } from 'next-auth/client'
import NProgress from 'nprogress'
import { FaGithub } from 'react-icons/fa'
import { FiX } from 'react-icons/fi'

import styles from './styles.module.scss'

export function SignInButton () {
  const [session] = useSession()

  async function handleSignIn () {
    NProgress.start()
    await signIn('github')
    NProgress.done()
  }

  async function handleSignOut () {
    NProgress.start()
    await signOut()
    NProgress.done()
  }

  return session ? (
    <button
      className={styles.signInButton}
      onClick={() => handleSignOut()}
    >
      <FaGithub color="#04D361" />
      { session.user.name }
      <FiX color="#737380" />
    </button>
  ) : (
    <button
      className={styles.signInButton}
      onClick={() => handleSignIn()}
    >
      <FaGithub color="#EBA417" />
      Entrar com github
    </button>
  )
}