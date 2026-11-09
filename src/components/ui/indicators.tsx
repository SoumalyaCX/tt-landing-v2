/** Small status elements: Chip, StatusPill, Dot and Toggle. */

import { type VariantProps, cva } from "class-variance-authority";
import { cn } from "@/lib/cn";
import { type ColorToken, tintStyle } from "@/theme/colors";

/* ---- Chip ------------------------------------------------------------------ */

const chipVariants = cva(
  "inline-flex max-w-full shrink-0 items-center gap-1.5 rounded-full border font-semibold whitespace-nowrap [&_svg]:shrink-0",
  {
    variants: {
      tone: {
        neutral: "border-border-strong bg-fill-4 text-muted",
        outline: "border-border-strong bg-transparent text-muted",
        soft: "border-border bg-fill-5 text-muted",
        green: "border-leaf/35 bg-leaf/10 text-leaf-100",
        blue: "border-sky/35 bg-sky/10 text-sky-100",
        token: "border-transparent bg-sky/14 text-sky-100",
      },
      size: {
        sm: "px-2.25 py-0.75 text-3xs [&_svg]:size-2.75",
        md: "px-2.75 py-1.25 text-xs [&_svg]:size-3.5",
      },
    },
    defaultVariants: { tone: "neutral", size: "md" },
  },
);

export type ChipProps = React.ComponentProps<"span"> &
  VariantProps<typeof chipVariants> & { icon?: React.ReactNode };

export function Chip({ tone, size, icon, className, children, ...props }: ChipProps) {
  return (
    <span className={cn(chipVariants({ tone, size }), className)} {...props}>
      {icon}
      <span className="truncate">{children}</span>
    </span>
  );
}

/* ---- StatusPill ------------------------------------------------------------ */

export type StatusPillProps = {
  label: React.ReactNode;
  color: ColorToken;
  className?: string;
};

/** Pill whose text and tint come from one color token (zones, severities). */
export function StatusPill({ label, color, className }: StatusPillProps) {
  return (
    <span
      style={tintStyle(color)}
      className={cn(
        "inline-flex w-fit items-center gap-1.5 rounded-full border border-border bg-[color-mix(in_srgb,var(--c)_18%,transparent)] px-2.5 py-1 text-xs font-bold text-(--c)",
        className,
      )}
    >
      {label}
    </span>
  );
}

/* ---- Dot ------------------------------------------------------------------- */

export type DotProps = {
  color?: ColorToken;
  size?: "md" | "lg";
  shape?: "round" | "square";
  glow?: boolean;
  pulse?: boolean;
  className?: string;
};

const sizes = { md: "size-2", lg: "size-2.5" };

/** Small status dot, optionally glowing or pulsing (respects reduced motion). */
export function Dot({
  color = "leaf",
  size = "md",
  shape = "round",
  glow = false,
  pulse = false,
  className,
}: DotProps) {
  return (
    <span
      aria-hidden
      style={tintStyle(color)}
      className={cn(
        "inline-block shrink-0 bg-current text-(--c)",
        shape === "round" ? "rounded-full" : "rounded-2xs",
        sizes[size],
        glow && "shadow-dot",
        pulse && "motion-safe:animate-pulse-dot",
        className,
      )}
    />
  );
}

/* ---- Toggle ---------------------------------------------------------------- */

export type ToggleProps = { on?: boolean; label?: React.ReactNode; className?: string };

/** Static on/off switch used inside product mock-ups (not a form control). */
export function Toggle({ on = true, label, className }: ToggleProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 text-2xs font-semibold",
        on ? "text-leaf-100" : "text-dim",
        className,
      )}
    >
      <span
        aria-hidden
        className={cn(
          "relative h-4 w-7 shrink-0 rounded-full transition-colors",
          on ? "bg-leaf" : "bg-fill-strong",
        )}
      >
        <span
          className={cn(
            "absolute top-0.5 size-3 rounded-full bg-strong transition-[left]",
            on ? "left-3.5" : "left-0.5",
          )}
        />
      </span>
      {label}
    </span>
  );
}
