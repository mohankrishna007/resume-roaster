import { Flame, Heart, Skull, Sparkles, Zap } from "lucide-react";
import type { Severity } from "@/types/roast";

export type SevKey = "mild" | "medium" | "savage" | "good";

export interface SeverityMeta {
  /** CSS modifier suffix — drives `.sev-*` styles. */
  key: SevKey;
  label: string;
  Icon: typeof Flame;
}

/**
 * Maps the LLM-emitted severity to the visual treatment + icon used by
 * RoastCard, PositivePoints, and the demo on the landing page.
 */
export const SEVERITY_META: Record<Severity | "actually_good", SeverityMeta> = {
  mild: { key: "mild", label: "mild", Icon: Zap },
  medium: { key: "medium", label: "medium heat", Icon: Flame },
  savage: { key: "savage", label: "savage", Icon: Skull },
  actually_good: { key: "good", label: "actually good", Icon: Heart },
};

/** Convenience export for the "win" / praise card which always uses Sparkles. */
export const PRAISE_ICON = Sparkles;
