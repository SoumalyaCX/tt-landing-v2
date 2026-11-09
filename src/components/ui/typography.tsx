import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

const headingVariants = cva("font-light text-balance", {
  variants: {
    size: {
      display: "text-display tracking-tightest",
      h2: "text-h2 tracking-tight",
      "h3-lg": "text-h3-lg tracking-tight",
      h3: "text-h3 tracking-tight",
      "h3-sm": "text-h3-sm tracking-tight",
      xl: "text-xl font-medium tracking-snug",
    },
    gradient: {
      none: "",
      ink: "text-ink",
    },
  },
  defaultVariants: { size: "h2", gradient: "none" },
});

/** Section, card and hero headings on the theme type scale. */
export type HeadingProps = React.ComponentProps<"h2"> &
  VariantProps<typeof headingVariants> & {
    as?: "h1" | "h2" | "h3" | "h4" | "p" | "span";
  };

export function Heading({ as: Tag = "h2", size, gradient, className, ...props }: HeadingProps) {
  return <Tag className={cn(headingVariants({ size, gradient }), className)} {...props} />;
}

/** Small sky label used above section titles and inside cards. */
export function Eyebrow({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p className={cn("text-ui font-semibold tracking-label text-accent", className)} {...props} />
  );
}

/** Intro paragraph under a heading. */
export function Lede({ className, ...props }: React.ComponentProps<"p">) {
  return <p className={cn("max-w-lede text-lede text-muted", className)} {...props} />;
}
