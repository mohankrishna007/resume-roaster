"use client";
import { useCallback, useEffect, useState } from "react";
import { useDropzone, type FileRejection } from "react-dropzone";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, ArrowRight, FileUp } from "lucide-react";

interface UploadZoneProps {
  onUpload: (file: File) => void;
  isLoading?: boolean;
  selectedFile?: string;
}

const MAX_BYTES = 5 * 1024 * 1024; // keep in sync with /api/roast

// Hard PDF check: some browsers / OSes hand us files with an empty or
// generic `application/octet-stream` MIME type. Trust the extension as a
// fallback, but require one of the two to clearly identify the file as PDF.
function isPdfFile(file: File): boolean {
  const lowerName = file.name.toLowerCase();
  const extOk = lowerName.endsWith(".pdf");
  const mimeOk = file.type === "application/pdf";
  return mimeOk || extOk;
}

export function UploadZone({ onUpload, isLoading = false, selectedFile }: UploadZoneProps) {
  const [error, setError] = useState<string | null>(null);

  // Auto-clear the error after a few seconds so it doesn't linger.
  useEffect(() => {
    if (!error) return;
    const t = window.setTimeout(() => setError(null), 4000);
    return () => window.clearTimeout(t);
  }, [error]);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) return;
      if (!isPdfFile(file)) {
        setError("PDF only. That file isn't a PDF.");
        return;
      }
      if (file.size > MAX_BYTES) {
        setError("That file is too big. Max 5 MB.");
        return;
      }
      setError(null);
      onUpload(file);
    },
    [onUpload]
  );

  const onDropRejected = useCallback((rejections: FileRejection[]) => {
    const first = rejections[0];
    const code = first?.errors[0]?.code;
    if (code === "file-invalid-type") {
      setError("PDF only. That file isn't a PDF.");
    } else if (code === "file-too-large") {
      setError("That file is too big. Max 5 MB.");
    } else if (code === "too-many-files") {
      setError("One resume at a time, please.");
    } else {
      setError("We couldn't accept that file. Try a different PDF.");
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive, isDragReject } =
    useDropzone({
      onDrop,
      onDropRejected,
      // Both the MIME-type key and the extension fallback. The extension
      // list is what's surfaced to the OS file picker, so non-PDFs are
      // greyed out / hidden by default.
      accept: { "application/pdf": [".pdf"] },
      maxSize: MAX_BYTES,
      disabled: isLoading,
      multiple: false,
    });

  return (
    <div {...getRootProps()} className="relative w-full">
      {/* `accept` here is a belt-and-suspenders hint for the native file
          dialog in case getInputProps doesn't propagate it on some browsers. */}
      <input {...getInputProps({ accept: "application/pdf,.pdf" })} className="hidden" />
      <span aria-hidden className={`dropzone-glow ${isDragActive ? "is-active" : ""}`} />
      <motion.div
        whileHover={!isLoading ? { y: -2 } : undefined}
        whileTap={!isLoading ? { scale: 0.99 } : undefined}
        animate={isDragActive ? { scale: 1.015 } : { scale: 1 }}
        transition={{ type: "spring", stiffness: 280, damping: 22 }}
        className={[
          "group relative flex flex-col gap-4 rounded-[28px] border-2 border-dashed p-4 transition-colors sm:flex-row sm:items-center sm:justify-between sm:gap-5 sm:p-6 md:p-7",
          isDragReject
            ? "border-rose-400 bg-rose-500/10"
            : isDragActive
              ? "border-[var(--accent)] bg-[var(--accent-soft)]"
              : "border-[var(--line)] bg-white/[0.02] hover:border-[var(--accent)]/60 hover:bg-white/[0.04]",
          isLoading ? "opacity-60 cursor-not-allowed" : "cursor-pointer",
        ].join(" ")}
      >
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-300 to-orange-500 text-zinc-900 shadow-lg shadow-orange-900/30 sm:h-14 sm:w-14">
            <FileUp className="h-5 w-5 sm:h-6 sm:w-6" />
          </div>
          <div className="min-w-0">
            <p className="font-display text-lg font-bold leading-tight sm:text-xl md:text-2xl">
              {isDragReject
                ? "nope — PDFs only"
                : isDragActive
                  ? "yes. let it go 👇"
                  : selectedFile ?? "Drop your resume. Get roasted."}
            </p>
            <p className="mt-1 text-xs text-[var(--ink-mute)] sm:text-sm">
              or tap to upload · PDF only · max 5 MB · nothing stored
            </p>
          </div>
        </div>

        <button
          type="button"
          disabled={isLoading}
          className="btn-hot whitespace-nowrap self-stretch sm:self-auto justify-center"
        >
          {isLoading ? (
            <>
              <motion.span
                animate={{ rotate: 360 }}
                transition={{ duration: 0.9, repeat: Infinity, ease: "linear" }}
                className="inline-block h-4 w-4 rounded-full border-2 border-zinc-900/30 border-t-zinc-900"
              />
              Roasting…
            </>
          ) : (
            <>
              Roast me <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>
      </motion.div>

      <AnimatePresence>
        {error && (
          <motion.div
            key="upload-error"
            role="alert"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18 }}
            className="mt-3 flex items-center gap-2 rounded-xl border border-rose-400/40 bg-rose-500/10 px-3 py-2 text-sm text-rose-200"
          >
            <AlertTriangle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
