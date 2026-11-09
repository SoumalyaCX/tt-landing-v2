/** Boxes: Card, Surface (flat tinted box), Callout and IconTile. */

import { type VariantProps, cva } from "class-variance-authority";
import { cn } from "@/lib/cn";
import { Dot } from "@/components/ui/indicators";

/* ---- Card ------------------------------------------------------------------ */

export const cardVariants = cva("relative min-w-0 border", {
  variants: {
    variant: {
      /** Frosted gradient card with soft top light */
      glass: "rounded-glass border-border-strong bg-glass shadow-glass",
      /** Barely-there fill, used for stat and info cards */
      subtle: "rounded-card border-border bg-fill-1",
      /** Darker inset panel for dashboards */
      panel: "rounded-2xl border-border bg-inset-panel shadow-inset",
      /** Small tile inside dashboards */
      tile: "rounded-2xl border-border bg-fill-3",
      /** Highlighted card with a radial light in the corner */
      featured: "rounded-card border-border-strong bg-featured",
    },
    padding: {
      none: "",
      md: "p-6",
      lg: "p-7",
      xl: "p-6 sm:p-8",
    },
    interactive: {
      true: "transition-colors duration-300 ease-brand hover:border-border-strong",
      false: "",
    },
  },
  defaultVariants: { variant: "subtle", padding: "md", interactive: false },
});

export type CardProps = React.HTMLAttributes<HTMLElement> &
  VariantProps<typeof cardVariants> & {
    as?: "div" | "article" | "figure" | "aside" | "li";
  };

export function Card({
  as: Tag = "div",
  variant,
  padding,
  interactive,
  className,
  ...props
}: CardProps) {
  return (
    <Tag className={cn(cardVariants({ variant, padding, interactive }), className)} {...props} />
  );
}

/* ---- Surface --------------------------------------------------------------- */

/** Flat tinted box: task tiles, "now" rows, warnings, playbook items, mock-up cards. */
export const surfaceVariants = cva("min-w-0 border border-border", {
  variants: {
    tone: {
      neutral: "bg-fill-4",
      fill: "bg-fill-2",
      "sky-strong": "bg-sky/16",
      leaf: "bg-leaf/10",
      well: "bg-well",
    },
    radius: {
      lg: "rounded-lg",
      xl: "rounded-xl",
    },
    padding: {
      none: "",
      sm: "px-3 py-2",
      md: "p-3",
      lg: "px-4 py-3.5",
    },
  },
  defaultVariants: { tone: "neutral", radius: "lg", padding: "md" },
});

export type SurfaceProps = React.HTMLAttributes<HTMLElement> &
  VariantProps<typeof surfaceVariants> & { as?: "div" | "li" | "span" };

export function Surface({
  as: Tag = "div",
  tone,
  radius,
  padding,
  className,
  ...props
}: SurfaceProps) {
  return <Tag className={cn(surfaceVariants({ tone, radius, padding }), className)} {...props} />;
}

/* ---- Callout --------------------------------------------------------------- */

const calloutVariants = cva("flex min-w-0 items-start border border-border", {
  variants: {
    tone: {
      blue: "bg-fill-5",
      green: "bg-leaf/12",
      amber: "bg-amber/14 text-amber-100",
    },
    size: {
      sm: "gap-2.5 rounded-lg p-3 text-sm",
      md: "gap-3 rounded-2xl px-5.5 py-5 text-base leading-relaxed text-muted",
    },
  },
  defaultVariants: { tone: "blue", size: "md" },
});

const dotColor = { blue: "volt", green: "leaf", amber: "amber" } as const;

export type CalloutProps = VariantProps<typeof calloutVariants> & {
  title?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
};

/** Note / warning box with a glowing dot. */
export function Callout({ tone = "blue", size = "md", title, children, className }: CalloutProps) {
  return (
    <div className={cn(calloutVariants({ tone, size }), className)}>
      <Dot
        color={dotColor[tone ?? "blue"]}
        size={size === "md" ? "lg" : "md"}
        glow
        className={size === "md" ? "mt-1.75" : "mt-1.5"}
      />
      <p className="min-w-0">
        {title && <b className="font-semibold text-foreground">{title} </b>}
        {children}
      </p>
    </div>
  );
}

/* ---- IconTile -------------------------------------------------------------- */

const iconTileVariants = cva("grid shrink-0 place-items-center border [&_svg]:shrink-0", {
  variants: {
    size: {
      xs: "size-7.5 rounded-md [&_svg]:size-4", // 30 — slim menu links, status
      sm: "size-8.5 rounded-md [&_svg]:size-4.25", // 34 — menu links
      md: "size-10.5 rounded-lg [&_svg]:size-5.75", // 42 — stat cards
      lg: "size-11.5 rounded-xl [&_svg]:size-6.75", // 46 — feature items
      xl: "size-15 rounded-2xl [&_svg]:size-8", // 60 — featured stat card
    },
    tone: {
      /** Brand-gradient icon on a faint tile */
      gradient: "border-border bg-fill-5 icon-gradient",
      /** Muted icon that lights up sky on hover/selection (menus) */
      neutral:
        "border-border bg-fill-4 text-muted transition-colors duration-150 group-hover:border-sky/40 group-hover:bg-sky/10 group-hover:text-accent group-data-[active=true]:border-sky/40 group-data-[active=true]:bg-sky/10 group-data-[active=true]:text-accent",
      leaf: "border-transparent bg-leaf/14 text-leaf",
    },
  },
  defaultVariants: { size: "lg", tone: "gradient" },
});

export type IconTileProps = React.ComponentProps<"span"> & VariantProps<typeof iconTileVariants>;

/** A square tile holding one icon. Pass the icon as children. */
export function IconTile({ size, tone, className, ...props }: IconTileProps) {
  return (
    <span aria-hidden className={cn(iconTileVariants({ size, tone }), className)} {...props} />
  );
}
