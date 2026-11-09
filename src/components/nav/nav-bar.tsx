"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useScroll, useTransform } from "motion/react";
import { useLenis } from "lenis/react";
import { CaretDownIcon } from "@phosphor-icons/react";
import { cn } from "@/lib/cn";
import { useMediaQuery } from "@/hooks/use-media-query";
import { minWidth } from "@/theme/breakpoints";
import { timing, transition } from "@/theme/motion";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/layout/section";
import { DropdownMenu, MegaMenu } from "@/components/nav/menus";
import { HamburgerButton, MobileMenu } from "@/components/nav/mobile-menu";
import { type LinkData, type NavAction, type NavItem } from "@/components/nav/types";

export type NavBarProps = {
  brand: { src: string; alt: string; href: string; width: number; height: number };
  items: NavItem[];
  /** Text link before the action buttons (e.g. "Log in") */
  utilityLink?: LinkData;
  actions: NavAction[];
  /** Accessible names: the nav landmark, the logo link and the menu button */
  labels: { nav: string; home: string; openMenu: string; closeMenu: string };
  /** Pixels of scroll before the bar switches to its scrolled style */
  scrolledAfter?: number;
};

/**
 * Fixed pill navigation bar.
 * Desktop (≥ nav breakpoint): menus open on hover with a short close delay,
 * or on click/tap/keyboard; Escape closes and returns focus; one menu at a time.
 * Mobile: hamburger opens a grouped menu built from the same data.
 */
export function NavBar({
  brand,
  items,
  utilityLink,
  actions,
  labels,
  scrolledAfter = 40,
}: NavBarProps) {
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const closeTimer = useRef<number | undefined>(undefined);
  const triggers = useRef<Record<string, HTMLButtonElement | null>>({});
  const navRef = useRef<HTMLElement>(null);
  const hamburgerRef = useRef<HTMLButtonElement>(null);
  const hoverable = useMediaQuery("(hover: hover)");
  const desktop = useMediaQuery(minWidth("nav"));
  const lenis = useLenis();
  const baseId = useId();
  const mobileId = `${baseId}-mobile`;
  const menuId = (label: string) => `${baseId}-${label.replace(/\W+/g, "-")}`;

  // Bar background darkens once the page has scrolled a little.
  const { scrollY } = useScroll();
  const barBg = useTransform(scrollY, (y) =>
    y > scrolledAfter ? "var(--nav-bg-scrolled)" : "var(--nav-bg)",
  );

  const cancelClose = () => window.clearTimeout(closeTimer.current);
  useEffect(() => cancelClose, []);
  const closeAll = useCallback(() => {
    cancelClose();
    setOpenMenu(null);
  }, []);

  // Escape closes the open menu and returns focus to its trigger; a click
  // anywhere outside the navigation closes everything.
  useEffect(() => {
    if (!openMenu) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      triggers.current[openMenu]?.focus();
      closeAll();
    };
    const onPointer = (e: PointerEvent) => {
      if (!navRef.current?.contains(e.target as Node)) closeAll();
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
    };
  }, [openMenu, closeAll]);

  // Mobile menu acts as a modal: page scroll is locked and the rest of the page
  // is `inert` (unreachable by Tab and screen readers) while it is open.
  useEffect(() => {
    if (!mobileOpen) return;
    const root = document.documentElement;
    root.style.overflow = "hidden";
    lenis?.stop();
    const header = navRef.current;
    const background = Array.from(header?.parentElement?.children ?? []).filter(
      (el): el is HTMLElement =>
        el instanceof HTMLElement && el !== header && !el.hasAttribute("data-nav-scrim"),
    );
    background.forEach((el) => (el.inert = true));
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && closeMobile();
    document.addEventListener("keydown", onKey);
    return () => {
      root.style.overflow = "";
      lenis?.start();
      background.forEach((el) => (el.inert = false));
      document.removeEventListener("keydown", onKey);
    };
  }, [mobileOpen, lenis]);

  /** Close the mobile menu and give focus back to the menu button. */
  function closeMobile() {
    setMobileOpen(false);
    hamburgerRef.current?.focus();
  }

  // Close the mobile menu once the desktop layout applies (render-time state adjustment).
  if (desktop && mobileOpen) setMobileOpen(false);

  function itemHandlers(id: string) {
    return {
      onMouseEnter: () => {
        if (!hoverable) return;
        cancelClose();
        setOpenMenu(id);
      },
      onMouseLeave: () => {
        if (!hoverable) return;
        cancelClose();
        closeTimer.current = window.setTimeout(
          () => setOpenMenu((cur) => (cur === id ? null : cur)),
          timing.menuCloseDelay,
        );
      },
      onBlur: (e: React.FocusEvent<HTMLLIElement>) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
          setOpenMenu((cur) => (cur === id ? null : cur));
        }
      },
    };
  }

  function onTriggerClick(e: React.MouseEvent, id: string) {
    cancelClose();
    // A real mouse click on a hover device keeps it open; taps and keyboard toggle.
    if (hoverable && e.detail > 0) setOpenMenu(id);
    else setOpenMenu((cur) => (cur === id ? null : id));
  }

  const anyOpen = mobileOpen || openMenu !== null;

  return (
    <>
      {/* Blurred scrim behind any open menu; clicking it closes the menu */}
      <AnimatePresence>
        {anyOpen && (
          <motion.div
            key="nav-scrim"
            data-nav-scrim
            aria-hidden
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={transition.menu}
            onClick={() => {
              closeAll();
              if (mobileOpen) closeMobile();
            }}
            className="fixed inset-0 z-40 bg-scrim backdrop-blur-scrim"
          />
        )}
      </AnimatePresence>

      <header
        ref={navRef}
        className="pointer-events-none fixed inset-x-0 top-0 z-50 pt-[max(1rem,env(safe-area-inset-top))] pb-4"
      >
        <Container>
          <motion.nav
            aria-label={labels.nav}
            style={{ backgroundColor: barBg }}
            className="pointer-events-auto relative flex min-h-16 items-center gap-3 rounded-full border border-border py-2 pr-2.5 pl-5 transition-colors duration-300 nav:gap-4 2xl:gap-5 2xl:pl-5.5"
          >
            <Link href={brand.href} aria-label={labels.home} className="shrink-0">
              <Image
                src={brand.src}
                alt={brand.alt}
                width={brand.width}
                height={brand.height}
                preload
                className="h-6.5 w-auto sm:h-7.5"
              />
            </Link>

            <ul className="mx-auto hidden items-center gap-0.5 nav:flex 2xl:gap-1">
              {items.map((item) => {
                if (item.kind === "link") {
                  return (
                    <li key={item.label}>
                      <Link
                        href={item.href}
                        className="flex min-h-11 items-center rounded-full px-2.5 text-base font-medium text-muted no-underline transition-colors duration-200 hover:bg-fill-5 hover:text-foreground 2xl:px-3"
                      >
                        {item.label}
                      </Link>
                    </li>
                  );
                }
                const open = openMenu === item.label;
                return (
                  <li
                    key={item.label}
                    className={item.kind === "mega" ? "static" : "relative"}
                    {...itemHandlers(item.label)}
                  >
                    <button
                      ref={(el) => {
                        triggers.current[item.label] = el;
                      }}
                      type="button"
                      aria-expanded={open}
                      aria-controls={menuId(item.label)}
                      onClick={(e) => onTriggerClick(e, item.label)}
                      onMouseOver={() => hoverable && !open && setOpenMenu(item.label)}
                      className={cn(
                        "flex min-h-11 items-center gap-1.5 rounded-full px-2.5 text-base font-medium transition-colors duration-200 2xl:px-3",
                        open
                          ? "bg-fill-5 text-foreground"
                          : "text-muted hover:bg-fill-5 hover:text-foreground",
                      )}
                    >
                      {item.label}
                      <CaretDownIcon
                        aria-hidden
                        className={cn(
                          "size-3 opacity-70 transition-transform duration-250 ease-brand",
                          open && "rotate-180",
                        )}
                      />
                    </button>
                    {item.kind === "mega" ? (
                      <MegaMenu
                        {...item.menu}
                        id={menuId(item.label)}
                        open={open}
                        onNavigate={closeAll}
                      />
                    ) : (
                      <DropdownMenu
                        links={item.links}
                        id={menuId(item.label)}
                        open={open}
                        onNavigate={closeAll}
                      />
                    )}
                  </li>
                );
              })}
            </ul>

            <div className="ml-auto flex shrink-0 items-center gap-2 nav:ml-0">
              {utilityLink && (
                <Link
                  href={utilityLink.href}
                  className="hidden min-h-11 items-center px-3 text-base font-medium text-muted no-underline transition-colors hover:text-foreground nav:flex"
                >
                  {utilityLink.label}
                </Link>
              )}
              {actions.map((a) => (
                <Button
                  key={a.label}
                  href={a.href}
                  variant={a.variant}
                  size="sm"
                  className={
                    a.variant === "ghost" ? "hidden nav:inline-flex" : "hidden sm:inline-flex"
                  }
                >
                  {a.label}
                </Button>
              ))}
              <HamburgerButton
                ref={hamburgerRef}
                labels={{ open: labels.openMenu, close: labels.closeMenu }}
                open={mobileOpen}
                onToggle={() => setMobileOpen((o) => !o)}
                controls={mobileId}
                className="nav:hidden"
              />
            </div>
          </motion.nav>

          <AnimatePresence>
            {mobileOpen && !desktop && (
              <MobileMenu
                id={mobileId}
                items={items}
                extraLinks={utilityLink ? [utilityLink] : []}
                actions={actions}
                onNavigate={() => setMobileOpen(false)}
              />
            )}
          </AnimatePresence>
        </Container>
      </header>
    </>
  );
}
