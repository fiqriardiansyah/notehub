import "@/styles/globals.css";

import { Inter as FontSans } from "next/font/google";

import { cn } from "@/lib/utils";
import Provider from "./provider";
import { SessionProvider } from "next-auth/react";
import { auth } from "@/auth";
import Layout from "@/components/layout";
import "react-circular-progressbar/dist/styles.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export default async function RootLayout({ children }: { children: any }) {
  const session = await auth();
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>Note Space Hub</title>
        <link rel="icon" type="image/x-icon" href="/icon.png" />
        <link rel="icon" type="image/png" sizes="36x36" href="/icon-36.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/icon-180.png" />
        <meta name="msapplication-TileColor" content="#ffffff" />
        <meta name="msapplication-TileImage" content="/icon-180.png" />
        <meta name="theme-color" content="#ffffff" />
        <meta name="description" content="Your tracker thougt apps" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Notespacehub" />
        <meta property="og:url" content="http://notehub-pi.vercel.app" />
        <meta property="og:image" content="https://ik.imagekit.io/p4ukigs1hrvx/notespacehub-bg_iu22nzgdf.png?updatedAt=1730190310235" />
        <meta property="og:description" content="Your tracker daily assistant"></meta>
      </head>
      <body style={{ pointerEvents: "auto" }} className={cn("font-sans antialiased", fontSans.variable)}>
        <SessionProvider session={session} basePath="/api/auth">
          <Provider>
            <Layout>{children}</Layout>
          </Provider>
        </SessionProvider>
      </body>
    </html>
  );
}
