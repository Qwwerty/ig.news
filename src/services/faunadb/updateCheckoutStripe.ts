import {query as q} from 'faunadb'
import {fauna} from '../fauna'

interface IUser {
  ref: {
    id: string;
  }
}

interface IStripeCustomer {
  id: string;
}

export async function updateCheckoutStripe (user: IUser, stripeCustomer: IStripeCustomer) {
  try {
    await fauna.query(
      q.Update(
        q.Ref(
          q.Collection('users'),
          user.ref.id
        ),{
          data: {
            stripe_customer_id: stripeCustomer.id
          }
        }
      )
    )

    return user
  } catch (e) {
    throw  new Error(e)
  }
}