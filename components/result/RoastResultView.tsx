"use client";

import Link from "next/link";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Flame, RefreshCcw } from "lucide-react";
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
import { useShareRoast } from "@/hooks/useShareRoast";
import { useAuth } from "../auth/AuthProvider";
import { SignInGate } from "../auth/SignInGate";
import { SectionKicker } from "../ui/SectionKicker";

/** Fraction of items shown to anonymous users before the sign-in gate. */
const FREE_FRACTION = 0.6;

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
  const { user } = useAuth();
  const shareRoast = useShareRoast();
  const allRoasts = roastResult.roasts;
  const freeRoasts = Math.max(1, Math.ceil(allRoasts.length * FREE_FRACTION));
  const isLocked = !user && allRoasts.length > freeRoasts;
  const visibleRoasts = isLocked ? allRoasts.slice(0, freeRoasts) : allRoasts;

  const handleShare = () => {
    void shareRoast(roastResult, shareId, "topbar");
  };



  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={CONTAINER_TRANSITION}
      className="relative z-10"
    >
      <div className="bar-gradient sticky top-0 z-30 border-b border-[var(--line)] bg-[#0b0810]/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-3 sm:px-8 lg:max-w-6xl lg:px-12 2xl:max-w-7xl">
          <div className="flex min-w-0 items-center gap-2.5">
            <Link href="/" aria-label="Home" className="inline-flex shrink-0 items-center justify-center rounded-md p-0 !cursor-pointer">
              <Image
                src="/icon.png"
                alt=""
                width={28}
                height={28}
                className="h-7 w-7 rounded-sm"
              />
            </Link>
            <p className="truncate text-sm font-semibold text-[var(--ink-soft)]">
              <span className="text-[var(--ink-mute)]">roast for</span>{" "}
              {roastResult.candidate.name}
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            {onReset ? (
              <button
                onClick={onReset}
                className="btn-bar btn-bar-ghost max-sm:btn-bar-icon"
                aria-label="Roast another"
              >
                <RefreshCcw className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">New</span>
              </button>
            ) : (
              <Link
                href="/"
                className="btn-bar btn-bar-primary max-sm:btn-bar-icon"
                aria-label="Roast your own"
              >
                <Flame className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Roast mine</span>
              </Link>
            )}
          </div>
        </div>
      </div>

      <article className="mx-auto max-w-5xl px-4 py-10 sm:px-8 sm:py-14 lg:max-w-6xl lg:px-12 lg:py-16 2xl:max-w-7xl 2xl:py-20">
        <div className="mx-auto max-w-3xl lg:max-w-4xl 2xl:max-w-5xl">
          <HeroRoast
            archetype={roastResult.archetype}
            candidate={roastResult.candidate}
          />

          <div className="my-12 rule-dotted" />

          <ScoresDisplay scores={roastResult.scores} />

          <div className="my-12 rule-dotted" />

          <CandidateSummary candidate={roastResult.candidate} />

          <div className="my-14">
            <SectionKicker>the breakdown</SectionKicker>
            <h2 className="font-display mt-3 text-[1.65rem] font-bold leading-[1.1] sm:text-3xl md:text-4xl lg:text-5xl lg:leading-[1.05]">
              Line by line, no mercy.
            </h2>
            <p className="mt-3 text-[var(--ink-soft)]">
              {isLocked
                ? "A taste of the breakdown — sign in to see the rest."
                : `${allRoasts.length} moments your resume should probably hear.`}
            </p>
          </div>
        </div>

        <div className="space-y-8 sm:space-y-10 lg:space-y-12">
          {visibleRoasts.map((roast, idx) => (
            <RoastCard key={idx} roast={roast} index={idx} />
          ))}
        </div>

        {isLocked && (
          <div className="mx-auto mt-12 max-w-3xl">
            <SignInGate />
          </div>
        )}

        <div className="mx-auto mt-14 max-w-3xl lg:max-w-4xl 2xl:max-w-5xl">
          <div className="rule-dotted" />

          <div className="mt-14">
            <PositivePoints
              wins={roastResult.wins}
              maxWins={
                isLocked && roastResult.wins.length > 1
                  ? Math.max(1, Math.ceil(roastResult.wins.length * 0.6))
                  : undefined
              }
            />
          </div>

          <div className="my-14 rule-dotted" />

          <BiggestTruth truth={roastResult.biggest_truth} />

          <div className="my-14 rule-dotted" />

          <VerdictPanel
            result={roastResult}
            shareId={shareId ?? null}
            onReset={onReset ?? (() => (window.location.href = "/"))}
          />
        </div>
      </article>
    </motion.div>
  );
}
