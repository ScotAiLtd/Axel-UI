import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/db";
import { AuthOptions } from "next-auth";
import type { DefaultSession } from "next-auth";

interface ExtendedSession extends DefaultSession {
  user: {
    id: string
  } & DefaultSession["user"]
}

export const authConfig: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    {
      id: "azure-ad-saml",
      name: "Azure Active Directory",
      type: "oauth",
      wellKnown: undefined,
      authorization: {
        url: "https://login.microsoftonline.com/7001f45d-eb22-4507-836a-8f0a934324bf/saml2",
        params: {}
      },
      token: {
        url: `${process.env.NEXTAUTH_URL}/api/auth/saml/callback`,
      },
      userinfo: {
        url: `${process.env.NEXTAUTH_URL}/api/auth/saml/userinfo`,
      },
      profile: (profile: any) => {
        return {
          id: profile.sub || profile.email || profile.nameidentifier,
          name: profile.name || `${profile.givenname || ''} ${profile.surname || ''}`.trim(),
          email: profile.emailaddress || profile.email,
          image: null,
        }
      },
      clientId: "axle-hr-portal", // This is our Entity ID
      clientSecret: "not-used-for-saml", // SAML doesn't use client secret
      checks: ["none"], // Disable PKCE for SAML
    },
  ],
  pages: {
    signIn: "/",
    signOut: "/",
  },
  callbacks: {
    session({ session, user }) {
      if (session.user && user?.id) {
        (session.user as ExtendedSession["user"]).id = user.id;
      }
      return session;
    },
    async redirect({ url, baseUrl }: { url: string; baseUrl: string }) {
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
  },
}; 