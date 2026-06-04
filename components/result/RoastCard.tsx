"use client";
import type { Roast } from "@/types/roast";
import { Sparkles } from "lucide-react";
import { ResumeLineCard } from "./ResumeLineCard";

export function RoastCard({ roast, index }: { roast: Roast; index: number }) {
  const isGood = roast.severity === "actually_good";

  return (
    <ResumeLineCard
      severity={roast.severity}
      index={index}
      resumeLine={roast.resume_line}
      annotationLabel={isGood ? "actual praise" : "what the roaster said"}
      reaction={roast.reaction}
      body={roast.roast}
      footer={
        !isGood && (
          <div className="fix-row">
            <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-[var(--hl-green)]" />
            <p className="text-sm leading-6 text-[var(--ink-soft)]">
              <span className="font-semibold text-[var(--hl-green)]">try this:</span>{" "}
              {roast.fix}
            </p>
          </div>
        )
      }
    />
  );
}
