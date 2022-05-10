import NextAuth from "next-auth";
import FacebookProvider from "next-auth/providers/facebook";

const FACEBOOK_CLIENT_ID = process.env.FACEBOOK_CLIENT_ID;
const FACEBOOK_CLIENT_SECRET = process.env.FACEBOOK_CLIENT_SECRET;

if (!FACEBOOK_CLIENT_ID) {
  throw new Error("FACEBOOK_CLIENT_ID env. variable is not defined");
}
if (!FACEBOOK_CLIENT_SECRET) {
  throw new Error("FACEBOOK_CLIENT_SECRET env. variable is not defined");
}

export default NextAuth({
  providers: [
    FacebookProvider({
      clientId: FACEBOOK_CLIENT_ID,
      clientSecret: FACEBOOK_CLIENT_SECRET,
    }),
  ],
});
