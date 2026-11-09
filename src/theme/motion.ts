import type { Transition, Variants } from "motion/react";

/**
 * Motion tokens — every animation on the site pulls from here, so the
 * overall feel can be retuned in one place. Values match the demo.
 * (CSS-only entry animations — bars growing, donuts spinning — live in
 * theme.css as `--animate-*`.)
 */

/** The brand easing curve, cubic-bezier(.22,.8,.24,1). Same as `ease-brand` in theme.css. */
export const ease = {
  brand: [0.22, 0.8, 0.24, 1],
} as const satisfies Record<string, [number, number, number, number]>;

/** Durations in seconds */
export const duration = {
  /** Content leaving before new content swaps in */
  exit: 0.12,
  fast: 0.2,
  menu: 0.22,
  ui: 0.35,
  swap: 0.45,
  step: 0.55,
  base: 0.6,
  reveal: 0.7,
  bloom: 1.1,
  count: 1.1,
} as const;

/** Stagger gaps in seconds */
export const stagger = {
  cells: 0.012,
  bars: 0.035,
  rows: 0.04,
  groups: 0.05,
  cards: 0.06,
  step: 0.08,
} as const;

/** Behaviour timings in milliseconds */
export const timing = {
  menuCloseDelay: 180,
  autoConnectDelay: 350,
  memoryAutoplay: 3600,
  /* Assistant console */
  aiStep: 850,
  aiStepReduced: 250,
  /** A step shows "done" this long before the next one starts */
  aiStepOverlap: 60,
  aiDoneMessage: 100,
  /** After the last step: pause before the readout updates */
  aiApply: 1300,
  aiApplyReduced: 400,
  aiStatusReset: 2500,
  changedHighlight: 6000,
  /* Assistant orb speech */
  speechShort: 1500,
  speechLong: 2100,
  speechFirstLine: 300,
  speechGap: 420,
  speechOutro: 450,
  idleChatter: 5200,
  happyHold: 1600,
  blinkMin: 2600,
  blinkRange: 2800,
  blinkHold: 130,
  /* Assistant orb intro (ms after the first WebGL frame): the eyes blink,
     the orb blooms in as they reopen, then the greeting starts. */
  introBlink: 250,
  greetingDelay: 2000,
} as const;

/** Scroll-reveal viewport defaults */
export const viewport = { once: true, amount: 0.2 } as const;

/** The circuit auto-connects once it is this far into the viewport. */
export const autoConnectMargin = "0px 0px -30% 0px";

export const transition = {
  brand: { duration: duration.ui, ease: ease.brand },
  menu: { duration: duration.menu, ease: ease.brand },
  swap: { duration: duration.swap, ease: ease.brand },
  reveal: { duration: duration.reveal, ease: ease.brand },
} as const satisfies Record<string, Transition>;

/**
 * Assistant orb intro: the orb grows out from behind the eyes on a soft spring
 * while a glow of light fades through it and a thin ring ripples outward.
 * Only opacity and scale animate (GPU-composited), so it stays smooth.
 */
export const orbIntro = {
  orb: {
    scale: { type: "spring", visualDuration: duration.bloom, bounce: 0.18 },
    opacity: { duration: duration.reveal, ease: ease.brand },
  } satisfies Transition,
  glow: {
    duration: duration.bloom * 1.3,
    ease: "easeOut",
    times: [0, 0.35, 1],
  } satisfies Transition,
  ripple: {
    duration: duration.bloom * 1.2,
    ease: ease.brand,
    times: [0, 0.3, 1],
  } satisfies Transition,
  /** Seconds the rings take to spin up and settle back down after the bloom */
  spinUp: 1.8,
};

/* ---- Variants (ported from the demo's CSS keyframes) ---------------------- */

const exitFade = { opacity: 0, transition: { duration: duration.exit } };

/** Small fade-up used when panel content swaps */
export const swapIn: Variants = {
  hidden: { opacity: 0, y: 6 },
  visible: { opacity: 1, y: 0, transition: transition.swap },
  exit: exitFade,
};

/** Fade-up out of a blur, used when dashboards swap */
export const blurIn: Variants = {
  hidden: { opacity: 0, y: 10, filter: "blur(6px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: duration.base, ease: ease.brand },
  },
  exit: exitFade,
};

/**
 * Pinned stepper panels: the active panel is in place; panels before it drift
 * up and panels after it wait below, so changes follow the scroll direction.
 */
const stepAway = (y: number) => ({
  opacity: 0,
  y,
  filter: "blur(8px)",
  transition: transition.brand,
  transitionEnd: { visibility: "hidden" as const },
});
export const stepPanel: Variants = {
  active: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    visibility: "visible",
    transition: { duration: duration.step, ease: ease.brand, delay: stagger.step },
  },
  before: stepAway(-28),
  after: stepAway(28),
};

/** Scroll reveal for cards; `custom` = delay in seconds (for staggering). */
export const revealUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { ...transition.reveal, delay },
  }),
};

/** Easing helpers for JS-driven tweens (count-ups, autoplay) */
export const easeFn = {
  outCubic: (p: number) => 1 - (1 - p) ** 3,
  outQuad: (p: number) => 1 - (1 - p) ** 2,
} as const;
