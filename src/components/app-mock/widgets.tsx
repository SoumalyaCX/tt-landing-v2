/** Mock-up widgets: KpiGrid, PersonLabel, LiveBadge, TaskTile and AlertList. */

import { cn } from "@/lib/cn";
import { type Tone, toneText } from "@/theme/colors";
import { cardVariants, surfaceVariants } from "@/components/ui/surfaces";
import { Avatar, type AvatarProps } from "@/components/ui/avatar";
import { Dot } from "@/components/ui/indicators";

/* ---- KpiGrid --------------------------------------------------------------- */

export type Kpi = {
  label: string;
  value: React.ReactNode;
  icon?: React.ReactNode;
  /** Small line under the value (large tiles), e.g. "+9 vs baseline" */
  note?: string;
  noteTone?: Tone;
  valueTone?: Tone;
};

const compactCols = {
  2: "grid-cols-2",
  3: "grid-cols-2 @sm:grid-cols-3",
  4: "grid-cols-2 @md:grid-cols-4",
};
const cols = {
  sm: compactCols,
  md: compactCols,
  lg: { 2: "grid-cols-2", 3: "grid-cols-2 @2xl:grid-cols-3", 4: "grid-cols-2 @3xl:grid-cols-4" },
};

/** Row of KPI tiles; columns adapt to the frame width. `lg` tiles carry a note line. */
export function KpiGrid({
  items,
  columns = 4,
  size = "md",
  className,
}: {
  items: Kpi[];
  columns?: 2 | 3 | 4;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const lg = size === "lg";
  return (
    <div className={cn("grid", lg ? "gap-3" : "gap-2", cols[size][columns], className)}>
      {items.map((k) => (
        <div
          key={k.label}
          className={cn(
            cardVariants({ variant: "tile", padding: "none" }),
            "grid",
            lg ? "gap-1 px-4.5 py-4" : "gap-0.5 rounded-lg px-3 py-2",
          )}
        >
          <small
            className={cn(
              "text-muted",
              // large tiles wrap long labels; compact tiles truncate
              lg
                ? "text-sm leading-snug font-medium"
                : cn("truncate", size === "md" ? "text-2xs" : "text-3xs"),
            )}
          >
            {k.label}
          </small>
          <b
            className={cn(
              "flex items-center gap-1.5 whitespace-nowrap tabular-nums [&_svg]:size-4.25 [&_svg]:text-amber-100",
              lg
                ? "text-stat leading-tight font-light tracking-tighter"
                : cn(
                    "font-normal tracking-snug",
                    size === "md" ? "text-base @sm:text-lg" : "text-control",
                  ),
              k.valueTone ? toneText[k.valueTone] : "text-strong",
            )}
          >
            {k.icon}
            {k.value}
          </b>
          {k.note && (
            <em
              className={cn("text-xs not-italic", k.noteTone ? toneText[k.noteTone] : "text-dim")}
            >
              {k.note}
            </em>
          )}
        </div>
      ))}
    </div>
  );
}

/* ---- PersonLabel ----------------------------------------------------------- */

export type PersonLabelProps = {
  initials: string;
  hue: number;
  name: React.ReactNode;
  size?: AvatarProps["size"];
  className?: string;
};

/** Hue avatar followed by a name. */
export function PersonLabel({ initials, hue, name, size = "md", className }: PersonLabelProps) {
  return (
    <span className={cn("inline-flex min-w-0 items-center gap-2", className)}>
      <Avatar initials={initials} hue={hue} size={size} />
      <span className="truncate">{name}</span>
    </span>
  );
}

/* ---- LiveBadge ------------------------------------------------------------- */

/** Pulsing green dot with a short label, e.g. "Live". */
export function LiveBadge({ label, className }: { label: string; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-1.5 font-semibold text-leaf-100", className)}>
      <Dot color="leaf" glow pulse />
      {label}
    </span>
  );
}

/* ---- TaskTile -------------------------------------------------------------- */

export type TaskTileProps = {
  title: string;
  meta: string;
  tone?: "default" | "highlight" | "muted";
  className?: string;
};

/** Small task card with an accent line under the title (e.g. "ETA 4 PM"). */
export function TaskTile({ title, meta, tone = "default", className }: TaskTileProps) {
  return (
    <p
      className={cn(
        surfaceVariants({ tone: tone === "highlight" ? "sky-strong" : "neutral", padding: "none" }),
        "p-2.5 text-sm leading-tight font-medium",
        tone === "muted" && "opacity-60",
        className,
      )}
    >
      {title}
      <em className="mt-1.5 block text-2xs text-accent not-italic">{meta}</em>
    </p>
  );
}

/* ---- AlertList ------------------------------------------------------------- */

export type AlertItem = {
  severity: "high" | "medium" | "low";
  title: string;
  meta: string;
  level: string;
};

const styles = {
  high: { dot: "coral", pill: "bg-coral/16 text-coral-100" },
  medium: { dot: "amber", pill: "bg-amber/14 text-amber-100" },
  low: { dot: "periwinkle", pill: "bg-fill-strong text-volt-50" },
} as const;

/** Security / risk alerts with a severity dot and level pill. */
export function AlertList({ alerts, className }: { alerts: AlertItem[]; className?: string }) {
  return (
    <ul className={cn("grid gap-1.5", className)}>
      {alerts.map((a) => (
        <li
          key={a.title}
          className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-2.5 rounded-md bg-fill-3 px-2.5 py-2.25"
        >
          <Dot color={styles[a.severity].dot} glow={a.severity === "high"} />
          <span className="grid text-xs text-foreground">
            {a.title}
            <small className="text-2xs text-dim">{a.meta}</small>
          </span>
          <em
            className={cn(
              "rounded-full px-2 py-0.5 text-3xs font-bold not-italic",
              styles[a.severity].pill,
            )}
          >
            {a.level}
          </em>
        </li>
      ))}
    </ul>
  );
}
