"use client";

import { useState, useRef, useCallback, useEffect } from "react";

export function useTimer() {
  const [elapsed, setElapsed] = useState(0);
  const startRef = useRef<number | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const start = useCallback(() => {
    if (startRef.current !== null) return;
    startRef.current = Date.now();
    intervalRef.current = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startRef.current!) / 1000));
    }, 1000);
  }, []);

  const stop = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => stop();
  }, [stop]);

  const formatted = `${Math.floor(elapsed / 60)}:${(elapsed % 60)
    .toString()
    .padStart(2, "0")}`;

  return { elapsed, formatted, start, stop };
}
