import { Navigation } from "~/components/navigation";
import "~/styles/globals.css";

export const metadata = {
  description:
    "Unleash Creativity: Explore our AI-powered sticker emporium - a diverse collection of ready-to-sell stickers, crafted by cutting-edge technology",
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
        <link
          rel="stylesheet"
          href="https://use.typekit.net/yjv8oem.css"
        ></link>
        <link
          rel="stylesheet"
          href="https://use.typekit.net/yjv8oem.css"
        ></link>
      </head>
      <body className="relative h-screen w-screen overflow-hidden bg-zinc-900">
        <Navigation />
        {children}
      </body>
    </html>
  );
}
export default RootLayout;
