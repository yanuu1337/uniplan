import "#/styles/globals.css";

import { type Metadata } from "next";
import { IBM_Plex_Mono } from "next/font/google";

import { TRPCReactProvider } from "#/trpc/react";
import Nav from "#/components/nav";

export const metadata: Metadata = {
  title: "UniPlan - Academic Calendar for Students",
  description:
    "Tired of having to check multiple places to figure out where and when you have classes? Use UniPlan - a hobby project, an academic calendar for students, by a student.",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: "--font-ibm-plex-mono",
  weight: ["100", "200", "300", "400", "500", "600", "700"],
});
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      data-theme="dark"
      className={`${ibmPlexMono.variable} dark bg-background`}
    >
      <body>
        <TRPCReactProvider>
          <Nav />
          {children}
        </TRPCReactProvider>
      </body>
    </html>
  );
}
