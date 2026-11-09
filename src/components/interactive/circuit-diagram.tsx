"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from "motion/react";
import { cn } from "@/lib/cn";
import { autoConnectMargin, duration, easeFn, timing } from "@/theme/motion";
import { SegmentedControl } from "@/components/ui/controls";

/* ---- Data shapes ----------------------------------------------------------- */

export type CircuitSource = { label: string; icon: React.ReactNode };

export type CircuitOutput = {
  title: string;
  /** Number counted up to once unified */
  value: number;
  suffix: string;
  /** Text in the siloed / unified state */
  before: string;
  after: string;
};

export type CircuitDiagramProps = {
  /** Four sources: top-left, bottom-left, top-right, bottom-right */
  sources: [CircuitSource, CircuitSource, CircuitSource, CircuitSource];
  hub: {
    siloed: { icon: React.ReactNode; badge: React.ReactNode; title: string; sub: string };
    unified: { logo: { src: string; width: number; height: number }; title: string; sub: string };
  };
  /** Two outputs: left, right */
  outputs: [CircuitOutput, CircuitOutput];
  toggle: { ariaLabel: string; siloed: string; unified: string };
  /** Status line in each state: [siloed, unified] */
  status: [string, string];
  unknownText: string;
  className?: string;
};

/* ---- Board geometry (a 1200 × 640 drawing) --------------------------------- */

const HUB = { x: 600, y: 320, w: 200, h: 168 };
const SRC = [
  { x: 300, y: 130, s: 1, v: -1 },
  { x: 300, y: 510, s: 1, v: 1 },
  { x: 900, y: 130, s: -1, v: -1 },
  { x: 900, y: 510, s: -1, v: 1 },
];
const OUT = [
  { x: 140, y: 320, s: -1 },
  { x: 1060, y: 320, s: 1 },
];
const SRC_W = 220;
const OUT_W = 230;

type Pt = { x: number; y: number };
const f = (v: number) => v.toFixed(1);

/** Straight runs joined by rounded corners (circuit-trace style). */
function route(pts: Pt[], radius: number) {
  let d = `M${f(pts[0].x)} ${f(pts[0].y)}`;
  for (let i = 1; i < pts.length - 1; i++) {
    const [p, c, q] = [pts[i - 1], pts[i], pts[i + 1]];
    const l1 = Math.hypot(c.x - p.x, c.y - p.y);
    const l2 = Math.hypot(q.x - c.x, q.y - c.y);
    const u1 = { x: (c.x - p.x) / l1, y: (c.y - p.y) / l1 };
    const u2 = { x: (q.x - c.x) / l2, y: (q.y - c.y) / l2 };
    const th = Math.acos(Math.max(-1, Math.min(1, u1.x * u2.x + u1.y * u2.y)));
    if (th < 1e-3) continue;
    const tt = Math.tan(th / 2);
    const t = Math.min(radius * tt, l1 * 0.48, l2 * 0.48);
    const r = t / tt;
    const A = { x: c.x - u1.x * t, y: c.y - u1.y * t };
    const B = { x: c.x + u2.x * t, y: c.y + u2.y * t };
    const sweep = u1.x * u2.y - u1.y * u2.x > 0 ? 1 : 0;
    d += ` L${f(A.x)} ${f(A.y)} A${f(r)} ${f(r)} 0 0 ${sweep} ${f(B.x)} ${f(B.y)}`;
  }
  const e = pts[pts.length - 1];
  return `${d} L${f(e.x)} ${f(e.y)}`;
}

type Wire = { d: string; a: Pt; b: Pt };
const WIRES: Wire[] = (() => {
  const out: Wire[] = [];
  // Sources → hub: flat run, a rounded 90° turn, straight into the hub.
  for (const c of SRC) {
    const sx = c.x + (c.s * SRC_W) / 2;
    const x0 = HUB.x - c.s * 52;
    const edge = HUB.y + (c.v * HUB.h) / 2;
    for (let k = 0; k < 4; k++) {
      const L = (k - 1.5) * 15;
      const y = c.y + L;
      const x = x0 + c.v * c.s * L;
      const a = { x: sx, y };
      const b = { x, y: edge };
      out.push({ d: route([a, { x, y }, b], 30), a, b });
    }
  }
  // Hub → outputs: flat, a rounded step outwards, flat again.
  for (const o of OUT) {
    const hs = [-33, -11, 11, 33];
    const es = [-64, -42, 42, 64];
    const order = [0, 1, 1, 0];
    for (let k = 0; k < 4; k++) {
      const sy = HUB.y + hs[k];
      const sxh = HUB.x + (o.s * HUB.w) / 2;
      const ex = o.x - (o.s * OUT_W) / 2;
      const ey = o.y + es[k];
      const jx = (sxh + ex) / 2 + o.s * (order[k] - 0.5) * 22;
      const a = { x: sxh, y: sy };
      const b = { x: ex, y: ey };
      out.push({ d: route([a, { x: jx, y: sy }, { x: jx, y: ey }, b], 14), a, b });
    }
  }
  return out;
})();

/* ---- Component ----------------------------------------------------------- */

/**
 * Four source systems, a hub and two outputs. "Siloed" shows dashed, drifting,
 * disconnected nodes; "Unified" lights the wires, sends pulses along them and
 * counts the outputs up. It connects itself once when scrolled into view.
 * Below the `lg` breakpoint the board becomes a simple grid.
 */
export function CircuitDiagram({
  sources,
  hub,
  outputs,
  toggle,
  status,
  unknownText,
  className,
}: CircuitDiagramProps) {
  const [unified, setUnified] = useState(false);
  const touched = useRef(false);
  const boardRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const inView = useInView(boardRef, { once: true, margin: autoConnectMargin });

  // Connect once, shortly after the board scrolls into view (at once with reduced motion).
  useEffect(() => {
    if (!inView) return;
    const t = window.setTimeout(
      () => !touched.current && setUnified(true),
      reduce ? 0 : timing.autoConnectDelay,
    );
    return () => clearTimeout(t);
  }, [inView, reduce]);

  // Board scale: node sizes are drawn for a 1200px-wide board.
  useEffect(() => {
    const el = boardRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() =>
      el.style.setProperty("--u", Math.max(0.6, el.clientWidth / 1200).toFixed(3)),
    );
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const nodeBase =
    "relative grid min-w-0 border p-4 rounded-2xl transition-[translate,opacity,border-color,box-shadow,background-color] duration-[900ms,600ms,600ms,600ms,600ms] ease-brand " +
    "lg:absolute lg:top-[calc(var(--y)/640*100%)] lg:left-[calc(var(--x)/1200*100%)] lg:translate-x-[calc(-50%+var(--dx)*26px*var(--u)*var(--off))] lg:translate-y-[calc(-50%+var(--dy)*18px*var(--u)*var(--off))]";
  const pos = (x: number, y: number, dx: number, dy: number) =>
    ({ "--x": x, "--y": y, "--dx": dx, "--dy": dy }) as React.CSSProperties;

  return (
    <div className={cn("grid gap-5", className)}>
      <SegmentedControl
        ariaLabel={toggle.ariaLabel}
        value={unified ? "1" : "0"}
        onChange={(v) => {
          touched.current = true;
          setUnified(v === "1");
        }}
        options={[
          { value: "0", label: toggle.siloed },
          { value: "1", label: toggle.unified },
        ]}
        className="mx-auto max-w-105"
      />

      <div
        ref={boardRef}
        data-unified={unified}
        style={{ "--off": unified ? 0 : 1 } as React.CSSProperties}
        // --u (board scale) is measured in JS; these per-breakpoint values match the
        // board width at each size, so the server HTML already lays out correctly.
        className="group/board relative isolate mt-5 grid grid-cols-2 gap-2.5 lg:block lg:aspect-[1200/640] lg:[--u:0.71] xl:[--u:0.78] nav:[--u:0.84] 2xl:[--u:1]"
      >
        {/* Background glow */}
        <span
          aria-hidden
          className={cn(
            "pointer-events-none absolute -inset-[6%] -z-1 bg-circuit-glow transition-opacity duration-800",
            unified ? "opacity-100" : "opacity-35",
          )}
        />

        {/* Wires (desktop) */}
        <svg
          viewBox="0 0 1200 640"
          aria-hidden
          className="absolute inset-0 hidden size-full overflow-visible lg:block"
        >
          {WIRES.map((w, n) => (
            <path
              key={`w${n}`}
              d={w.d}
              fill="none"
              strokeWidth="1.3"
              strokeLinecap="round"
              className={cn(
                "transition-[stroke] duration-600",
                unified ? "stroke-wire-on" : "stroke-wire-off [stroke-dasharray:3_8]",
              )}
            />
          ))}
          {WIRES.map((w, n) => (
            <path
              key={`p${n}`}
              d={w.d}
              pathLength={100}
              fill="none"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeDasharray="5 95"
              className={cn(
                "stroke-sky-50 drop-shadow-glow-sky transition-opacity duration-500",
                unified ? "opacity-100" : "opacity-0",
              )}
              style={
                unified && !reduce
                  ? {
                      animation: `wire-pulse ${(2.2 + ((n * 0.37) % 1.4)).toFixed(2)}s linear infinite`,
                      animationDelay: `-${((n * 0.61) % 2.4).toFixed(2)}s`,
                    }
                  : undefined
              }
            />
          ))}
          {WIRES.flatMap((w, n) =>
            [w.a, w.b].map((p, k) => (
              <circle
                key={`c${n}-${k}`}
                cx={p.x}
                cy={p.y}
                r={3}
                className={cn(
                  "transition-[fill] duration-600",
                  unified ? "fill-sky-100 drop-shadow-glow-sky" : "fill-after",
                )}
              />
            )),
          )}
        </svg>

        {/* Sources */}
        {sources.map((src, i) => {
          const c = SRC[i];
          return (
            <div
              key={src.label}
              style={pos(c.x, c.y, -c.s, c.v)}
              className={cn(
                nodeBase,
                "content-start gap-3 lg:h-[calc(120px*var(--u))] lg:w-[calc(220px*var(--u))] lg:grid-cols-[auto_1fr] lg:content-center lg:items-center lg:gap-[calc(14px*var(--u))] lg:rounded-[calc(22px*var(--u))] lg:px-[calc(20px*var(--u))] lg:py-0",
                unified
                  ? "border-node-border-on bg-node node-glow-sky"
                  : "border-dashed border-border-dashed bg-fill-1 opacity-60",
              )}
            >
              <span
                className={cn(
                  "grid size-11 place-items-center rounded-xl border border-border-strong transition-colors duration-600 lg:size-[calc(44px*var(--u))] lg:rounded-[calc(13px*var(--u))] [&_svg]:size-6 lg:[&_svg]:size-[calc(24px*var(--u))]",
                  unified ? "bg-node-icon text-icon-soft" : "bg-fill-3 text-muted",
                )}
              >
                {src.icon}
              </span>
              <span className="text-base leading-snug font-semibold text-foreground lg:text-[calc(15px*var(--u))]">
                {src.label}
              </span>
            </div>
          );
        })}

        {/* Hub */}
        <div
          style={pos(HUB.x, HUB.y, 0, 0)}
          className={cn(
            nodeBase,
            "col-span-2 min-h-36 place-items-center rounded-glass text-center lg:h-[calc(168px*var(--u))] lg:min-h-0 lg:w-[calc(200px*var(--u))] lg:rounded-[calc(26px*var(--u))]",
            unified
              ? "border-border-ghost-hover bg-hub"
              : "border-dashed border-border-dashed bg-fill-2 opacity-85",
          )}
        >
          <i
            aria-hidden
            className={cn(
              "absolute -inset-[calc(5px*var(--u))] hidden rounded-[calc(31px*var(--u))] p-[calc(2.5px*var(--u))] transition-opacity duration-800 lg:block",
              unified ? "hub-ring opacity-100 hub-glow" : "opacity-0",
            )}
          />
          <HubFace visible={!unified}>
            <span className="relative mb-1 size-11.5 text-icon-dim lg:size-[calc(46px*var(--u))] [&>svg]:size-full">
              {hub.siloed.icon}
              <span className="absolute -right-1.5 -bottom-1.5 grid size-5 place-items-center rounded-full bg-popover text-danger lg:size-[calc(20px*var(--u))] [&>svg]:size-full">
                {hub.siloed.badge}
              </span>
            </span>
            <b className="text-control font-bold text-muted lg:text-[calc(16px*var(--u))]">
              {hub.siloed.title}
            </b>
            <small className="text-xs text-muted lg:text-[calc(12.5px*var(--u))]">
              {hub.siloed.sub}
            </small>
          </HubFace>
          <HubFace visible={unified}>
            <Image
              src={hub.unified.logo.src}
              alt=""
              width={hub.unified.logo.width}
              height={hub.unified.logo.height}
              className="mb-1 h-auto w-12 lg:w-[calc(48px*var(--u))]"
            />
            <b className="text-control font-bold lg:text-[calc(16px*var(--u))]">
              {hub.unified.title}
            </b>
            <small className="text-xs text-muted lg:text-[calc(12.5px*var(--u))]">
              {hub.unified.sub}
            </small>
          </HubFace>
        </div>

        {/* Outputs */}
        {outputs.map((o, i) => {
          const c = OUT[i];
          return (
            <div
              key={o.title}
              style={pos(c.x, c.y, c.s * 1.4, 0)}
              className={cn(
                nodeBase,
                "col-span-2 content-center gap-2 lg:h-[calc(200px*var(--u))] lg:w-[calc(230px*var(--u))] lg:gap-[calc(8px*var(--u))] lg:rounded-[calc(22px*var(--u))] lg:px-[calc(22px*var(--u))] lg:py-0",
                unified
                  ? "border-leaf/50 bg-node node-glow-leaf"
                  : "border-dashed border-border-dashed bg-fill-1",
              )}
            >
              <p className="text-sm leading-snug font-semibold text-muted lg:text-[calc(13.5px*var(--u))]">
                {o.title}
              </p>
              <CountUp
                on={unified}
                to={o.value}
                suffix={o.suffix}
                unknown={unknownText}
                className={cn(
                  "text-2xl font-light tracking-tight whitespace-nowrap tabular-nums transition-colors duration-600 lg:text-[calc(28px*var(--u))]",
                  unified ? "text-strong" : "text-dim",
                )}
              />
              <span
                className={cn(
                  "text-sm leading-normal transition-colors duration-600 lg:text-[calc(13px*var(--u))]",
                  unified ? "text-leaf-50" : "text-dim",
                )}
              >
                {unified ? o.after : o.before}
              </span>
            </div>
          );
        })}
      </div>

      <p aria-live="polite" className="text-center text-base text-muted">
        {status[unified ? 1 : 0]}
      </p>
    </div>
  );
}

/** One of the hub's two faces; crossfades with a slight blur. */
function HubFace({ visible, children }: { visible: boolean; children: React.ReactNode }) {
  return (
    <span
      aria-hidden={!visible}
      className={cn(
        "col-start-1 row-start-1 grid justify-items-center gap-1.5 transition-[opacity,scale,filter] duration-600 ease-brand lg:gap-[calc(6px*var(--u))]",
        visible ? "opacity-100" : "pointer-events-none scale-92 opacity-0 blur-xs",
      )}
    >
      {children}
    </span>
  );
}

/** Counts up to `to` with an ease-out when `on`; shows `unknown` otherwise. */
function CountUp({
  on,
  to,
  suffix,
  unknown,
  className,
}: {
  on: boolean;
  to: number;
  suffix: string;
  unknown: string;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const value = useMotionValue(0);
  const text = useTransform(value, (v) => `${Math.round(v)}${suffix}`);

  useEffect(() => {
    if (!on) return value.jump(0);
    if (reduce) return value.jump(to);
    const controls = animate(value, to, { duration: duration.count, ease: easeFn.outCubic });
    return () => controls.stop();
  }, [on, to, reduce, value]);

  return <motion.b className={className}>{on ? text : unknown}</motion.b>;
}
