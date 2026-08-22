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
export const preloadImages = (images: string[], width = 1200) => {
  if (!images || !Array.isArray(images)) return;
  images.forEach((url) => {
    if (!url || isImageCached(url)) return;
    const img = new Image();
    img.src = optimizeCloudinaryUrl(url, width);
    img.onload = () => markImageLoaded(url);
  });
};

// ---------------------------------------------------------------------------
// Property detail cache (stale-while-revalidate)
//
// Keeps the last-fetched property + reviews + blocked dates in memory keyed
// by slug, so navigating away (e.g. back to the home page) and returning to
// the same property renders instantly from cache instead of showing the full
// loading skeleton and re-requesting everything. A background refetch still
// runs to keep the data fresh.
// ---------------------------------------------------------------------------
export interface PropertyDetailCacheEntry {
  property: any;
  reviews: any[];
  blockedDates: Date[];
  ts: number;
}

const _propertyDetailCache = new Map<string, PropertyDetailCacheEntry>();

export function getCachedPropertyDetail(slug: string): PropertyDetailCacheEntry | undefined {
  return _propertyDetailCache.get(slug);
}

export function setCachedPropertyDetail(slug: string, entry: Omit<PropertyDetailCacheEntry, "ts">): void {
  _propertyDetailCache.set(slug, { ...entry, ts: Date.now() });
}

// ---------------------------------------------------------------------------
// Properties list cache (stale-while-revalidate)
//
// The home page mounts Hero + PropertyCollection (and App itself) each of
// which independently fetch the full properties list. Navigating away and
// back to "/" remounts them, re-triggering the fetch + loading skeleton
// every time. Cache the last response so a remount renders instantly, while
// a background refetch keeps it current.
// ---------------------------------------------------------------------------
let _propertiesListCache: { data: any[]; ts: number } | null = null;

export function getCachedProperties(): any[] | undefined {
  return _propertiesListCache?.data;
}

export function setCachedProperties(data: any[]): void {
  _propertiesListCache = { data, ts: Date.now() };
}

// ---------------------------------------------------------------------------
// Single-flight request dedup
//
// Hero, PropertyCollection, App, and PropertiesJournal each fetch the same
// properties list on their own mount. On first load of "/" all three mount
// within the same tick and would otherwise fire 3 identical network
// requests. Wrapping the fetch call in this lets whichever caller goes first
// own the actual request — everyone else just awaits that same promise.
// ---------------------------------------------------------------------------
let _inFlightPropertiesFetch: Promise<any[]> | null = null;

export function fetchPropertiesDeduped(fetcher: () => Promise<any[]>): Promise<any[]> {
  if (_inFlightPropertiesFetch) return _inFlightPropertiesFetch;
  _inFlightPropertiesFetch = fetcher().finally(() => {
    _inFlightPropertiesFetch = null;
  });
  return _inFlightPropertiesFetch;
}

// ---------------------------------------------------------------------------
// Generic keyed data cache (stale-while-revalidate)
//
// Same pattern as the properties list cache above, but for any other page
// data (reviews, contact settings, etc.) keyed by an arbitrary string so a
// remounted page renders instantly from the last response instead of
// showing a loading state, while a background refetch keeps it current.
// ---------------------------------------------------------------------------
const _dataCache = new Map<string, { data: any; ts: number }>();

export function getCachedData<T = any>(key: string): T | undefined {
  return _dataCache.get(key)?.data;
}

export function setCachedData(key: string, data: any): void {
  _dataCache.set(key, { data, ts: Date.now() });
}

export const preloadPropertyImages = (properties: any | any[]) => {
  if (!properties) return;
  const propsArray = Array.isArray(properties) ? properties : [properties];

  const urlsToPreload: string[] = [];
  propsArray.forEach(p => {
    const primary = p.images?.find((img: any) => img.is_primary)?.url || p.images?.[0]?.url || p.coverImage;
    if (primary) urlsToPreload.push(primary);
    if (p.map_image) urlsToPreload.push(p.map_image);
  });

  // Preload at the same width the property detail hero renders (1600px) so
  // this warm-up produces the exact URL the detail page will request.
  preloadImages(urlsToPreload, 1600);
};
