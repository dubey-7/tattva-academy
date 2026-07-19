"use client";

import { useState } from "react";

import Image from "next/image";
import { motion } from "framer-motion";

import {
  ArrowRight,
  BookOpen,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Globe,
  GraduationCap,
  Lightbulb,
  MessageCircle,
  Target,
  Users,
} from "lucide-react";

import { siteConfig } from "@/config/site";
import { teacher } from "@/data/teacher";

import FadeIn from "@/components/common/FadeIn";
import Container from "@/components/common/Container";
import SectionHeading from "@/components/common/SectionHeading";
import { Button } from "@/components/ui/button";

import {
  fadeLeft,
  fadeRight,
} from "@/lib/animations";

export default function AboutTeacher() {
  const { content } = teacher;

  const whatsappLink = `https://wa.me/${siteConfig.whatsapp}?text=${encodeURIComponent(
    siteConfig.whatsappMessage
  )}`;

  const [expandedCards, setExpandedCards] = useState<
    Record<string, boolean>
  >({
    experience: false,
    curriculum: false,
    philosophy: false,
    mission: false,
  });

  function toggleCard(card: string) {
    setExpandedCards((prev) => ({
      ...prev,
      [card]: !prev[card],
    }));
  }

  const [expanded, setExpanded] = useState(false);

  const qualifications =
    content.sections.qualifications.points;

  const experience =
    content.sections.experience.points;

  const curriculum =
    content.sections.curriculum.points;

  const tests =
    content.sections.tests.points;

  const philosophy =
    content.sections.philosophy.points;

  const mission =
    content.sections.mission.description;

  return (
    <FadeIn>
      <section
        id="about"
        className="bg-muted/30 py-24"
      >
        <Container>

          <SectionHeading
            badge="About the Teacher"
            title={content.title}
            description="Personalized one-on-one tutoring designed to help every student build confidence, master concepts, and achieve academic excellence."
          />

          <div className="isolate grid items-start gap-12 lg:grid-cols-2 lg:gap-20">

            {/* LEFT */}

            <motion.div
              variants={fadeLeft}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="relative z-10 lg:sticky lg:top-28"
            >

              <div className="absolute -z-10 h-[420px] w-[420px] rounded-full bg-primary/10 blur-3xl" />

              <Image
                src={teacher.image}
                alt={teacher.name}
                width={520}
                height={620}
                className="w-full max-w-[520px] rounded-[2rem] object-cover shadow-2xl"
              />

              <div className="mt-8 rounded-3xl border bg-card p-6 shadow-sm">

                <h3 className="text-3xl font-bold">
                  {content.name}
                </h3>

                <p className="mt-2 text-lg font-medium text-primary">
                  {content.subtitle}
                </p>

                <Button
                  asChild
                  size="lg"
                  className="group relative mt-10 w-full overflow-hidden rounded-xl bg-gradient-to-r from-[#25D366] to-[#128C7E] px-6 py-4 text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:scale-105 hover:shadow-2xl active:scale-95 sm:w-auto sm:px-8 sm:py-5 sm:text-base lg:px-10 lg:py-6 lg:text-lg"
                >
                  <a
                    href={`https://wa.me/${siteConfig.whatsapp.replace(
                      /\D/g,
                      ""
                    )}?text=Hi%20Tattva,%20I%20would%20like%20to%20know%20more%20about%20your%20classes.`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {/* Shine Effect */}
                    <span className="absolute inset-0 -translate-x-full skew-x-[-20deg] bg-white/20 transition-transform duration-700 group-hover:translate-x-[180%]" />

                    <span className="relative flex items-center">
                      <MessageCircle className="mr-2 h-5 w-5" />
                      Chat on WhatsApp
                    </span>
                  </a>
                </Button>

              </div>

            </motion.div>
            {/* RIGHT */}

            <motion.div
              variants={fadeRight}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
            >
              <div className="rounded-[32px] border bg-card p-10 shadow-lg">

                {/* Qualifications */}

                <div className="mb-8">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="rounded-xl bg-primary/10 p-3">
                      <GraduationCap className="h-6 w-6 text-primary" />
                    </div>

                    <h3 className="text-2xl font-bold">
                      {content.sections.qualifications.heading}
                    </h3>
                  </div>

                  <div className="space-y-3">
                    {qualifications.map((item) => (
                      <div
                        key={item}
                        className="flex items-start gap-3"
                      >
                        <CheckCircle className="mt-1 h-5 w-5 text-primary" />

                        <p className="text-muted-foreground">
                          {item}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Experience */}

                <div className="mb-8">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="rounded-xl bg-primary/10 p-3">
                      <Users className="h-6 w-6 text-primary" />
                    </div>

                    <h3 className="text-2xl font-bold">
                      {content.sections.experience.heading}
                    </h3>
                  </div>

                  <div className="space-y-3">
                    {experience.map((item) => (
                      <div
                        key={item}
                        className="flex items-start gap-3"
                      >
                        <CheckCircle className="mt-1 h-5 w-5 text-primary" />

                        <p className="text-muted-foreground">
                          {item}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Curriculum */}

                <div className="mb-8">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="rounded-xl bg-primary/10 p-3">
                      <Globe className="h-6 w-6 text-primary" />
                    </div>

                    <h3 className="text-2xl font-bold">
                      {content.sections.curriculum.heading}
                    </h3>
                  </div>

                  <div className="space-y-3">
                    {(expanded
                      ? curriculum
                      : curriculum.slice(0, 2)
                    ).map((item) => (
                      <div
                        key={item}
                        className="flex items-start gap-3"
                      >
                        <CheckCircle className="mt-1 h-5 w-5 text-primary" />

                        <p className="text-muted-foreground">
                          {item}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Expanded Content */}

                {expanded && (
                  <>
                    {/* Tests */}

                    <div className="mb-8">
                      <div className="mb-4 flex items-center gap-3">
                        <div className="rounded-xl bg-primary/10 p-3">
                          <BookOpen className="h-6 w-6 text-primary" />
                        </div>

                        <h3 className="text-2xl font-bold">
                          {content.sections.tests.heading}
                        </h3>
                      </div>

                      <div className="space-y-3">
                        {tests.map((item) => (
                          <div
                            key={item}
                            className="flex items-start gap-3"
                          >
                            <CheckCircle className="mt-1 h-5 w-5 text-primary" />

                            <p className="text-muted-foreground">
                              {item}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Philosophy */}

                    <div className="mb-8">
                      <div className="mb-4 flex items-center gap-3">
                        <div className="rounded-xl bg-primary/10 p-3">
                          <Lightbulb className="h-6 w-6 text-primary" />
                        </div>

                        <h3 className="text-2xl font-bold">
                          {content.sections.philosophy.heading}
                        </h3>
                      </div>

                      <div className="space-y-3">
                        {philosophy.map((item) => (
                          <div
                            key={item}
                            className="flex items-start gap-3"
                          >
                            <CheckCircle className="mt-1 h-5 w-5 text-primary" />

                            <p className="text-muted-foreground">
                              {item}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Mission */}

                    <div>
                      <div className="mb-4 flex items-center gap-3">
                        <div className="rounded-xl bg-primary/10 p-3">
                          <Target className="h-6 w-6 text-primary" />
                        </div>

                        <h3 className="text-2xl font-bold">
                          {content.sections.mission.heading}
                        </h3>
                      </div>

                      <p className="leading-8 text-muted-foreground">
                        {mission}
                      </p>
                    </div>
                  </>
                )}

                {/* Read More */}

                <div className="mt-10 border-t pt-6">

                  <Button
                    variant="ghost"
                    className="h-auto p-0 text-primary hover:bg-transparent"
                    onClick={() => setExpanded(!expanded)}
                  >
                    {expanded ? (
                      <>
                        Show Less
                        <ChevronUp className="ml-2 h-4 w-4" />
                      </>
                    ) : (
                      <>
                        Read More
                        <ChevronDown className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>

                </div>

              </div>
            </motion.div>
          </div>
        </Container>
      </section>
    </FadeIn>
  );
}