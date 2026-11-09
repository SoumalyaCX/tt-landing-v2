"use client";

import { useCallback, useEffect, useMemo, useRef } from "react";

/**
 * A bag of timeouts that is cleared on unmount.
 * `later` schedules, `clear` cancels everything still pending.
 */
export function useTimeouts() {
  const ids = useRef(new Set<number>());

  const clear = useCallback(() => {
    ids.current.forEach(clearTimeout);
    ids.current.clear();
  }, []);

  const later = useCallback((fn: () => void, ms: number) => {
    const id = window.setTimeout(() => {
      ids.current.delete(id);
      fn();
    }, ms);
    ids.current.add(id);
  }, []);

  useEffect(() => clear, [clear]);

  return useMemo(() => ({ later, clear }), [later, clear]);
}
