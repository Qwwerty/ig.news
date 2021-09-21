import styles from './styles.module.scss'
import {signIn, useSession} from "next-auth/client";

export function SubscriptionButton () {
  const [session] = useSession()

  function handleSubscription () {
    if (!session) {
      signIn('github')
      return
    }


  }

  return (
    <button
      type="button"
      className={styles.subscriptionButton}
      onClick={handleSubscription}
    >
      Inscrever-se
    </button>
  )
}