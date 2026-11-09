/** Row-style data displays: TimelineRows / SegmentBar / BlockStrip, Meter / MeterRow and MetricList. */

import { cn } from "@/lib/cn";
import { type ColorToken, type Tone, colorVar, toneText } from "@/theme/colors";
import { Dot } from "@/components/ui/indicators";

/* ---- Timeline -------------------------------------------------------------- */

/** One coloured slice: [colour, relative length] */
export type Segment = [ColorToken, number];

export type TimelineRow = { label: string; segments: Segment[] };

/** Labelled rows of stacked segments (e.g. an hour split into focused/active/idle). */
export function TimelineRows({ rows, className }: { rows: TimelineRow[]; className?: string }) {
  return (
    <div className={cn("grid gap-1.5", className)}>
      {rows.map((r) => (
        <div
          key={r.label}
          className="grid grid-cols-[4.5rem_minmax(0,1fr)] items-center gap-2.5 text-2xs text-muted tabular-nums"
        >
          <span>{r.label}</span>
          <SegmentBar segments={r.segments} />
        </div>
      ))}
    </div>
  );
}

/** A single bar split into proportional segments; grows in from the left. */
export function SegmentBar({ segments, className }: { segments: Segment[]; className?: string }) {
  return (
    <div className={cn("flex h-4 gap-0.5 overflow-hidden rounded-sm", className)}>
      {segments.map(([color, flex], i) => (
        <i
          key={i}
          className="block origin-left animate-grow-x"
          style={{ flex, backgroundColor: colorVar(color) }}
        />
      ))}
    </div>
  );
}

/** Equal-width blocks (e.g. 5-minute slots) with an axis underneath. */
export function BlockStrip({
  blocks,
  axis,
  className,
}: {
  blocks: ColorToken[];
  axis: string[];
  className?: string;
}) {
  return (
    <div className={cn("grid gap-1.75", className)}>
      <div className="flex h-5 gap-0.75">
        {blocks.map((c, i) => (
          <i
            key={i}
            className="block flex-1 origin-left animate-grow-x rounded-xs"
            style={{ backgroundColor: colorVar(c) }}
          />
        ))}
      </div>
      <div aria-hidden className="flex justify-between text-4xs text-dim">
        {axis.map((a) => (
          <span key={a}>{a}</span>
        ))}
      </div>
    </div>
  );
}

/* ---- Meter ----------------------------------------------------------------- */

/** A horizontal track with a fill that grows in from the left (default fill: brand gradient). */
export function Meter({
  percent,
  color,
  className,
}: {
  percent: number;
  color?: ColorToken;
  className?: string;
}) {
  return (
    <span className={cn("block h-2.5 overflow-hidden rounded-sm bg-track", className)}>
      <i
        className={cn(
          "block h-full origin-left animate-grow-x rounded-[inherit]",
          !color && "bg-meter",
        )}
        style={{ width: `${percent}%`, backgroundColor: color ? colorVar(color) : undefined }}
      />
    </span>
  );
}

/* ---- MeterRow -------------------------------------------------------------- */

export type MeterRowProps = {
  label: string;
  value: string;
  percent: number;
  color: ColorToken;
  className?: string;
};

/** Label + horizontal meter + value. Stacks the label above the bar in narrow frames. */
export function MeterRow({ label, value, percent, color, className }: MeterRowProps) {
  return (
    <div
      className={cn(
        "grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-3 gap-y-1.5 text-sm @md:grid-cols-[10.5rem_minmax(0,1fr)_3.5rem]",
        className,
      )}
    >
      <span className="min-w-0">{label}</span>
      <Meter
        percent={percent}
        color={color}
        className="order-last col-span-full @md:order-none @md:col-span-1"
      />
      <em className="text-right font-semibold not-italic tabular-nums">{value}</em>
    </div>
  );
}

/* ---- MetricList ------------------------------------------------------------ */

export type MetricItem = {
  label: string;
  value: string;
  valueTone?: Tone;
  /** Meter under the row, 0–100 */
  meter?: number;
  /** Meter colour (default: brand gradient) */
  meterColor?: ColorToken;
  /** Glowing dot before the label */
  signal?: ColorToken;
};

/** Label/value rows, each optionally with a signal dot and a meter. */
export function MetricList({ items, className }: { items: MetricItem[]; className?: string }) {
  return (
    <ul className={cn("grid", className)}>
      {items.map((m) => (
        <li
          key={m.label}
          className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-3 gap-y-1.5 border-t border-border py-2.25 text-ui text-muted first:border-t-0"
        >
          <span className="inline-flex min-w-0 items-center gap-2">
            {m.signal && <Dot color={m.signal} glow />}
            <span className="truncate">{m.label}</span>
          </span>
          <b
            className={cn(
              "font-semibold tabular-nums",
              m.valueTone ? toneText[m.valueTone] : "text-strong",
            )}
          >
            {m.value}
          </b>
          {m.meter !== undefined && (
            <Meter percent={m.meter} color={m.meterColor} className="col-span-full h-1.75" />
          )}
        </li>
      ))}
    </ul>
  );
}
