"use client";
import { useIntervalEffect } from "@react-hookz/web";
import { motion } from "framer-motion";
import { useState } from "react";
import { acronym } from "~/utils/acronym";

export const ShuffleText = ({
  text,
  className = "",
}: {
  text: string;
  shuffleCount?: number;
  alphabet?: string;
  className?: string;
}) => {
  const [shuffledText, setShuffledText] = useState(text);

  useIntervalEffect(() => {
    setShuffledText(acronym("witas"));
  }, 2000);

  return (
    <motion.span
      className={className}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {shuffledText}
    </motion.span>
  );
};
