/**
 * Decorative "planet horizon": a huge dark circle whose lit edge peeks up from
 * the bottom of its section, a soft light flare above it, and a fade to the
 * page colour. Place it inside a `relative overflow-hidden` section.
 */
export function HorizonGlow() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-1">
      <span className="absolute bottom-[calc(-162.5rem+clamp(9.375rem,18vw,14.375rem))] left-1/2 size-[162.5rem] -translate-x-1/2 rounded-full bg-horizon shadow-horizon" />
      <span className="absolute bottom-[clamp(7.5rem,17vw,13.125rem)] left-1/2 h-30 w-[min(56.25rem,140vw)] -translate-x-1/2 bg-flare blur-sm" />
      <span className="absolute inset-x-0 bottom-0 h-40 bg-linear-to-b from-transparent to-background" />
    </div>
  );
}
