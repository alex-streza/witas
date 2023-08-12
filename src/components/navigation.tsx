"use client";
import { cva } from "class-variance-authority";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useClickOutside, useMediaQuery } from "@react-hookz/web";
import { Hamburger } from "@phosphor-icons/react";

const linkVariants = cva(
  "rounded-[32px] px-3 py-1.5 md:px-6 flex items-center gap-2 md:text-lg text-zinc-900 md:py-3.5 font-serif uppercase",
  {
    variants: {
      active: {
        false: "bg-white",
        true: "bg-green",
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
    setOpen(!isPhone);
  }, [isPhone]);

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
      className="fixed right-5 top-5 z-50 flex max-w-[363px] flex-wrap items-end justify-end gap-3 md:right-10 md:top-10"
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
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clipPath="url(#clip0_144_77)">
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M12.4899 0.491713L10.58 8.59981L14.9627 1.516C15.0985 1.29661 15.4033 1.26119 15.5857 1.44361L18.5564 4.41427C18.7388 4.59669 18.7034 4.90153 18.484 5.03727L11.4002 9.42004L19.5083 7.5101C19.7594 7.45095 20 7.64147 20 7.89945V12.1006C20 12.3586 19.7594 12.5491 19.5083 12.4899L11.4002 10.58L18.484 14.9628C18.7034 15.0985 18.7388 15.4033 18.5564 15.5858L15.5857 18.5564C15.4033 18.7388 15.0985 18.7034 14.9627 18.484L10.58 11.4002L12.4899 19.5083C12.5491 19.7594 12.3585 20 12.1006 20H7.89943C7.64145 20 7.45094 19.7594 7.51009 19.5083L9.42003 11.4002L5.03726 18.484C4.90153 18.7034 4.59668 18.7388 4.41426 18.5564L1.44361 15.5857C1.26119 15.4033 1.29661 15.0985 1.516 14.9627L8.59975 10.58L0.491714 12.4899C0.240606 12.5491 0 12.3586 0 12.1006V7.89944C1.94914e-07 7.64146 0.240605 7.45095 0.491714 7.5101L8.5998 9.42003L1.516 5.03728C1.29661 4.90154 1.26119 4.59669 1.44361 4.41427L4.41426 1.44362C4.59668 1.2612 4.90153 1.29662 5.03726 1.51601L9.42003 8.59983L7.51009 0.491714C7.45094 0.240606 7.64145 3.89828e-07 7.89943 3.67275e-07L12.1006 0C12.3586 0 12.5491 0.240605 12.4899 0.491713ZM10 11.1429C10.6312 11.1429 11.1429 10.6312 11.1429 10C11.1429 9.36882 10.6312 8.85714 10 8.85714C9.36882 8.85714 8.85714 9.36882 8.85714 10C8.85714 10.6312 9.36882 11.1429 10 11.1429Z"
                    fill="#262626"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_144_77">
                    <rect width="20" height="20" fill="white" />
                  </clipPath>
                </defs>
              </svg>
              WTF is this?
            </MotionLink>
            <motion.a
              href="https://supabase.com/launch-week"
              target="_blank"
              rel="noopener noreferrer"
              className={linkVariants()}
              variants={variants}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M3.08399 15.25C1.41999 15.25 0.483988 13.338 1.50399 12.024L10.21 0.807C10.794 0.0539995 12 0.466999 12 1.42V8.75H20.916C22.579 8.75 23.516 10.663 22.496 11.977L13.79 23.194C13.206 23.947 12 23.534 12 22.581V15.251H3.08399V15.25Z"
                  fill="#262626"
                />
              </svg>
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
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g clipPath="url(#clip0_144_85)">
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M22.1973 9.60564C21.1155 10.7629 19.3425 11.6436 17.5406 12C19.3425 12.3564 21.1155 13.2371 22.1972 14.3944L23.4253 15.7082L21.6595 16.0493C20.1041 16.3496 18.152 16.02 16.4847 15.2491C17.733 16.5967 18.6498 18.3512 18.8448 19.9234L19.0661 21.7081L17.4371 20.9462C16.0021 20.2751 14.6167 18.8609 13.7209 17.2572C13.9387 19.0811 13.6491 21.0395 12.8827 22.426L12.0127 24L11.1427 22.426C10.3763 21.0395 10.0867 19.0811 10.3046 17.2572C9.40877 18.8609 8.02336 20.275 6.58837 20.9462L4.95934 21.7081L5.18064 19.9234C5.37559 18.3512 6.29239 16.5967 7.54073 15.2491C5.8734 16.02 3.92136 16.3498 2.36593 16.0493L0.600098 15.7082L1.82823 14.3944C2.91001 13.237 4.68306 12.3564 6.48501 12C4.683 11.6436 2.91001 10.7629 1.82823 9.60564L0.600098 8.29177L2.36593 7.9507C3.92136 7.65031 5.87346 7.98 7.54073 8.75084C6.29239 7.40333 5.37559 5.64871 5.18064 4.07659L4.95934 2.29177L6.58843 3.05381C8.02341 3.72497 9.40883 5.13912 10.3046 6.74278C10.0867 4.91888 10.3764 2.96048 11.1427 1.574L12.0128 0L12.8828 1.574C13.6493 2.96048 13.9388 4.91888 13.7209 6.74278C14.6168 5.13912 16.0022 3.72503 17.4372 3.05381L19.0663 2.29177L18.8449 4.07659C18.65 5.64871 17.7332 7.40333 16.4849 8.75084C18.1521 7.98 20.1042 7.65025 21.6596 7.9507L23.4255 8.29177L22.1973 9.60564ZM9.75062 14.2435C10.984 15.4769 12.9837 15.4769 14.2171 14.2435C15.4505 13.0102 15.4505 11.0104 14.2171 9.77701C12.9837 8.54363 10.984 8.54363 9.75062 9.77701C8.51723 11.0104 8.51723 13.0102 9.75062 14.2435Z"
                      fill="#262626"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_144_85">
                      <rect width="24" height="24" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
                Generate your own
              </MotionLink>
            </div>
            <MotionLink
              href="/explore"
              className={linkVariants({
                active: pathname?.includes("explore"),
              })}
              variants={variants}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clipPath="url(#clip0_144_89)">
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M12 2.98306L8 0V7.99998H0L2.98306 12L3.49691e-07 16H8V8H16V0L12 2.98306ZM21.0169 12L24 8.00002H16V16H8V24L12 21.0169L16 24V16H24L21.0169 12Z"
                    fill="#262626"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_144_89">
                    <rect width="24" height="24" fill="white" />
                  </clipPath>
                </defs>
              </svg>
              Explore
            </MotionLink>
          </>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};
