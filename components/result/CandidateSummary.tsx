"use client";
import { motion } from "framer-motion";
import { RoastResult } from "@/types/roast";
import { FADE_UP_VIEWPORT } from "@/lib/motion";
import { SectionKicker } from "../ui/SectionKicker";

export function CandidateSummary({ candidate }: { candidate: RoastResult["candidate"] }) {
  const domain = candidate.domain_focus.map((d, i) => (
    <span key={d}>
      <span className="text-[var(--ink)]">{d.toLowerCase()}</span>
      {i < candidate.domain_focus.length - 1
        ? i === candidate.domain_focus.length - 2
          ? " and "
          : ", "
        : "."}
    </span>
  ));

  return (
    <motion.section {...FADE_UP_VIEWPORT}>
      <SectionKicker>who we&apos;re reading</SectionKicker>
      <p className="mt-4 text-base leading-7 text-[var(--ink-soft)] sm:text-lg sm:leading-8">
        <span className="font-display text-xl font-bold text-[var(--ink)] sm:text-2xl">
          {candidate.name}
        </span>
        {" — "}
        a <span className="text-[var(--ink)]">{candidate.experience_level.toLowerCase()}</span> with{" "}
        <span className="text-[var(--ink)]">{candidate.experience_years} years</span>
        {candidate.location.length > 0 && (
          <>
            , out of{" "}
            <span className="text-[var(--ink)]">{candidate.location.join(" / ")}</span>
          </>
        )}
        .{" "}
        {candidate.education && (
          <>
            Did <span className="text-[var(--ink)]">{candidate.education.degree}</span> at{" "}
            <span className="text-[var(--ink)]">{candidate.education.college}</span>.{" "}
          </>
        )}
        Works in {domain}
      </p>
    </motion.section>
  );
}
