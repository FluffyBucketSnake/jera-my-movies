import bcrypt from "bcrypt";
import NextAuth from "next-auth";
import FacebookProvider from "next-auth/providers/facebook";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "config/db";
import { convertProfileModelToDTO } from "dtos/Profile";

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
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials) return null;
        const user = await prisma.user.findFirst({
          where: { email: credentials.email },
          include: { credential: true },
        });
        if (!(user && user.credential)) return null;
        if (
          !(await bcrypt.compare(
            credentials.password,
            user.credential.password
          ))
        )
          return null;
        const { credential, ...userData } = user;
        return userData;
      },
    }),
    FacebookProvider({
      name: "facebook",
      clientId: FACEBOOK_CLIENT_ID,
      clientSecret: FACEBOOK_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async session({ session, user }) {
      const userData = await prisma.userData.findUnique({
        where: { userId: user.id },
        include: { profiles: { include: { movieWatchlist: true } } },
      });
      const profileCount = await prisma.profile.count;
      const signupComplete = !!userData;
      session.user.id = user.id;
      session.user.signupComplete = signupComplete;
      session.user.canCreateNewProfile =
        !!userData && userData.profiles.length < 4;
      session.user.profiles =
        (userData && userData.profiles.map(convertProfileModelToDTO)) ??
        undefined;
      return session;
    },
  },
});
