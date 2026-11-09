"use client";

import { useEffect, useRef, useState } from "react";

export type NowPlayingProps = {
  app: string;
  detail: string;
  /** Seconds already elapsed when the timer starts */
  startSeconds: number;
};

const pad = (n: number) => String(n).padStart(2, "0");
const format = (s: number) =>
  `${pad(Math.floor(s / 3600))}:${pad(Math.floor(s / 60) % 60)}:${pad(s % 60)}`;

/** "Currently working in …" row with a live timer that ticks while visible. */
export function NowPlaying({ app, detail, startSeconds }: NowPlayingProps) {
  const [secs, setSecs] = useState(startSeconds);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let visible = false;
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    if (ref.current) io.observe(ref.current);
    const id = window.setInterval(() => visible && setSecs((s) => s + 1), 1000);
    return () => {
      io.disconnect();
      clearInterval(id);
    };
  }, []);

  return (
    <div
      ref={ref}
      className="flex min-w-0 items-center gap-2.5 rounded-xl border border-border bg-sky/12 px-3 py-2.25 text-xs text-muted"
    >
      <span className="shrink-0 text-sm font-bold text-strong">{app}</span>
      <span className="min-w-0 truncate">{detail}</span>
      <b className="ml-auto shrink-0 font-semibold text-strong tabular-nums">{format(secs)}</b>
    </div>
  );
}
