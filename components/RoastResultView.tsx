"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Flame, RefreshCcw, Share2 } from "lucide-react";
import type { RoastResult } from "@/types/roast";
import {
  HeroRoast,
  CandidateSummary,
  PositivePoints,
  RoastCard,
  BiggestTruth,
  ScoresDisplay,
  VerdictPanel,
} from "@/components";
import { CONTAINER_TRANSITION } from "@/lib/constants";
import { track } from "@/lib/analytics";

interface RoastResultViewProps {
  roastResult: RoastResult;
  shareId?: string | null;
  /** When provided, shows a "New" button that calls this. Omit for shared view. */
  onReset?: () => void;
}

export function RoastResultView({
  roastResult,
  shareId,
  onReset,
}: RoastResultViewProps) {
  const handleShare = () => {
    const url =
      shareId && typeof window !== "undefined"
        ? `${window.location.origin}/r/${shareId}`
        : typeof window !== "undefined"
          ? window.location.href
          : "";

    if (typeof navigator !== "undefined" && navigator.share) {
      navigator
        .share({
          title: `${roastResult.candidate.name}'s resume roast`,
          text: roastResult.verdict.share_quote,
          url,
        })
        .catch(() => {});
      track("share_clicked", { surface: "topbar", method: "native" });
    } else {
      navigator.clipboard?.writeText(url);
      track("share_clicked", { surface: "topbar", method: "clipboard" });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={CONTAINER_TRANSITION}
      className="relative z-10"
    >
      <div className="bar-gradient sticky top-0 z-30 border-b border-[var(--line)] bg-[#0b0810]/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-3 sm:px-8">
          <div className="flex min-w-0 items-center gap-2.5">
            <Flame className="h-4 w-4 shrink-0 text-[var(--accent)]" />
            <p className="truncate text-sm font-semibold text-[var(--ink-soft)]">
              <span className="text-[var(--ink-mute)]">roast for</span>{" "}
              {roastResult.candidate.name}
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <button onClick={handleShare} className="btn-hot !px-4 !py-2 text-sm">
              <Share2 className="h-3.5 w-3.5" />
              Share
            </button>
            {onReset ? (
              <button
                onClick={onReset}
                className="btn-ghost !px-3 !py-2 text-sm"
                aria-label="Roast another"
              >
                <RefreshCcw className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">New</span>
              </button>
            ) : (
              <Link
                href="/"
                className="btn-ghost !px-3 !py-2 text-sm"
                aria-label="Roast your own"
              >
                <Flame className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Roast mine</span>
              </Link>
            )}
          </div>
        </div>
      </div>

      <article className="mx-auto max-w-5xl px-6 py-12 sm:px-8 sm:py-14 lg:py-16">
        <div className="mx-auto max-w-3xl">
          <HeroRoast
            archetype={roastResult.archetype}
            candidate={roastResult.candidate}
          />

          <div className="my-12 rule-dotted" />

          <ScoresDisplay scores={roastResult.scores} />

          <div className="my-12 rule-dotted" />

          <CandidateSummary candidate={roastResult.candidate} />

          <div className="my-14">
            <p className="kicker">the breakdown</p>
            <h2 className="font-display mt-3 text-[2rem] font-bold leading-[1.1] sm:text-5xl sm:leading-[1.05]">
              Line by line, no mercy.
            </h2>
            <p className="mt-3 text-[var(--ink-soft)]">
              {roastResult.roasts.length} moments your resume should probably hear.
            </p>
          </div>
        </div>

        <div className="space-y-10 sm:space-y-12">
          {roastResult.roasts.map((roast, idx) => (
            <RoastCard key={idx} roast={roast} index={idx} />
          ))}
        </div>

        <div className="mx-auto mt-14 max-w-3xl">
          <div className="rule-dotted" />

          <div className="mt-14">
            <PositivePoints wins={roastResult.wins} />
          </div>

          <div className="my-14 rule-dotted" />

          <BiggestTruth truth={roastResult.biggest_truth} />

          <div className="my-14 rule-dotted" />

          <VerdictPanel
            verdict={roastResult.verdict}
            candidateName={roastResult.candidate.name}
            onReset={onReset ?? (() => (window.location.href = "/"))}
          />
        </div>
      </article>
    </motion.div>
  );
}
