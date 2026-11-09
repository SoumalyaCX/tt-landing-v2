/** Report tables: DataTable (+ ToneValue, SkillSummary) and its controls (FilterChips, SearchField, TableFooter, Pager). */

import { CaretDownIcon, MagnifyingGlassIcon } from "@phosphor-icons/react/ssr";
import { cn } from "@/lib/cn";
import { stagger } from "@/theme/motion";
import { Chip } from "@/components/ui/indicators";

/* ---- DataTable ------------------------------------------------------------- */

export type DataTableColumn = {
  label: string;
  /** Right-aligned, never wraps */
  numeric?: boolean;
  /** Full-strength text colour instead of muted (e.g. a name column) */
  strong?: boolean;
};

export type DataTableProps = {
  columns: DataTableColumn[];
  /** Cells may be plain text or any element (person labels, toned values…) */
  rows: React.ReactNode[][];
  className?: string;
};

/**
 * Report table. In wide frames it is a real table; in narrow frames each row
 * becomes a small card (first cell as the title, the rest as label/value
 * pairs), so it never needs sideways scrolling.
 */
export function DataTable({ columns, rows, className }: DataTableProps) {
  return (
    <div className={cn("min-w-0", className)}>
      {/* Wide: table */}
      <div className="hidden overflow-hidden rounded-lg border border-border @md:block">
        <table className="w-full border-collapse text-2xs tabular-nums">
          <thead>
            <tr>
              {columns.map((c) => (
                <th
                  key={c.label}
                  scope="col"
                  className={cn(
                    "bg-fill-3 px-2.25 py-1.75 font-semibold whitespace-nowrap text-dim",
                    c.numeric ? "text-right" : "text-left",
                  )}
                >
                  {c.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, r) => (
              <tr
                key={r}
                className="animate-blur-in"
                style={{ animationDelay: `${r * stagger.rows}s` }}
              >
                {row.map((cell, i) => {
                  // The first cell names the row.
                  const Cell = i === 0 ? "th" : "td";
                  return (
                    <Cell
                      key={i}
                      scope={i === 0 ? "row" : undefined}
                      className={cn(
                        "border-t border-border px-2.25 py-1.5 font-normal",
                        columns[i]?.strong ? "text-foreground" : "text-muted",
                        // numbers never wrap; text may wrap so the table always fits its frame
                        columns[i]?.numeric ? "text-right whitespace-nowrap" : "min-w-16 text-left",
                      )}
                    >
                      {cell}
                    </Cell>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Narrow: one card per row */}
      <ul className="grid gap-1.5 @md:hidden">
        {rows.map((row, r) => (
          <li
            key={r}
            className="grid animate-blur-in gap-1.5 rounded-lg border border-border bg-fill-3 px-3 py-2 text-2xs"
            style={{ animationDelay: `${r * stagger.rows}s` }}
          >
            <div className="text-xs text-foreground">{row[0]}</div>
            {/* text columns: full-width rows so long values can wrap */}
            {row.slice(1).some((_, i) => !columns[i + 1]?.numeric) && (
              <dl className="grid gap-0.5">
                {row.slice(1).map((cell, i) =>
                  columns[i + 1]?.numeric ? null : (
                    <div key={i} className="grid grid-cols-[4.5rem_minmax(0,1fr)] gap-2">
                      <dt className="text-dim">{columns[i + 1]?.label}</dt>
                      <dd className="text-muted">{cell}</dd>
                    </div>
                  ),
                )}
              </dl>
            )}
            {/* numeric columns: compact label/value grid */}
            <dl className="grid grid-cols-2 gap-x-3 gap-y-0.5 @xs:grid-cols-3">
              {row.slice(1).map((cell, i) =>
                columns[i + 1]?.numeric ? (
                  <div key={i} className="flex min-w-0 justify-between gap-2">
                    <dt className="truncate text-dim">{columns[i + 1]?.label}</dt>
                    <dd className="text-right whitespace-nowrap text-muted tabular-nums">{cell}</dd>
                  </div>
                ) : null,
              )}
            </dl>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Coloured value inside a table (e.g. overbooked hours in amber). */
export function ToneValue({ tone, children }: { tone: "hot" | "free"; children: React.ReactNode }) {
  return (
    <span className={cn("font-semibold", tone === "hot" ? "text-amber-200" : "text-sky-100")}>
      {children}
    </span>
  );
}

/** "React, TypeScript +9" style skill summary. */
export function SkillSummary({ skills, more }: { skills: string; more: string }) {
  return (
    <span className="text-foreground">
      {skills}
      <em className="ml-1 font-semibold text-volt-100 not-italic">{more}</em>
    </span>
  );
}

/* ---- ReportControls -------------------------------------------------------- */

/** Row of filter dropdown chips (decorative). */
export function FilterChips({ labels }: { labels: string[] }) {
  return (
    <div aria-hidden className="flex flex-wrap gap-1.5">
      {labels.map((l) => (
        <span
          key={l}
          className="inline-flex items-center gap-2 rounded-md border border-border-strong px-2.25 py-1 text-3xs text-muted [&_svg]:size-2.5"
        >
          {l}
          <CaretDownIcon />
        </span>
      ))}
    </div>
  );
}

/** Search box with selected tokens (decorative). */
export function SearchField({ label, tokens }: { label: string; tokens: string[] }) {
  return (
    <div
      aria-hidden
      className="flex flex-wrap items-center gap-1.75 rounded-md border border-border-strong bg-well px-2.5 py-1.5 text-2xs text-dim"
    >
      <MagnifyingGlassIcon className="size-3.25" />
      {label}
      {tokens.map((t) => (
        <Chip key={t} tone="token" size="sm" className="py-px text-2xs">
          {t}
        </Chip>
      ))}
    </div>
  );
}

/** "Showing 1–5 of 114" line with pager or legend on the right. */
export function TableFooter({
  summary,
  children,
}: {
  summary: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-2 text-3xs text-dim">
      <span>{summary}</span>
      {children}
    </div>
  );
}

/** Page numbers (decorative). */
export function Pager({ pages, active }: { pages: string[]; active: string }) {
  return (
    <span aria-hidden className="flex gap-0.75">
      {pages.map((p, i) => (
        <i
          key={i}
          className={cn(
            "min-w-5 rounded-sm px-1.25 py-0.5 text-center not-italic",
            p === active ? "bg-volt text-strong" : "text-muted",
          )}
        >
          {p}
        </i>
      ))}
    </span>
  );
}
