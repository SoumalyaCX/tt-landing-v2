import Link from "next/link";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

export const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center gap-[0.55em] rounded-full font-semibold tracking-normal whitespace-nowrap no-underline transition-[transform,background-color,border-color,box-shadow] duration-250 ease-brand select-none disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        /** Voice-orb finish: spinning conic ring + breathing halo */
        primary: "orb hover:-translate-y-px active:translate-y-0 active:scale-98",
        ghost:
          "border border-border-ghost bg-fill-4 text-foreground duration-350 hover:border-border-ghost-hover hover:bg-fill-hover",
      },
      size: {
        md: "min-h-13 px-6.5 text-control",
        sm: "min-h-11 px-4.5 text-base",
        icon: "size-9.5 p-0",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

type ButtonVariantProps = VariantProps<typeof buttonVariants>;

type Common = ButtonVariantProps & {
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  className?: string;
  children?: React.ReactNode;
};

export type ButtonProps = Common &
  (
    | ({ href: string } & Omit<
        React.ComponentProps<typeof Link>,
        "href" | "className" | "children"
      >)
    | ({ href?: undefined } & Omit<React.ComponentProps<"button">, "className" | "children">)
  );

/** Renders a Next <Link> when `href` is given, otherwise a <button>. */
export function Button({
  variant,
  size,
  iconLeft,
  iconRight,
  className,
  children,
  ...props
}: ButtonProps) {
  const classes = cn(buttonVariants({ variant, size }), className);
  const content = (
    <>
      {iconLeft}
      {children}
      {iconRight}
    </>
  );

  if (props.href !== undefined) {
    return (
      <Link className={classes} {...(props as React.ComponentProps<typeof Link>)}>
        {content}
      </Link>
    );
  }
  const { type = "button", ...rest } = props as React.ComponentProps<"button">;
  return (
    <button type={type} className={classes} {...rest}>
      {content}
    </button>
  );
}
