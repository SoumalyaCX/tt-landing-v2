import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

const avatarVariants = cva(
  "inline-grid shrink-0 place-items-center rounded-full leading-none font-bold select-none",
  {
    variants: {
      size: {
        xs: "size-5 text-4xs",
        sm: "size-6 text-4xs",
        md: "size-6.5 text-3xs",
        lg: "size-11 text-ui",
      },
      look: {
        /** Tinted by the person's hue, with a dark ring (dashboards) */
        hue: "avatar-hue ring-2 ring-avatar-ring",
        /** Brand gradient (testimonials) */
        gradient: "bg-avatar text-strong",
      },
    },
    defaultVariants: { size: "md", look: "hue" },
  },
);

export type AvatarProps = Omit<React.ComponentProps<"span">, "children"> &
  VariantProps<typeof avatarVariants> & {
    initials: string;
    /** 0–360 hue for the `hue` look */
    hue?: number;
    /** Accessible name; omit when the name is printed next to the avatar */
    label?: string;
  };

export function Avatar({
  initials,
  hue = 220,
  size,
  look,
  label,
  className,
  style,
  ...props
}: AvatarProps) {
  return (
    <span
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      className={cn(avatarVariants({ size, look }), className)}
      style={{ ...style, "--h": hue } as React.CSSProperties}
      {...props}
    >
      {initials}
    </span>
  );
}

export type AvatarStackProps = {
  people: { initials: string; hue?: number; name?: string }[];
  size?: AvatarProps["size"];
  className?: string;
};

/** Overlapping avatars (task assignees). */
export function AvatarStack({ people, size = "xs", className }: AvatarStackProps) {
  return (
    <span className={cn("inline-flex", className)}>
      {people.map((p, i) => (
        <Avatar
          key={p.initials + i}
          initials={p.initials}
          hue={p.hue}
          label={p.name}
          size={size}
          className={i > 0 ? "-ml-1" : undefined}
        />
      ))}
    </span>
  );
}
