import { motion } from "motion/react";
import { ReactNode } from "react";

interface FocusSectionProps {
  children: ReactNode;
  className?: string;
}

export default function FocusBox({ children, className = "" }: FocusSectionProps) {
  return (
    <motion.div
      initial={{ filter: "blur(12px) brightness(0.85)", opacity: 0.3, scale: 0.98, y: 40 }}
      whileInView={{ filter: "blur(0px) brightness(1)", opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: false, amount: 0.25 }}
      transition={{ 
        duration: 1.2, 
        ease: [0.25, 0.1, 0.25, 1],
        opacity: { duration: 1 }
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
