"use client";

import { useState, useCallback } from "react";
import type { UploadedResume, RoastResult } from "@/types/roast";
import { roastResume } from "@/lib/roast-engine";
import { track } from "@/lib/analytics";

type Step = "idle" | "uploading" | "processing" | "result" | "error";

interface State {
  step: Step;
  uploadedResume: UploadedResume | null;
  roastResult: RoastResult | null;
  shareId: string | null;
  error: string | null;
}

const initialState: State = {
  step: "idle",
  uploadedResume: null,
  roastResult: null,
  shareId: null,
  error: null,
};

export function useRoastFlow() {
  const [state, setState] = useState<State>(initialState);

  const handleUpload = useCallback(async (file: File) => {
    const startedAt = performance.now();
    track("roast_upload_started", {
      file_size_kb: Math.round(file.size / 1024),
    });

    setState({
      step: "uploading",
      uploadedResume: { file, text: "", filename: file.name },
      roastResult: null,
      shareId: null,
      error: null,
    });

    // Fire the LLM request immediately — don't wait for the animation rhythm.
    // The processing screen animation runs in parallel with the actual work.
    const roastPromise = roastResume(file).then(
      (r) => ({ ok: true as const, response: r }),
      (err: unknown) => ({ ok: false as const, err }),
    );

    // Brief moment on the "opening your file" screen for UX rhythm.
    await new Promise((r) => setTimeout(r, 350));
    setState((prev) => ({ ...prev, step: "processing" }));

    // Minimum time on the processing screen so the steps don't flash by if
    // the model returns very fast.
    const [result] = await Promise.all([
      roastPromise,
      new Promise((r) => setTimeout(r, 1800)),
    ]);

    if (result.ok) {
      track("roast_upload_succeeded", {
        duration_ms: Math.round(performance.now() - startedAt),
        overall_score: result.response.result.scores.overall,
        roast_count: result.response.result.roasts.length,
        shared: result.response.shareId ? "yes" : "no",
      });
      setState((prev) => ({
        ...prev,
        step: "result",
        roastResult: result.response.result,
        shareId: result.response.shareId,
      }));
      // Reflect the shareable URL without a full navigation so refresh / share
      // both land on the persisted view.
      if (result.response.shareId && typeof window !== "undefined") {
        window.history.replaceState(null, "", `/r/${result.response.shareId}`);
      }
    } else {
      const message =
        result.err instanceof Error
          ? result.err.message
          : "Failed to process resume";
      track("roast_upload_failed", {
        duration_ms: Math.round(performance.now() - startedAt),
        message: message.slice(0, 120),
      });
      setState({
        step: "error",
        uploadedResume: null,
        roastResult: null,
        shareId: null,
        error: message,
      });
    }
  }, []);

  const reset = useCallback(() => {
    if (typeof window !== "undefined" && window.location.pathname !== "/") {
      window.history.replaceState(null, "", "/");
    }
    setState(initialState);
  }, []);

  return { ...state, handleUpload, reset };
}
