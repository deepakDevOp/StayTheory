import { useEffect } from "react";

/**
 * Marks the current page as noindex/nofollow for search engines while
 * mounted. robots.txt already disallows crawling /admin* entirely, but this
 * covers crawlers that render JS and ignore robots.txt, or a page that got
 * linked/indexed before robots.txt existed.
 */
export function useNoIndex() {
  useEffect(() => {
    let meta = document.querySelector('meta[name="robots"]') as HTMLMetaElement | null;
    const existed = !!meta;
    if (!meta) {
      meta = document.createElement("meta");
      meta.name = "robots";
      document.head.appendChild(meta);
    }
    const previousContent = meta.content;
    meta.content = "noindex, nofollow";

    return () => {
      if (!meta) return;
      if (existed) {
        meta.content = previousContent;
      } else {
        meta.remove();
      }
    };
  }, []);
}
