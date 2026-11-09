"use client";

import { useId, useState } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/cn";
import { transition } from "@/theme/motion";

export type AccordionItemData = {
  question: string;
  answer: React.ReactNode;
};

/**
 * Question/answer list. One answer is open at a time: opening another closes
 * the previous one, and clicking the open question closes it. Answers slide open.
 * Closed answers stay in the HTML (collapsed and `inert`), so they are crawlable.
 */
export function Accordion({
  items,
  defaultOpen = 0,
  className,
}: {
  items: AccordionItemData[];
  /** Index of the answer open on load (`null` = all closed) */
  defaultOpen?: number | null;
  className?: string;
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(defaultOpen);
  return (
    <div className={cn("border-t border-border", className)}>
      {items.map((item, i) => (
        <AccordionItem
          key={item.question}
          {...item}
          open={openIndex === i}
          onToggle={() => setOpenIndex((cur) => (cur === i ? null : i))}
        />
      ))}
    </div>
  );
}

function AccordionItem({
  question,
  answer,
  open,
  onToggle,
}: AccordionItemData & { open: boolean; onToggle: () => void }) {
  const id = useId();
  return (
    <div className="border-b border-border">
      <h3>
        <button
          type="button"
          id={`${id}-q`}
          aria-expanded={open}
          aria-controls={`${id}-a`}
          onClick={onToggle}
          className={cn(
            "flex w-full items-center justify-between gap-6 px-1 py-6.5 text-left text-title font-medium tracking-slight transition-colors",
            open ? "text-strong" : "text-foreground hover:text-strong",
          )}
        >
          {question}
          <PlusMinus open={open} />
        </button>
      </h3>
      <motion.div
        id={`${id}-a`}
        role="region"
        aria-labelledby={`${id}-q`}
        inert={!open}
        initial={false}
        animate={
          open
            ? { height: "auto", opacity: 1, visibility: "visible" }
            : { height: 0, opacity: 0, transitionEnd: { visibility: "hidden" } }
        }
        transition={transition.brand}
        className="overflow-hidden"
      >
        <div className="max-w-prose px-1 pb-7 text-lg text-muted lg:pr-16 [&_a]:text-muted [&_a]:underline">
          {answer}
        </div>
      </motion.div>
    </div>
  );
}

/** Circle with a plus that turns into a filled × when open. */
function PlusMinus({ open }: { open: boolean }) {
  return (
    <span
      aria-hidden
      className={cn(
        "relative size-9 shrink-0 rounded-full border transition-[background-color,border-color,rotate] duration-400 ease-brand",
        open ? "rotate-45 border-volt bg-volt" : "border-border-strong",
      )}
    >
      <span className="absolute top-1/2 left-1/2 h-[1.5px] w-3 -translate-1/2 bg-foreground" />
      <span className="absolute top-1/2 left-1/2 h-[1.5px] w-3 -translate-1/2 rotate-90 bg-foreground" />
    </span>
  );
}
