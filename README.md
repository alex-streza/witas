![image](https://github.com/alex-streza/witas/assets/72100849/3c967493-e462-49ff-9f78-56b0326fbda1)

## Think/Imagine/Optimize

WITAS isn't your run of the mill website, it's build for those who like a challenge, and love cute stickers.

https://witas.vercel.app

> **Note**
>
> This project is optimized for mobile devices, generation won't work on desktop devices yet.

<sup>Made for Supabase Launch Week 8 Hackathon.</sup>

Built with

- [Supabase](https://supabase.com/)
- [Upstash](https://upstash.com/)
- [Vercel](https://vercel.com/)
- [Resend](https://resend.com/)
- [Next.JS](https://nextjs.org/)
- [OpenAI](https://openai.com/)
- [Midjourney](https://midjourney.com/)
- [Replicate](https://replicate.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [TailwindCSS](https://tailwindcss.com/)
- [framer-motion](https://www.framer.com/motion/)

## How it works

> **Warning**
>
> AHOY mate! Spoilers ahead!
>
> Let me first present how it works followed by some of the its inner workings since the UI isn't the only thing that's exceptional.

As the name doesn't suggest, it's an acronym for Wait is that sticker, in a nutshell it generates stickers with Midjourney.

1. Enter your server id, channel id and authorization for Midjourney (optional)
2. Enter subject (optional)
3. Generate or enter prompt
4. Wait for the generation to finish (marvel at some sweet stickers in the meanwhile)
5. Pick your favorite sticker (or all 4) download them raw or get the optimized versions in email 10 minutes later

It uses both OpenAI GPT3.5 to generate a prompt for a given subject and calls Midjourney to generate the stickers, it uses a stream connection which allows instant updates whenever progress is made.

Once the image is generated it is inserted in Supabase and uploaded to Storage, then gets split in 4 using canvas methods where you can individually download and optimize each.

If you want to optimize an image it will trigger first a Replicate upscale prediction with a webhook pointing back to the API. In the endpoint I check the query metadata type to decide whether it should proceed to remove the background or mark the job as fully completed by uploading the result to Supabase storage.

One can explore images and go to each individually where I'm using an algorithm to extract dominant colors from the sticker and save them in Supabase. The plan was to create an 8 galaxy from each 8 dominant colors of each sticker but I kinda ran out of time.

Every 10 minutes there's a cron job setup in Upstash that hits an endpoint which checks all completed jobs that were not notified yet and sends batch emails using Resend to users containing the optimized stickers.

The entered server id, channel id and authorization are only stored locally in local storage, they are used directly in the API call to Midjourney/Discord.

There are a lot of image manipulation all throughot the app, you can find useful functions to convert images from base64 to blob and vice versa, or download from url and upload to Supa Storage, compress images, split images, etc.

List of Supabase features used:

- Database
  - storing stickers, users, colors and replicate_jobs info
- Storage
  - storing raw stickers and optimized stickers

## Motivation

About a month ago my GF and project sidekick had the idea to use Midjourney to generate stickers, she automated the cropping and upscaling parts using Python locally (no Replicate there) and then manually uploaded to Redbubble. That's when I first theorized building something like that but I didn't do anything about it.

Then came Supabase Launch Week 8 Hackathon and I thought it would be a great opportunity to build something free & open-source with Supabase and Midjourney, since very few have done before.

## Ideas for the future

- Generate flow for desktop
- Allow sticker template customization before export
- Use different high quality models to enable free usage
- Restructure/refactor code
- Use more Supabase because it's cool

## The team / contributors

- alex-streza ([GitHub](https://github.com/alex-streza), [Twitter](https://twitter.com/alex_streza))
- catalina ([GitHub](https://github.com/welnic), [Twitter](https://twitter.com/Catalina_Melnic)

## Thanks to

- [cata](https://twitter.com/Catalina_Melnic) for giving constant feedback, configuring Resend and working on color extraction and the galaxy scene
- [erictik](https://github.com/erictik) for creating the foundation for communicating with [Midjourney](https://github.com/erictik/midjourney-ui) in Next.JS
- [laznic](https://github.com/laznic) [generationhotdog](https://generationhotdog.com) was a huge inspiration for this project (including the README)
