import {query as q} from 'faunadb'
import {fauna} from '../fauna'

interface IUser {
  ref: {
    id: string;
  },
  data: {
    stripe_customer_id: string;
  }
}

export async function getUser (email: string) {
  try {
    const user = await fauna.query<IUser>(
      q.Get(
        q.Match(
          q.Index('user_by_email'),
          q.Casefold(email)
        )
      )
    )

    return user
  } catch (e) {
    throw  new Error(e)
  }
}