/**
 * Breakpoints for JavaScript (media queries in hooks). Keep in sync with
 * `--breakpoint-*` in src/styles/theme.css.
 */
export const breakpoints = {
  sm: "35rem",
  md: "47.5rem",
  lg: "56.25rem",
  xl: "61.25rem",
  nav: "66.25rem",
  "2xl": "77.5rem",
} as const;

export const minWidth = (bp: keyof typeof breakpoints) => `(min-width: ${breakpoints[bp]})`;

/**
 * Wide and tall enough for pinned, scroll-driven stages (`pinned:` variant in
 * globals.css): at least 1024×760, or 1200×700. Measured so the tallest stage
 * always fits the sticky area; smaller screens get stacked stages instead.
 */
export const pinnedQuery =
  "(min-width: 64rem) and (min-height: 47.5rem), (min-width: 75rem) and (min-height: 43.75rem)";

/** Height of the fixed nav plus breathing room, in px, for JS scroll offsets
 *  (smooth-scroll anchors). Same value as `--spacing-nav` (6.5rem) in theme.css. */
export const navOffset = 104;
