import type { NextAuthOptions, Profile } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import prisma from "./prisma";

interface GoogleProfile extends Profile {
  picture?: string;
}

const googleEnabled = Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);

export const authOptions: NextAuthOptions = {
  providers: googleEnabled
    ? [
        GoogleProvider({
          clientId: process.env.GOOGLE_CLIENT_ID as string,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET as string
        })
      ]
    : [],
  session: {
    strategy: "jwt"
  },
  pages: {
    signIn: "/login"
  },
  callbacks: {
    async signIn({ profile }) {
      const googleProfile = profile as GoogleProfile;
      if (!googleProfile?.email) {
        return false;
      }

      await prisma.user.upsert({
        where: { email: googleProfile.email },
        update: {
          name: googleProfile.name,
          image: googleProfile.picture
        },
        create: {
          email: googleProfile.email,
          name: googleProfile.name,
          image: googleProfile.picture
        }
      });

      return true;
    },
    async session({ session, token }) {
      if (session.user && token.email) {
        const user = await prisma.user.findUnique({ where: { email: token.email } });
        if (user) {
          session.user.id = user.id;
        }
      }
      return session;
    },
    async jwt({ token, profile }) {
      if (profile?.email) {
        token.email = profile.email;
      }
      return token;
    }
  }
};
