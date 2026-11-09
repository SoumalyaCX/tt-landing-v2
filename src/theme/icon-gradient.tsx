/**
 * Renders the `#ph-grad` gradient once per page so any icon can use
 * `color={iconGradient}` (see icons.tsx). Colors come from theme.css.
 */
export function IconGradientDefs() {
  return (
    <svg aria-hidden width="0" height="0" className="absolute size-0 overflow-hidden">
      <defs>
        <linearGradient id="ph-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="var(--grad-icon-from)" />
          <stop offset="1" stopColor="var(--grad-icon-to)" />
        </linearGradient>
      </defs>
    </svg>
  );
}
