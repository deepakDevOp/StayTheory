import { motion } from "motion/react";
import { ReactNode } from "react";

interface FocusSectionProps {
  children: ReactNode;
  className?: string;
}

// Uses only GPU-composited properties (opacity, transform) — no CSS filter animations
// which force expensive repaints on every frame during scroll.
export default function FocusBox({ children, className = "" }: FocusSectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97, y: 32 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{
        duration: 0.7,
        ease: [0.25, 0.1, 0.25, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
