"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

import { successStories } from "@/data/successStories";

export default function FloatingSuccessCard() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % successStories.length);
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  const student = successStories[index];

  return (
    <motion.div
      animate={{ y: [0, -8, 0] }}
      transition={{
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      className="absolute -left-20 top-8 z-40 w-[300px] rounded-2xl border bg-card p-4 shadow-2xl"
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={student.id}
          initial={{ opacity: 0, y: 12, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -12, scale: 0.96 }}
          transition={{ duration: 0.45 }}
        >
          <div className="flex items-center gap-4">
            <Image
              src={student.image}
              alt={student.name}
              width={72}
              height={72}
              className="rounded-xl object-cover shadow-md"
            />

            <div className="flex-1">
              <p className="text-xs font-semibold uppercase tracking-wide text-primary">
                Success Story
              </p>

              <h4 className="mt-1 text-base font-bold text-foreground">
                {student.name}
              </h4>

              <p className="text-sm text-muted-foreground">
                {student.grade}
              </p>

              <p className="text-sm font-medium text-primary">
                {student.subject}
              </p>

              <p className="mt-1 text-xs text-muted-foreground">
                📍 {student.region}
              </p>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}