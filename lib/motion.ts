/**
 * Shared framer-motion presets. Most sections in the result view animate the
 * same way (fade up on enter / on scroll) — these constants keep the wiring
 * identical so the rhythm of the page stays consistent.
 */

export const FADE_UP_VIEWPORT = {
  initial: { opacity: 0, y: 14 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.4 },
} as const;

export const FADE_UP_ENTER = {
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4 },
} as const;

/**
 * Slight stagger for list items — delay scales with index but caps so the
 * 10th card doesn't take a second to fade in.
 */
export function fadeUpStaggered(index: number) {
  return {
    initial: { opacity: 0, y: 16 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-80px" },
    transition: {
      delay: Math.min(index * 0.06, 0.3),
      duration: 0.4,
      ease: "easeOut" as const,
    },
  };
}
