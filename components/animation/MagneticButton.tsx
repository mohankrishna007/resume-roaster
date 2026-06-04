"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { useRef, type ReactNode, type MouseEvent } from "react";

interface MagneticButtonProps {
  children: ReactNode;
  className?: string;
  onClick?: (e: MouseEvent<HTMLElement>) => void;
  href?: string;
  ariaLabel?: string;
  /** how strongly the button is pulled toward the cursor (0–1) */
  strength?: number;
}

/**
 * Magnetic hover wrapper — subtle pull toward the cursor with spring lag.
 * Disabled on coarse pointers automatically (CSS only fine-pointer tracks pointer events).
 */
export function MagneticButton({
  children,
  className,
  onClick,
  href,
  ariaLabel,
  strength = 0.35,
}: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 18, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 220, damping: 18, mass: 0.4 });

  const handleMove = (e: MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const dx = e.clientX - (r.left + r.width / 2);
    const dy = e.clientY - (r.top + r.height / 2);
    x.set(dx * strength);
    y.set(dy * strength);
  };

  const handleLeave = () => {
    x.set(0);
    y.set(0);
  };

  const inner = (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{ x: sx, y: sy }}
      className="inline-block"
    >
      {href ? (
        <a href={href} onClick={onClick} aria-label={ariaLabel} className={className}>
          {children}
        </a>
      ) : (
        <button onClick={onClick} aria-label={ariaLabel} className={className}>
          {children}
        </button>
      )}
    </motion.div>
  );

  return inner;
}
