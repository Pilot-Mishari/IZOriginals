import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { connectToDatabase } from '@/lib/db';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // 1. Check if they filled out the form
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Please enter an email and password.');
        }

        await connectToDatabase();

        // 2. Find the exact user in your new database
        const user = await User.findOne({ email: (credentials.email as string).toLowerCase() });
        if (!user) {
          throw new Error('No account found with this email.');
        }

        // 3. Compare the typed password with the hashed database password
        const passwordsMatch = await bcrypt.compare(
          credentials.password as string,
          user.password
        );

        if (!passwordsMatch) {
          throw new Error('Incorrect password.');
        }

        // 4. Success! Give the session their secure details
        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role, // In case we need Admin checks later!
        };
      }
    })
  ],
  pages: {
    signIn: '/login', // Tell NextAuth where our custom login page is
  },
  callbacks: {
    // This ensures their database ID and Role get passed to their browser session
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        (session.user as any).id = token.id;
        (session.user as any).role = token.role;
      }
      return session;
    }
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.AUTH_SECRET,
});