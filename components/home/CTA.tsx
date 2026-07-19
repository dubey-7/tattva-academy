import { ArrowRight, MessageCircle } from "lucide-react";

import Container from "@/components/common/Container";
import { siteConfig } from "@/config/site";
import { Button } from "@/components/ui/button";
import TrialButton from "../trial/TrialButton";

const whatsappLink = `https://wa.me/${siteConfig.whatsapp}?text=${encodeURIComponent(
  siteConfig.whatsappMessage
)}`;

export default function CTA() {
  return (
    <section className="py-24">
      <Container>
        <div className="overflow-hidden rounded-[2rem] bg-primary px-8 py-16 text-center text-primary-foreground shadow-2xl md:px-16">

          <span className="inline-block rounded-full bg-white/10 px-4 py-2 text-sm font-medium">
            Start Your Learning Journey Today
          </span>

          <h2 className="mt-6 text-4xl font-bold md:text-5xl">
            Book Your Free Trial Class
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-primary-foreground/80">
            Experience personalized one-on-one learning with expert guidance.
            Discover how concept-based teaching can improve confidence,
            understanding, and academic performance.
          </p>

          <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">

            {/* Book Free Trial */}
            <TrialButton
              className="
                bg-white
                text-primary
                shadow-[0_15px_40px_rgba(255,255,255,0.35)]
                hover:shadow-[0_22px_60px_rgba(255,255,255,0.55)]
                animate-[float_3.5s_ease-in-out_infinite]
              "
            />

            {/* Contact Us */}
            <Button
              asChild
              size="lg"
              className="group relative overflow-hidden rounded-2xl border-2 border-white bg-transparent px-10 py-5 text-[18px] font-bold text-white transition-all duration-300 hover:-translate-y-2 hover:scale-105 hover:bg-white hover:text-primary hover:shadow-xl"
            >
              <a
                href={`https://wa.me/${siteConfig.whatsapp.replace(
                  /\D/g,
                  ""
                )}?text=${encodeURIComponent(
                  "Hi Tattva, I would like to know more about your classes."
                )}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="relative flex items-center">
                  <MessageCircle className="mr-3 h-5 w-5 animate-pulse" />
                  Contact Us
                </span>
              </a>
            </Button>
            
          </div>

        </div>
      </Container>
    </section>
  );
}