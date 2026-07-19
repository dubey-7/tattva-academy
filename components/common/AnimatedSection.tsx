"use client";

import { motion } from "framer-motion";

interface AnimatedSectionProps {
  children: React.ReactNode;
  className?: string;
}

export default function AnimatedSection({
  children,
  className,
}: AnimatedSectionProps) {
  return (
    <motion.div
      className={className}
      initial={{
        opacity: 0,
        y: 50,
      }}
      whileInView={{
        opacity: 1,
        y: 0,
      }}
      viewport={{
        once: true,
        amount: 0.2,
      }}
      transition={{
        duration: 0.7,
      }}
    >
      {children}
    </motion.div>
  );
}