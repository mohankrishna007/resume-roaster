"use client";
import { motion } from "framer-motion";
import { Roast } from "@/types/roast";
import { Sparkles } from "lucide-react";

const severityMeta: Record<
  Roast["severity"],
  { label: string; bubbleClass: string; tagClass: string }
> = {
  mild: {
    label: "mild",
    bubbleClass: "bubble-you",
    tagClass: "tag hot",
  },
  medium: {
    label: "medium heat",
    bubbleClass: "bubble-you",
    tagClass: "tag hot",
  },
  savage: {
    label: "savage",
    bubbleClass:
      "border-rose-400/35 !bg-gradient-to-b !from-rose-500/20 !to-rose-500/8",
    tagClass:
      "tag !bg-rose-500/15 !border-rose-400/35 !text-rose-100",
  },
  actually_good: {
    label: "actually good",
    bubbleClass:
      "border-emerald-400/35 !bg-gradient-to-b !from-emerald-500/18 !to-emerald-500/6",
    tagClass: "tag good",
  },
};

export function RoastCard({ roast, index }: { roast: Roast; index: number }) {
  const meta = severityMeta[roast.severity] ?? severityMeta.medium;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ delay: Math.min(index * 0.05, 0.25), duration: 0.35 }}
      className="space-y-3"
    >
      {/* the line from their resume */}
      <div className="bubble bubble-them max-w-[88%] sm:max-w-[80%]">
        <p className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-[var(--ink-mute)]">
          your resume said
        </p>
        <p className="mt-1.5 italic text-[var(--ink-soft)] leading-7">
          &ldquo;{roast.resume_line}&rdquo;
        </p>
      </div>

      {/* the roast */}
      <div className={`bubble ml-auto max-w-[92%] sm:max-w-[85%] ${meta.bubbleClass}`}>
        <p className="text-sm font-bold tracking-wide text-[var(--ink)]">
          {roast.reaction}
        </p>
        <p className="font-display mt-1.5 text-xl font-semibold leading-[1.3] sm:text-2xl">
          {roast.roast}
        </p>
      </div>

      {/* severity tag */}
      <div className="ml-auto flex max-w-[92%] sm:max-w-[85%] flex-wrap items-center gap-2 pl-2 text-xs text-[var(--ink-mute)]">
        <span className={meta.tagClass}>{meta.label}</span>
      </div>

      {/* the fix — the value layer */}
      {roast.severity !== "actually_good" && (
        <div className="ml-auto flex max-w-[92%] gap-3 pl-2 sm:max-w-[85%]">
          <Sparkles className="mt-1 h-4 w-4 shrink-0 text-[var(--hl-green)]" />
          <p className="text-sm leading-7 text-[var(--ink-soft)]">
            <span className="text-[var(--hl-green)] font-semibold">try this:</span>{" "}
            {roast.fix}
          </p>
        </div>
      )}
    </motion.div>
  );
}
