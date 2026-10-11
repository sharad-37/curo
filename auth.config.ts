// auth.config.ts
import type { NextAuthConfig } from "next-auth";
import GitHub from "next-auth/providers/github";

export const authConfig = {
  pages: {
    signIn: "/login",
    newUser: "/dashboard",
  },
  providers: [
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID,
      clientSecret: process.env.AUTH_GITHUB_SECRET,
      issuer: "https://github.com/login/oauth",
    }),
  ],
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isAppRoute =
        nextUrl.pathname.startsWith("/dashboard") ||
        nextUrl.pathname.startsWith("/transactions") ||
        nextUrl.pathname.startsWith("/analytics") ||
        nextUrl.pathname.startsWith("/budgets") ||
        nextUrl.pathname.startsWith("/goals") ||
        nextUrl.pathname.startsWith("/recurring") ||
        nextUrl.pathname.startsWith("/insights") ||
        nextUrl.pathname.startsWith("/forecasting") ||
        nextUrl.pathname.startsWith("/settings");

      if (isAppRoute) {
        if (isLoggedIn) return true;
        return false; // Redirects unauthenticated requests to /login
      }

      // Redirect authenticated users away from /login or /signup to /dashboard
      if (
        isLoggedIn &&
        (nextUrl.pathname === "/login" || nextUrl.pathname === "/signup")
      ) {
        return Response.redirect(new URL("/dashboard", nextUrl));
      }

      return true;
    },
  },
} satisfies NextAuthConfig;
