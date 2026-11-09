"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";
import { type ColorToken, colorVar, tintStyle } from "@/theme/colors";
import { Card, Surface } from "@/components/ui/surfaces";
import { StatusPill } from "@/components/ui/indicators";
import { Swap } from "@/components/interactive/swap";

export type SpectrumZone = {
  label: string;
  /** Short label under the horizontal bar */
  short: string;
  color: ColorToken;
};

export type SpectrumPerson = {
  name: string;
  /** Index into `zones` */
  zone: number;
  signals: string[];
  playbook: string[];
};

export type SpectrumPlotProps = {
  zones: SpectrumZone[];
  people: SpectrumPerson[];
  heading: { kicker: string; text: string };
  /** Labels for the two ends, e.g. ["Burnout end", "Drift end"] */
  ends: [string, string];
  labels: { demo: string; signals: string; playbook: string };
  className?: string;
};

const initials = (name: string) =>
  name
    .replace(".", "")
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

/**
 * People plotted along a spectrum of zones (e.g. burnout ↔ drift). Wide
 * frames show a horizontal barbell with weight plates; narrow frames show a
 * vertical spectrum with one row per person. Selecting a person shows their
 * signals and playbook in the side panel.
 */
export function SpectrumPlot({
  zones,
  people,
  heading,
  ends,
  labels,
  className,
}: SpectrumPlotProps) {
  const [selected, setSelected] = useState(0);

  // Position along the bar: one unit per person, plus a gap between zones.
  const raw = people.reduce<number[]>((acc, p, i) => {
    const prev = i === 0 ? -1 : acc[i - 1];
    const gap = i > 0 && p.zone !== people[i - 1].zone ? 0.9 : 0;
    acc.push(i === 0 ? 0 : prev + 1 + gap);
    return acc;
  }, []);
  const span = raw[raw.length - 1] || 1;
  const pos = raw.map((v) => 5 + (v / span) * 90);

  // Zone segments under the bar
  const segments = people.reduce<{ zone: number; a: number; b: number }[]>((acc, p, i) => {
    const last = acc[acc.length - 1];
    if (!last || last.zone !== p.zone) acc.push({ zone: p.zone, a: pos[i], b: pos[i] });
    else last.b = pos[i];
    return acc;
  }, []);

  const person = people[selected];
  const zone = zones[person.zone];

  return (
    <div className={cn("grid gap-6 2xl:grid-cols-[minmax(0,2.1fr)_minmax(0,1fr)]", className)}>
      {/* Stage */}
      <div className="@container relative min-w-0 overflow-hidden rounded-3xl border border-border-strong bg-barbell-stage">
        <div className="grid max-w-160 gap-1.5 p-5 sm:p-6">
          <p className="text-sm font-bold tracking-label text-accent">{heading.kicker}</p>
          <p className="text-base leading-normal text-muted">{heading.text}</p>
        </div>

        {/* Horizontal barbell (wide frames) */}
        <div className="hidden h-95 grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-x-1.5 px-6 pb-6 @3xl:grid">
          <Plates side="start" label={ends[0]} />
          <div className="relative mx-1 h-full">
            <span
              aria-hidden
              className="absolute top-1/2 -right-2 -left-2 h-3 -translate-y-1/2 rounded-full bg-spectrum shadow-spectrum-bar"
            />
            {people.map((p, i) => {
              const on = i === selected;
              return (
                <button
                  key={p.name}
                  type="button"
                  aria-pressed={on}
                  aria-label={`${p.name}, ${zones[p.zone].label}`}
                  onClick={() => setSelected(i)}
                  style={{ left: `${pos[i]}%`, ...tintStyle(zones[p.zone].color) }}
                  className={cn(
                    "absolute top-1/2 grid -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-pin transition-[width,height,box-shadow,scale] duration-350 ease-brand",
                    on ? "z-2 size-11.5 pin-ring-on" : "z-1 size-8.5 pin-ring hover:scale-108",
                  )}
                >
                  <b
                    className={cn(
                      "font-bold tracking-label text-strong",
                      on ? "text-sm" : "text-2xs",
                    )}
                  >
                    {initials(p.name)}
                  </b>
                  <em
                    className={cn(
                      "absolute left-1/2 -translate-x-1/2 text-xs font-semibold whitespace-nowrap not-italic transition-colors",
                      i % 2 ? "top-[calc(100%+0.75rem)]" : "bottom-[calc(100%+0.75rem)]",
                      on ? "text-strong" : "text-muted",
                    )}
                  >
                    {p.name}
                  </em>
                </button>
              );
            })}
            {/* Zone scale */}
            <div aria-hidden className="absolute inset-x-0 bottom-0 h-11">
              {segments.map((s) => {
                const single = s.b - s.a < 1;
                return (
                  <span
                    key={`${s.zone}-${s.a}`}
                    className="absolute top-0 h-0.5 rounded-xs bg-(--c)"
                    style={{
                      left: `${s.a - 2.6}%`,
                      width: `${s.b - s.a + 5.2}%`,
                      ...tintStyle(zones[s.zone].color),
                    }}
                  >
                    <small
                      className={cn(
                        "absolute left-1/2 -translate-x-1/2 text-2xs font-semibold whitespace-nowrap text-muted",
                        single ? "top-6" : "top-2",
                      )}
                    >
                      {zones[s.zone].short}
                    </small>
                  </span>
                );
              })}
            </div>
          </div>
          <Plates side="end" label={ends[1]} />
        </div>

        {/* Vertical spectrum (narrow frames) */}
        <div className="relative px-4 pb-6 @3xl:hidden">
          <p className="mb-2 pl-14 text-xs font-semibold text-muted">{ends[0]}</p>
          <div className="relative">
            <span
              aria-hidden
              className="absolute top-1 bottom-1 left-8 w-2.5 -translate-x-1/2 rounded-full bg-spectrum-vertical shadow-spectrum-bar"
            />
            {segments.map((s) => (
              <div key={`${s.zone}-${s.a}`} className="relative pb-2">
                <p
                  className="mb-0.5 pt-2 pl-14 text-2xs font-semibold"
                  style={{ color: colorVar(zones[s.zone].color) }}
                >
                  {zones[s.zone].label}
                </p>
                {people.map((p, i) => {
                  if (p.zone !== s.zone || pos[i] < s.a || pos[i] > s.b) return null;
                  const on = i === selected;
                  return (
                    <button
                      key={p.name}
                      type="button"
                      aria-pressed={on}
                      aria-label={`${p.name}, ${zones[p.zone].label}`}
                      onClick={() => setSelected(i)}
                      style={tintStyle(zones[p.zone].color)}
                      className="grid min-h-11 w-full grid-cols-[4rem_minmax(0,1fr)] items-center text-left"
                    >
                      <span className="grid place-items-center">
                        <span
                          className={cn(
                            "grid place-items-center rounded-full bg-pin font-bold text-strong transition-[width,height,box-shadow] duration-350 ease-brand",
                            on ? "size-9.5 text-xs pin-ring-on" : "size-7.5 text-3xs pin-ring",
                          )}
                        >
                          {initials(p.name)}
                        </span>
                      </span>
                      <span
                        className={cn("text-ui font-semibold", on ? "text-strong" : "text-muted")}
                      >
                        {p.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
          <p className="mt-2 pl-14 text-xs font-semibold text-muted">{ends[1]}</p>
        </div>
      </div>

      {/* Selected person */}
      <Card variant="glass" padding="md" aria-live="polite" className="min-w-0">
        <Swap swapKey={selected} className="grid content-start gap-2.5">
          <p className="justify-self-start rounded-full border border-border bg-fill-4 px-2.25 py-0.5 text-2xs font-semibold text-dim">
            {labels.demo}
          </p>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h3 className="text-3xl font-light tracking-tight">{person.name}</h3>
            <StatusPill label={zone.label} color={zone.color} />
          </div>
          <p className="mt-2 text-xs font-semibold text-dim">{labels.signals}</p>
          <ul className="grid gap-1.5">
            {person.signals.map((s) => (
              <Surface as="li" key={s} padding="sm" className="text-ui">
                {s}
              </Surface>
            ))}
          </ul>
          <p className="mt-2 text-xs font-semibold text-dim">{labels.playbook}</p>
          <ul className="grid gap-1.5">
            {person.playbook.map((s) => (
              <Surface as="li" key={s} tone="leaf" padding="sm" className="text-ui text-leaf-50">
                {s}
              </Surface>
            ))}
          </ul>
        </Swap>
      </Card>
    </div>
  );
}

/** Three weight plates and an end label. */
function Plates({ side, label }: { side: "start" | "end"; label: string }) {
  const warm = side === "start";
  return (
    <div
      aria-hidden
      className={cn("relative flex h-full items-center gap-1.5", !warm && "flex-row-reverse")}
      style={
        {
          "--gl": warm ? "var(--plate-glow-warm)" : "var(--plate-glow-cool)",
        } as React.CSSProperties
      }
    >
      {[
        { size: "h-45 w-5", fill: warm ? "bg-plate-warm" : "bg-plate-cool" },
        { size: "h-37 w-4.25", fill: warm ? "bg-plate-warm-alt" : "bg-plate-cool-alt" },
        { size: "h-28 w-3.5", fill: warm ? "bg-plate-warm" : "bg-plate-cool" },
      ].map((plate, i) => (
        <i
          key={i}
          className={cn(
            "relative block rounded-lg shadow-[var(--sh-plate),0_18px_40px_-18px_var(--gl)] after:absolute after:inset-x-1.25 after:top-0.75 after:h-2/5 after:rounded-md after:bg-linear-to-b after:from-white/35 after:to-transparent",
            plate.size,
            plate.fill,
          )}
        />
      ))}
      <span className="absolute top-[calc(50%-7.25rem)] left-1/2 -translate-x-1/2 text-xs font-semibold whitespace-nowrap text-muted">
        {label}
      </span>
    </div>
  );
}
