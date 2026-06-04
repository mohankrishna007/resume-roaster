"use client";

import { motion, type Variants } from "framer-motion";
import type { ReactNode } from "react";

interface RevealOnScrollProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  /** keeps reveal pinned after first trigger */
  once?: boolean;
}

/**
 * Soft fade + lift + blur reveal that fires when the section enters the viewport.
 * Used to give the long landing page a more cinematic scroll rhythm.
 */
export function RevealOnScroll({
  children,
  className,
  delay = 0,
  y = 28,
  once = true,
}: RevealOnScrollProps) {
  const variants: Variants = {
    hidden: { opacity: 0, y, filter: "blur(8px)" },
    show: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { duration: 0.7, delay, ease: [0.21, 0.47, 0.32, 0.98] },
    },
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once, margin: "-80px" }}
      variants={variants}
      className={className}
    >
      {children}
    </motion.div>
  );
}
