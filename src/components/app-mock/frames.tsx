/** Product-screen frames: AppWindow, AppBar, MockCard, DashboardFrame / DashboardSplit / DashboardPanel and ViewTabs. */

import { cn } from "@/lib/cn";
import { Dot } from "@/components/ui/indicators";
import { cardVariants, surfaceVariants } from "@/components/ui/surfaces";

/* ---- AppWindow ------------------------------------------------------------- */

export type AppWindowProps = {
  /** `glass` = floating product screen, `inset` = darker panel inside another card */
  variant?: "glass" | "inset";
  /** `lg` = roomier padding for a mock-up that is the main visual of a panel */
  padding?: "md" | "lg";
  className?: string;
  children: React.ReactNode;
  /** Names the mock-up for screen readers (e.g. "Sample sprint board") */
  "aria-label"?: string;
};

/**
 * Frame for a product-screen mock-up. It is a size container, so everything
 * inside adapts to the frame's own width (container queries), not the screen's.
 */
export function AppWindow({
  variant = "glass",
  padding = "md",
  className,
  children,
  ...rest
}: AppWindowProps) {
  return (
    <div
      role={rest["aria-label"] ? "figure" : undefined}
      {...rest}
      className={cn(
        cardVariants({ variant: variant === "glass" ? "glass" : "panel", padding: "none" }),
        "@container grid content-start *:min-w-0",
        variant === "glass" ? "gap-2.5" : "gap-3 text-xs text-muted",
        padding === "lg"
          ? "p-5.5"
          : variant === "glass"
            ? "p-3.5 sm:px-4.5 sm:py-4"
            : "p-3.5 sm:p-4",
        className,
      )}
    >
      {children}
    </div>
  );
}

/** Header row of a mock-up: a title (or any content) on the left, a chip or control on the right. */
export function AppBar({
  title,
  left,
  right,
  className,
}: {
  /** Plain bold title; use `left` instead for richer content (tabs, a person…) */
  title?: React.ReactNode;
  left?: React.ReactNode;
  right?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-wrap items-center justify-between gap-2.5", className)}>
      <div className="min-w-0">
        {title && <b className="text-sm font-semibold text-foreground">{title}</b>}
        {left}
      </div>
      {right}
    </div>
  );
}

/** Small boxed area inside a mock-up (chart cards, breakdowns). */
export function MockCard({
  title,
  aside,
  tone = "well",
  className,
  children,
}: {
  title?: React.ReactNode;
  aside?: React.ReactNode;
  /** `well` = dark recessed box, `fill` = faint light box */
  tone?: "well" | "fill";
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        surfaceVariants({ tone, radius: "xl", padding: "md" }),
        "grid content-start gap-2.5 *:min-w-0",
        className,
      )}
    >
      {(title || aside) && (
        <AppBar
          className="gap-2 text-2xs"
          left={title && <b className="font-semibold text-strong">{title}</b>}
          right={aside}
        />
      )}
      {children}
    </div>
  );
}

/* ---- DashboardFrame -------------------------------------------------------- */

export type DashboardFrameProps = {
  title: string;
  subtitle?: string;
  /** Chips on the right of the header */
  aside?: React.ReactNode;
  /** Small line under the body, with a green dot */
  footnote?: string;
  children: React.ReactNode;
  className?: string;
};

/**
 * Large analytics dashboard: header bar (title + chips) over a faint dot grid.
 * It is a size container, so its contents adapt to the frame width.
 */
export function DashboardFrame({
  title,
  subtitle,
  aside,
  footnote,
  children,
  className,
}: DashboardFrameProps) {
  return (
    <div
      className={cn(
        "@container relative isolate overflow-hidden rounded-frame border border-border-strong bg-dashboard",
        className,
      )}
    >
      <span aria-hidden className="pointer-events-none absolute inset-0 -z-1 dot-grid" />
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-4 py-3.5 sm:px-6 sm:py-4">
        <p className="flex min-w-0 items-center gap-2.5 text-base font-semibold text-foreground">
          <Dot color="sky" shape="square" glow className="size-2.25" />
          <span className="min-w-0">
            {title}
            {subtitle && (
              <small className="ml-1 text-ui font-medium text-muted">· {subtitle}</small>
            )}
          </span>
        </p>
        {aside && <div className="flex flex-wrap gap-2">{aside}</div>}
      </div>
      <div className="grid gap-3.5 p-4 sm:px-6 sm:pt-5.5 sm:pb-6">
        {children}
        {footnote && (
          <p className="mt-0.5 flex items-center gap-2 text-sm text-muted">
            <Dot color="leaf" glow />
            {footnote}
          </p>
        )}
      </div>
    </div>
  );
}

/** Two dashboard columns side by side (wider first) once the frame has room. */
export function DashboardSplit({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("grid gap-3 @3xl:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]", className)}>
      {children}
    </div>
  );
}

export type DashboardPanelProps = {
  title: string;
  /** Chip or control on the right of the title */
  aside?: React.ReactNode;
  /** Let the content take any spare height (e.g. a chart beside a taller panel) */
  stretch?: boolean;
  /** Pinned under the content (e.g. a chart legend) */
  footer?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
};

/** Dark inset panel inside a dashboard, with a title row. */
export function DashboardPanel({
  title,
  aside,
  stretch = false,
  footer,
  className,
  children,
}: DashboardPanelProps) {
  return (
    <div
      className={cn(
        cardVariants({ variant: "panel", padding: "none" }),
        "grid gap-3.5 p-4 sm:p-4.5",
        stretch ? "grid-rows-[auto_minmax(0,1fr)] content-stretch" : "content-start",
        className,
      )}
    >
      <AppBar
        left={<b className="text-md font-semibold text-foreground">{title}</b>}
        right={aside}
      />
      {footer ? (
        <div className="grid h-full grid-rows-[minmax(0,1fr)_auto] gap-3">
          {children}
          {footer}
        </div>
      ) : (
        children
      )}
    </div>
  );
}

/* ---- ViewTabs -------------------------------------------------------------- */

export type ViewTab = { label: string; icon: React.ReactNode; active?: boolean };

/** App view switcher (List / Board / …). Decorative; inactive labels hide in narrow frames. */
export function ViewTabs({ tabs, className }: { tabs: ViewTab[]; className?: string }) {
  return (
    <div
      aria-hidden
      className={cn(
        "flex max-w-full gap-0.5 rounded-lg border border-border bg-well p-0.75",
        className,
      )}
    >
      {tabs.map((t) => (
        <span
          key={t.label}
          className={cn(
            "inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.25 text-xs font-semibold whitespace-nowrap [&_svg]:size-3.25",
            t.active ? "bg-sky/14 text-sky-100" : "text-dim",
          )}
        >
          {t.icon}
          <span className={cn(!t.active && "@max-md:hidden")}>{t.label}</span>
        </span>
      ))}
    </div>
  );
}
