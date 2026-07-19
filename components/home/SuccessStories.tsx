"use client";

import Image from "next/image";
import { MapPin } from "lucide-react";

import Container from "@/components/common/Container";
import SectionHeading from "@/components/common/SectionHeading";

import { successStories } from "@/data/successStories";

export default function SuccessStories() {
  // duplicate list for seamless looping
  const stories = [...successStories, ...successStories];

  return (
    <section className="bg-muted/30 py-24 overflow-hidden">
      <Container>
        <SectionHeading
          badge="Student Success"
          title="Success Stories"
          description="Real achievements from students around the world through personalized one-on-one learning."
        />

        <div className="relative mt-12 overflow-hidden">

        {/* left fade */}
        <div className="pointer-events-none absolute left-0 top-0 z-20 h-full w-28 bg-gradient-to-r from-muted to-transparent" />

        {/* right fade */}
        <div className="pointer-events-none absolute right-0 top-0 z-20 h-full w-28 bg-gradient-to-l from-muted to-transparent" />

        <div className="marquee flex gap-3 sm:gap-6">

          {stories.map((story, index) => (
            <div
              key={`${story.id}-${index}`}
              className="group w-[190px] shrink-0 overflow-hidden rounded-2xl border bg-card shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl sm:w-[260px] sm:rounded-3xl md:w-[320px]"
            >
              <div className="relative h-[190px] bg-muted sm:h-[260px] md:h-[330px]">
                <Image
                  src={story.image}
                  alt={story.name}
                  fill
                  className="object-contain p-1.5 transition-transform duration-500 group-hover:scale-105 sm:p-2"
                />
              </div>

              <div className="p-3 sm:p-5">

                <h3 className="text-sm font-bold text-foreground sm:text-xl">
                  {story.name}
                </h3>

                <div className="mt-2 space-y-1 text-xs sm:mt-4 sm:space-y-2 sm:text-sm">

                  <p>
                    <span className="font-semibold text-primary">
                      Grade:
                    </span>{" "}
                    {story.grade}
                  </p>

                  <p>
                    <span className="font-semibold text-primary">
                      Subject:
                    </span>{" "}
                    {story.subject}
                  </p>

                  <div className="flex items-center gap-1.5 text-muted-foreground sm:gap-2">
                    <MapPin className="h-3 w-3 shrink-0 text-primary sm:h-4 sm:w-4" />
                    <span className="truncate">{story.region}</span>
                  </div>

                </div>

              </div>
            </div>
          ))}

        </div>
      </div>
      </Container>
    </section>
  );
}