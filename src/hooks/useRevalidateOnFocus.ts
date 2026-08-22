import { useEffect, useRef } from "react";

/**
 * Re-runs `callback` when the tab regains focus or becomes visible again, so
 * a page left open while an admin edits the underlying data (in another tab
 * or session) picks up the change without the user having to navigate away
 * and back. Throttled so rapid focus/visibility events don't double-fetch.
 */
export function useRevalidateOnFocus(callback: () => void, minIntervalMs = 15000) {
  const lastRun = useRef(Date.now());
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  useEffect(() => {
    const trigger = () => {
      const now = Date.now();
      if (now - lastRun.current < minIntervalMs) return;
      lastRun.current = now;
      callbackRef.current();
    };
    const onVisibilityChange = () => {
      if (document.visibilityState === "visible") trigger();
    };
    window.addEventListener("focus", trigger);
    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => {
      window.removeEventListener("focus", trigger);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [minIntervalMs]);
}
