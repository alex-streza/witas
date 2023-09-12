import { Analytics } from "@vercel/analytics/react";
import Script from "next/script";
import { Navigation } from "~/components/navigation";
import { env } from "~/env.mjs";
import "~/styles/globals.css";

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
        <Script id="mixpanel">
          {`
            (function(f,b){if(!b.__SV){var e,g,i,h;window.mixpanel=b;b._i=[];b.init=function(e,f,c){function g(a,d){var b=d.split(".");2==b.length&&(a=a[b[0]],d=b[1]);a[d]=function(){a.push([d].concat(Array.prototype.slice.call(arguments,0)))}}var a=b;"undefined"!==typeof c?a=b[c]=[]:c="mixpanel";a.people=a.people||[];a.toString=function(a){var d="mixpanel";"mixpanel"!==c&&(d+="."+c);a||(d+=" (stub)");return d};a.people.toString=function(){return a.toString(1)+".people (stub)"};i="disable time_event track track_pageview track_links track_forms track_with_groups add_group set_group remove_group register register_once alias unregister identify name_tag set_config reset opt_in_tracking opt_out_tracking has_opted_in_tracking has_opted_out_tracking clear_opt_in_out_tracking start_batch_senders people.set people.set_once people.unset people.increment people.append people.union people.track_charge people.clear_charges people.delete_user people.remove".split(" ");
            for(h=0;h<i.length;h++)g(a,i[h]);var j="set set_once union unset remove delete".split(" ");a.get_group=function(){function b(c){d[c]=function(){call2_args=arguments;call2=[c].concat(Array.prototype.slice.call(call2_args,0));a.push([e,call2])}}for(var d={},e=["get_group"].concat(Array.prototype.slice.call(arguments,0)),c=0;c<j.length;c++)b(j[c]);return d};b._i.push([e,f,c])};b.__SV=1.2;e=f.createElement("script");e.type="text/javascript";e.async=!0;e.src="undefined"!==typeof MIXPANEL_CUSTOM_LIB_URL?MIXPANEL_CUSTOM_LIB_URL:"file:"===f.location.protocol&&"//cdn.mxpnl.com/libs/mixpanel-2-latest.min.js".match(/^\/\//)?"https://cdn.mxpnl.com/libs/mixpanel-2-latest.min.js":"//cdn.mxpnl.com/libs/mixpanel-2-latest.min.js";g=f.getElementsByTagName("script")[0];g.parentNode.insertBefore(e,g)}})(document,window.mixpanel||[]);
          `}
        </Script>
        <Script id="mixpanel">
          {`
            mixpanel.init(${env.NEXT_PUBLIC_MIXPANEL_TOKEN}, { debug: true, track_pageview: true, persistence: 'localStorage' });
          `}
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
