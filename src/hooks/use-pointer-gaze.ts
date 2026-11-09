"use client";

import { useEffect, useRef } from "react";

export type Gaze = {
  /** Pointer offset from the element's centre, in px */
  dx: number;
  dy: number;
  /** Distance from the centre (never 0) */
  d: number;
  /** Element width, in px */
  width: number;
};

/**
 * Calls `onGaze` on every pointer move with the pointer's position relative
 * to the element's centre. Only listens while the element is on screen, so
 * off-screen elements cost nothing.
 */
export function usePointerGaze(
  ref: React.RefObject<HTMLElement | null>,
  onGaze: (gaze: Gaze, e: PointerEvent) => void,
  { mouseOnly = false } = {},
) {
  const handler = useRef(onGaze);
  useEffect(() => {
    handler.current = onGaze;
  }, [onGaze]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onMove = (e: PointerEvent) => {
      if (mouseOnly && e.pointerType !== "mouse") return;
      const box = el.getBoundingClientRect();
      const dx = e.clientX - (box.left + box.width / 2);
      const dy = e.clientY - (box.top + box.height / 2);
      handler.current({ dx, dy, d: Math.hypot(dx, dy) || 1, width: box.width }, e);
    };
    let listening = false;
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting === listening) return;
      listening = entry.isIntersecting;
      if (listening) window.addEventListener("pointermove", onMove, { passive: true });
      else window.removeEventListener("pointermove", onMove);
    });
    io.observe(el);
    return () => {
      io.disconnect();
      window.removeEventListener("pointermove", onMove);
    };
  }, [ref, mouseOnly]);
}
