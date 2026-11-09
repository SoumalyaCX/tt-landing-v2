/** Page layout: Container, Section and SectionHeader. */

import { cn } from "@/lib/cn";
import { Eyebrow, Heading, Lede } from "@/components/ui/typography";

/* ---- Container ------------------------------------------------------------- */

export type ContainerProps = React.HTMLAttributes<HTMLElement> & {
  as?: "div" | "nav" | "header" | "footer";
};

/** Centred page column: max 1240px wide with the theme gutter on each side. */
export function Container({ as: Tag = "div", className, ...props }: ContainerProps) {
  return (
    <Tag
      className={cn(
        "mx-auto w-[min(var(--container-page),calc(100%-2*var(--spacing-gutter)))]",
        className,
      )}
      {...props}
    />
  );
}

/* ---- Section --------------------------------------------------------------- */

export type SectionProps = React.ComponentProps<"section"> & {
  /** Vertical rhythm. `default` = theme section padding, `cta` = the taller
   *  closing-banner padding, `none` = no padding. */
  spacing?: "default" | "cta" | "none";
  /** Wrap children in the page Container (default true). */
  contained?: boolean;
  containerClassName?: string;
};

/** A page section: anchor offset for the fixed nav, theme spacing, page container. */
export function Section({
  spacing = "default",
  contained = true,
  className,
  containerClassName,
  children,
  ...props
}: SectionProps) {
  return (
    <section
      className={cn(
        "relative scroll-mt-nav",
        spacing === "default" && "py-section",
        spacing === "cta" && "pt-cta-top pb-cta-bottom",
        className,
      )}
      {...props}
    >
      {contained ? <Container className={containerClassName}>{children}</Container> : children}
    </section>
  );
}

/* ---- SectionHeader --------------------------------------------------------- */

export type SectionHeaderProps = {
  /** Small sky label above the title */
  eyebrow?: React.ReactNode;
  title: React.ReactNode;
  /** id for aria-labelledby on the parent section */
  titleId?: string;
  /** Larger supporting line directly under the title */
  subtitle?: React.ReactNode;
  lede?: React.ReactNode;
  align?: "left" | "center";
  as?: "h1" | "h2";
  /** Actions (buttons, toggles) rendered under the text */
  children?: React.ReactNode;
  className?: string;
  titleClassName?: string;
  ledeClassName?: string;
};

export function SectionHeader({
  eyebrow,
  title,
  titleId,
  subtitle,
  lede,
  align = "left",
  as = "h2",
  children,
  className,
  titleClassName,
  ledeClassName,
}: SectionHeaderProps) {
  const centered = align === "center";
  return (
    <div
      className={cn(
        "grid max-w-head min-w-0 grid-cols-1 gap-head-gap",
        centered && "mx-auto justify-items-center text-center",
        className,
      )}
    >
      {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
      <Heading as={as} id={titleId} size="h2" gradient="ink" className={titleClassName}>
        {title}
      </Heading>
      {subtitle && (
        <p className="-mt-1.5 text-sub font-medium tracking-slight text-foreground">{subtitle}</p>
      )}
      {lede && <Lede className={cn(centered && "mx-auto", ledeClassName)}>{lede}</Lede>}
      {children}
    </div>
  );
}
