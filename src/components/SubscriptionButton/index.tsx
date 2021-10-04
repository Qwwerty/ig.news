import styles from './styles.module.scss'
import {signIn, useSession} from "next-auth/client";
import {getStripeJS} from "../../services/stripe-js";
import {api} from "../../services/api";
import {useRouter} from "next/router";
import NProgress from 'nprogress'

export function SubscriptionButton () {
  const [session] = useSession()
  const router = useRouter()

  async function handleSubscription () {
    if (!session) {
      signIn('github')
      return
    }

    if (session?.activeSubscription) {
      await router.push('/posts')
      return
    }

    try {
      NProgress.start()

      const response = await api.post('subscription')
      const { sessionId } = response.data

      const stripe = await getStripeJS()

      await stripe.redirectToCheckout({ sessionId })
    } catch (e) {
      alert(e.message)
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