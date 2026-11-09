"use client";

import { motion } from "motion/react";
import { revealUp, stagger, viewport } from "@/theme/motion";

export type RevealProps = {
  /** Position in a group of reveals; each step waits a little longer (stagger). */
  index?: number;
  className?: string;
  children: React.ReactNode;
};

/** Fades and lifts its content in once, when it scrolls into view. */
export function Reveal({ index = 0, className, children }: RevealProps) {
  return (
    <motion.div
      variants={revealUp}
      custom={index * stagger.cards}
      initial="hidden"
      whileInView="visible"
      viewport={viewport}
      className={className}
    >
      {children}
    </motion.div>
  );
}
