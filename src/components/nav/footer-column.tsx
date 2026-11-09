"use client";

import { useId, useRef, useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { CaretDownIcon } from "@phosphor-icons/react";
import { cn } from "@/lib/cn";
import { transition } from "@/theme/motion";
import { type FooterColumnData } from "@/components/nav/types";

export type FooterColumnProps = FooterColumnData & {
  /** Heading in the plain text color instead of the accent color */
  plain?: boolean;
  /** Links shown before the "show more" toggle */
  limit?: number;
  /** Toggle texts */
  toggleLabels: { more: string; less: string };
};

/**
 * Footer link column; long columns collapse behind a "show more" toggle.
 * Collapsed links stay in the HTML (just `hidden`), so they remain crawlable.
 */
export function FooterColumn({
  title,
  links,
  plain = false,
  limit = 4,
  toggleLabels,
}: FooterColumnProps) {
  const [expanded, setExpanded] = useState(false);
  const listId = useId();
  const firstHidden = useRef<HTMLAnchorElement>(null);
  const collapsible = links.length > limit;

  return (
    <div className="min-w-0">
      <h3
        className={cn(
          "mb-4 text-control leading-snug font-semibold tracking-normal",
          plain ? "text-foreground" : "text-accent",
        )}
      >
        {title}
      </h3>
      <ul id={listId} className="grid gap-2.75">
        {links.map((link, i) => {
          const hidden = collapsible && !expanded && i >= limit;
          return (
            <motion.li
              key={link.label}
              hidden={hidden}
              className="text-ui leading-snug"
              initial={false}
              animate={hidden ? { opacity: 0, y: -4 } : { opacity: 1, y: 0 }}
              transition={transition.brand}
            >
              <Link
                ref={i === limit ? firstHidden : undefined}
                href={link.href}
                className="break-words text-muted no-underline transition-colors duration-200 hover:text-foreground"
              >
                {link.label}
              </Link>
            </motion.li>
          );
        })}
      </ul>
      {collapsible && (
        <button
          type="button"
          aria-expanded={expanded}
          aria-controls={listId}
          onClick={() => {
            const next = !expanded;
            setExpanded(next);
            if (next)
              requestAnimationFrame(() => firstHidden.current?.focus({ preventScroll: true }));
          }}
          className="mt-1.5 inline-flex min-h-8 items-center gap-2 text-sm font-medium text-dim transition-colors hover:text-accent"
        >
          {expanded ? toggleLabels.less : toggleLabels.more}
          <CaretDownIcon
            aria-hidden
            className={cn(
              "size-3 transition-transform duration-250 ease-brand",
              expanded && "rotate-180",
            )}
          />
        </button>
      )}
    </div>
  );
}
