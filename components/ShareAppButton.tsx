"use client";

import { useCallback, useState } from "react";
import { Share2 } from "lucide-react";

type ShareAppButtonProps = {
  iconOnly?: boolean;
};

function ShareAppButton({ iconOnly = false }: ShareAppButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = useCallback(async () => {
    const url =
      process.env.NEXT_PUBLIC_SITE_URL ||
      (typeof window !== "undefined" ? window.location.origin : "");

    const title = "Roastume 🔥";
    const text = "Think your resume is good? Upload it and find out.";

    try {
      if (typeof navigator !== "undefined" && navigator.share) {
        await navigator.share({
          title,
          text,
          url,
        });
        return;
      }

      const shareText = `${text}\n\n${url}`;

      await navigator.clipboard.writeText(shareText);

      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      // Don't crash the UI if sharing fails
    }
  }, []);

  if (iconOnly) {
    return (
      <button
        onClick={handleShare}
        className="inline-flex items-center gap-2 p-2 rounded-md text-[var(--ink)] hover:bg-white/[0.02]"
        aria-label={copied ? "Link copied" : "Share Roastume"}
      >
        <Share2 className="h-5 w-5" />
        <span className="text-sm">{copied ? "Link copied!" : "Share Roastume"}</span>
      </button>
    );
  }

  return (
    <button
      onClick={handleShare}
      className="inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium text-[var(--ink)] hover:bg-white/[0.02]"
      aria-label="Share Roastume"
    >
      <Share2 className="h-4 w-4" />
      {copied ? "Link copied!" : "Share Roastume"}
    </button>
  );
}

export { ShareAppButton };
export default ShareAppButton;
