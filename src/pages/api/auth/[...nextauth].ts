import NextAuth from "next-auth"
import Providers from "next-auth/providers"

import { createUser } from '../../../services/faunadb/createUser'

export default NextAuth({
  // Configure one or more authentication providers
  providers: [
    Providers.GitHub({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      scope: 'read:user'
    }),
  ],
  callbacks: {
    async signIn(user, account, profile){
      const { email } = user

      try {
        await createUser(email)
        return true
      } catch (error) {
        return false
      }
    }
  }
})