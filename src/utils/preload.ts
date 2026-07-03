// ---------------------------------------------------------------------------
// Cloudinary URL optimization
// ---------------------------------------------------------------------------
export const optimizeCloudinaryUrl = (url: string, width = 1200, quality = "auto"): string => {
  if (!url || !url.includes("res.cloudinary.com")) return url;
  return url.replace("/upload/", `/upload/f_auto,q_${quality},w_${width},c_limit/`);
};

export const optimizeImageUrl = (url: string, width?: number, quality?: string) => {
  return optimizeCloudinaryUrl(url, width, quality);
};

// ---------------------------------------------------------------------------
// In-memory image cache
//
// Tracks which image URLs have been fully loaded this session.
// TTL: 10 minutes — short enough that admin image changes (which produce a
// new Cloudinary URL) are always fresh, long enough for normal browsing.
//
// How admin invalidation works:
//   Cloudinary URLs contain a version segment, e.g. /v1718000000/.
//   Every time you upload or replace an image via the admin panel, Cloudinary
//   bumps that version number → the URL changes → it is NOT in this cache →
//   the browser fetches the new image. Old cached entries expire after TTL.
// ---------------------------------------------------------------------------
const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes

interface CacheEntry { ts: number }
const _imageCache = new Map<string, CacheEntry>();

/** Returns true if the URL was loaded recently (within TTL). */
export function isImageCached(url: string): boolean {
  if (!url) return false;
  const entry = _imageCache.get(url);
  if (!entry) return false;
  if (Date.now() - entry.ts > CACHE_TTL_MS) {
    _imageCache.delete(url);
    return false;
  }
  return true;
}

/** Call this in an <img> onLoad handler to register the image as cached. */
export function markImageLoaded(url: string): void {
  if (url) _imageCache.set(url, { ts: Date.now() });
}

/**
 * Returns the correct loading attribute for an <img>:
 * - "eager" if the image is already in our cache (avoids lazy-repaint flash)
 * - the provided fallback ("lazy" | "eager") otherwise
 */
export function imageLoadingAttr(url: string, fallback: "lazy" | "eager" = "lazy"): "lazy" | "eager" {
  return isImageCached(url) ? "eager" : fallback;
}

// ---------------------------------------------------------------------------
// Preload helpers
// ---------------------------------------------------------------------------
export const preloadImages = (images: string[]) => {
  if (!images || !Array.isArray(images)) return;
  images.forEach((url) => {
    if (!url || isImageCached(url)) return;
    const img = new Image();
    img.src = optimizeCloudinaryUrl(url, 1200);
    img.onload = () => markImageLoaded(url);
  });
};

export const preloadPropertyImages = (properties: any | any[]) => {
  if (!properties) return;
  const propsArray = Array.isArray(properties) ? properties : [properties];

  const urlsToPreload: string[] = [];
  propsArray.forEach(p => {
    const primary = p.images?.find((img: any) => img.is_primary)?.url || p.images?.[0]?.url || p.coverImage;
    if (primary) urlsToPreload.push(primary);
    if (p.map_image) urlsToPreload.push(p.map_image);
  });

  preloadImages(urlsToPreload);
};
