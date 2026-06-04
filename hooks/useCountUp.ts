"use client";
import { animate, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";

/**
 * Animates an integer from 0 → `to` the first time the returned ref enters
 * the viewport. Used for the buzzword / scroll-seconds chips.
 */
export function useCountUp(to: number, duration = 1.1, delay = 0) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [val, setVal] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, to, {
      duration,
      delay,
      ease: "easeOut",
      onUpdate: (v) => setVal(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, to, duration, delay]);

  return { ref, value: val };
}
