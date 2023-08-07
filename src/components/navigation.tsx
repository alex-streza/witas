"use client";
import { cva } from "class-variance-authority";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useClickOutside, useMediaQuery } from "@react-hookz/web";
import { Hamburger } from "@phosphor-icons/react";

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

const MotionLink = motion(Link);

const variants = {
  visible: {
    opacity: 1,
    scale: 1,
    rotate: 0,
    transition: {
      when: "beforeChildren",
      staggerChildren: 0.1,
    },
  },
  hidden: {
    opacity: 0,
    scale: 0,
    rotate: 12,
    transition: {
      when: "afterChildren",
    },
  },
};

export const Navigation = () => {
  const ref = useRef<HTMLDivElement>(null);
  const isPhone = useMediaQuery("(max-width: 768px)");

  const [open, setOpen] = useState(!isPhone);
  const [showChild, setShowChild] = useState(false);

  const pathname = usePathname();

  useEffect(() => {
    setShowChild(true);
  }, []);

  useClickOutside(ref, () => {
    setOpen(false);
  });

  if (!showChild) {
    return <></>;
  }

  return (
    <motion.nav
      ref={ref}
      className="fixed right-5 top-5 z-20 flex max-w-[363px] flex-wrap items-end justify-end gap-3 md:right-10 md:top-10"
      initial="hidden"
      animate="visible"
      exit="hidden"
      variants={variants}
      transition={{
        delay: 0.5,
      }}
    >
      <AnimatePresence>
        {!open && (
          <motion.button
            className={linkVariants()}
            variants={variants}
            onClick={() => setOpen((prev) => !prev)}
          >
            <Hamburger size={32} />
          </motion.button>
        )}
        {open && (
          <>
            <MotionLink
              href="/"
              className={linkVariants({
                active: pathname === "/",
              })}
              variants={variants}
            >
              WTF is this?
            </MotionLink>
            <motion.a
              href="https://supabase.com/launch-week"
              target="_blank"
              rel="noopener noreferrer"
              className={linkVariants()}
              variants={variants}
            >
              Supa 8
            </motion.a>
            <div className="flex w-full justify-end">
              <MotionLink
                href="/generate"
                className={linkVariants({
                  active: pathname === "/generate",
                })}
                variants={variants}
              >
                Generate your own
              </MotionLink>
            </div>
            <MotionLink
              href="/explore"
              className={linkVariants({
                active: pathname === "/explore",
              })}
              variants={variants}
            >
              Explore
            </MotionLink>
          </>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};
