"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { animate, useInView, useReducedMotion } from "motion/react";
import { cn } from "@/lib/cn";
import { usePointerGaze } from "@/hooks/use-pointer-gaze";
import { easeFn, timing } from "@/theme/motion";
import { Card, IconTile } from "@/components/ui/surfaces";
import { RangeField } from "@/components/ui/controls";
import { ShaderCanvas, type Uniforms } from "@/components/effects/shader-canvas";
import { memoryOrbShader } from "@/components/effects/shaders";
import { Swap } from "@/components/interactive/swap";

export type LearningStage = {
  /** First day this stage applies from */
  from: number;
  status: string;
  text: string;
};

export type LearningOrbProps = {
  title: string;
  icon: React.ReactNode;
  sliderLabel: string;
  /** Slider range: 1 … max days */
  max: number;
  /** Day the slider animates to when first seen */
  autoplayTo: number;
  stages: LearningStage[];
  className?: string;
};

/**
 * An orb that "learns": its rings appear and sharpen as the days-of-usage
 * slider moves, and the answer below grows clearer. When first scrolled into
 * view the slider plays forward on its own until the visitor takes over.
 */
export function LearningOrb({
  title,
  icon,
  sliderLabel,
  max,
  autoplayTo,
  stages,
  className,
}: LearningOrbProps) {
  const reduce = useReducedMotion() ?? false;
  const [day, setDay] = useState(1);
  const touched = useRef(false);
  const orbRef = useRef<HTMLDivElement>(null);
  const inView = useInView(orbRef, { once: true, amount: 0.5 });

  const uniforms = useRef<Uniforms>({ uTime: 0, uDay: 1 / max, uLook: [0, 0], uHover: 0 });
  const sim = useRef({
    day: 1 / max,
    dayT: 1 / max,
    look: { x: 0, y: 0 },
    lookT: { x: 0, y: 0 },
    hover: 0,
    hoverT: 0,
  });

  useEffect(() => {
    sim.current.dayT = day / max;
  }, [day, max]);

  // Autoplay once when the orb is half visible (instantly with reduced motion).
  useEffect(() => {
    if (!inView || touched.current) return;
    const controls = animate(1, autoplayTo, {
      duration: reduce ? 0 : timing.memoryAutoplay / 1000,
      ease: easeFn.outQuad,
      onUpdate: (v) => !touched.current && setDay(Math.max(1, Math.round(v))),
    });
    return () => controls.stop();
  }, [inView, reduce, autoplayTo]);

  // Gaze: rings brighten towards the cursor.
  usePointerGaze(orbRef, ({ dx, dy, d, width }) => {
    const k = Math.min(1, d / (width * 0.9));
    sim.current.lookT = { x: (dx / d) * k, y: (-dy / d) * k };
    sim.current.hoverT = d < width * 0.5 ? 1 : 0;
  });

  const onFrame = useCallback(
    (t: number, dt: number) => {
      const s = sim.current;
      const k = (rate: number) => 1 - Math.exp(-dt * rate);
      s.day += (s.dayT - s.day) * (reduce ? 1 : k(4));
      s.look.x += (s.lookT.x - s.look.x) * k(6);
      s.look.y += (s.lookT.y - s.look.y) * k(6);
      s.hover += (s.hoverT - s.hover) * k(5);
      const u = uniforms.current;
      u.uTime = reduce ? 4 : t;
      u.uDay = s.day;
      u.uLook = [s.look.x, s.look.y];
      u.uHover = s.hover;
    },
    [reduce],
  );

  const stageIndex = stages.reduce((found, s, i) => (day >= s.from ? i : found), 0);
  const stage = stages[stageIndex];

  return (
    <Card variant="glass" padding="md" className={cn("grid gap-4", className)}>
      <div className="flex items-center gap-2.5 text-ui">
        <IconTile size="xs" tone="leaf">
          {icon}
        </IconTile>
        <b className="font-semibold">{title}</b>
      </div>

      <div ref={orbRef} className="aspect-square w-full max-w-95 justify-self-center">
        <ShaderCanvas
          fragment={memoryOrbShader}
          uniforms={uniforms}
          onFrame={onFrame}
          animate={!reduce}
          version={day}
        />
      </div>

      <RangeField
        label={sliderLabel}
        value={day}
        min={1}
        max={max}
        onChange={(v) => {
          touched.current = true;
          setDay(v);
        }}
      />

      {/* The answer sharpens with more history */}
      <div
        aria-live="polite"
        className="min-h-24 rounded-2xl border border-border bg-well p-4 transition-[filter,opacity] duration-500"
        style={{
          filter: `blur(${Math.max(0, 3 - (day / max) * 9)}px)`,
          opacity: 0.55 + Math.min(0.45, (day / max) * 1.5),
        }}
      >
        <Swap swapKey={stageIndex}>
          <p className="mb-1.5 text-sm font-bold text-accent">{stage.status}</p>
          <p className="text-base leading-normal">{stage.text}</p>
        </Swap>
      </div>
    </Card>
  );
}
