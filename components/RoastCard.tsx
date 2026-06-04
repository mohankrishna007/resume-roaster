"use client";
import { motion } from "framer-motion";
import { Roast } from "@/types/roast";
import { Sparkles, Flame, Heart, Zap, Skull } from "lucide-react";

type SevKey = "mild" | "medium" | "savage" | "good";

const severityMeta: Record<
  Roast["severity"],
  {
    key: SevKey;
    label: string;
    Icon: typeof Flame;
  }
> = {
  mild: { key: "mild", label: "mild", Icon: Zap },
  medium: { key: "medium", label: "medium heat", Icon: Flame },
  savage: { key: "savage", label: "savage", Icon: Skull },
  actually_good: { key: "good", label: "actually good", Icon: Heart },
};

export function RoastCard({ roast, index }: { roast: Roast; index: number }) {
  const meta = severityMeta[roast.severity] ?? severityMeta.medium;
  const lineNum = String(index + 1).padStart(2, "0");
  const isGood = roast.severity === "actually_good";

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{
        delay: Math.min(index * 0.06, 0.3),
        duration: 0.4,
        ease: "easeOut",
      }}
      className="grid gap-5 md:grid-cols-[1fr_1.15fr] md:gap-6 md:items-start"
    >
      {/* LEFT — the resume line, rendered as a quoted document line */}
      <div className={`doc-line sev-${meta.key}`}>
        <div className={`sev-stamp sev-${meta.key}`}>
          <meta.Icon className="h-3 w-3" />
          {meta.label}
        </div>
        <div className="doc-meta">
          <span className="doc-num">L{lineNum}</span>
          <span>your resume said</span>
        </div>
        <p className="doc-text">
          <span className="doc-text-highlight">
            &ldquo;{roast.resume_line}&rdquo;
          </span>
          <span className="annot-caret md:hidden" aria-hidden>↘</span>
        </p>
      </div>

      {/* RIGHT — the annotation: reaction + roast + (optional) fix */}
      <div className="space-y-3">
        <div className={`annotation sev-${meta.key}`}>
          <p className="text-[0.7rem] font-bold uppercase tracking-[0.2em] text-[var(--ink-mute)]">
            {isGood ? "actual praise" : "what the roaster said"}
          </p>
          <p className="mt-2 text-sm font-semibold text-[var(--ink-soft)]">
            {roast.reaction}
          </p>
          <p className="font-display mt-2 text-xl leading-[1.3] font-semibold sm:text-[1.4rem]">
            {roast.roast}
          </p>
        </div>

        {!isGood && (
          <div className="fix-row">
            <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-[var(--hl-green)]" />
            <p className="text-sm leading-6 text-[var(--ink-soft)]">
              <span className="font-semibold text-[var(--hl-green)]">try this:</span>{" "}
              {roast.fix}
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
