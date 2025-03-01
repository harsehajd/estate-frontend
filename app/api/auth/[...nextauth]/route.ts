import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        
        try {
          // This is a placeholder - you would normally validate against your API
          if (credentials.email === "user@example.com" && credentials.password === "password") {
            return {
              id: "1",
              email: "user@example.com",
              name: "Demo User"
            };
          }
          return null;
        } catch (error) {
          return null;
        }
      }
    })
  ],
  pages: {
    signIn: "/auth/signin",
    signOut: "/auth/signout",
    error: "/auth/error",
    newUser: "/auth/register"
  },
  session: {
    strategy: "jwt"
  }
});

export { handler as GET, handler as POST }; 