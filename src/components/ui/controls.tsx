"use client";

/** Interactive form controls: SegmentedControl and RangeField. */

import { useId, useState } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/cn";
import { transition } from "@/theme/motion";

/* ---- SegmentedControl ------------------------------------------------------ */

export type SegmentedOption<T extends string = string> = {
  value: T;
  label: React.ReactNode;
  /** Shorter label shown below the `sm` breakpoint, e.g. "Org-wide" */
  shortLabel?: React.ReactNode;
};

export type SegmentedControlProps<T extends string = string> = {
  options: SegmentedOption<T>[];
  /** Controlled value */
  value?: T;
  defaultValue?: T;
  onChange?: (value: T) => void;
  ariaLabel: string;
  size?: "md" | "lg";
  className?: string;
};

/**
 * Pill switch with a sliding highlight. Options share the width equally and
 * labels may wrap on very narrow screens, so it never overflows.
 */
export function SegmentedControl<T extends string = string>({
  options,
  value,
  defaultValue,
  onChange,
  ariaLabel,
  size = "md",
  className,
}: SegmentedControlProps<T>) {
  const [internal, setInternal] = useState<T>(defaultValue ?? options[0].value);
  const current = value ?? internal;
  const pillId = useId();

  return (
    <div
      role="group"
      aria-label={ariaLabel}
      className={cn("flex w-full rounded-full border border-border-ghost bg-fill-4 p-1", className)}
    >
      {options.map((opt) => {
        const active = opt.value === current;
        return (
          <button
            key={opt.value}
            type="button"
            aria-pressed={active}
            onClick={() => {
              setInternal(opt.value);
              onChange?.(opt.value);
            }}
            className={cn(
              "relative min-w-0 flex-auto rounded-full px-1.5 leading-tight font-semibold text-balance transition-colors duration-300 sm:flex-1 sm:basis-0 sm:px-2",
              size === "md"
                ? "min-h-11 text-2xs min-[380px]:text-xs sm:text-ui"
                : "min-h-11.5 text-2xs min-[380px]:text-xs sm:text-md",
              active ? "text-strong" : "text-muted hover:text-foreground",
            )}
          >
            {active && (
              <motion.span
                layoutId={pillId}
                transition={transition.menu}
                aria-hidden
                className="absolute inset-0 rounded-full bg-fill-strong"
              />
            )}
            {opt.shortLabel ? (
              <>
                <span className="relative whitespace-nowrap sm:hidden">{opt.shortLabel}</span>
                <span className="relative hidden sm:inline">{opt.label}</span>
              </>
            ) : (
              <span className="relative">{opt.label}</span>
            )}
          </button>
        );
      })}
    </div>
  );
}

/* ---- RangeField ------------------------------------------------------------ */

export type RangeFieldProps = {
  /** Text before the value, e.g. "Days of usage:" */
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
  className?: string;
};

/** Labelled range slider showing its current value. */
export function RangeField({ label, value, min, max, onChange, className }: RangeFieldProps) {
  const id = useId();
  return (
    <div className={cn("grid gap-2.5 text-ui text-muted", className)}>
      <label htmlFor={id}>
        {label} <b className="font-bold text-strong tabular-nums">{value}</b>
      </label>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="min-h-8 w-full cursor-pointer accent-sky"
      />
    </div>
  );
}
