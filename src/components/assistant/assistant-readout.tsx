"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { ArrowRightIcon, SparkleIcon, XIcon } from "@phosphor-icons/react";
import { cn } from "@/lib/cn";
import { type ColorToken, colorVar } from "@/theme/colors";
import { duration, ease, swapIn, timing } from "@/theme/motion";
import { useTimeouts } from "@/hooks/use-timeouts";
import { Button } from "@/components/ui/button";
import { Swap } from "@/components/interactive/swap";
import { useAssistant } from "@/components/assistant/assistant-context";

/* ---- Data shapes ----------------------------------------------------------- */

export type ReadoutMetric = { id: string; label: string; minutes: number; color: ColorToken };

export type ReadoutExtra = { icon: React.ReactNode; text: string; status: string };

/** What an instruction changes on the readout once it has run. */
export type InstructionEffect = {
  score?: number;
  /** Minute deltas per metric id */
  metrics?: Record<string, number>;
  /** New row added under the metrics */
  addItem?: ReadoutExtra;
};

export type Instruction = {
  text: string;
  /** Typed words that trigger this instruction */
  keys: string[];
  steps: string[];
  effect: InstructionEffect;
  /** Note shown under the readout afterwards */
  note: string;
};

export type AssistantReadoutProps = {
  ariaLabel: string;
  title: string;
  range: string;
  score: { value: number; max: number; label: string };
  metrics: ReadoutMetric[];
  /** Minutes that equal a full bar */
  scaleMinutes: number;
  note: string;
  instructions: Instruction[];
  text: {
    assistantName: string;
    intro: string;
    closeLabel: string;
    inputLabel: string;
    placeholder: string;
    sendLabel: string;
    doneMessage: string;
    fallbackMessage: string;
    doneSuffix: string;
    changedBadge: string;
    reset: string;
  };
  className?: string;
};

type StepState = "idle" | "run" | "done";

/** Minutes → "3h 50m" */
const fmt = (m: number) => `${Math.floor(m / 60)}h ${String(m % 60).padStart(2, "0")}m`;

/* ---- Component -------------------------------------------------------------- */

/**
 * A product readout card with an assistant console. Running an instruction
 * shows its steps, then applies its effect to the readout and highlights
 * what changed. Typed prompts are matched against each instruction's keys.
 */
export function AssistantReadout({
  ariaLabel,
  title,
  range,
  score,
  metrics,
  scaleMinutes,
  note,
  instructions,
  text,
  className,
}: AssistantReadoutProps) {
  const {
    busy,
    consoleOpen,
    consoleId,
    setConsoleOpen,
    setBusy,
    setStatus,
    openConsole,
    inputRef,
    panelRef,
  } = useAssistant();
  const reduce = useReducedMotion() ?? false;

  const initial = () => ({
    score: score.value,
    minutes: Object.fromEntries(metrics.map((m) => [m.id, m.minutes])) as Record<string, number>,
    extras: [] as ReadoutExtra[],
  });
  const [values, setValues] = useState(initial);
  const [applied, setApplied] = useState<number[]>([]);
  const [changed, setChanged] = useState<string[]>([]);
  const [resultNote, setResultNote] = useState<string | null>(null);
  const [run, setRun] = useState<{ index: number; steps: StepState[] } | null>(null);
  const [message, setMessage] = useState<{ text: string; ok: boolean } | null>(null);
  const [query, setQuery] = useState("");
  const { later, clear } = useTimeouts();

  /** The view is about to swap: if focus is on a control inside it (not the
   *  prompt form, which stays), move it to the panel now — the old view stays
   *  mounted during its exit animation, then focus would fall to <body>. */
  function keepFocus() {
    const panel = panelRef.current;
    const active = document.activeElement;
    if (panel && active && active !== panel && panel.contains(active) && !active.closest("form")) {
      panel.focus({ preventScroll: true });
    }
  }

  function closeConsole() {
    if (busy) return;
    setConsoleOpen(false);
    setMessage(null);
    keepFocus();
  }

  function runInstruction(i: number) {
    if (busy || applied.includes(i)) return;
    const ins = instructions[i];
    // Cancel leftovers from the previous run (status reset, highlight clear).
    clear();
    openConsole(false);
    setBusy(true);
    setStatus("working");
    setQuery("");
    setMessage(null);
    setRun({ index: i, steps: ins.steps.map(() => "idle") });
    keepFocus();

    const stepMs = reduce ? timing.aiStepReduced : timing.aiStep;
    const setStep = (k: number, state: StepState) =>
      setRun((r) => (r ? { ...r, steps: r.steps.map((s, j) => (j === k ? state : s)) } : r));
    ins.steps.forEach((_, k) => {
      later(() => setStep(k, "run"), k * stepMs);
      later(() => setStep(k, "done"), (k + 1) * stepMs - timing.aiStepOverlap);
    });
    const n = ins.steps.length;
    later(
      () => {
        setMessage({ text: text.doneMessage, ok: true });
        setStatus("done");
      },
      n * stepMs + timing.aiDoneMessage,
    );
    later(
      () => {
        const { effect } = ins;
        const keys = [
          ...Object.keys(effect.metrics ?? {}),
          ...(effect.score ? ["score"] : []),
          ...(effect.addItem ? ["extra"] : []),
        ];
        setValues((v) => {
          const minutes = { ...v.minutes };
          for (const [id, delta] of Object.entries(effect.metrics ?? {})) minutes[id] += delta;
          return {
            score: v.score + (effect.score ?? 0),
            minutes,
            extras: effect.addItem ? [...v.extras, effect.addItem] : v.extras,
          };
        });
        setChanged(keys);
        setApplied((x) => [...x, i]);
        setResultNote(ins.note);
        setRun(null);
        setMessage(null);
        setBusy(false);
        setConsoleOpen(false);
        later(() => setStatus("idle"), timing.aiStatusReset);
        later(() => setChanged([]), timing.changedHighlight);
      },
      n * stepMs + (reduce ? timing.aiApplyReduced : timing.aiApply),
    );
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const q = query.trim().toLowerCase();
    if (!q) return openConsole(true);
    const hit = instructions.findIndex(
      (ins, i) => !applied.includes(i) && ins.keys.some((k) => q.includes(k)),
    );
    if (hit > -1) return runInstruction(hit);
    openConsole(false);
    setMessage({ text: text.fallbackMessage, ok: false });
  }

  function reset() {
    clear();
    setStatus("idle");
    setValues(initial());
    setApplied([]);
    setChanged([]);
    setResultNote(null);
  }

  const isChanged = (key: string) => changed.includes(key);
  const changedBadge = (
    <span className="ml-1.5 inline-flex rounded-full border border-border bg-sky/12 px-1.75 py-px align-middle text-2xs font-bold text-sky-100">
      {text.changedBadge}
    </span>
  );

  return (
    <aside
      ref={panelRef}
      id={consoleId}
      tabIndex={-1}
      aria-label={ariaLabel}
      onKeyDown={(e) => e.key === "Escape" && consoleOpen && closeConsole()}
      className={cn(
        "pointer-events-auto w-full rounded-3xl border border-border-strong bg-popover p-4 shadow-readout outline-none lg:max-w-readout lg:justify-self-end",
        className,
      )}
    >
      {!consoleOpen && (
        <div className="mx-1 mt-3.5 mb-2 flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5 text-sm text-muted">
          <b className="text-ui font-semibold text-foreground">{title}</b>
          <span>{range}</span>
        </div>
      )}

      {/* Screen readers hear short status updates, not the whole panel. */}
      <p aria-live="polite" className="sr-only">
        {message?.text ?? (run ? instructions[run.index].text : (resultNote ?? ""))}
      </p>

      <Swap
        swapKey={consoleOpen ? "console" : "view"}
        className={consoleOpen ? "px-1 py-0.5" : "px-1 pb-1"}
      >
        {!consoleOpen ? (
          /* ---- Readout view ---- */
          <>
            <div
              className={cn(
                "mb-2.5 flex items-baseline gap-2.5 rounded-lg transition-[background-color,box-shadow] duration-600",
                isChanged("score") && "-mx-2 -mt-1 mb-1.5 bg-sky/10 px-2 py-1 shadow-ring-sky",
              )}
            >
              <strong className="text-stat-sm font-light tracking-tighter">
                {values.score}
                <span className="text-xl text-muted">/{score.max}</span>
              </strong>
              <span className="text-ui text-muted">
                {score.label}
                {isChanged("score") && changedBadge}
              </span>
            </div>

            <div className="grid gap-2.25">
              {metrics.map((m) => {
                const minutes = values.minutes[m.id];
                const width = Math.round((minutes / scaleMinutes) * 100);
                return (
                  <div
                    key={m.id}
                    className={cn(
                      "grid grid-cols-[minmax(0,1fr)_auto] gap-x-3 gap-y-1.5 rounded-lg text-ui transition-[background-color,box-shadow] duration-600",
                      isChanged(m.id) && "-mx-2 -my-1.5 bg-sky/10 px-2 py-1.5 shadow-ring-sky",
                    )}
                  >
                    <span>
                      {m.label}
                      {isChanged(m.id) && changedBadge}
                    </span>
                    <span className="font-semibold tabular-nums">{fmt(minutes)}</span>
                    <div className="col-span-full h-1.5 overflow-hidden rounded-sm bg-track">
                      <motion.i
                        className="block h-full rounded-[inherit]"
                        style={{ backgroundColor: colorVar(m.color) }}
                        initial={{ width: 0 }}
                        animate={{ width: `${width}%` }}
                        transition={{ duration: duration.count, ease: ease.brand }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {values.extras.length > 0 && (
              <ul className="mt-2.5 grid gap-2">
                {values.extras.map((x, i) => (
                  <motion.li
                    key={x.text}
                    variants={swapIn}
                    initial="hidden"
                    animate="visible"
                    className={cn(
                      "flex items-center gap-2.5 rounded-lg border border-border px-2.5 py-2 text-sm [&_svg]:size-4 [&_svg]:shrink-0 [&_svg]:text-accent",
                      isChanged("extra") && i === values.extras.length - 1
                        ? "bg-sky/18"
                        : "bg-fill-4",
                    )}
                  >
                    {x.icon}
                    <span className="min-w-0">{x.text}</span>
                    <em className="ml-auto text-2xs font-bold text-leaf-100 not-italic">
                      {x.status}
                    </em>
                  </motion.li>
                ))}
              </ul>
            )}

            <p className="mt-3 border-t border-border pt-3 text-sm leading-normal text-muted">
              {resultNote ?? note}
              {applied.length > 0 && (
                <button
                  type="button"
                  onClick={reset}
                  className="ml-1.5 text-sm font-semibold text-accent underline underline-offset-3"
                >
                  {text.reset}
                </button>
              )}
            </p>
          </>
        ) : (
          /* ---- Console ---- */
          <>
            <div className="flex items-center gap-2 text-base">
              <SparkleIcon
                weight="fill"
                aria-hidden
                className="size-4.5 shrink-0 fill-brand-gradient"
              />
              <b className="font-bold">{text.assistantName}</b>
              <button
                type="button"
                onClick={closeConsole}
                disabled={busy}
                aria-label={text.closeLabel}
                className="ml-auto grid size-9 place-items-center rounded-full border border-border text-muted transition-colors hover:border-border-strong hover:text-strong disabled:opacity-50"
              >
                <XIcon aria-hidden className="size-4" />
              </button>
            </div>

            {run ? (
              <ol className="mt-1 grid gap-2.5">
                <li className="mb-0.5 text-md font-semibold text-strong">
                  “{instructions[run.index].text}”
                </li>
                {instructions[run.index].steps.map((step, k) => {
                  const state = run.steps[k];
                  return (
                    <li
                      key={step}
                      className={cn(
                        "flex items-center gap-2.5 text-ui transition-colors duration-300",
                        state === "run"
                          ? "text-foreground"
                          : state === "done"
                            ? "text-muted"
                            : "text-dim",
                      )}
                    >
                      <i
                        aria-hidden
                        className={cn(
                          "grid size-4.5 shrink-0 place-items-center rounded-full border-[1.5px]",
                          state === "idle" && "border-dim",
                          state === "run" && "animate-spin-fast border-sky border-r-transparent",
                          state === "done" && "border-sky bg-sky",
                        )}
                      >
                        {state === "done" && (
                          <span className="h-1 w-1.75 -translate-y-px -rotate-45 border-b-2 border-l-2 border-background" />
                        )}
                      </i>
                      <span>{step}</span>
                    </li>
                  );
                })}
              </ol>
            ) : (
              <>
                <p className="mt-2 mb-3 text-sm leading-normal text-muted">{text.intro}</p>
                <div className="grid gap-1.5">
                  {instructions.map((ins, i) => {
                    const done = applied.includes(i);
                    return (
                      <button
                        key={ins.text}
                        type="button"
                        disabled={done || busy}
                        onClick={() => runInstruction(i)}
                        className="flex min-h-11 w-full items-center gap-2.5 rounded-xl border border-border-ghost bg-fill-4 px-3 py-2 text-left text-sm leading-snug font-medium text-foreground transition-colors duration-250 hover:border-border-ghost-hover hover:bg-fill-hover disabled:cursor-default disabled:opacity-50"
                      >
                        <ArrowRightIcon aria-hidden className="size-4 shrink-0 text-accent" />
                        <span>
                          {ins.text}
                          {done && ` ${text.doneSuffix}`}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </>
            )}

            {message && (
              <p
                className={cn(
                  "mt-3 text-sm leading-normal",
                  message.ok ? "text-leaf-100" : "text-muted",
                )}
              >
                {message.text}
              </p>
            )}
          </>
        )}
      </Swap>

      {/* Prompt */}
      <form
        onSubmit={onSubmit}
        autoComplete="off"
        className="mt-3.5 flex items-center gap-2 rounded-full border border-border-strong bg-well py-1.25 pr-1.25 pl-3 transition-[border-color,box-shadow] duration-300 focus-within:border-border-ghost-hover focus-within:shadow-focus-sky"
      >
        <SparkleIcon weight="fill" aria-hidden className="size-4.5 shrink-0 fill-brand-gradient" />
        <label className="sr-only" htmlFor={`${consoleId}-input`}>
          {text.inputLabel}
        </label>
        <input
          ref={inputRef}
          id={`${consoleId}-input`}
          type="text"
          value={query}
          readOnly={busy}
          aria-disabled={busy}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => !consoleOpen && !busy && openConsole(false)}
          placeholder={text.placeholder}
          enterKeyHint="send"
          className="min-h-9.5 min-w-0 flex-1 bg-transparent text-md font-medium text-ellipsis text-foreground outline-none placeholder:text-muted focus-visible:outline-none"
        />
        <Button type="submit" size="icon" aria-label={text.sendLabel} disabled={busy}>
          <ArrowRightIcon aria-hidden />
        </Button>
      </form>
    </aside>
  );
}
