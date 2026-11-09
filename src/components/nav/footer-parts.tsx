/** Footer pieces: SocialLink and LegalBar. */

import Link from "next/link";
import { type LinkData, type SocialLinkData } from "@/components/nav/types";
import { Container } from "@/components/layout/section";

/* ---- SocialLink ------------------------------------------------------------ */

/** Square icon link to a social profile. */
export function SocialLink({ label, href, icon }: SocialLinkData) {
  return (
    <Link
      href={href}
      aria-label={label}
      className="grid size-12 place-items-center rounded-xl border border-border-strong bg-fill-3 text-muted transition-[color,background-color,border-color,transform] duration-200 ease-brand hover:-translate-y-0.5 hover:border-sky/50 hover:bg-sky/10 hover:text-strong [&_svg]:size-5"
    >
      {icon}
    </Link>
  );
}

/* ---- LegalBar -------------------------------------------------------------- */

export type LegalBarProps = {
  copyright: string;
  links: LinkData[];
  /** Name of the legal-links navigation landmark */
  ariaLabel: string;
};

/** Bottom strip: copyright on one side, legal links (with dividers on wide screens) on the other. */
export function LegalBar({ copyright, links, ariaLabel }: LegalBarProps) {
  return (
    <div className="mt-12 border-t border-border pt-6.5 pb-[calc(1.625rem+env(safe-area-inset-bottom))] text-sm text-muted md:mt-18">
      <Container className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3.5">
        <span>{copyright}</span>
        <nav aria-label={ariaLabel} className="flex flex-wrap gap-x-5.5 gap-y-2.5 md:gap-0">
          {links.map((l) => (
            <Link
              key={l.label}
              href={l.href}
              className="text-muted no-underline transition-colors hover:text-foreground md:border-l md:border-border-strong md:px-4.5 md:first:border-l-0 md:first:pl-0 md:last:pr-0"
            >
              {l.label}
            </Link>
          ))}
        </nav>
      </Container>
    </div>
  );
}
