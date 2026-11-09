"use client";

import { MotionConfig, useReducedMotion } from "motion/react";
import { ReactLenis } from "lenis/react";
import { IconProvider } from "@/theme/icons";
import { navOffset } from "@/theme/breakpoints";
import { transition } from "@/theme/motion";

/**
 * App-wide client providers:
 * - MotionConfig: default transition + honours the OS "reduce motion" setting
 * - Lenis smooth scroll (disabled when reduced motion is requested)
 * - Phosphor icon defaults
 */
export function Providers({ children }: { children: React.ReactNode }) {
  const reduceMotion = useReducedMotion();

  return (
    <MotionConfig reducedMotion="user" transition={transition.brand}>
      <IconProvider>
        {!reduceMotion && (
          <ReactLenis
            root
            options={{ lerp: 0.1, anchors: { offset: -navOffset }, autoRaf: true }}
          />
        )}
        {children}
      </IconProvider>
    </MotionConfig>
  );
}
