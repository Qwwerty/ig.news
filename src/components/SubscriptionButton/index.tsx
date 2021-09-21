import styles from './styles.module.scss'
import {signIn, useSession} from "next-auth/client";
import {getStripeJS} from "../../services/stripe-js";
import {api} from "../../services/api";

export function SubscriptionButton () {
  const [session] = useSession()

  async function handleSubscription () {
    if (!session) {
      signIn('github')
      return
    }

    try {
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