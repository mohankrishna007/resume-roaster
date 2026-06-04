"use client";
import { useCallback } from "react";
import type { RoastResult } from "@/types/roast";
import { track } from "@/lib/analytics";
import { buildShareContent } from "@/lib/roast/share";

type Surface = "topbar" | "verdict";

/**
 * Wraps the navigator.share / clipboard fallback dance so both share buttons
 * (topbar + verdict) emit identical analytics and copy.
 */
export function useShareRoast() {
  return useCallback(
    async (
      result: RoastResult,
      shareId: string | null | undefined,
      surface: Surface,
    ): Promise<"native" | "clipboard" | "failed"> => {
      if (typeof window === "undefined") return "failed";
      const url = shareId
        ? `${window.location.origin}/r/${shareId}`
        : window.location.href;
      const share = buildShareContent(result, url);

      try {
        if (typeof navigator !== "undefined" && navigator.share) {
          await navigator.share({
            title: share.title,
            text: share.text,
            url: share.url,
          });
          track("share_clicked", { surface, method: "native" });
          return "native";
        }
        await navigator.clipboard?.writeText(share.full);
        track("share_clicked", { surface, method: "clipboard" });
        return "clipboard";
      } catch {
        return "failed";
      }
    },
    [],
  );
}
