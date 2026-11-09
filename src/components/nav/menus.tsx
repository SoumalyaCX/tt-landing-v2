"use client";

/** Desktop navigation menus: MenuLinkItem, MenuPopover, DropdownMenu and MegaMenu. */

import { useId, useRef, useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRightIcon } from "@phosphor-icons/react";
import { cn } from "@/lib/cn";
import { rovingIndex } from "@/lib/roving-index";
import { duration, ease, transition } from "@/theme/motion";
import { IconTile } from "@/components/ui/surfaces";
import { type MegaCategory, type MegaMenuData, type MenuLink } from "@/components/nav/types";

/* ---- MenuLinkItem ---------------------------------------------------------- */

export type MenuLinkItemProps = MenuLink & {
  /** Compact row without description (industry lists) */
  slim?: boolean;
  onNavigate?: () => void;
  className?: string;
};

/** Icon tile + title + optional description; used in dropdowns and mega menus. */
export function MenuLinkItem({
  label,
  desc,
  href,
  icon,
  slim,
  onNavigate,
  className,
}: MenuLinkItemProps) {
  return (
    <Link
      href={href}
      onClick={onNavigate}
      className={cn(
        "group flex min-w-0 gap-3 rounded-xl px-3 text-muted no-underline transition-colors duration-150 hover:bg-fill-5 hover:text-foreground focus-visible:bg-fill-5",
        slim ? "items-center py-1.75" : "items-start py-2.5",
        className,
      )}
    >
      <IconTile size={slim ? "xs" : "sm"} tone="neutral">
        {icon}
      </IconTile>
      <span className="min-w-0">
        <b className="block text-md leading-tight font-semibold text-foreground">{label}</b>
        {desc && <span className="mt-0.75 block text-xs leading-snug text-dim">{desc}</span>}
      </span>
    </Link>
  );
}

/* ---- MenuPopover ----------------------------------------------------------- */

export type MenuPopoverProps = {
  open: boolean;
  /** For the trigger's `aria-controls` */
  id?: string;
  className?: string;
  children: React.ReactNode;
};

/**
 * Shared open/close animation for dropdowns and mega menus. It stays mounted
 * (links stay crawlable and tab selection is kept); when closed it is hidden
 * and `inert`, so it can't be focused or clicked.
 */
export function MenuPopover({ open, id, className, children }: MenuPopoverProps) {
  return (
    <motion.div
      id={id}
      inert={!open}
      initial={false}
      animate={
        open
          ? { opacity: 1, y: 0, visibility: "visible" }
          : { opacity: 0, y: -6, transitionEnd: { visibility: "hidden" } }
      }
      transition={transition.menu}
      className={cn("absolute z-10", className)}
    >
      {children}
    </motion.div>
  );
}

/* ---- DropdownMenu ---------------------------------------------------------- */

export type DropdownMenuProps = {
  links: MenuLink[];
  open: boolean;
  id?: string;
  onNavigate?: () => void;
};

/** Small menu under a nav trigger. The top padding bridges the hover gap. */
export function DropdownMenu({ links, open, id, onNavigate }: DropdownMenuProps) {
  return (
    <MenuPopover open={open} id={id} className="top-full -left-2 pt-4.5">
      <div className="grid w-82.5 gap-0.5 rounded-card border border-border-strong bg-popover p-2 shadow-popover">
        {links.map((link) => (
          <MenuLinkItem key={link.label + link.href} {...link} onNavigate={onNavigate} />
        ))}
      </div>
    </MenuPopover>
  );
}

/* ---- MegaMenu -------------------------------------------------------------- */

export type MegaMenuProps = MegaMenuData & {
  open: boolean;
  id?: string;
  onNavigate?: () => void;
};

/**
 * Full-width flyout: a vertical tab rail of categories and the selected
 * category's links. Hover, focus or click selects a tab; arrow keys, Home and
 * End move between tabs. The selection is kept between openings.
 */
export function MegaMenu({
  railLabel,
  ariaLabel,
  compact,
  categories,
  open,
  id,
  onNavigate,
}: MegaMenuProps) {
  const [active, setActive] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const baseId = useId();

  function onKeyDown(e: React.KeyboardEvent, index: number) {
    const next = rovingIndex(e.key, index, categories.length);
    if (next === null) return;
    e.preventDefault();
    setActive(next);
    tabs.current[next]?.focus();
  }

  return (
    <MenuPopover open={open} id={id} className="inset-x-0 top-full pt-2.5">
      <div
        className={cn(
          "grid overflow-hidden rounded-3xl border border-border-strong bg-popover shadow-popover",
          compact
            ? "grid-cols-[17rem_minmax(0,1fr)] 2xl:grid-cols-[18.75rem_minmax(0,1fr)]"
            : "grid-cols-[13.75rem_minmax(0,1fr)] 2xl:grid-cols-[16.25rem_minmax(0,1fr)]",
        )}
      >
        {/* Rail */}
        <div
          role="tablist"
          aria-orientation="vertical"
          aria-label={ariaLabel}
          className="border-r border-border bg-rail px-3.5 py-5.5"
        >
          <div className="px-3 pb-3 text-sm font-semibold tracking-label text-accent">
            {railLabel}
          </div>
          {categories.map((cat, i) => {
            const selected = i === active;
            return (
              <button
                key={cat.label}
                ref={(el) => {
                  tabs.current[i] = el;
                }}
                type="button"
                role="tab"
                id={`${baseId}-tab-${i}`}
                aria-selected={selected}
                aria-controls={`${baseId}-panel-${i}`}
                tabIndex={selected ? 0 : -1}
                data-active={selected}
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                onClick={() => setActive(i)}
                onKeyDown={(e) => onKeyDown(e, i)}
                className={cn(
                  "group flex w-full items-center gap-3 rounded-2xl border px-3 text-left transition-colors duration-150",
                  compact ? "mt-0.5 py-1.75" : "mt-1 py-2.25",
                  selected ? "border-sky/30 bg-sky/8" : "border-transparent hover:bg-fill-4",
                )}
              >
                <IconTile size="sm" tone="neutral">
                  {cat.icon}
                </IconTile>
                <span className="min-w-0">
                  <b
                    className={cn(
                      "block text-base leading-tight font-semibold",
                      selected ? "text-foreground" : "text-muted",
                    )}
                  >
                    {cat.label}
                  </b>
                  {!compact && <span className="mt-0.5 block text-xs text-dim">{cat.sub}</span>}
                </span>
              </button>
            );
          })}
        </div>

        {/* Panels — stacked in one grid cell so the menu height never jumps */}
        <div
          className="my-2 mr-1.5 grid scrollbar-thin max-h-[calc(100svh-9rem)] overflow-y-auto overscroll-contain py-3.5 pr-5 pl-7"
          data-lenis-prevent
        >
          {categories.map((cat, i) => (
            <MegaPanel
              key={cat.label}
              category={cat}
              id={`${baseId}-panel-${i}`}
              labelledBy={`${baseId}-tab-${i}`}
              visible={i === active}
              onNavigate={onNavigate}
            />
          ))}
        </div>
      </div>
    </MenuPopover>
  );
}

function MegaPanel({
  category,
  id,
  labelledBy,
  visible,
  onNavigate,
}: {
  category: MegaCategory;
  id: string;
  labelledBy: string;
  visible: boolean;
  onNavigate?: () => void;
}) {
  const grouped = Boolean(category.groups);
  return (
    <motion.div
      id={id}
      role="tabpanel"
      aria-labelledby={labelledBy}
      inert={!visible}
      initial={false}
      animate={
        visible
          ? { opacity: 1, visibility: "visible" }
          : { opacity: 0, transitionEnd: { visibility: "hidden" } }
      }
      transition={{ duration: duration.fast, ease: ease.brand }}
      className={cn(
        "col-start-1 row-start-1 grid content-start",
        grouped ? "grid-cols-3 gap-x-4.5" : "grid-cols-2 gap-x-6 gap-y-0.5",
      )}
    >
      {category.showHead && (
        <p className="col-span-full mx-3 mb-3.5 grid gap-1 border-b border-border pb-4">
          <b className="text-xl font-light tracking-snug text-strong">{category.label}</b>
          <span className="text-sm text-muted">{category.sub}</span>
        </p>
      )}
      {category.links?.map((link) => (
        <MenuLinkItem key={link.href} {...link} onNavigate={onNavigate} />
      ))}
      {category.groups?.map((group) => (
        <div key={group.label} className="min-w-0">
          <p className="mx-3 mb-2 border-b border-border pb-2.5 text-sm font-semibold text-accent">
            {group.label}
          </p>
          {group.links.map((link) => (
            <MenuLinkItem key={link.href} {...link} slim onNavigate={onNavigate} />
          ))}
        </div>
      ))}
      {category.more && (
        <Link
          href={category.more.href}
          onClick={onNavigate}
          className="group col-span-full mx-3 mt-2.5 inline-flex w-fit items-center gap-2 pt-3.5 text-sm font-semibold text-accent no-underline"
        >
          {category.more.label}
          <ArrowRightIcon className="size-3.5 transition-transform duration-200 group-hover:translate-x-0.75" />
        </Link>
      )}
    </motion.div>
  );
}
