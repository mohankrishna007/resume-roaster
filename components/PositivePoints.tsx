"use client";
import { motion } from "framer-motion";

interface PositivePointsProps {
  wins: string[];
}

export function PositivePoints({ wins }: PositivePointsProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
    >
      <p className="kicker">but real talk — these are good</p>
      <h2 className="font-display mt-3 text-[1.85rem] font-bold leading-tight sm:text-4xl">
        Stuff you actually <span className="marker-green marker">got right.</span>
      </h2>

      <div className="mt-8 grid gap-5 sm:flex sm:flex-wrap">
        {wins.map((win, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.08 }}
            whileHover={{ y: -4, rotate: 0 }}
            className={`sticky-note ${
              idx % 3 === 1 ? "alt" : idx % 3 === 2 ? "alt2" : ""
            } w-full sm:w-[15rem]`}
          >
            <p className="font-display text-lg font-bold leading-snug">
              {win}
            </p>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}
