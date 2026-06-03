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

    // Brief moment on the "opening your file" screen for UX rhythm.
    await new Promise((r) => setTimeout(r, 350));

    setState((prev) => ({ ...prev, step: "processing" }));

    try {
      const roast = await roastResume(file);
      setState((prev) => ({
        ...prev,
        step: "result",
        roastResult: roast,
      }));
    } catch (err) {
      setState({
        step: "error",
        uploadedResume: null,
        roastResult: null,
        error: err instanceof Error ? err.message : "Failed to process resume",
      });
    }
  }, []);

  const reset = useCallback(() => setState(initialState), []);

  return { ...state, handleUpload, reset };
}
