import "@/styles/globals.css";

import { Inter as FontSans } from "next/font/google";

import { cn } from "@/lib/utils";
import Provider from "./provider";
import { SessionProvider } from "next-auth/react";
import { auth } from "@/auth";
import Layout from "@/components/layout";
import 'react-circular-progressbar/dist/styles.css';
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
        <title>NoteHub</title>
        <meta name="description" content="My awesome app with new App Router" />
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
