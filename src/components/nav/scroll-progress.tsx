"use client";

import { useState } from "react";
import { motion, useMotionValueEvent, useScroll, useTransform } from "motion/react";
import { cn } from "@/lib/cn";

/**
 * Thin gradient bar across the top showing page scroll progress. The gradient
 * is sized to the viewport, so each color stays at a fixed screen position.
 */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const width = useTransform(scrollYProgress, (p) => `${(p * 100).toFixed(2)}%`);
  const [started, setStarted] = useState(false);
  useMotionValueEvent(scrollYProgress, "change", (p) => setStarted(p > 0.002));

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-x-0 top-0 z-60 h-0.5 overflow-x-clip"
    >
      <motion.i
        style={{ width }}
        className="relative block h-full rounded-r-xs bg-progress bg-size-[100vw_100%] bg-no-repeat shadow-progress"
      >
        <span
          className={cn(
            "absolute top-1/2 -right-1.5 size-3 -translate-y-1/2 rounded-full bg-progress-head transition-opacity duration-300",
            started ? "opacity-100" : "opacity-0",
          )}
        />
      </motion.i>
    </div>
  );
}
