"use client";

import { useId, useRef, useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/cn";
import { rovingIndex } from "@/lib/roving-index";
import { Card } from "@/components/ui/surfaces";
import { Swap } from "@/components/interactive/swap";

export type ListTabItem = {
  /** Big keyword, e.g. "WHAT" */
  keyword: string;
  title: string;
  description: string;
};

export type ListTabPanel = {
  heading: string;
  body: React.ReactNode;
  /** Any visual (a mock dashboard, an image…) */
  content?: React.ReactNode;
  link?: { label: string; href: string };
};

export type ListTabsProps = {
  items: ListTabItem[];
  panels: ListTabPanel[];
  ariaLabel: string;
  className?: string;
};

/**
 * A vertical list of tabs beside a sticky answer panel (wide screens). On
 * smaller screens the list becomes wrapping pills above the panel.
 * Arrow keys, Home and End move between tabs.
 */
export function ListTabs({ items, panels, ariaLabel, className }: ListTabsProps) {
  const [active, setActive] = useState(0);
  const baseId = useId();
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const n = items.length;
  const panel = panels[active];

  function onKeyDown(e: React.KeyboardEvent, i: number) {
    const next = rovingIndex(e.key, i, n);
    if (next === null) return;
    e.preventDefault();
    setActive(next);
    tabs.current[next]?.focus();
  }

  return (
    <div className={cn("grid items-start gap-4 xl:grid-cols-2 xl:gap-10", className)}>
      <div
        role="tablist"
        aria-label={ariaLabel}
        aria-orientation="vertical"
        className="flex flex-wrap gap-2 xl:grid xl:gap-0 xl:border-t xl:border-border"
      >
        {items.map((item, i) => {
          const selected = i === active;
          return (
            <button
              key={item.keyword}
              ref={(el) => {
                tabs.current[i] = el;
              }}
              type="button"
              role="tab"
              id={`${baseId}-tab-${i}`}
              aria-selected={selected}
              aria-controls={`${baseId}-panel`}
              tabIndex={selected ? 0 : -1}
              onClick={() => setActive(i)}
              onKeyDown={(e) => onKeyDown(e, i)}
              className={cn(
                "group text-left transition-colors duration-300",
                // pills (small screens)
                "rounded-full border px-4 py-2.5",
                selected ? "border-border-ghost-hover bg-fill-hover" : "border-border",
                // list rows (wide screens)
                "xl:grid xl:grid-cols-[9.375rem_minmax(0,1fr)] xl:items-baseline xl:gap-x-5 xl:gap-y-1 xl:rounded-none xl:border-0 xl:border-b xl:border-border xl:px-2 xl:py-4.5",
                selected ? "xl:bg-selected-row" : "xl:bg-transparent",
              )}
            >
              <span
                className={cn(
                  "text-control font-semibold transition-colors duration-300 xl:row-span-2 xl:self-start xl:text-tab xl:font-light xl:tracking-tight",
                  selected ? "text-strong xl:text-glow-sky" : "text-dim group-hover:text-muted",
                )}
              >
                {item.keyword}
              </span>
              <span
                className={cn(
                  "hidden text-control font-semibold xl:block",
                  selected ? "text-accent" : "text-muted",
                )}
              >
                {item.title}
              </span>
              <span
                className={cn(
                  "hidden text-ui leading-snug xl:col-start-2 xl:block",
                  selected ? "text-muted" : "text-dim",
                )}
              >
                {item.description}
              </span>
            </button>
          );
        })}
      </div>

      <Card
        variant="glass"
        padding="none"
        className="min-w-0 p-5 sm:p-6.5 xl:sticky xl:top-27.5 xl:min-h-90 xl:p-9"
      >
        <Swap
          swapKey={active}
          id={`${baseId}-panel`}
          role="tabpanel"
          aria-labelledby={`${baseId}-tab-${active}`}
          className="grid min-w-0 content-start gap-4"
        >
          <p className="text-gradient-tag text-qs-tag font-light tracking-tight">{panel.heading}</p>
          <div className="text-lg text-muted">{panel.body}</div>
          {panel.content}
          {panel.link && (
            <Link
              href={panel.link.href}
              className="inline-flex min-h-11 items-center justify-self-start font-semibold text-accent no-underline underline-offset-4 hover:underline"
            >
              {panel.link.label}
            </Link>
          )}
        </Swap>
      </Card>
    </div>
  );
}
