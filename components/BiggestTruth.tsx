"use client";
import { motion } from "framer-motion";
import { RoastResult } from "@/types/roast";

export function BiggestTruth({ truth }: { truth: RoastResult["biggest_truth"] }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
    >
      <p className="kicker">the biggest truth</p>

      <h2 className="font-display mt-4 text-4xl font-bold leading-[1.15] sm:text-5xl">
        <span className="marker-pink marker">{truth.headline}.</span>
      </h2>

      <p className="mt-6 text-lg leading-8 text-[var(--ink-soft)]">
        {truth.explanation}
      </p>

      <p className="pull-quote mt-10 border-l-4 border-[var(--accent)] pl-5 text-2xl italic text-[var(--ink)] sm:text-3xl">
        “{truth.one_liner}”
      </p>
    </motion.section>
  );
}
