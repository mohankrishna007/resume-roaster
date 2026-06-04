"use client";

import { motion } from "framer-motion";

// Pre-defined animation configurations for better performance
const BLOB_ANIMATIONS = [
  {
    animate: { x: [0, 30, -20, 0], y: [0, -20, 20, 0] },
    transition: { duration: 22, repeat: Infinity, ease: "easeInOut" },
    className: "absolute -left-32 top-8 h-[28rem] w-[28rem] rounded-full bg-[#ff7a2f]/25 blur-[140px]",
  },
  {
    animate: { x: [0, -28, 16, 0], y: [0, 22, -18, 0] },
    transition: { duration: 26, repeat: Infinity, ease: "easeInOut" },
    className: "absolute right-[-6rem] top-1/3 h-[24rem] w-[24rem] rounded-full bg-[#ff4d8d]/18 blur-[150px]",
  },
  {
    animate: { x: [0, 18, -14, 0], y: [0, 20, -16, 0] },
    transition: { duration: 24, repeat: Infinity, ease: "easeInOut" },
    className: "absolute bottom-[-8rem] left-1/3 h-[30rem] w-[30rem] rounded-full bg-[#b39dff]/16 blur-[160px]",
  },
  {
    animate: { x: [0, -20, 14, 0], y: [0, -18, 22, 0] },
    transition: { duration: 28, repeat: Infinity, ease: "easeInOut" },
    className: "absolute right-1/4 bottom-1/4 h-[22rem] w-[22rem] rounded-full bg-[#c8ff3e]/10 blur-[150px]",
  },
] as const;

export function AnimatedBackground() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {BLOB_ANIMATIONS.map((blob, index) => (
        <motion.div
          key={index}
          animate={blob.animate}
          transition={blob.transition}
          className={blob.className}
        />
      ))}
    </div>
  );
}
