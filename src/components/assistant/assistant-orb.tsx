"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { cn } from "@/lib/cn";
import { usePointerGaze } from "@/hooks/use-pointer-gaze";
import { useTimeouts } from "@/hooks/use-timeouts";
import { orbIntro, timing } from "@/theme/motion";
import { Dot } from "@/components/ui/indicators";
import { ShaderCanvas, type Uniforms } from "@/components/effects/shader-canvas";
import { heroOrbShader } from "@/components/effects/shaders";
import { useAssistant } from "@/components/assistant/assistant-context";

export type AssistantOrbProps = {
  /** Assistant name shown in the status tag, e.g. "TraceAI" */
  name: string;
  /** Lines spoken shortly after load */
  greeting: string[];
  /** Lines spoken when the visitor has been idle for a while */
  idleLines: string[];
  /** Said when the orb is clicked */
  hello: string;
  workingText: string;
  doneText: string;
  /** Status tag texts */
  statusText: { idleMouse: string; idleTouch: string; working: string; done: string };
  className?: string;
};

type FaceMode = "eyes" | "text" | "happy";

/**
 * The assistant's animated orb with eyes that follow the cursor, blinking,
 * short spoken lines, and a status tag that opens the console.
 * Layout is pure CSS: centred in the page flow on small screens, positioned
 * over the hero (67% / 37%) from the `lg` breakpoint, sized by `--R`.
 */
export function AssistantOrb({
  name,
  greeting,
  idleLines,
  hello,
  workingText,
  doneText,
  statusText,
  className,
}: AssistantOrbProps) {
  const { status, openConsole, consoleId, consoleOpen } = useAssistant();
  const thinking = status === "working";
  const reduce = useReducedMotion() ?? false;

  const orbRef = useRef<HTMLDivElement>(null);
  const faceRef = useRef<HTMLDivElement>(null);
  const eyesRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);
  const uniforms = useRef<Uniforms>({ uTime: 0, uSpin: 0, uThink: 0, uHover: 0, uLook: [0, 0] });

  // Smoothed animation state (mutated every frame, never triggers renders)
  const sim = useRef({
    look: { x: 0, y: 0 },
    lookT: { x: 0, y: 0 },
    hover: 0,
    hoverT: 0,
    think: 0,
    thinkT: 0,
    spin: 0,
    lastMove: -99,
    time: 0,
    /** Time the intro bloom started (rings spin up, then settle) */
    bloomAt: -99,
  });

  // Speech state. Speech timers are cleared on unmount by the hook.
  const speech = useRef({ busy: false, mode: "eyes" as FaceMode });
  const { later, clear: clearTimers } = useTimeouts();

  /* ---- face helpers (imperative: they run on timers, outside React renders) ---- */
  const setFaceMode = useCallback((m: FaceMode) => {
    if (faceRef.current) faceRef.current.dataset.mode = m;
  }, []);
  const setText = useCallback((text: string, opts: { in?: boolean; dots?: boolean } = {}) => {
    const el = textRef.current;
    if (!el) return;
    el.textContent = text;
    el.dataset.big = String(text.length < 5);
    el.dataset.in = String(opts.in ?? true);
    el.dataset.dots = String(opts.dots ?? false);
  }, []);
  const hideText = useCallback(() => {
    if (textRef.current) textRef.current.dataset.in = "false";
  }, []);

  const say = useCallback(
    (lines: string[], done?: () => void) => {
      clearTimers();
      speech.current.mode = "text";
      setFaceMode("text");
      let i = 0;
      const next = () => {
        if (i >= lines.length) {
          hideText();
          later(() => done?.(), timing.speechOutro);
          return;
        }
        hideText();
        later(
          () => {
            const line = lines[i++];
            setText(line);
            later(next, line.length < 5 ? timing.speechShort : timing.speechLong);
          },
          i ? timing.speechGap : timing.speechFirstLine,
        );
      };
      next();
    },
    [clearTimers, hideText, later, setFaceMode, setText],
  );

  const toEyes = useCallback(
    function eyes() {
      speech.current.mode = "eyes";
      setFaceMode("eyes");
      if (speech.current.busy || reduce) return;
      clearTimers();
      later(() => {
        if (speech.current.busy || sim.current.hoverT) return eyes();
        say(idleLines, eyes);
      }, timing.idleChatter);
    },
    [clearTimers, idleLines, later, reduce, say, setFaceMode],
  );

  const wake = useCallback(() => {
    if (speech.current.busy || speech.current.mode === "eyes") return;
    hideText();
    toEyes();
  }, [hideText, toEyes]);

  /* ---- intro: eyes from the start; once the orb is ready they blink once,
     the orb blooms in as they reopen, then the greeting ---- */
  const [ready, setReady] = useState(false);
  const [bloomed, setBloomed] = useState(false);
  // Without WebGL (ok = false) the face still runs its intro, just without the orb.
  const onReady = useCallback(() => setReady(true), []);
  // Reduced motion: no choreography, the orb simply appears.
  const showOrb = bloomed || (ready && reduce);

  useEffect(() => {
    setFaceMode("eyes");
    if (!ready || reduce) return;
    let blinkTimer = 0;
    let holdTimer = 0;
    const blinkOnce = () => {
      if (speech.current.mode !== "eyes" || !eyesRef.current) return;
      eyesRef.current.dataset.blink = "true";
      holdTimer = window.setTimeout(
        () => eyesRef.current && (eyesRef.current.dataset.blink = "false"),
        timing.blinkHold,
      );
    };
    const blinkLoop = () => {
      blinkOnce();
      blinkTimer = window.setTimeout(
        blinkLoop,
        timing.blinkMin + Math.random() * timing.blinkRange,
      );
    };
    // 1. one deliberate blink
    const introBlink = window.setTimeout(blinkOnce, timing.introBlink);
    // 2. as the eyes reopen, the orb blooms in and its rings spin up, then settle
    const bloom = window.setTimeout(() => {
      setBloomed(true);
      sim.current.bloomAt = sim.current.time;
    }, timing.introBlink + timing.blinkHold);
    // 3. the regular blink rhythm, and the greeting
    blinkTimer = window.setTimeout(blinkLoop, timing.introBlink + timing.blinkMin);
    const greet = window.setTimeout(
      () => !speech.current.busy && say(greeting, toEyes),
      timing.greetingDelay,
    );
    return () => {
      clearTimeout(introBlink);
      clearTimeout(bloom);
      clearTimeout(greet);
      clearTimeout(blinkTimer);
      clearTimeout(holdTimer);
      clearTimers();
    };
  }, [ready, greeting, reduce, say, setFaceMode, toEyes, clearTimers]);

  /* ---- thinking: driven by the console ---- */
  const wasThinking = useRef(false);
  useEffect(() => {
    sim.current.thinkT = thinking ? 1 : 0;
    if (thinking) {
      speech.current.busy = true;
      clearTimers();
      speech.current.mode = "text";
      setFaceMode("text");
      setText(workingText, { dots: true });
    } else if (wasThinking.current) {
      speech.current.busy = false;
      say([doneText], () => {
        toEyes();
        setFaceMode("happy");
        later(() => speech.current.mode === "eyes" && setFaceMode("eyes"), timing.happyHold);
      });
    }
    wasThinking.current = thinking;
  }, [thinking, clearTimers, doneText, later, say, setFaceMode, setText, toEyes, workingText]);

  /* ---- gaze: eyes and ring brightness follow the mouse ---- */
  usePointerGaze(
    orbRef,
    ({ dx, dy, d, width }) => {
      const R = width * 0.3; // the ring sits at 60% of the canvas half-width
      const k = Math.min(1, d / (R * 2.2));
      const s = sim.current;
      const over = d < R * 1.05;
      s.lookT = { x: (dx / d) * k, y: (dy / d) * k };
      s.hoverT = over ? 1 : 0;
      s.lastMove = s.time;
      if (orbRef.current) orbRef.current.style.cursor = over ? "pointer" : "";
      if (d < R * 2.4) wake();
    },
    { mouseOnly: true },
  );

  /* ---- per-frame update ---- */
  const onFrame = useCallback(
    (t: number, dt: number) => {
      const s = sim.current;
      s.time = t;
      if (t - s.lastMove > 4 && !reduce)
        s.lookT = { x: Math.sin(t * 0.5) * 0.5, y: Math.sin(t * 0.37) * 0.25 };
      const ease = (rate: number) => 1 - Math.exp(-dt * rate);
      s.look.x += (s.lookT.x - s.look.x) * ease(8);
      s.look.y += (s.lookT.y - s.look.y) * ease(8);
      s.hover += (s.hoverT - s.hover) * ease(6);
      // Reduced motion draws single frames, so jump straight to the target.
      s.think += (s.thinkT - s.think) * (reduce ? 1 : ease(3));
      // Intro spin-up: a smooth swell and settle (sin²), never a sudden jump.
      const k = (t - s.bloomAt) / orbIntro.spinUp;
      const swell = k > 0 && k < 1 ? Math.sin(Math.PI * k) ** 2 : 0;
      s.spin += dt * (1 + s.think * 4 + swell * 2.5 + s.hover * 0.6);
      const u = uniforms.current;
      u.uTime = t;
      u.uSpin = s.spin;
      u.uThink = Math.max(s.think, swell * 0.45);
      u.uHover = s.hover;
      u.uLook = [s.look.x, -s.look.y];

      const box = orbRef.current;
      const face = faceRef.current;
      if (!box || !face) return;
      const R = box.clientWidth * 0.3;
      const bob = reduce ? 0 : Math.sin(t * 1.3) * R * 0.03;
      box.style.transform = `translateY(${bob.toFixed(2)}px)`;
      face.style.setProperty("--ex", `${(s.look.x * R * 0.2).toFixed(1)}px`);
      face.style.setProperty("--ey", `${(s.look.y * R * 0.14 + bob).toFixed(1)}px`);
    },
    [reduce],
  );

  function onOrbClick(e: React.MouseEvent<HTMLDivElement>) {
    const box = e.currentTarget.getBoundingClientRect();
    const R = box.width * 0.3;
    const d = Math.hypot(
      e.clientX - (box.left + box.width / 2),
      e.clientY - (box.top + box.height / 2),
    );
    if (d * d < R * R * 1.2) {
      if (!speech.current.busy) say([hello], toEyes);
      openConsole(true);
    }
  }

  // The orb fades a little as the hero scrolls away.
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, (y) =>
    typeof window === "undefined" ? 1 : 1 - Math.min(1, y / window.innerHeight) * 0.6,
  );

  const label =
    status === "working" ? statusText.working : status === "done" ? statusText.done : null;

  return (
    <motion.div
      style={{ opacity }}
      className={cn(
        // --R = orb radius. Small screens: in-flow stage; lg+: covers the hero.
        "pointer-events-none relative z-0 mx-auto h-[calc(var(--R)*3.3)] w-full [--R:min(30vw,8.125rem)] lg:absolute lg:inset-0 lg:h-auto lg:[--R:min(max(10.24rem,21svh),13vw)]",
        className,
      )}
    >
      {/* Orb canvas (centre = orb centre). Hidden until the intro blink, then it
          grows out from behind the eyes on a soft spring. Only opacity and scale
          animate (no CSS blur over the live canvas), so the bloom stays smooth. */}
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={showOrb ? { opacity: 1, scale: 1 } : undefined}
        transition={orbIntro.orb}
        className="absolute top-1/2 left-1/2 size-[calc(var(--R)*3.3333)] -translate-x-1/2 -translate-y-1/2 will-change-[transform,opacity] lg:top-[37%] lg:left-[67%]"
      >
        <div ref={orbRef} onClick={onOrbClick} className="pointer-events-auto size-full">
          <ShaderCanvas
            fragment={heroOrbShader}
            uniforms={uniforms}
            onFrame={onFrame}
            onReady={onReady}
            animate={!reduce}
            version={thinking ? 1 : 0}
          />
        </div>
      </motion.div>

      {/* Soft light the orb materialises out of: it swells and fades through */}
      <motion.span
        aria-hidden
        initial={{ opacity: 0, scale: 0.4 }}
        animate={bloomed ? { opacity: [0, 0.85, 0], scale: [0.4, 0.95, 1.25] } : undefined}
        transition={orbIntro.glow}
        className="pointer-events-none absolute top-1/2 left-1/2 size-[calc(var(--R)*2.6)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-orb-bloom will-change-[transform,opacity] lg:top-[37%] lg:left-[67%]"
      />

      {/* A thin ring of light that ripples outward as the orb appears */}
      <motion.span
        aria-hidden
        initial={{ opacity: 0, scale: 0.6 }}
        animate={bloomed ? { opacity: [0, 0.7, 0], scale: [0.6, 1.05, 1.4] } : undefined}
        transition={orbIntro.ripple}
        className="pointer-events-none absolute top-1/2 left-1/2 size-[calc(var(--R)*2)] -translate-x-1/2 -translate-y-1/2 rounded-full border border-sky-100/60 shadow-glow-sky will-change-[transform,opacity] lg:top-[37%] lg:left-[67%]"
      />

      {/* Face: eyes or spoken words over the orb */}
      <div
        ref={faceRef}
        aria-hidden
        data-mode="eyes"
        className="group/face absolute top-1/2 left-1/2 grid size-[calc(var(--R)*1.72)] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full lg:top-[37%] lg:left-[67%]"
      >
        {/* Eyes are there from the start; the intro blink happens on them */}
        <div>
          <div
            ref={eyesRef}
            data-blink="false"
            className="group/eyes flex translate-x-(--ex) translate-y-(--ey) gap-[calc(var(--R)*0.2)] transition-[opacity,translate] duration-[350ms,80ms] ease-linear group-data-[mode=text]/face:opacity-0"
          >
            {[0, 1].map((i) => (
              <i
                key={i}
                className="block orb-eye transition-[scale,height,border-radius,translate] duration-[140ms,300ms,300ms,300ms] ease-brand group-data-[blink=true]/eyes:scale-y-8 group-data-[mode=happy]/face:h-[calc(var(--R)*0.1)] group-data-[mode=happy]/face:-translate-y-[calc(var(--R)*0.03)] group-data-[mode=happy]/face:rounded-[999px_999px_4px_4px] group-data-[mode=text]/face:scale-y-5"
              />
            ))}
          </div>
        </div>
        <p
          ref={textRef}
          data-in="false"
          className="absolute inset-0 m-0 grid scale-96 place-items-center px-[16%] text-center orb-speech leading-tight font-light tracking-slight text-balance text-ice opacity-0 blur-sm transition-[opacity,filter,scale] duration-[450ms,550ms,550ms] ease-brand data-[big=true]:text-[calc(var(--R)*0.3)] data-[dots=true]:typing-dots data-[in=true]:scale-100 data-[in=true]:opacity-100 data-[in=true]:blur-none"
        />
      </div>

      {/* Status tag: opens the console */}
      <button
        type="button"
        aria-controls={consoleId}
        aria-expanded={consoleOpen}
        onClick={() => openConsole(true)}
        className="pointer-events-auto absolute top-[calc(50%+var(--R)*1.25)] left-1/2 inline-flex min-h-10 -translate-x-1/2 items-center gap-2.25 rounded-full border border-border-ghost bg-fill-4 pr-3.75 pl-3 text-sm font-medium whitespace-nowrap text-muted transition-colors duration-300 hover:border-border-ghost-hover hover:bg-fill-hover lg:top-[max(6.5rem,calc(37%-var(--R)*1.32-2.75rem))] lg:left-[67%]"
      >
        <Dot color={status === "working" ? "sky" : "leaf"} glow pulse={status === "working"} />
        <b className="font-bold tracking-label text-strong">{name}</b>
        {label ? (
          <span>{label}</span>
        ) : (
          // Idle text depends on the input device; CSS picks it, so the server HTML is already right.
          <>
            <span className="pointer-coarse:hidden">{statusText.idleMouse}</span>
            <span className="hidden pointer-coarse:inline">{statusText.idleTouch}</span>
          </>
        )}
      </button>
    </motion.div>
  );
}
