import {query as q} from 'faunadb'
import {fauna} from '../fauna'

export async function createUser(email: string) {
  try {
    await fauna.query(
      await fauna.query(
        q.If(
          q.Not(
            q.Exists(
              q.Match(
                q.Index('user_by_email'),
                q.Casefold(email)
              )
            )
          ),
          q.Create(
            q.Collection('users'),
            {data: {email}}
          ),
          q.Get(
            q.Match(
              q.Index('user_by_email'),
              q.Casefold(email)
            )
          )
        )
      )
    )
  } catch (e) {
    throw  new Error(e)
  }
}