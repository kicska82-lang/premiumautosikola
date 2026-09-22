/**
 * Returns a source accepted by next/image for the local image library.
 * Older Supabase records stored bare filenames; those are deliberately
 * replaced by a known local fallback rather than causing a page-wide 500.
 */
export function localImageSrc(
  value: string | null | undefined,
  fallback: string,
): string {
  return value?.startsWith("/") ? value : fallback;
}
