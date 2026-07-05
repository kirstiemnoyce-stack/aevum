/**
 * Returns a placeholder image URL for image generation previews.
 * Used when no API key is configured or as a fallback.
 */
export function getDemoImageUrl(prompt: string): string {
  const encoded = encodeURIComponent(prompt.slice(0, 100));
  return `https://picsum.photos/seed/${encodeURIComponent(prompt.slice(0, 20))}/512/512`;
}
