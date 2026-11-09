"use client";

import { AnimatePresence, type HTMLMotionProps, motion } from "motion/react";
import { blurIn, swapIn } from "@/theme/motion";

export type SwapProps = Omit<
  HTMLMotionProps<"div">,
  "variants" | "initial" | "animate" | "exit"
> & {
  /** Changing this swaps the content: the old one fades out, the new one animates in. */
  swapKey: React.Key;
  /** `fade` = small fade-up, `blur` = fade-up out of a blur */
  effect?: "fade" | "blur";
};

/** Animates between pieces of content whenever `swapKey` changes. */
export function Swap({ swapKey, effect = "fade", ...props }: SwapProps) {
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={swapKey}
        variants={effect === "blur" ? blurIn : swapIn}
        initial="hidden"
        animate="visible"
        exit="exit"
        {...props}
      />
    </AnimatePresence>
  );
}
