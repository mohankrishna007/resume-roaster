import type { ReactNode } from "react";

/**
 * Tiny tracking-wide label that sits above section headings. Wraps the
 * `.kicker` CSS class so callers don't have to remember the magic string.
 */
export function SectionKicker({ children }: { children: ReactNode }) {
  return <p className="kicker">{children}</p>;
}
