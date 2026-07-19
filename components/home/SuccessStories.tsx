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

        <div className="marquee flex gap-6">

          {stories.map((story, index) => (
            <div
              key={`${story.id}-${index}`}
              className="group w-[320px] shrink-0 overflow-hidden rounded-3xl border bg-card shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
            >
              <div className="relative h-[330px] bg-muted">
                <Image
                  src={story.image}
                  alt={story.name}
                  fill
                  className="object-contain p-2 transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              <div className="p-5">

                <h3 className="text-xl font-bold text-foreground">
                  {story.name}
                </h3>

                <div className="mt-4 space-y-2 text-sm">

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

                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="h-4 w-4 text-primary" />
                    {story.region}
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