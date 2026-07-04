import { useState, useCallback, useEffect } from "react";

export function useTheme() {
  const [isDark, setIsDark] = useState(() =>
    typeof window !== "undefined" && document.documentElement.classList.contains("dark")
  );

  // Stay in sync when another component toggles the theme
  useEffect(() => {
    const handler = () =>
      setIsDark(document.documentElement.classList.contains("dark"));
    window.addEventListener("themechange", handler);
    return () => window.removeEventListener("themechange", handler);
  }, []);

  const toggle = useCallback(() => {
    const next = !document.documentElement.classList.contains("dark");
    if (next) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("st_theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("st_theme", "light");
    }
    setIsDark(next);
    window.dispatchEvent(new Event("themechange"));
  }, []);

  return { isDark, toggle };
}
