"use client";

import { useState, useCallback } from "react";
import type { UploadedResume, RoastResult } from "@/types/roast";
import { roastResume } from "@/lib/roast-engine";

type Step = "idle" | "uploading" | "processing" | "result" | "error";

interface State {
  step: Step;
  uploadedResume: UploadedResume | null;
  roastResult: RoastResult | null;
  error: string | null;
}

const initialState: State = {
  step: "idle",
  uploadedResume: null,
  roastResult: null,
  error: null,
};

export function useRoastFlow() {
  const [state, setState] = useState<State>(initialState);

  const handleUpload = useCallback(async (file: File) => {
    setState({
      step: "uploading",
      uploadedResume: { file, text: "", filename: file.name },
      roastResult: null,
      error: null,
    });

    // Fire the LLM request immediately — don't wait for the animation rhythm.
    // The processing screen animation runs in parallel with the actual work.
    const roastPromise = roastResume(file).then(
      (r) => ({ ok: true as const, roast: r }),
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
      setState((prev) => ({ ...prev, step: "result", roastResult: result.roast }));
    } else {
      setState({
        step: "error",
        uploadedResume: null,
        roastResult: null,
        error:
          result.err instanceof Error
            ? result.err.message
            : "Failed to process resume",
      });
    }
  }, []);

  const reset = useCallback(() => setState(initialState), []);

  return { ...state, handleUpload, reset };
}
