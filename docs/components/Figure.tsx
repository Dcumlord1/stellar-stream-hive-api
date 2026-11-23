import type { ReactNode } from "react";

/**
 * A semantic figure wrapper for inline SVG diagrams and other visual content.
 * Provides a visible caption and accessible name via aria-labelledby.
 *
 * Usage in MDX:
 *   import Figure from "@/components/Figure";
 *   <Figure title="Stream lifecycle" description="State transitions from Created to Exhausted.">
 *     <svg>…</svg>
 *   </Figure>
 */
export default function Figure({
  title,
  description,
  src,
  alt,
  caption,
  children,
}: {
  title?: string;
  description?: string;
  src?: string;
  alt?: string;
  caption?: string;
  children?: ReactNode;
}) {
  const label = title ?? caption ?? alt ?? "Figure";
  const captionId = `fig-${label.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")}`;
  return (
    <figure className="my-8" aria-labelledby={captionId}>
      {src ? <img src={src} alt={alt ?? label} /> : children}
      <figcaption id={captionId} className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
        <span className="font-semibold">{title ?? caption ?? label}</span>
        {description && <span> — {description}</span>}
      </figcaption>
    </figure>
  );
}
