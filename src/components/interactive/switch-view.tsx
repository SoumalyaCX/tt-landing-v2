"use client";

import { createContext, useContext, useState } from "react";
import { cn } from "@/lib/cn";
import { SegmentedControl, type SegmentedOption } from "@/components/ui/controls";
import { Swap } from "@/components/interactive/swap";

const SwitchContext = createContext<string | null>(null);

function useActive() {
  const v = useContext(SwitchContext);
  if (v === null) throw new Error("Use inside <SwitchView>");
  return v;
}

export type SwitchViewProps = {
  options: SegmentedOption[];
  defaultValue?: string;
  ariaLabel: string;
  /** <SwitchPanels/>, <HighlightColumns/> or anything else that reacts to the selection */
  children: React.ReactNode;
  className?: string;
  controlClassName?: string;
};

/**
 * A segmented switch whose selection is shared with its children: panels
 * swap to the matching view and highlight lists light up matching items.
 */
export function SwitchView({
  options,
  defaultValue,
  ariaLabel,
  children,
  className,
  controlClassName,
}: SwitchViewProps) {
  const [active, setActive] = useState(defaultValue ?? options[0].value);
  return (
    <SwitchContext.Provider value={active}>
      <div className={className}>
        <SegmentedControl
          ariaLabel={ariaLabel}
          size="lg"
          options={options}
          value={active}
          onChange={setActive}
          className={cn("mx-auto max-w-180", controlClassName)}
        />
        {children}
      </div>
    </SwitchContext.Provider>
  );
}

/** Shows the view whose key matches the selection; replays a blur-in on every change. */
export function SwitchPanels({
  views,
  className,
}: {
  views: Record<string, React.ReactNode>;
  className?: string;
}) {
  const active = useActive();
  return (
    <div className={className}>
      <Swap swapKey={active} effect="blur">
        {views[active]}
      </Swap>
    </div>
  );
}

export type HighlightColumn = {
  title: string;
  intro: string;
  items: {
    title: string;
    text: string;
    /** selection values that light this item up */ when?: string[];
  }[];
};

/** Columns of items; items matching the current selection light up. */
export function HighlightColumns({
  columns,
  className,
}: {
  columns: HighlightColumn[];
  className?: string;
}) {
  const active = useActive();
  return (
    <div className={cn("grid border-t border-border lg:grid-cols-3", className)}>
      {columns.map((col, i) => (
        <div
          key={col.title}
          className={cn(
            "grid content-start gap-2.5 pt-6 lg:pt-7",
            i > 0 && "lg:border-l lg:border-border lg:pl-7",
            i < columns.length - 1 && "lg:pr-7",
          )}
        >
          <h3 className="text-2xl font-light tracking-snug">{col.title}</h3>
          <p className="text-md text-muted lg:min-h-[3em]">{col.intro}</p>
          <ul className="grid">
            {col.items.map((item) => {
              const on = item.when?.includes(active) ?? false;
              return (
                <li
                  key={item.title}
                  className={cn(
                    "relative grid gap-0.5 border-t border-border py-3 pl-3.5 text-ui transition-colors duration-400",
                    on ? "text-sky-50" : "text-muted",
                  )}
                >
                  <span
                    aria-hidden
                    className={cn(
                      "absolute top-4.5 left-0 size-1.5 rounded-full transition-[background-color,box-shadow] duration-400",
                      on ? "bg-sky text-sky shadow-dot" : "bg-border-strong",
                    )}
                  />
                  <b className="text-base font-semibold text-foreground">{item.title}</b>
                  {item.text}
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </div>
  );
}
