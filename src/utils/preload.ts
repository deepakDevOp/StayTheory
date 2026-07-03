// Cloudinary auto-optimization: convert to webp, compress, and resize
export const optimizeCloudinaryUrl = (url: string, width = 1200, quality = "auto"): string => {
  if (!url || !url.includes("res.cloudinary.com")) return url;
  // Insert transformation before /upload/
  return url.replace(
    "/upload/",
    `/upload/f_auto,q_${quality},w_${width},c_limit/`
  );
};

export const optimizeImageUrl = (url: string, width?: number, quality?: string) => {
  return optimizeCloudinaryUrl(url, width, quality);
};

export const preloadImages = (images: string[]) => {
  if (!images || !Array.isArray(images)) return;
  images.forEach((url) => {
    if (url) {
      const img = new Image();
      img.src = optimizeCloudinaryUrl(url, 1200);
    }
  });
};

export const preloadPropertyImages = (properties: any | any[]) => {
  if (!properties) return;
  const propsArray = Array.isArray(properties) ? properties : [properties];

  const urlsToPreload: string[] = [];

  propsArray.forEach(p => {
    // Only preload primary/cover image eagerly; rest load lazily
    const primary = p.images?.find((img: any) => img.is_primary)?.url || p.images?.[0]?.url || p.coverImage;
    if (primary) urlsToPreload.push(primary);
    if (p.map_image) urlsToPreload.push(p.map_image);
  });

  preloadImages(urlsToPreload);
};
