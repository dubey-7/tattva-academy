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
          
          <div className="marquee flex gap-6">

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
                  className="group w-[320px] shrink-0 rounded-[28px] border bg-card p-8 shadow-lg transition-all duration-300 hover:shadow-2xl"
                >

                  <div
                    className={`mb-6 flex h-16 w-16 items-center justify-center rounded-2xl ${program.color}`}
                  >
                    <Icon className="h-8 w-8" />
                  </div>

                  <h3 className="text-2xl font-bold text-foreground">
                    {program.title}
                  </h3>

                  <p className="mt-3 text-muted-foreground">
                    {program.subtitle}
                  </p>

                  <div className="mt-6 flex flex-wrap gap-2">

                    <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold text-primary">
                      Mathematics
                    </span>

                    <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold text-primary">
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