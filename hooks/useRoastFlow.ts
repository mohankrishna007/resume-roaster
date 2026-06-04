"use client";

import { useState, useCallback, useEffect } from "react";
import type { UploadedResume, RoastResult } from "@/types/roast";
import { roastResume } from "@/lib/roast/engine";
import { track } from "@/lib/analytics";
import { useAuth } from "@/components/auth/AuthProvider";
import {
  hasReachedGuestLimit,
  incrementGuestRoastCount,
} from "@/lib/roast/quota";

type Step =
  | "idle"
  | "uploading"
  | "processing"
  | "result"
  | "error"
  | "sign-in-required";

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
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const { user } = useAuth();

  const handleUpload = useCallback(async (file: File) => {
    // Guests get one roast per device. From the second roast on, force sign-in.
    if (!user && hasReachedGuestLimit()) {
      track("roast_blocked_guest_limit");
      setPendingFile(file);
      setState({
        step: "sign-in-required",
        uploadedResume: null,
        roastResult: null,
        shareId: null,
        error: null,
      });
      return;
    }

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
      if (!user) incrementGuestRoastCount();
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
      const errObj = result.err as (Error & { status?: number; reason?: string }) | undefined;
      const message =
        errObj instanceof Error
          ? errObj.message
          : "Failed to process resume";

      // Server-side guest cap hit — surface the same sign-in screen the
      // client-side check uses.
      if (!user && (errObj?.reason === "guest_limit" || errObj?.status === 401)) {
        track("roast_blocked_guest_limit", { source: "server" });
        setPendingFile(file);
        setState({
          step: "sign-in-required",
          uploadedResume: null,
          roastResult: null,
          shareId: null,
          error: null,
        });
        return;
      }

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
  }, [user]);

  const reset = useCallback(() => {
    if (typeof window !== "undefined" && window.location.pathname !== "/") {
      window.history.replaceState(null, "", "/");
    }
    setPendingFile(null);
    setState(initialState);
  }, []);

  // Once the user signs in from the sign-in gate, auto-resume the roast with
  // the file they originally dropped — no need to re-pick it.
  useEffect(() => {
    if (user && pendingFile && state.step === "sign-in-required") {
      const file = pendingFile;
      setPendingFile(null);
      void handleUpload(file);
    }
  }, [user, pendingFile, state.step, handleUpload]);

  return { ...state, handleUpload, reset };
}
