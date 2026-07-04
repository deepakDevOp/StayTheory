import { motion } from "motion/react";
import { ReactNode } from "react";

interface FocusSectionProps {
  children: ReactNode;
  className?: string;
}

// opacity + translateY only — scale removed because it forces GPU layer re-rasterisation
// on every composited frame during scroll, causing images inside to repaint.
export default function FocusBox({ children, className = "" }: FocusSectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{
        duration: 0.65,
        ease: [0.25, 0.1, 0.25, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
