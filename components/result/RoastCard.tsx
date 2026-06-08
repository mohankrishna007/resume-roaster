"use client";
import type { Roast } from "@/types/roast";
import { Sparkles } from "lucide-react";
import { ResumeLineCard } from "./ResumeLineCard";
import { FormattedText } from "../ui/FormattedText";

export function RoastCard({ roast, index }: { roast: Roast; index: number }) {
  return (
    <ResumeLineCard
      severity={roast.severity}
      index={index}
      resumeLine={roast.resume_line}
      annotationLabel={
        <div className="flex flex-wrap items-center gap-2">
          <span>what the roaster said</span>
          {roast.issue_type && (
            <span className="text-[10px] bg-red-500/10 border border-black rounded px-1.5 py-0.5 font-mono text-red-500 font-semibold uppercase tracking-wider">
              {roast.issue_type.replace(/_/g, " ")}
            </span>
          )}
          {roast.confidence && (
            <span className={`text-[10px] border rounded px-1.5 py-0.5 font-mono uppercase tracking-wider ${roast.confidence === "high"
                ? "bg-[var(--accent-lime)]/10 border-[var(--accent-lime)]/20 text-[var(--accent-lime)]"
                : roast.confidence === "medium"
                  ? "bg-yellow-500/10 border-yellow-500/20 text-yellow-500"
                  : "bg-red-500/10 border-red-500/20 text-red-500"
              }`}>
              {roast.confidence} confidence
            </span>
          )}
        </div>
      }
      reaction={roast.reaction}
      body={roast.roast}
      footer={
        <div className="fix-row flex-col sm:flex-row sm:items-center justify-between gap-4 w-full">
          <div className="flex items-start gap-2.5 w-full">
            <Sparkles className="mt-1 h-4 w-4 shrink-0 text-[var(--hl-green)]" />
            <div className="w-full">
              <p className="text-sm leading-6 text-[var(--ink-soft)]">
                <span className="font-semibold text-[var(--hl-green)]">Fix:</span>{" "}
                <FormattedText text={roast.fix} />
              </p>

              {roast.rewrite_candidate && roast.missing_fields && roast.missing_fields.length > 0 && (
                <div className="mt-2.5 flex flex-wrap items-center gap-1.5 text-xs text-[var(--ink-mute)]">
                  <span className="font-mono text-[9px] uppercase tracking-wider text-[var(--accent-lime)] bg-[var(--accent-lime)]/10 border border-[var(--accent-lime)]/20 rounded px-1.5 py-0.5">
                    missing
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {roast.missing_fields.map((f, fi) => (
                      <span key={fi} className="rounded bg-white/5 border border-white/10 px-1.5 py-0.5 font-mono text-[10px] text-[var(--ink-soft)] lowercase">
                        {f}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      }
    />
  );
}
