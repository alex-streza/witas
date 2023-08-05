import "~/styles/globals.css";

export const metadata = {
  title: "Wait is that a sticker?",
  description:
    "WITAS allows anyone to generate state-of-the-art stickers using multiple AI models to iterate, upscale, crop and edit images.",
  openGraph: {
    images: ["/images/og.png"],
  },
};

function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <html lang="en">
        <head />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#000000" />
        <body>{children}</body>
      </html>
    </>
  );
}
export default RootLayout;
