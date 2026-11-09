"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import { minWidth } from "@/theme/breakpoints";

export type AssistantStatus = "idle" | "working" | "done";

type AssistantContextValue = {
  consoleId: string;
  consoleOpen: boolean;
  setConsoleOpen: (open: boolean) => void;
  /** An instruction is running; the console can't be closed or reopened */
  busy: boolean;
  setBusy: (busy: boolean) => void;
  /** "working" drives the orb's thinking look */
  status: AssistantStatus;
  setStatus: (status: AssistantStatus) => void;
  /** Open the console; with `focus`, scroll it into view (small screens) and focus the input (mouse users). */
  openConsole: (focus?: boolean) => void;
  inputRef: React.RefObject<HTMLInputElement | null>;
  panelRef: React.RefObject<HTMLElement | null>;
};

const AssistantContext = createContext<AssistantContextValue | null>(null);

/** Shared state between the assistant orb, its status tag and the readout console. */
export function AssistantProvider({ children }: { children: React.ReactNode }) {
  const consoleId = useId();
  const [consoleOpen, setConsoleOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState<AssistantStatus>("idle");
  const inputRef = useRef<HTMLInputElement | null>(null);
  const panelRef = useRef<HTMLElement | null>(null);
  const busyRef = useRef(false);
  useEffect(() => {
    busyRef.current = busy;
  }, [busy]);

  const openConsole = useCallback((focus = false) => {
    if (busyRef.current) return;
    setConsoleOpen(true);
    if (!focus) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!window.matchMedia(minWidth("lg")).matches) {
      panelRef.current?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "center" });
    }
    if (window.matchMedia("(pointer: fine)").matches) {
      requestAnimationFrame(() => inputRef.current?.focus({ preventScroll: true }));
    }
  }, []);

  const value = useMemo(
    () => ({
      consoleId,
      consoleOpen,
      setConsoleOpen,
      busy,
      setBusy,
      status,
      setStatus,
      openConsole,
      inputRef,
      panelRef,
    }),
    [consoleId, consoleOpen, busy, status, openConsole],
  );

  return <AssistantContext.Provider value={value}>{children}</AssistantContext.Provider>;
}

export function useAssistant() {
  const ctx = useContext(AssistantContext);
  if (!ctx) throw new Error("useAssistant must be used inside <AssistantProvider>");
  return ctx;
}
