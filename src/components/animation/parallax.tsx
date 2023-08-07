import { motion, useSpring, useTransform } from "framer-motion";
import { useEffect, type PropsWithChildren } from "react";

export const useParallax = (
  offset = 1,
  stiffness = 250,
  damping = 20,
  force = 45
) => {
  const x = useSpring(0, { stiffness, damping });
  const y = useSpring(0, { stiffness, damping });
  // dunno how to reduce this repeating code, might figure it out later
  const primaryX = useTransform(x, (event) => event / force);
  const primaryY = useTransform(y, (event) => event / force);
  const secondaryX = useTransform(x, (event) => event / -force);
  const secondaryY = useTransform(y, (event) => event / -force);

  const onMouseMoveHandler = (event: MouseEvent) => {
    x.set(event.clientX * offset * 2);
    y.set(event.clientY * offset * 2);
  };

  const onMouseLeaveHandler = () => {
    x.set(0);
    y.set(0);
  };

  return {
    primaryX,
    primaryY,
    secondaryX,
    secondaryY,
    onMouseMoveHandler,
    onMouseLeaveHandler,
  };
};

export const Parallax = ({
  children,
  offset,
}: PropsWithChildren & {
  offset?: number;
}) => {
  const { primaryX, primaryY, onMouseMoveHandler, onMouseLeaveHandler } =
    useParallax(offset);

  useEffect(() => {
    window.addEventListener("mousemove", onMouseMoveHandler);
    window.addEventListener("mouseleave", onMouseLeaveHandler);

    return () => {
      window.removeEventListener("mousemove", onMouseMoveHandler);
      window.removeEventListener("mouseleave", onMouseLeaveHandler);
    };
  }, [onMouseMoveHandler, onMouseLeaveHandler]);

  return (
    <motion.div
      initial={{
        scale: 0,
      }}
      animate={{
        scale: 1,
      }}
      transition={{
        delay: Math.random() * 0.5,
      }}
      whileHover={{
        scale: 1.1,
        transition: {
          delay: 0,
          type: "spring",
          stiffness: 550,
          damping: 10,
        },
      }}
      style={{
        x: primaryX,
        y: primaryY,
      }}
    >
      {children}
    </motion.div>
  );
};
