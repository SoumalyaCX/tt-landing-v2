/**
 * Color tokens that data may reference by name, e.g. `{ color: "coral" }`.
 * Each name maps to a raw CSS variable in src/styles/theme.css, so page data
 * never contains hex values and stays in sync with the theme.
 */
export const colorTokens = [
  "volt",
  "sky",
  "leaf",
  "amber",
  "coral",
  "violet",
  "indigo",
  "cyan",
  "periwinkle",
  "ultraviolet",
  "lavender",
  "slate",
  "break",
  "idle",
  "track",
  "risk",
  "sky-100",
  "sky-50",
  "sky-faint",
  "volt-100",
  "volt-50",
  "leaf-100",
  "leaf-50",
  "amber-100",
  "amber-200",
  "coral-100",
  "coral-200",
  "muted",
  "dim",
  "text",
] as const;

export type ColorToken = (typeof colorTokens)[number];

/** `var(--coral)` for a token name */
export const colorVar = (token: ColorToken) => `var(--${token})`;

/** Inline style that exposes a token as `--c` for components that tint themselves. */
export const tintStyle = (token: ColorToken) => ({ "--c": colorVar(token) }) as React.CSSProperties;

/** Builds a gradient from token names, e.g. accent bars: ["coral", "amber"] */
export const gradientOf = (tokens: readonly ColorToken[], angle = 90) =>
  `linear-gradient(${angle}deg, ${tokens.map(colorVar).join(", ")})`;

/**
 * Meaning-based text colours for values in mock-ups and tables
 * (a warning count, a positive trend…). One map, used by every component.
 */
export const toneText = {
  success: "text-leaf-100",
  warning: "text-amber-200",
  danger: "text-coral-200",
  info: "text-volt-100",
} as const;

export type Tone = keyof typeof toneText;
