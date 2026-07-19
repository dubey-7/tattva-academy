import { ArrowRight } from "lucide-react";

import Container from "@/components/common/Container";
import SectionHeading from "@/components/common/SectionHeading";

import { Button } from "@/components/ui/button";

import { siteConfig } from "@/config/site";

const whatsappLink = `https://wa.me/${siteConfig.whatsapp}?text=${encodeURIComponent(
  "Hi Tanvi, I would like to book a FREE Demo Lecture."
)}`;

export default function DemoVideos() {
  return (
    <section
      id="demo-classes"
      className="bg-muted/30 py-24"
    >
      <Container>

        <SectionHeading
          badge="Demo Class"
          title="Experience a Live Teaching Session"
          description="Watch a real one-on-one class and discover how personalized teaching helps students understand concepts with confidence."
        />

        <div className="mx-auto max-w-5xl overflow-hidden rounded-3xl border bg-card shadow-xl">

          <video
            controls
            preload="metadata"
            poster="/images/demo-poster.jpg"
            className="aspect-video w-full"
          >
            <source
              src="/videos/demolecture.mp4"
              type="video/mp4"
            />

            Your browser does not support the video tag.
          </video>

        </div>

        <div className="mt-14 flex justify-center">

          <Button
            asChild
            size="lg"
            className="animate-premium shine-button rounded-2xl px-16 py-9 text-xl font-extrabold tracking-wide shadow-2xl transition-all duration-300 hover:scale-110"
          >
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              🎯 Reserve Your FREE Demo Class

              <ArrowRight className="ml-3 h-6 w-6" />
            </a>
          </Button>

        </div>

      </Container>
    </section>
  );
}