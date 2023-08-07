"use client";
import { cva } from "class-variance-authority";
import Link from "next/link";
import { usePathname } from "next/navigation";

const linkVariants = cva(
  "rounded-[32px] px-3 py-1.5 md:px-6 bg-white md:text-lg text-zinc-900 md:py-3.5 font-serif uppercase",
  {
    variants: {
      active: {
        false: "bg-white",
        true: "bg-primary",
      },
    },
    defaultVariants: {
      active: false,
    },
  }
);

export const Navigation = () => {
  const pathname = usePathname();

  return (
    <nav className="fixed right-5 top-5 flex max-w-[363px] flex-wrap items-end justify-end gap-3 md:right-10 md:top-10">
      <Link
        href="/"
        className={linkVariants({
          active: pathname === "/",
        })}
      >
        WTF is this?
      </Link>
      <a
        href="https://supabase.com/launch-week"
        target="_blank"
        rel="noopener noreferrer"
        className={linkVariants()}
      >
        Supa 8
      </a>
      <div className="flex w-full justify-end">
        <Link
          href="/generate"
          className={linkVariants({
            active: pathname === "/generate",
          })}
        >
          Generate your own
        </Link>
      </div>
      <Link
        href="/explore"
        className={linkVariants({
          active: pathname === "/explore",
        })}
      >
        Explore
      </Link>
    </nav>
  );
};
