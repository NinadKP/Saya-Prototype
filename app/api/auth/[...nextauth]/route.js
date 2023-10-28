import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

import User from '@models/user';
import { connectToDB } from '@utils/database';

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          scope: "https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/calendar"
        }
      }
    })
  ],
  session: {
    jwt: true,
    maxAge: 2592000
  },
  callbacks: {

    async session({ session, token, user }) {

     if (typeof token !== typeof undefined)
      {
        session.token = token.token;
      }
      session.user = token.token.user
      const sessionUser = await User.findOne({ email: session.user.email });
      // console.log(sessionUser);
      if (sessionUser){
        session.user.id = sessionUser._id.toString();
      }
      

      session.accessToken = token.token.account.access_token
      console.log(session)
      return session;
    },

    async jwt(token, user, account) {
      if (typeof user !== typeof undefined)
      {
          token.token.user = user;
      }

    return token
  

  },
    async signIn({ account, profile, user, credentials }) {
      try {
        await connectToDB();

        // check if user already exists
        const userExists = await User.findOne({ email: profile.email });

        // if not, create a new document and save user in MongoDB
        if (!userExists) {
          await User.create({
            email: profile.email,
            username: profile.name.replace(" ", "").toLowerCase(),
            image: profile.picture,
            access_token: account.access_token
          });
        }

        return true
      } catch (error) {
        console.log("Error checking if user exists: ", error.message);
        return false
      }
    },
  },

})

export { handler as GET, handler as POST }