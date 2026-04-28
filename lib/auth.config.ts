import type { NextAuthConfig } from "next-auth";

// Edge-compatible config — no bcrypt, no Prisma
export const authConfig: NextAuthConfig = {
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  providers: [],
  callbacks: {
    authorized({ auth, request }) {
      const isLoggedIn = !!auth?.user;
      const isAdminRoute = request.nextUrl.pathname.startsWith("/admin");
      if (isAdminRoute) return isLoggedIn;
      return true;
    },
    jwt({ token, user }) {
      if (user) token.rol = (user as { rol?: string }).rol;
      return token;
    },
    session({ session, token }) {
      if (session.user) (session.user as { rol?: string }).rol = token.rol as string;
      return session;
    },
  },
};
