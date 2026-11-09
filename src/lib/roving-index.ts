/**
 * Keyboard navigation for tab lists (roving tabindex): returns the index the
 * key moves to, or `null` if the key isn't a navigation key.
 * - `wrap`: past the ends loops around (otherwise stops at the ends)
 * - `axis`: which arrow keys count ("x" = ←/→, "both" = all four)
 */
export function rovingIndex(
  key: string,
  index: number,
  count: number,
  { wrap = true, axis = "both" }: { wrap?: boolean; axis?: "x" | "both" } = {},
): number | null {
  const last = count - 1;
  const step = (d: 1 | -1) => {
    const n = index + d;
    if (wrap) return (n + count) % count;
    return Math.min(last, Math.max(0, n));
  };
  if (key === "ArrowRight" || (axis === "both" && key === "ArrowDown")) return step(1);
  if (key === "ArrowLeft" || (axis === "both" && key === "ArrowUp")) return step(-1);
  if (key === "Home") return 0;
  if (key === "End") return last;
  return null;
}
