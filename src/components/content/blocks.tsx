/** Content blocks: FeatureItem, NumberedPoint and FeatureSplit. */

import { cn } from "@/lib/cn";
import { IconTile } from "@/components/ui/surfaces";
import { Eyebrow, Heading } from "@/components/ui/typography";

/* ---- FeatureItem ----------------------------------------------------------- */

export type FeatureItemProps = {
  icon: React.ReactNode;
  title: React.ReactNode;
  body: React.ReactNode;
  className?: string;
};

/** Icon + bold title + supporting text, separated by a top rule. */
export function FeatureItem({ icon, title, body, className }: FeatureItemProps) {
  return (
    <li
      className={cn(
        "grid grid-cols-[auto_minmax(0,1fr)] items-start gap-4 border-t border-border py-4 text-base text-muted",
        className,
      )}
    >
      <IconTile size="lg" tone="gradient">
        {icon}
      </IconTile>
      <span className="grid gap-1">
        <b className="text-body font-semibold text-foreground">{title}</b>
        {body}
      </span>
    </li>
  );
}

/* ---- NumberedPoint --------------------------------------------------------- */

export type NumberedPointProps = {
  num: string;
  title: React.ReactNode;
  body: React.ReactNode;
  className?: string;
};

/** "01 / title / text" item with a top rule. */
export function NumberedPoint({ num, title, body, className }: NumberedPointProps) {
  return (
    <li className={cn("grid content-start gap-2.5 border-t border-border pt-5", className)}>
      <span className="text-sm font-bold text-accent">{num}</span>
      <Heading as="h3" size="xl">
        {title}
      </Heading>
      <p className="text-base text-muted">{body}</p>
    </li>
  );
}

/* ---- FeatureSplit ---------------------------------------------------------- */

export type FeatureSplitProps = {
  eyebrow: string;
  title: React.ReactNode;
  body: React.ReactNode;
  /** Visual shown beside the copy (a mock-up, image, chart…) */
  visual: React.ReactNode;
  className?: string;
};

/** Copy on one side, a visual on the other; stacks on narrower screens. */
export function FeatureSplit({ eyebrow, title, body, visual, className }: FeatureSplitProps) {
  return (
    <div
      className={cn(
        "grid items-center gap-7 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] xl:gap-14",
        className,
      )}
    >
      <div className="grid min-w-0 gap-4">
        <Eyebrow className="tracking-normal">{eyebrow}</Eyebrow>
        <Heading as="h3" size="h3-lg">
          {title}
        </Heading>
        <p className="text-body text-muted">{body}</p>
      </div>
      <div className="min-w-0">{visual}</div>
    </div>
  );
}
