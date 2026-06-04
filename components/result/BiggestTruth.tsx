"use client";
import { motion } from "framer-motion";
import { RoastResult } from "@/types/roast";
import { FADE_UP_VIEWPORT } from "@/lib/motion";
import { ExclaimDoodle, StarDoodle } from "../decoration/Doodles";
import { SectionKicker } from "../ui/SectionKicker";

export function BiggestTruth({ truth }: { truth: RoastResult["biggest_truth"] }) {
  return (
    <motion.section {...FADE_UP_VIEWPORT} className="relative">
      <ExclaimDoodle
        aria-hidden
        className="pointer-events-none absolute -left-4 top-1 hidden h-14 w-4 text-[var(--accent-pink)] md:-left-8 md:block"
      />
      <StarDoodle
        aria-hidden
        className="pointer-events-none absolute -right-2 top-0 hidden h-6 w-6 rotate-12 text-[var(--accent-lime)] md:block"
      />

      <SectionKicker>the biggest truth</SectionKicker>

      <h2 className="font-display mt-4 text-[1.5rem] font-bold leading-[1.15] sm:text-3xl md:text-4xl lg:text-5xl">
        <span className="marker-pink marker">{truth.headline}.</span>
      </h2>

      <p className="mt-6 text-[0.95rem] leading-7 text-[var(--ink-soft)] sm:text-base md:text-lg sm:leading-8">
        {truth.explanation}
      </p>

      <p className="pull-quote mt-8 border-l-4 border-[var(--accent)] pl-4 text-lg italic text-[var(--ink)] sm:mt-10 sm:pl-5 sm:text-xl md:text-2xl lg:text-3xl">
        “{truth.one_liner}”
      </p>
    </motion.section>
  );
}
