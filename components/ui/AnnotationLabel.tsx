import type { ReactNode } from "react";

/**
 * The tiny uppercase eyebrow used on annotation cards
 * ("what the roaster said", "actual praise", etc.).
 */
export function AnnotationLabel({ children }: { children: ReactNode }) {
  return (
    <p className="text-[0.7rem] font-bold uppercase tracking-[0.2em] text-[var(--ink-mute)]">
      {children}
    </p>
  );
}
