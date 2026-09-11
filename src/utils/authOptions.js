import CredentialsProvider from "next-auth/providers/credentials";
import User from "@/models/User";
import { verifyPassword } from "@/utils/auth";
import connectDB from "@/utils/connectDB";
import "@/utils/env";

export const authOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: "jwt" },
  pages: {
    signIn: "/",
  },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "text" },
      },
      async authorize(credentials) {
        const email = credentials?.email?.trim().toLowerCase();
        const password = credentials?.password;

        try {
          await connectDB();
        } catch (error) {
          throw new Error("Could not connect to the database");
        }

        if (!email || !password) {
          throw new Error("Please enter a valid email and password");
        }

        const user = await User.findOne({ email });

        if (!user) {
          throw new Error("No account found. Please sign up first");
        }

        const isValid = await verifyPassword(password, user.password);

        if (!isValid) {
          throw new Error("Incorrect email or password");
        }

        return {
          email: user.email,
          name: [user.name, user.lastName].filter(Boolean).join(" "),
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.email = user.email;
        token.name = user.name || "";
      }
      if (trigger === "update" && session) {
        if (session.email) token.email = session.email;
        if (typeof session.name === "string") token.name = session.name;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.email = token.email;
      session.user.name = token.name || "";
      return session;
    },
  },
};
