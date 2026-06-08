/**
 * Renders text with basic inline Markdown parsing and quote highlighting:
 * - **bold** or __bold__ -> strong tag
 * - *italic* or _italic_ -> em tag
 * - `code` -> inline code tag
 * - 'quoted text' or "quoted text" -> inline highlighted code tag (preserving quotes)
 */
export function FormattedText({ text }: { text: string }) {
  if (!text) return null;

  // Split by bold (** or __), italic (* or _), inline code (`),
  // and quoted phrases (single/double quotes) only when surrounded by spaces or punctuation
  // to avoid matching apostrophes/contractions (like don't, it's).
  const regex = /(\*\*.*?\*\*|__.*?__|\*.*?\*|_.*?_|`.*?`|(?<=^|\s|[([{"'–—-])"[^"]+"(?=$|\s|[.,;:!?)"'\]}–—-])|(?<=^|\s|[([{"'–—-])'[^']+'(?=$|\s|[.,;:!?)"'\]}–—-]))/g;
  const parts = text.split(regex);

  return (
    <>
      {parts.map((part, index) => {
        if (
          (part.startsWith("**") && part.endsWith("**")) ||
          (part.startsWith("__") && part.endsWith("__"))
        ) {
          return (
            <strong key={index} className="font-bold text-[var(--ink)]">
              {part.slice(2, -2)}
            </strong>
          );
        }
        if (
          (part.startsWith("*") && part.endsWith("*")) ||
          (part.startsWith("_") && part.endsWith("_"))
        ) {
          return (
            <em key={index} className="italic text-[var(--ink-soft)]">
              {part.slice(1, -1)}
            </em>
          );
        }
        if (part.startsWith("`") && part.endsWith("`")) {
          return (
            <code
              key={index}
              className="font-mono bg-white/5 border border-white/10 rounded px-1.5 py-0.5 text-[0.7em] text-[var(--accent-lime)] font-semibold"
            >
              {part.slice(1, -1)}
            </code>
          );
        }
        if (part.startsWith('"') && part.endsWith('"')) {
          return (
            <code
              key={index}
              className="font-mono bg-white/5 border border-white/10 rounded px-1.5 py-0.5 text-[0.7em] text-[var(--accent-lime)] font-semibold"
            >
              &ldquo;{part.slice(1, -1)}&rdquo;
            </code>
          );
        }
        if (part.startsWith("'") && part.endsWith("'")) {
          return (
            <code
              key={index}
              className="font-mono bg-white/5 border border-white/10 rounded px-1.5 py-0.5 text-[0.7em] text-[var(--accent-lime)] font-semibold"
            >
              &apos;{part.slice(1, -1)}&apos;
            </code>
          );
        }
        return part;
      })}
    </>
  );
}
