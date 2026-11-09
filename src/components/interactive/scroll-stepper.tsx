"use client";

import { useId, useRef, useState } from "react";
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import { useLenis } from "lenis/react";
import { cn } from "@/lib/cn";
import { rovingIndex } from "@/lib/roving-index";
import { useMediaQuery } from "@/hooks/use-media-query";
import { pinnedQuery } from "@/theme/breakpoints";
import { stepPanel } from "@/theme/motion";
import { Container } from "@/components/layout/section";

export type Step = { number: string; title: string; subtitle: string };

export type ScrollStepperProps = {
  steps: Step[];
  /** One panel per step (any content) */
  panels: React.ReactNode[];
  ariaLabel: string;
  /** "1 of 5 | Keep scrolling" texts */
  progress: { of: string; hint: string };
  /** Scroll distance per step, in viewport heights */
  heightPerStep?: number;
  className?: string;
};

/**
 * Pinned, scroll-driven stepper. On screens that are wide and tall enough the
 * stage sticks while the page scrolls through it, and the steps advance with
 * scroll progress (tabs also jump to their step). Elsewhere the panels are
 * simply stacked with a small step label, so nothing is ever cut off.
 *
 * Both layouts are rendered and the `pinned:` CSS variant picks one, so the
 * server HTML already has the right layout (no jump after hydration).
 */
export function ScrollStepper({
  steps,
  panels,
  ariaLabel,
  progress,
  heightPerStep = 86,
  className,
}: ScrollStepperProps) {
  const pinned = useMediaQuery(pinnedQuery);
  const reduce = useReducedMotion();
  const lenis = useLenis();
  const baseId = useId();
  const outerRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [active, setActive] = useState(0);
  const n = steps.length;

  const { scrollYProgress } = useScroll({ target: outerRef, offset: ["start start", "end end"] });
  const fill = useTransform(scrollYProgress, (p) => `${p * 100}%`);
  useMotionValueEvent(scrollYProgress, "change", (p) => {
    if (pinned) setActive(Math.min(n - 1, Math.floor(p * n)));
  });

  function goTo(i: number) {
    setActive(i);
    const el = outerRef.current;
    if (!pinned || !el) return;
    const top = el.getBoundingClientRect().top + window.scrollY;
    const len = Math.max(1, el.offsetHeight - window.innerHeight);
    const target = top + ((i + 0.5) / n) * len;
    if (lenis) lenis.scrollTo(target, { immediate: !!reduce });
    else window.scrollTo({ top: target, behavior: reduce ? "auto" : "smooth" });
  }

  function onKeyDown(e: React.KeyboardEvent, i: number) {
    const next = rovingIndex(e.key, i, n, { wrap: false, axis: "x" });
    if (next === null) return;
    e.preventDefault();
    tabRefs.current[next]?.focus({ preventScroll: true });
    goTo(next);
  }

  return (
    <div
      ref={outerRef}
      className={cn("relative pinned:h-(--stepper-h)", className)}
      style={{ "--stepper-h": `${n * heightPerStep}svh` } as React.CSSProperties}
    >
      <div className="pinned:sticky pinned:top-pin pinned:flex pinned:h-[calc(100svh-var(--spacing-pin))] pinned:items-center">
        <Container>
          <div className="hidden pinned:block">
            {/* Step tabs with the progress line */}
            <div
              role="tablist"
              aria-label={ariaLabel}
              className="relative grid gap-2"
              style={{ gridTemplateColumns: `repeat(${n}, minmax(0, 1fr))` }}
            >
              <span
                aria-hidden
                className="absolute top-5.5 h-0.5 rounded-xs bg-border-strong"
                style={{ left: `${50 / n}%`, right: `${50 / n}%` }}
              >
                <motion.i
                  style={{ width: fill }}
                  className="block h-full rounded-[inherit] bg-meter shadow-glow-line"
                />
              </span>
              {steps.map((step, i) => {
                const selected = i === active;
                return (
                  <button
                    key={step.number}
                    ref={(el) => {
                      tabRefs.current[i] = el;
                    }}
                    type="button"
                    role="tab"
                    id={`${baseId}-tab-${i}`}
                    aria-selected={selected}
                    aria-controls={`${baseId}-panel-${i}`}
                    tabIndex={selected ? 0 : -1}
                    onClick={() => goTo(i)}
                    onKeyDown={(e) => onKeyDown(e, i)}
                    className="relative grid justify-items-center gap-1 px-1.5 pb-3.5 text-center short:pb-1"
                  >
                    <span
                      className={cn(
                        "mb-2.5 grid size-11.5 place-items-center rounded-full text-ui font-semibold transition-[color,border-color,background-color] duration-400 ease-brand short:mb-1",
                        selected
                          ? "orb"
                          : cn(
                              "border-[1.5px] bg-surface",
                              i < active
                                ? "border-sky text-accent"
                                : "border-border-strong text-muted",
                            ),
                      )}
                    >
                      {step.number}
                    </span>
                    <b className="text-title font-medium tracking-slight text-foreground">
                      {step.title}
                    </b>
                    <small
                      className={cn("text-sm short:hidden", selected ? "text-accent" : "text-dim")}
                    >
                      {step.subtitle}
                    </small>
                  </button>
                );
              })}
            </div>

            {/* Panels: all stacked in one grid cell, so the area is always as
                  tall as the tallest panel — switching steps never shifts the layout. */}
            <div className="mt-10 grid short:mt-4">
              {panels.map((panel, i) => {
                const isActive = i === active;
                return (
                  <motion.div
                    key={steps[i].number}
                    id={`${baseId}-panel-${i}`}
                    role="tabpanel"
                    aria-labelledby={`${baseId}-tab-${i}`}
                    aria-hidden={!isActive}
                    inert={!isActive}
                    initial={false}
                    animate={isActive ? "active" : i < active ? "before" : "after"}
                    variants={stepPanel}
                    className="col-start-1 row-start-1 self-center"
                  >
                    {/* Remount on activation so the panel's own entry animations replay */}
                    <div key={isActive ? "active" : "idle"}>{panel}</div>
                  </motion.div>
                );
              })}
            </div>

            <p
              aria-hidden
              className="mt-6.5 flex items-center justify-center gap-2.5 text-xs text-dim short:mt-3"
            >
              <span>
                <b className="font-bold text-strong">{active + 1}</b> {progress.of} {n}
              </span>
              <i className="h-3 w-px bg-border-strong" />
              {progress.hint}
            </p>
          </div>

          {/* Stacked: every panel with its step label */}
          <div className="grid gap-14 pinned:hidden">
            {panels.map((panel, i) => (
              <div key={steps[i].number}>
                <p className="mb-4 text-sm font-bold tracking-label text-accent">
                  {steps[i].number} {steps[i].title}
                </p>
                {panel}
              </div>
            ))}
          </div>
        </Container>
      </div>
    </div>
  );
}
