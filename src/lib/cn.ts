import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

/**
 * tailwind-merge must know the custom theme scale names, otherwise e.g.
 * `text-body` (a size) and `text-muted` (a color) would be treated as
 * conflicting and one would be dropped. Keep in sync with theme.css.
 */
const fontSizes = [
  "5xs",
  "4xs",
  "3xs",
  "2xs",
  "xs",
  "sm",
  "ui",
  "md",
  "base",
  "control",
  "lg",
  "body",
  "quote",
  "quote-lg",
  "xl",
  "2xl",
  "3xl",
  "gauge",
  "stat-sm",
  "kicker",
  "lede",
  "sub",
  "title",
  "h3-sm",
  "h3",
  "h3-lg",
  "stat",
  "tab",
  "qs-tag",
  "stat-lg",
  "stat-xl",
  "h2",
  "display",
  "footer-big",
];

const twMerge = extendTailwindMerge({
  override: {
    // Tailwind v4: `leading-*` always beats the line-height bundled with a text
    // size, so a text size must not remove an earlier `leading-*`.
    conflictingClassGroups: { "font-size": [] },
    theme: {
      radius: ["2xs", "xs", "sm", "md", "lg", "xl", "2xl", "card", "glass", "3xl", "frame", "full"],
      tracking: ["tightest", "tighter", "tight", "snug", "slight", "normal", "label"],
      leading: ["none", "display", "tight", "snug", "normal", "relaxed"],
      breakpoint: ["sm", "md", "lg", "xl", "nav", "2xl"],
    },
  },
  extend: {
    theme: {
      text: fontSizes,
      shadow: [
        "popover",
        "readout",
        "glass",
        "inset",
        "card",
        "glow-sky",
        "glow-donut",
        "ring-sky",
        "focus-sky",
        "horizon",
        "progress",
        "glow-line",
        "dot",
        "spectrum-bar",
      ],
      "font-weight": ["body"],
      spacing: ["gutter", "section", "cta-top", "cta-bottom", "nav", "head-gap", "pin"],
      container: ["page", "head", "hero", "lede", "lede-wide", "prose", "readout"],
      ease: ["brand", "out"],
      "drop-shadow": ["glow-sky"],
      blur: ["scrim"],
      animate: [
        "blur-in",
        "draw",
        "grow-x",
        "grow-y",
        "needle",
        "pulse-dot",
        "spin-fast",
        "spin-in",
      ],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
