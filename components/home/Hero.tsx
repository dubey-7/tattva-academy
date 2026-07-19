"use client";

import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";

import TrialButton from "@/components/trial/TrialButton";
import Container from "@/components/common/Container";
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
        <div className="grid items-center gap-10 lg:grid-cols-[1fr_1.2fr]">

          {/* LEFT */}
          <motion.div
            variants={fadeLeft}
            initial="hidden"
            animate="show"
            className="space-y-6 text-center lg:space-y-8 lg:text-left"
          >
            <span className="mx-auto inline-flex rounded-full bg-primary/10 px-5 py-2 text-sm font-semibold text-primary lg:mx-0">
              Personalized One-to-One Learning
            </span>

            <h1 className="mx-auto max-w-xl text-3xl font-bold leading-tight tracking-tight sm:text-4xl lg:mx-0 lg:text-5xl">
              Learn Math & Physics with Personalized One-on-One Mentorship
            </h1>

            <div className="mx-auto max-w-xl space-y-3 lg:mx-0">
              {highlights.map((point) => (
                <p
                  key={point}
                  className="text-base font-medium text-muted-foreground sm:text-lg lg:text-xl"
                >
                  {point}
                </p>
              ))}
            </div>

            <div className="flex flex-col items-center gap-4 sm:flex-row lg:justify-start">

              <TrialButton className="w-full sm:w-auto" />

              <a
                href={`https://wa.me/${siteConfig.whatsapp.replace(
                  /\D/g,
                  ""
                )}?text=Hi%20Tattva,%20I%20would%20like%20to%20know%20more%20about%20your%20classes.`}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative inline-flex w-full items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-r from-[#25D366] via-[#22c55e] to-[#128C7E] px-6 py-4 text-sm font-bold text-white shadow-[0_12px_35px_rgba(37,211,102,0.45)] transition-all duration-300 hover:-translate-y-1 hover:scale-105 hover:shadow-[0_18px_45px_rgba(37,211,102,0.6)] sm:w-auto sm:px-8 sm:py-5 sm:text-base lg:px-10 lg:py-6 lg:text-lg"
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
            className="relative flex justify-center overflow-visible px-2 lg:px-0"
          >
            <div className="absolute -z-10 h-[260px] w-[260px] rounded-full bg-primary/15 blur-3xl lg:h-[420px] lg:w-[420px]" />

            {/* Video — original aspect ratio preserved, no crop/zoom */}

            <div className="card-glow relative z-10 mx-auto w-full max-w-[560px] overflow-hidden rounded-[1.75rem] border border-border/60 bg-card p-2 shadow-2xl sm:max-w-[620px] md:max-w-[680px] lg:max-w-[720px] lg:rounded-[2rem] lg:p-3">
              <video
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                className="h-auto w-full rounded-2xl object-contain"
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