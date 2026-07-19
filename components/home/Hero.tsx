"use client";

import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";

import TrialButton from "@/components/trial/TrialButton";
import Container from "@/components/common/Container";
import FloatingSuccessCard from "@/components/cards/FloatingSuccessCard";
import { siteConfig } from "@/config/site";

import { fadeLeft, fadeRight } from "@/lib/animations";

export default function Hero() {
  const highlights = [
    "📅 Flexible Class Schedule",
    "👨‍🏫 Personalized One-on-One Mentorship",
    "🎯 Customized Learning Plans",
    "📈 Regular Progress Tracking",
  ];

  return (
    <section
      id="home"
      className="hero-gradient overflow-hidden pb-24 pt-24"
    >
      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-[1fr_1.2fr]">

          {/* LEFT */}
          <motion.div
            variants={fadeLeft}
            initial="hidden"
            animate="show"
            className="space-y-8"
          >
            <span className="inline-flex rounded-full bg-primary/10 px-5 py-2 text-sm font-semibold text-primary">
              Personalized One-to-One Learning
            </span>

            <h1 className="max-w-xl text-4xl font-bold leading-tight tracking-tight md:text-5xl">
              Learn Math & Physics with Personalized One-on-One Mentorship
            </h1>

            <div className="max-w-xl space-y-3">
              {highlights.map((point) => (
                <p
                  key={point}
                  className="text-lg font-medium text-muted-foreground md:text-xl"
                >
                  {point}
                </p>
              ))}
            </div>

            <div className="flex flex-wrap gap-4">

              <TrialButton />

              <a
                href={`https://wa.me/${siteConfig.whatsapp.replace(
                  /\D/g,
                  ""
                )}?text=Hi%20Tattva,%20I%20would%20like%20to%20know%20more%20about%20your%20classes.`}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative inline-flex items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-r from-[#25D366] via-[#22c55e] to-[#128C7E] px-10 py-6 text-base font-bold text-white shadow-[0_12px_35px_rgba(37,211,102,0.45)] transition-all duration-300 hover:-translate-y-1 hover:scale-105 hover:shadow-[0_18px_45px_rgba(37,211,102,0.6)]"
              >
                <span className="absolute inset-0 -translate-x-[140%] skew-x-[-25deg] bg-white/30 transition-transform duration-1000 group-hover:translate-x-[220%]" />

                <span className="absolute inset-0 rounded-2xl bg-white/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                <MessageCircle className="relative mr-2 h-5 w-5 animate-pulse" />

                <span className="relative">
                  Chat on WhatsApp
                </span>
              </a>

            </div>
          </motion.div>

          {/* RIGHT */}
          <motion.div
            variants={fadeRight}
            initial="hidden"
            animate="show"
            className="relative flex justify-center overflow-visible"
          >
            <div className="absolute -z-10 h-[420px] w-[420px] rounded-full bg-primary/15 blur-3xl" />

            <FloatingSuccessCard />

            {/* Students */}

            <motion.div
              animate={{
                y: [0, 8, 0],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
              }}
              className="absolute -right-8 top-12 z-20 rounded-2xl bg-white px-5 py-4 shadow-xl"
            >
              <p className="text-3xl font-bold text-primary">
                150+
              </p>

              <p className="text-sm text-muted-foreground">
                Students
              </p>
            </motion.div>

            {/* Classes */}

            <motion.div
              animate={{
                y: [0, -8, 0],
              }}
              transition={{
                duration: 4.5,
                repeat: Infinity,
              }}
              className="absolute -left-10 bottom-10 z-20 rounded-2xl bg-white px-5 py-4 shadow-xl"
            >
              <p className="text-3xl font-bold text-primary">
                5000+
              </p>

              <p className="text-sm text-muted-foreground">
                Classes
              </p>
            </motion.div>

            {/* Curriculum Cards */}

            {[
              ["IB", "DP & MYP", "left-16 -top-6"],
              ["IGCSE", "Math & Physics", "right-12 -top-8"],
              ["GCSE", "Cambridge", "-right-10 top-44"],
              ["A Level", "Advanced", "-left-12 top-56"],
              ["SAT", "Test Prep", "left-24 -bottom-8"],
              ["CBSE", "Grade 9-12", "right-20 -bottom-10"],
              ["ICSE", "Concept Based", "right-2 bottom-28"],
            ].map(([title, subtitle, pos]) => (
              <motion.div
                key={title}
                animate={{
                  y: [0, -6, 0],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                }}
                className={`absolute ${pos} z-20 rounded-xl border bg-white px-4 py-3 shadow-lg`}
              >
                <p className="font-bold text-primary">
                  {title}
                </p>

                <p className="text-xs text-muted-foreground">
                  {subtitle}
                </p>
              </motion.div>
            ))}

            {/* Video */}

            <div className="relative z-10 flex aspect-[2.2/1] w-full max-w-[750px] items-center justify-center rounded-[2rem] bg-background shadow-2xl">
              <video
                autoPlay
                muted
                loop
                playsInline
                className="w-full rounded-[1.5rem]"
              >
                <source
                  src="/videos/tanvi.mp4"
                  type="video/mp4"
                />

                Your browser does not support the video tag.
              </video>
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}