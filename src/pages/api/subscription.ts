import {NextApiRequest, NextApiResponse} from "next";
import {stripe} from "../../services/stripe";

import {getSession} from 'next-auth/client'
import { getUser } from '../../services/faunadb/getUser'
import {updateCheckoutStripe} from "../../services/faunadb/updateCheckoutStripe";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    const session = await getSession({req})

    /** Recover user faundadb*/
    const user = await getUser(session.user.email)

    let customerId = user.data.stripe_customer_id

    if (!customerId) {
      const stripeCustomer = await stripe.customers.create({
        email: session.user.email
      })

      /** Update customer stripe in faunadb*/
      await updateCheckoutStripe(user, stripeCustomer)

      customerId = stripeCustomer.id
    }

    const stripeCheckoutSession = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      billing_address_collection: 'required',
      line_items: [
        {price: 'price_1JbYhtCramiwGkN3ZtpfNiMD', quantity: 1}
      ],
      mode: 'subscription',
      allow_promotion_codes: true,
      success_url: process.env.STRIPE_SUCCESS_URL,
      cancel_url: process.env.STRIPE_CANCEL_URL
    })

    return res.status(200).json({sessionId: stripeCheckoutSession.id})
  } else {
    res.setHeader('Allow', 'POST')
    res.status(405).end('Method not allowed')
  }
}