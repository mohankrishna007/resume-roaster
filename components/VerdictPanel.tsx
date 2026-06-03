"use client";
import { motion } from "framer-motion";
import { RoastResult } from "@/types/roast";
import { Copy, RefreshCcw, Share2, Check } from "lucide-react";
import { useState } from "react";

interface VerdictPanelProps {
  verdict: RoastResult["verdict"];
  candidateName: string;
  onReset: () => void;
}

export function VerdictPanel({ verdict, candidateName, onReset }: VerdictPanelProps) {
  const [copied, setCopied] = useState(false);

  const shareText = `${candidateName}'s resume just got roasted:\n\n"${verdict.share_quote}"\n\nGet yours →`;

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: "My Resume Roast",
          text: shareText,
          url: window.location.href,
        });
        return;
      }
      await navigator.clipboard?.writeText(`${shareText} ${window.location.href}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // ignore
    }
  };

  const handleCopy = async () => {
    await navigator.clipboard?.writeText(`"${verdict.share_quote}" — Resume Roaster`);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
    >
      <p className="kicker">final verdict</p>

      <h2 className="font-display mt-4 text-4xl font-bold leading-[1.1] sm:text-5xl">
        {verdict.headline}
      </h2>

      <motion.div
        initial={{ scale: 0.96 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true }}
        transition={{ type: "spring", stiffness: 180, damping: 18 }}
        className="relative mt-10 rounded-[28px] bg-gradient-to-br from-amber-200 via-orange-300 to-rose-400 p-[2px]"
      >
        <div className="rounded-[26px] bg-[#120e0b] px-7 py-10 sm:px-10 sm:py-14">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-[var(--accent)]">
            ↓ screenshot this ↓
          </p>
          <p className="pull-quote mt-5 text-3xl leading-[1.15] sm:text-4xl">
            “{verdict.share_quote}”
          </p>
          <p className="mt-6 text-sm text-[var(--ink-mute)]">
            — resume roaster, on {candidateName.split(" ")[0]}&apos;s resume
          </p>

          <button
            onClick={handleCopy}
            className="mt-6 inline-flex items-center gap-2 text-xs font-semibold text-[var(--ink-mute)] hover:text-[var(--ink)]"
          >
            {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
            {copied ? "copied" : "copy quote"}
          </button>
        </div>
      </motion.div>

      <div className="mt-10 flex flex-col gap-3 sm:flex-row">
        <button onClick={handleShare} className="btn-hot flex-1 justify-center text-base">
          <Share2 className="h-4 w-4" />
          Share this roast
        </button>
        <button onClick={onReset} className="btn-ghost flex-1 justify-center text-base">
          <RefreshCcw className="h-4 w-4" />
          Roast another resume
        </button>
      </div>

      <p className="mt-5 text-center text-sm text-[var(--ink-mute)]">
        send it to a friend whose resume needs this
      </p>
    </motion.section>
  );
}
