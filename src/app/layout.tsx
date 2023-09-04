import { Navigation } from "~/components/navigation";
import { Analytics } from "@vercel/analytics/react";
import "~/styles/globals.css";
import { env } from "~/env.mjs";
import mixpanel from "mixpanel-browser";
import Script from "next/script";

export const metadata = {
  description:
    "Generate outstanding stickers using AI and upscale and crop automatically for all your merchandise needs, all done in minutes.",
  canonical: "https://witas.vercel.app",
  title: "Wait is that a sticker?",
  openGraph: {
    type: "website",
    locale: "en_IE",
    url: "https://witas.vercel.app",
    siteName: "WITAS",
    images: [
      {
        url: "/images/og.png",
        width: 1200,
        height: 630,
        alt: "WITAS",
      },
    ],
  },
  icons: {
    icon: "/favicons/favicon.ico",
    shortcut: "/favicon-32x32.png",
    apple: "/favicon-32x32.png",
  },
};

function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <Script>
          {`mixpanel.init("${env.NEXT_PUBLIC_MIXPANEL_TOKEN}", { track_pageview: true, persistence: 'localStorage' });`}
        </Script>
        <link
          rel="stylesheet"
          href="https://use.typekit.net/yjv8oem.css"
        ></link>
        <link
          rel="stylesheet"
          href="https://use.typekit.net/yjv8oem.css"
        ></link>
      </head>
      <body className="relative h-screen w-screen overflow-y-auto overflow-x-hidden bg-zinc-900 p-5 scrollbar-thin scrollbar-track-zinc-800 scrollbar-thumb-zinc-500 md:px-20 md:py-10">
        <Navigation />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
export default RootLayout;
