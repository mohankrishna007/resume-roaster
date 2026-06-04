"use client";
import { useEffect, useState } from "react";

/**
 * Reveal `text` character-by-character once `start` flips true.
 * Used for the verdict pull-quote so it feels like the roaster is typing it.
 */
export function useTypewriter(text: string, start: boolean, speedMs = 22): string {
  const [out, setOut] = useState("");

  useEffect(() => {
    if (!start) return;
    const init = setTimeout(() => setOut(""), 0);
    let i = 0;
    const id = setInterval(() => {
      i++;
      setOut(text.slice(0, i));
      if (i >= text.length) clearInterval(id);
    }, speedMs);
    return () => {
      clearInterval(id);
      clearTimeout(init);
    };
  }, [text, start, speedMs]);

  return out;
}
