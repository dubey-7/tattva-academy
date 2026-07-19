"use client";

import { motion } from "framer-motion";

import {
  GraduationCap,
  BookOpen,
  Calculator,
  Globe,
  Trophy,
  School,
  Brain,
} from "lucide-react";

import Container from "@/components/common/Container";
import SectionHeading from "@/components/common/SectionHeading";

const programs = [
  {
    title: "IB DP & MYP",
    subtitle: "International Baccalaureate",
    icon: GraduationCap,
    color: "bg-violet-100 text-violet-700 dark:bg-violet-500/20 dark:text-violet-300",
  },
  {
    title: "IGCSE",
    subtitle: "Cambridge Curriculum",
    icon: Globe,
    color: "bg-sky-100 text-sky-700 dark:bg-sky-500/20 dark:text-sky-300",
  },
  {
    title: "GCSE",
    subtitle: "UK Curriculum",
    icon: BookOpen,
    color: "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300",
  },
  {
    title: "A Level",
    subtitle: "Advanced Level",
    icon: Trophy,
    color: "bg-orange-100 text-orange-600 dark:bg-orange-500/20 dark:text-orange-300",
  },
  {
    title: "SAT",
    subtitle: "College Preparation",
    icon: Brain,
    color: "bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-300",
  },
  {
    title: "CBSE",
    subtitle: "Indian Curriculum",
    icon: School,
    color: "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-300",
  },
  {
    title: "ICSE",
    subtitle: "Council Curriculum",
    icon: Calculator,
    color: "bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300",
  },
];

export default function Subjects() {
  return (
    <section
      id="subjects"
      className="bg-muted/30 py-24"
    >
      <Container>

        <SectionHeading
          badge="Our Programs"
          title="Curriculums We Specialize In"
          description="Personalized one-on-one tutoring designed specifically for each curriculum to maximize academic success."
        />

        <div className="relative mt-12 overflow-hidden">

        <div className="pointer-events-none absolute left-0 top-0 z-20 h-full w-14 bg-gradient-to-r from-muted to-transparent" />

        <div className="pointer-events-none absolute right-0 top-0 z-20 h-full w-14 bg-gradient-to-l from-muted to-transparent" />
          
          <div className="marquee flex gap-3 sm:gap-6">

            {[...programs, ...programs].map((program, index) => {

              const Icon = program.icon;

              return (

                <motion.div
                  key={`${program.title}-${index}`}
                  animate={{
                    y: [0, -8, 0],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    delay: index * 0.2,
                  }}
                  whileHover={{
                    y: -12,
                    scale: 1.04,
                  }}
                  className="group w-[210px] shrink-0 rounded-2xl border bg-card p-4 shadow-lg transition-all duration-300 hover:shadow-2xl sm:w-[280px] sm:rounded-[28px] sm:p-6 md:w-[320px] md:p-8"
                >

                  <div
                    className={`mb-3 flex h-11 w-11 items-center justify-center rounded-xl sm:mb-5 sm:h-14 sm:w-14 sm:rounded-2xl md:mb-6 md:h-16 md:w-16 ${program.color}`}
                  >
                    <Icon className="h-5 w-5 sm:h-7 sm:w-7 md:h-8 md:w-8" />
                  </div>

                  <h3 className="text-base font-bold text-foreground sm:text-xl md:text-2xl">
                    {program.title}
                  </h3>

                  <p className="mt-1.5 text-xs text-muted-foreground sm:mt-2 sm:text-sm md:mt-3 md:text-base">
                    {program.subtitle}
                  </p>

                  <div className="mt-3 flex flex-wrap gap-1.5 sm:mt-5 sm:gap-2 md:mt-6">

                    <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary sm:px-3 sm:py-1 sm:text-sm">
                      Mathematics
                    </span>

                    <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary sm:px-3 sm:py-1 sm:text-sm">
                      Physics
                    </span>

                  </div>

                </motion.div>

              );
            })}

          </div>

        </div>
      </Container>
    </section>
  );
}