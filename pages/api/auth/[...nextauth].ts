import NextAuth from "next-auth";
import FacebookProvider from "next-auth/providers/facebook";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "config/db";

const FACEBOOK_CLIENT_ID = process.env.FACEBOOK_CLIENT_ID;
const FACEBOOK_CLIENT_SECRET = process.env.FACEBOOK_CLIENT_SECRET;

if (!FACEBOOK_CLIENT_ID) {
  throw new Error("FACEBOOK_CLIENT_ID env. variable is not defined");
}
if (!FACEBOOK_CLIENT_SECRET) {
  throw new Error("FACEBOOK_CLIENT_SECRET env. variable is not defined");
}

export default NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        username: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        console.log(credentials, req);
        return null;
      },
    }),
    FacebookProvider({
      name: "facebook",
      clientId: FACEBOOK_CLIENT_ID,
      clientSecret: FACEBOOK_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async signIn(data) {
      console.log(data);
      return true;
    },
  },
});
