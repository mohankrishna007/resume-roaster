"use client";
import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { motion } from "framer-motion";
import { ArrowRight, FileUp } from "lucide-react";

interface UploadZoneProps {
  onUpload: (file: File) => void;
  isLoading?: boolean;
  selectedFile?: string;
}

export function UploadZone({ onUpload, isLoading = false, selectedFile }: UploadZoneProps) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0 && acceptedFiles[0].type === "application/pdf") {
        onUpload(acceptedFiles[0]);
      }
    },
    [onUpload]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "application/pdf": [".pdf"] },
    disabled: isLoading,
    multiple: false,
  });

  return (
    <div {...getRootProps()} className="relative w-full">
      <input {...getInputProps()} className="hidden" />
      <span aria-hidden className={`dropzone-glow ${isDragActive ? "is-active" : ""}`} />
      <motion.div
        whileHover={!isLoading ? { y: -2 } : undefined}
        whileTap={!isLoading ? { scale: 0.99 } : undefined}
        animate={isDragActive ? { scale: 1.015 } : { scale: 1 }}
        transition={{ type: "spring", stiffness: 280, damping: 22 }}
        className={[
          "group relative flex flex-col gap-5 rounded-[28px] border-2 border-dashed p-6 transition-colors sm:flex-row sm:items-center sm:justify-between sm:p-7",
          isDragActive
            ? "border-[var(--accent)] bg-[var(--accent-soft)]"
            : "border-[var(--line)] bg-white/[0.02] hover:border-[var(--accent)]/60 hover:bg-white/[0.04]",
          isLoading ? "opacity-60 cursor-not-allowed" : "cursor-pointer",
        ].join(" ")}
      >
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-300 to-orange-500 text-zinc-900 shadow-lg shadow-orange-900/30">
            <FileUp className="h-6 w-6" />
          </div>
          <div>
            <p className="font-display text-2xl font-bold leading-tight">
              {isDragActive ? "yes. let it go 👇" : selectedFile ?? "Drop your resume in. We dare you."}
            </p>
            <p className="mt-1 text-sm text-[var(--ink-mute)]">
              or tap to upload · PDF only · nothing stored
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
    </div>
  );
}
