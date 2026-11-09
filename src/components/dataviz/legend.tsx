/** Chart legends: Legend, SwatchMark and the shared swatch fills. */

import { cn } from "@/lib/cn";
import { colorVar, type ColorToken } from "@/theme/colors";

/** A swatch is a colour token, a chart bar gradient, or a dashed line (e.g. a median). */
export type Swatch = ColorToken | "bar" | "bar-hi" | "bar-lo" | "dashed";

/** Swatches that can fill an area (everything except the dashed line). */
export type FillSwatch = Exclude<Swatch, "dashed">;

const gradient = { bar: "bg-bar", "bar-hi": "bg-bar-hi", "bar-lo": "bg-bar-lo" } as const;

/** Class + style that paint an element with a swatch (combine with your own size/position). */
export function swatchFill(swatch: FillSwatch): {
  className?: string;
  style?: React.CSSProperties;
} {
  return swatch in gradient
    ? { className: gradient[swatch as keyof typeof gradient] }
    : { style: { backgroundColor: colorVar(swatch as ColorToken) } };
}

/** The little colour mark in a legend. */
export function SwatchMark({ swatch, className }: { swatch: Swatch; className?: string }) {
  if (swatch === "dashed") {
    return (
      <i
        aria-hidden
        // a line, not a box: keep its own size whatever size class is passed
        className={cn(
          "inline-block shrink-0 border-t border-dashed border-median-line",
          className,
          "h-0 w-4",
        )}
      />
    );
  }
  const fill = swatchFill(swatch);
  return (
    <i
      aria-hidden
      className={cn("inline-block shrink-0 rounded-2xs", fill.className, className)}
      style={fill.style}
    />
  );
}

export type LegendItem = {
  label: string;
  swatch: Swatch;
  /** Shown on the right in list layout */ value?: string;
};

const legendSizes = {
  inline: {
    sm: { box: "gap-x-2 gap-y-1 text-4xs font-medium", mark: "size-1.75" },
    md: { box: "gap-x-3.5 gap-y-1.5 text-2xs", mark: "size-2.25" },
  },
  list: {
    sm: { box: "gap-1 text-3xs", mark: "size-2" },
    md: { box: "gap-2 text-xs", mark: "size-2.25" },
  },
};

/**
 * Chart legend. `inline` = wrapping row under a chart; `list` = a column
 * with values on the right (next to pies and donuts).
 */
export function Legend({
  items,
  layout = "inline",
  size = "md",
  className,
}: {
  items: LegendItem[];
  layout?: "inline" | "list";
  size?: "sm" | "md";
  className?: string;
}) {
  const sz = legendSizes[layout][size];
  if (layout === "inline") {
    return (
      <div className={cn("flex flex-wrap text-muted", sz.box, className)}>
        {items.map((it) => (
          <span key={it.label} className="inline-flex items-center gap-1.5">
            <SwatchMark swatch={it.swatch} className={sz.mark} />
            {it.label}
          </span>
        ))}
      </div>
    );
  }
  return (
    <ul className={cn("grid min-w-0", sz.box, className)}>
      {items.map((it) => (
        <li key={it.label} className="flex min-w-0 items-center gap-1.75 text-muted">
          <SwatchMark swatch={it.swatch} className={sz.mark} />
          <span className="truncate">{it.label}</span>
          {it.value && (
            <b className="ml-auto pl-1 font-semibold whitespace-nowrap text-strong tabular-nums">
              {it.value}
            </b>
          )}
        </li>
      ))}
    </ul>
  );
}
