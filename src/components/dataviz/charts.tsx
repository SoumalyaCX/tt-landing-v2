/** Charts: BarChart, GroupedBarChart, LineChart, HalfGauge, Donut and Heatmap. */

import { cn } from "@/lib/cn";
import { chartA11y } from "@/lib/a11y";
import { type ColorToken, colorVar } from "@/theme/colors";
import { stagger } from "@/theme/motion";
import { type FillSwatch, Legend, swatchFill } from "@/components/dataviz/legend";

/* Every chart takes an optional `label`: a text alternative for screen readers.
   Without it the chart is treated as decorative (e.g. inside a product mock-up). */

/* ---- BarChart -------------------------------------------------------------- */

export type Bar = { label: string; value: number; display?: string };

export type BarChartProps = {
  bars: Bar[];
  /** Value that fills the full height */
  max: number;
  /** Bars below this value use the muted "low" gradient */
  low?: number;
  /** Dashed reference line at this value (e.g. a team median) */
  median?: number;
  /** `sm` = compact card chart, `lg` = dashboard chart that fills spare height */
  size?: "sm" | "lg";
  label?: string;
  className?: string;
};

/** Vertical bar chart; the tallest bar is highlighted and bars grow up with a stagger. */
export function BarChart({ bars, max, low, median, size = "sm", label, className }: BarChartProps) {
  const top = Math.max(...bars.map((b) => b.value));
  const lg = size === "lg";
  return (
    <div
      {...chartA11y(label)}
      className={cn(
        "grid",
        lg
          ? "h-full grid-rows-[minmax(8.75rem,1fr)_auto] gap-1.5 @sm:grid-rows-[minmax(10.625rem,1fr)_auto]"
          : "gap-1",
        className,
      )}
    >
      <div
        className={cn(
          "relative flex items-end",
          lg ? "gap-1 pt-5.5 @sm:gap-2" : "h-23 gap-1.5 pt-3.5",
        )}
      >
        {!lg && (
          <>
            <span aria-hidden className="absolute inset-x-0 top-3.5 h-px bg-border" />
            <span
              aria-hidden
              className="absolute inset-x-0 top-[calc(50%+0.4375rem)] h-px bg-border"
            />
            <span aria-hidden className="absolute inset-x-0 bottom-0 h-px bg-border-strong" />
          </>
        )}
        {bars.map((b, i) => {
          const hi = b.value === top;
          const lo = low !== undefined && b.value < low;
          const h = (b.value / max) * 100;
          return (
            <span
              key={`${b.label}-${i}`}
              className="relative flex h-full flex-1 flex-col items-center justify-end"
            >
              <i
                title={`${b.label}: ${b.display ?? b.value}`}
                className={cn(
                  "block w-full origin-bottom animate-grow-y",
                  lg ? "max-w-10 rounded-t-lg rounded-b-xs" : "max-w-6 rounded-t-xs rounded-b-2xs",
                  hi
                    ? "bg-bar-hi shadow-glow-sky"
                    : lo
                      ? "bg-bar-lo opacity-90"
                      : cn("bg-bar", lg && "opacity-80"),
                )}
                style={{ height: `${h}%`, animationDelay: `${i * stagger.bars}s` }}
              />
              <em
                className={cn(
                  "absolute not-italic tabular-nums",
                  lg ? "text-2xs" : "text-5xs",
                  hi ? "font-bold text-strong" : cn("text-muted", lg && "hidden @sm:block"),
                )}
                style={{ bottom: `calc(${h}% + ${lg ? 4 : 2}px)` }}
              >
                {b.display ?? b.value}
              </em>
            </span>
          );
        })}
        {median !== undefined && (
          <span
            aria-hidden
            className="pointer-events-none absolute inset-x-0 border-t border-dashed border-median-line"
            style={{ bottom: `calc((100% - ${lg ? "1.375rem" : "0.875rem"}) * ${median / max})` }}
          />
        )}
      </div>
      <div className={cn("flex", lg ? "gap-1 @sm:gap-2" : "gap-1.5")}>
        {bars.map((b, i) => (
          <span
            key={`${b.label}-${i}`}
            className={cn(
              "flex-1 truncate text-center text-dim",
              lg ? "text-4xs @sm:text-2xs" : "text-4xs",
            )}
          >
            {b.label}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ---- GroupedBarChart ------------------------------------------------------- */

export type BarGroup = {
  label: string;
  /** One value per series, 0–100 (% of the chart height) */
  values: { value: number; title?: string }[];
};

export type GroupedBarChartProps = {
  groups: BarGroup[];
  /** Fill of each series, in order */
  series: FillSwatch[];
  /** Y-axis labels, top → bottom */
  yTicks?: string[];
  label?: string;
  className?: string;
};

/** Side-by-side bars per group on three faint grid lines; bars grow up on mount. */
export function GroupedBarChart({
  groups,
  series,
  yTicks,
  label,
  className,
}: GroupedBarChartProps) {
  return (
    <div {...chartA11y(label)} className={cn("grid gap-1.5", className)}>
      <div
        className={cn(
          "grid h-32 gap-1.5",
          yTicks ? "grid-cols-[1.5rem_minmax(0,1fr)]" : "grid-cols-1",
        )}
      >
        {yTicks && (
          <div className="flex -translate-y-[0.5em] flex-col justify-between text-4xs text-dim">
            {yTicks.map((t) => (
              <span key={t}>{t}</span>
            ))}
          </div>
        )}
        <div className="relative flex items-end justify-around px-1">
          <span aria-hidden className="absolute inset-x-0 top-0 h-px bg-border" />
          <span aria-hidden className="absolute inset-x-0 top-1/2 h-px bg-border" />
          <span aria-hidden className="absolute inset-x-0 bottom-0 h-px bg-border-strong" />
          {groups.map((g, gi) => (
            <span key={g.label} className="relative flex h-full items-end gap-0.75">
              {g.values.map((v, si) => {
                const fill = swatchFill(series[si]);
                return (
                  <i
                    key={si}
                    title={v.title}
                    className={cn(
                      "block w-2.5 origin-bottom animate-grow-y rounded-t-xs rounded-b-2xs @sm:w-3",
                      fill.className,
                    )}
                    style={{
                      ...fill.style,
                      height: `${v.value}%`,
                      animationDelay: `${gi * stagger.groups}s`,
                    }}
                  />
                );
              })}
            </span>
          ))}
        </div>
      </div>
      <div className={cn("flex justify-around text-3xs text-dim", yTicks && "pl-7.5")}>
        {groups.map((g) => (
          <span key={g.label}>{g.label}</span>
        ))}
      </div>
    </div>
  );
}

/* ---- LineChart ------------------------------------------------------------- */

export type LineSeries = { values: number[]; color: ColorToken };

export type LineChartProps = {
  series: LineSeries[];
  labels: string[];
  /** Value range mapped to the chart height */
  domain?: [number, number];
  label?: string;
  className?: string;
};

/** Small multi-line chart; lines draw in on mount. */
export function LineChart({
  series,
  labels,
  domain = [40, 100],
  label,
  className,
}: LineChartProps) {
  const [min, maxV] = domain;
  const points = (values: number[]) =>
    values
      .map(
        (v, i) =>
          `${((i * 200) / (values.length - 1)).toFixed(1)},${(((maxV - v) / (maxV - min)) * 74 + 3).toFixed(1)}`,
      )
      .join(" ");
  return (
    <div {...chartA11y(label)} className={cn("grid gap-1", className)}>
      <svg viewBox="0 0 200 80" preserveAspectRatio="none" className="block h-19 w-full">
        <path
          d="M0 40H200M0 77H200"
          stroke="var(--fill-hover)"
          strokeWidth="1"
          vectorEffect="non-scaling-stroke"
        />
        {series.map((s, i) => (
          <polyline
            key={i}
            points={points(s.values)}
            fill="none"
            stroke={colorVar(s.color)}
            strokeWidth="2"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
            strokeDasharray="400"
            className="animate-draw"
          />
        ))}
      </svg>
      <div className="flex justify-between text-4xs text-dim">
        {labels.map((l) => (
          <span key={l}>{l}</span>
        ))}
      </div>
    </div>
  );
}

/* ---- HalfGauge ------------------------------------------------------------- */

export type HalfGaugeProps = {
  value: number;
  label: string;
  color: ColorToken;
  className?: string;
};

/** Half-circle gauge (value 0–1) with a needle that sweeps in on mount. */
export function HalfGauge({ value, label, color, className }: HalfGaugeProps) {
  const deg = value * 180;
  return (
    <div className={cn("grid justify-items-center gap-0.5 text-3xs", className)}>
      <div aria-hidden className="relative h-10.5 w-21 overflow-hidden">
        <span
          aria-hidden
          className="absolute inset-x-0 top-0 -bottom-10.5 rounded-full [mask:radial-gradient(circle,transparent_27px,#000_28px)]"
          style={{
            backgroundImage: `conic-gradient(from 270deg, ${colorVar(color)} 0 ${deg}deg, var(--fill-strong) ${deg}deg 180deg, transparent 180deg)`,
          }}
        />
        <i
          aria-hidden
          className="absolute -bottom-[1.5px] left-1/2 h-0.75 w-7.5 origin-left animate-needle rounded-full bg-amber-100"
          style={{ rotate: `${180 + deg}deg` }}
        />
        <span
          aria-hidden
          className="absolute -bottom-1.25 left-1/2 size-2.5 -translate-x-1/2 rounded-full bg-amber-100"
        />
      </div>
      <b className="font-semibold text-muted">{label}</b>
      <small className="text-xs font-semibold text-strong">{Math.round(value * 100)}%</small>
    </div>
  );
}

/* ---- Donut ----------------------------------------------------------------- */

export type DonutSegment = {
  share: number;
  color: ColorToken;
  /** Legend text (used when the donut shows a legend) */
  label?: string;
  /** Legend value, e.g. "2h 18m" */
  value?: string;
};

export type DonutProps = {
  segments: DonutSegment[];
  /** Hole in the middle (donut) or solid (pie) */
  hole?: boolean;
  center?: string;
  sub?: string;
  size?: "sm" | "md" | "lg";
  /** Show a legend (segment labels and values) beside the chart */
  legend?: boolean;
  /** Text alternative; defaults to the centre text */
  label?: string;
  className?: string;
};

const sizes = {
  sm: {
    box: "size-17.5",
    hole: "inset-2.5",
    center: "text-ui font-semibold",
    sub: "text-5xs",
  },
  md: {
    box: "size-24",
    hole: "inset-3",
    center: "text-2xl font-light tracking-tight",
    sub: "text-3xs",
  },
  lg: {
    box: "size-37",
    hole: "inset-4",
    center: "text-gauge font-light tracking-tight",
    sub: "text-xs",
  },
};

/** Pie or donut chart drawn with a conic gradient; spins in on mount. */
export function Donut({
  segments,
  hole = true,
  center,
  sub,
  size = "md",
  legend = false,
  label,
  className,
}: DonutProps) {
  const ends = segments.map((_, i) =>
    segments.slice(0, i + 1).reduce((sum, x) => sum + x.share, 0),
  );
  const stops = segments
    .map((s, i) => `${colorVar(s.color)} ${ends[i] - s.share}% ${ends[i]}%`)
    .join(", ");
  const sz = sizes[size];
  const chart = (
    <div
      {...chartA11y(label ?? (center ? `${center} ${sub ?? ""}`.trim() : undefined))}
      className={cn(
        "relative grid shrink-0 animate-spin-in place-content-center rounded-full text-center",
        size !== "sm" && "shadow-glow-donut",
        sz.box,
        !legend && className,
      )}
      style={{ backgroundImage: `conic-gradient(${stops})` }}
    >
      {hole && <span aria-hidden className={cn("absolute rounded-full bg-hole", sz.hole)} />}
      {center && (
        <b aria-hidden className={cn("relative leading-none text-strong", sz.center)}>
          {center}
        </b>
      )}
      {sub && (
        <small aria-hidden className={cn("relative text-muted", sz.sub)}>
          {sub}
        </small>
      )}
    </div>
  );
  if (!legend) return chart;
  return (
    <div className={cn("grid grid-cols-[auto_minmax(0,1fr)] items-center gap-3", className)}>
      {chart}
      <Legend
        layout="list"
        size={size === "sm" ? "sm" : "md"}
        items={segments.map((s) => ({ label: s.label ?? "", value: s.value, swatch: s.color }))}
      />
    </div>
  );
}

/* ---- Heatmap --------------------------------------------------------------- */

export type HeatmapRow = {
  label: string;
  /** Intensities 0–1, one per column */
  values: number[];
  /** Columns from this index on are flagged as risk (coral) */
  riskFrom?: number;
};

export type HeatmapProps = {
  rows: HeatmapRow[];
  /** Column labels; empty strings leave a gap */
  columns: string[];
  label?: string;
  className?: string;
};

/** Rows × columns of cells whose sky intensity shows the value; risk cells turn coral. */
export function Heatmap({ rows, columns, label, className }: HeatmapProps) {
  const template = `minmax(3.5rem, 5.75rem) repeat(${columns.length}, minmax(0, 1fr))`;
  return (
    <div {...chartA11y(label)} className={cn("grid gap-1.25", className)}>
      {rows.map((row, r) => (
        <div
          key={row.label}
          className="grid items-center gap-0.75 @sm:gap-1"
          style={{ gridTemplateColumns: template }}
        >
          <span className="truncate pr-1 text-2xs font-medium text-foreground @sm:text-xs">
            {row.label}
          </span>
          {row.values.map((v, c) => {
            const risk = row.riskFrom !== undefined && c >= row.riskFrom;
            return (
              <i
                key={c}
                title={`${row.label}, ${columns[c] || `column ${c + 1}`}`}
                className="block h-4.5 animate-blur-in rounded-xs inset-ring inset-ring-fill-3 @sm:h-6 @sm:rounded-sm"
                style={{
                  animationDelay: `${(r * row.values.length + c) * stagger.cells}s`,
                  backgroundColor: risk
                    ? `color-mix(in srgb, var(--coral) ${Math.round((0.25 + v * 0.6) * 100)}%, transparent)`
                    : `color-mix(in srgb, var(--sky) ${Math.round(v * 90)}%, transparent)`,
                }}
              />
            );
          })}
        </div>
      ))}
      <div className="mt-0.5 grid gap-0.75 @sm:gap-1" style={{ gridTemplateColumns: template }}>
        <span />
        {columns.map((c, i) => (
          <em key={i} className="text-center text-4xs text-dim not-italic @sm:text-2xs">
            {c}
          </em>
        ))}
      </div>
    </div>
  );
}
