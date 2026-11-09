/** Content cards: StatCard, AccentCard, Testimonial and SignalColumn. */

import { cn } from "@/lib/cn";
import { Card, IconTile, Surface } from "@/components/ui/surfaces";
import { type ColorToken, gradientOf } from "@/theme/colors";
import { Avatar } from "@/components/ui/avatar";
import { Heading } from "@/components/ui/typography";

/* ---- StatCard -------------------------------------------------------------- */

export type StatCardProps = {
  /** Headline number, e.g. "2.1×" (may contain markup such as a smaller "vs") */
  value: React.ReactNode;
  title?: React.ReactNode;
  body: React.ReactNode;
  icon?: React.ReactNode;
  /** Large highlighted card: bigger value, icon top-left, content at the bottom */
  featured?: boolean;
  /** `gradient` = soft white gradient value, `plain` = solid text value (larger) */
  valueStyle?: "gradient" | "plain";
  className?: string;
};

/** A big number with a title and explanation (profit and trust stats). */
export function StatCard({
  value,
  title,
  body,
  icon,
  featured = false,
  valueStyle = "gradient",
  className,
}: StatCardProps) {
  return (
    <Card
      as="article"
      variant={featured ? "featured" : "subtle"}
      padding={featured ? "xl" : valueStyle === "plain" ? "lg" : "md"}
      interactive={!featured}
      className={cn(
        "grid content-start gap-2",
        valueStyle === "plain" && "gap-3",
        featured && "min-h-75 content-end pt-24 sm:pt-28",
        className,
      )}
    >
      {icon && (
        <IconTile
          size={featured ? "xl" : "md"}
          className={cn(
            "absolute",
            featured ? "top-6 left-6 sm:top-7.5 sm:left-8" : "top-5 right-5",
          )}
        >
          {icon}
        </IconTile>
      )}
      <b
        aria-hidden={title ? true : undefined}
        className={cn(
          "block font-light",
          valueStyle === "gradient"
            ? "text-gradient-stat tracking-tighter"
            : "tracking-tightest text-foreground",
          featured ? "text-stat-xl" : valueStyle === "plain" ? "text-stat-lg" : "text-stat",
          icon && !featured && "pr-13",
        )}
      >
        {value}
      </b>
      {title && (
        <h3
          className={cn(
            "font-semibold tracking-normal",
            featured ? "text-xl leading-snug" : "text-control leading-snug",
          )}
        >
          {/* the heading carries the figure too, so it makes sense on its own */}
          <span className="sr-only">{value} </span>
          {title}
        </h3>
      )}
      <p className={cn("text-muted", valueStyle === "plain" ? "text-base" : "text-md")}>{body}</p>
    </Card>
  );
}

/* ---- AccentCard ------------------------------------------------------------ */

export type AccentCardProps = {
  title: React.ReactNode;
  body: React.ReactNode;
  /** Colors of the short accent bar, left → right */
  accent: readonly ColorToken[];
  className?: string;
};

/** Card with a short colored bar above the title. */
export function AccentCard({ title, body, accent, className }: AccentCardProps) {
  return (
    <Card as="article" variant="subtle" className={cn("grid content-start gap-2.5", className)}>
      <span
        aria-hidden
        className="mb-1.5 block h-1 w-8.5 rounded-xs"
        style={{ backgroundImage: gradientOf(accent) }}
      />
      <Heading as="h3" size="xl" className="tracking-slight">
        {title}
      </Heading>
      <p className="text-base text-muted">{body}</p>
    </Card>
  );
}

/* ---- Testimonial ----------------------------------------------------------- */

export type TestimonialProps = {
  quote: React.ReactNode;
  name: string;
  role: React.ReactNode;
  initials: string;
  featured?: boolean;
  className?: string;
};

export function Testimonial({
  quote,
  name,
  role,
  initials,
  featured = false,
  className,
}: TestimonialProps) {
  return (
    <Card
      as="figure"
      variant="glass"
      padding="none"
      className={cn("m-0 grid content-between gap-6 p-6 sm:p-7.5", className)}
    >
      <blockquote
        className={cn(
          "m-0 text-foreground",
          featured ? "text-quote-lg font-light tracking-slight" : "text-quote",
        )}
      >
        {quote}
      </blockquote>
      <figcaption className="flex items-center gap-3 text-ui text-muted">
        <Avatar initials={initials} look="gradient" size="lg" />
        <span className="min-w-0">
          <b className="block font-semibold text-foreground">{name}</b>
          {role}
        </span>
      </figcaption>
    </Card>
  );
}

/* ---- SignalColumn ---------------------------------------------------------- */

export type SignalColumnProps = {
  /** `warm` = burnout side (coral), `cool` = drift side (blue) */
  tone: "warm" | "cool";
  /** Small label above the title, e.g. "Over-worked end" */
  label: string;
  title: string;
  signals: { direction: "up" | "down"; text: string }[];
  /** Screen-reader words for the ↑ / ↓ arrows */
  directionLabels: { up: string; down: string };
  /** Highlighted box at the bottom */
  note: { title: string; text: string };
  className?: string;
};

/** A titled list of rising/falling signals with a recommendation box. */
export function SignalColumn({
  tone,
  label,
  title,
  signals,
  directionLabels,
  note,
  className,
}: SignalColumnProps) {
  return (
    <div
      className={cn(
        "grid min-w-0 content-start gap-3 rounded-glass border border-border p-6 sm:p-7",
        tone === "warm" ? "bg-col-warm" : "bg-col-cool",
        className,
      )}
    >
      <p className="text-sm font-semibold text-muted">{label}</p>
      <Heading as="h3" size="h3-sm">
        {title}
      </Heading>
      <ul className="grid">
        {signals.map((s) => (
          <li key={s.text} className="flex gap-3 border-t border-border py-3 text-base">
            <b
              aria-hidden
              className={cn(
                "w-5 shrink-0 text-center",
                tone === "warm" ? "text-coral-200" : "text-volt-100",
              )}
            >
              {s.direction === "up" ? "↑" : "↓"}
            </b>
            <span className="min-w-0">
              <span className="sr-only">{directionLabels[s.direction]}: </span>
              {s.text}
            </span>
          </li>
        ))}
      </ul>
      <Surface tone="leaf" radius="xl" padding="lg" className="mt-1.5 text-md text-muted">
        <p className="mb-1.5 text-xs font-bold text-leaf">{note.title}</p>
        {note.text}
      </Surface>
    </div>
  );
}
