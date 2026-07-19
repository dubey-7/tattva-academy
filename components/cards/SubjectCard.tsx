"use client";

import { motion } from "framer-motion";
import {
  ArrowRight,
  BookOpen,
} from "lucide-react";

import { Button } from "@/components/ui/button";

interface SubjectCardProps {
  title: string;
  description: string;
}

export default function SubjectCard({
  title,
  description,
}: SubjectCardProps) {
  return (
    <motion.div
      whileHover={{
        y: -10,
      }}
      transition={{
        duration: 0.25,
      }}
      className="group relative overflow-hidden rounded-3xl border bg-card p-8 shadow-lg"
    >
      {/* Background Glow */}

      <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-primary/5 blur-3xl transition-all duration-500 group-hover:bg-primary/15" />

      {/* Icon */}

      <div className="relative z-10 mb-8 flex h-20 w-20 items-center justify-center rounded-3xl bg-primary/10 transition-all duration-300 group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground">
        <BookOpen className="h-10 w-10" />
      </div>

      {/* Title */}

      <h3 className="relative z-10 text-3xl font-bold">
        {title}
      </h3>

      {/* Description */}

      <p className="relative z-10 mt-5 leading-8 text-muted-foreground">
        {description}
      </p>

      {/* Features */}

      <div className="relative z-10 mt-8 space-y-3">

        <div>✔ One-to-One Sessions</div>

        <div>✔ Concept-Based Learning</div>

        <div>✔ Regular Assessments</div>

      </div>

      {/* Button */}

      <Button
        className="relative z-10 mt-8 rounded-xl"
      >
        Learn More

        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
      </Button>

    </motion.div>
  );
}