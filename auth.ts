import NextAuth from "next-auth";
import Github from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import { AuthRestAdapter } from "./auth-rest-adapter";

const providers = [
  Google({
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  }),
  // Github({
  //   clientId: process.env.GITHUB_CLIENT_ID,
  //   clientSecret: process.env.GITHUB_CLIENT_SECRET,
  // }),
];

export const providerMap = providers.map((provider: any) => {
  if (typeof provider === "function") {
    const providerData = provider();
    return { id: providerData.id, name: providerData.name };
  } else {
    return { id: provider.id, name: provider.name };
  }
});

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: AuthRestAdapter(),
  providers,
  pages: {
    signIn: "/signin",
  },
  session: {
    strategy: "database",
  },
  secret: process.env.NEXT_PUBLIC_SECRET,
  callbacks: {
    session(params) {
      return {
        ...params.session,
        sessionToken: params.session.sessionToken,
      };
    },
  },
  cookies: {
    sessionToken: {
      name: `authjs.session-token`,
      options: {
        httpOnly: false,
        secure: true,
        sameSite: "none",
      },
    },
  },
});
