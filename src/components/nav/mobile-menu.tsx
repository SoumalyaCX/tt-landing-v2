"use client";

/** Mobile navigation: MobileMenu and HamburgerButton. */

import Link from "next/link";
import { motion } from "motion/react";
import { cn } from "@/lib/cn";
import { duration, ease } from "@/theme/motion";
import { Button } from "@/components/ui/button";
import { type LinkData, type MenuLink, type NavAction, type NavItem } from "@/components/nav/types";

/* ---- MobileMenu ------------------------------------------------------------ */

export type MobileMenuProps = {
  id: string;
  items: NavItem[];
  /** Extra plain links (e.g. "Log in") listed after the plain nav links */
  extraLinks?: LinkData[];
  actions: NavAction[];
  onNavigate: () => void;
};

const linkBase =
  "flex min-h-11 items-center rounded-xl px-3.5 no-underline transition-colors duration-150 hover:bg-fill-5";

/** Grouped mobile navigation built from the same data as the desktop menus. */
export function MobileMenu({ id, items, extraLinks = [], actions, onNavigate }: MobileMenuProps) {
  const plain = [
    ...items.flatMap((item) =>
      item.kind === "link" ? [{ label: item.label, href: item.href }] : [],
    ),
    ...extraLinks,
  ];

  return (
    <motion.div
      id={id}
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: duration.menu, ease: ease.brand }}
      className="pointer-events-auto mt-2.5 overflow-hidden rounded-glass border border-border bg-menu py-2"
    >
      {/* Inner scroll area: inset from the rounded shell so the scrollbar stays inside */}
      <div
        data-lenis-prevent
        className="mr-1.5 scrollbar-thin max-h-[calc(100svh-8rem)] overflow-y-auto overscroll-contain py-1.5 pr-1.5 pb-[max(0.375rem,env(safe-area-inset-bottom))] pl-3.5"
      >
        {items.map((item) => {
          if (item.kind === "mega") {
            return (
              <Group key={item.label} title={item.label}>
                {item.menu.categories.map((cat) => (
                  <Disclosure key={cat.label} summary={cat.label}>
                    {cat.links && <SubLinks links={cat.links} onNavigate={onNavigate} />}
                    {cat.groups?.map((g) => (
                      <div key={g.label}>
                        <p className="mt-3 mb-1 ml-3.5 pl-3.5 text-xs font-semibold text-accent">
                          {g.label}
                        </p>
                        <SubLinks links={g.links} onNavigate={onNavigate} />
                      </div>
                    ))}
                  </Disclosure>
                ))}
              </Group>
            );
          }
          if (item.kind === "dropdown") {
            return (
              <Group key={item.label} title={item.label}>
                {item.links.map((l) => (
                  <Link
                    key={l.label}
                    href={l.href}
                    onClick={onNavigate}
                    className={cn(
                      linkBase,
                      "text-control font-medium text-muted hover:text-foreground",
                    )}
                  >
                    {l.label}
                  </Link>
                ))}
              </Group>
            );
          }
          return null;
        })}

        <div className="border-b border-border py-1.5">
          {plain.map((l) => (
            <Link
              key={l.label}
              href={l.href}
              onClick={onNavigate}
              className={cn(linkBase, "min-h-12 text-body font-medium text-foreground")}
            >
              {l.label}
            </Link>
          ))}
        </div>

        <div className="flex flex-wrap gap-2 px-1 pt-3.5 pb-0.5">
          {actions.map((a) => (
            <Button
              key={a.label}
              href={a.href}
              variant={a.variant}
              size="sm"
              onClick={onNavigate}
              className="min-w-36 flex-1"
            >
              {a.label}
            </Button>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border-b border-border pt-1.5 pb-2.5">
      <b className="block px-3.5 pt-2.5 pb-1 text-sm font-semibold tracking-label text-accent">
        {title}
      </b>
      {children}
    </div>
  );
}

function Disclosure({ summary, children }: { summary: string; children: React.ReactNode }) {
  return (
    <details className="group/d">
      <summary
        className={cn(
          linkBase,
          "cursor-pointer list-none justify-between gap-3 text-control font-medium text-muted group-open/d:text-foreground [&::-webkit-details-marker]:hidden",
        )}
      >
        {summary}
        <span
          aria-hidden
          className="mr-1 size-1.75 shrink-0 rotate-45 border-r-[1.5px] border-b-[1.5px] border-current transition-transform duration-200 ease-brand group-open/d:rotate-225"
        />
      </summary>
      <div className="pb-2">{children}</div>
    </details>
  );
}

function SubLinks({ links, onNavigate }: { links: MenuLink[]; onNavigate: () => void }) {
  return (
    <>
      {links.map((l) => (
        <Link
          key={l.href}
          href={l.href}
          onClick={onNavigate}
          className="ml-3.5 flex min-h-10 items-center rounded-r-lg border-l border-border pl-3.5 text-base text-dim no-underline transition-colors hover:bg-fill-5 hover:text-foreground"
        >
          {l.label}
        </Link>
      ))}
    </>
  );
}

/* ---- HamburgerButton ------------------------------------------------------- */

export type HamburgerButtonProps = {
  open: boolean;
  onToggle: () => void;
  controls: string;
  /** Accessible names for each state */
  labels: { open: string; close: string };
  ref?: React.Ref<HTMLButtonElement>;
  className?: string;
};

/** Three lines that morph into an ×. */
export function HamburgerButton({
  open,
  onToggle,
  controls,
  labels,
  ref,
  className,
}: HamburgerButtonProps) {
  const line =
    "absolute top-1/2 left-1/2 -mt-[0.75px] -ml-2 h-[1.5px] w-4 rounded-full bg-foreground transition-[transform,opacity] duration-250 ease-brand";
  return (
    <button
      ref={ref}
      type="button"
      aria-expanded={open}
      aria-controls={controls}
      aria-label={open ? labels.close : labels.open}
      onClick={onToggle}
      className={cn(
        "relative size-11 shrink-0 rounded-full border border-border-strong bg-fill-4",
        className,
      )}
    >
      <span aria-hidden className={cn(line, open ? "rotate-45" : "-translate-y-1.25")} />
      <span aria-hidden className={cn(line, open && "opacity-0")} />
      <span aria-hidden className={cn(line, open ? "-rotate-45" : "translate-y-1.25")} />
    </button>
  );
}
