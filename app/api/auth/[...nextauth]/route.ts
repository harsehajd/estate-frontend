import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { authService } from "@/services/api";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        
        try {
          const response = await authService.login(
            credentials.email,
            credentials.password
          );
          
          return {
            id: response.user.id,
            email: response.user.email,
            name: response.user.name,
            accessToken: response.access_token
          };
        } catch (error) {
          return null;
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      // Initial sign in
      if (account && user) {
        // For credentials provider, we already have the token from authorize
        if (account.provider === "credentials") {
          return {
            ...token,
            accessToken: user.accessToken,
            userId: user.id
          };
        }
        
        // For Google OAuth, we can use the user info directly
        if (account.provider === "google") {
          return {
            ...token,
            // Store Google access token if you need it
            accessToken: account.access_token,
            // Use Google's user ID
            userId: user.id
          };
        }
      }
      
      return token;
    },
    async session({ session, token }) {
      // Send properties to the client
      session.accessToken = token.accessToken as string;
      session.userId = token.userId as string;
      
      return session;
    }
  },
  pages: {
    signIn: '/auth/login',
  },
  session: {
    strategy: "jwt",
  },
});

export { handler as GET, handler as POST }; 