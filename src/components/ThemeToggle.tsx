import { motion } from "motion/react";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "../hooks/useTheme";

interface ThemeToggleProps {
  className?: string;
}

export default function ThemeToggle({ className = "" }: ThemeToggleProps) {
  const { isDark, toggle } = useTheme();

  return (
    <motion.button
      onClick={toggle}
      whileTap={{ scale: 0.88 }}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className={`relative w-9 h-9 rounded-full flex items-center justify-center transition-colors ${
        isDark
          ? "bg-stone-800 text-amber-400 hover:bg-stone-700"
          : "bg-stone-100 text-stone-500 hover:bg-stone-200"
      } ${className}`}
    >
      <motion.div
        key={isDark ? "moon" : "sun"}
        initial={{ rotate: -30, opacity: 0, scale: 0.7 }}
        animate={{ rotate: 0, opacity: 1, scale: 1 }}
        exit={{ rotate: 30, opacity: 0, scale: 0.7 }}
        transition={{ duration: 0.2 }}
      >
        {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
      </motion.div>
    </motion.button>
  );
}
