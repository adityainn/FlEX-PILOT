import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/services/db"

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  providers: [
    Credentials({
      name: "Demo Account",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "demo@flexpilot.ai" },
        password: { label: "Password", type: "password", placeholder: "Any password works" }
      },
      async authorize(credentials) {
        // Return a mocked user instantly to bypass any DB latency or connection timeouts
        return { 
          id: "usr_123", 
          name: "Demo User", 
          email: "demo@flexpilot.ai",
          image: "https://github.com/shadcn.png" 
        };
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.id) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
})
