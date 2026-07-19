import {
  Phone,
  Mail,
  MapPin,
  MessageCircle,
} from "lucide-react";

import PageHero from "@/components/common/PageHero";
import Container from "@/components/common/Container";
import ContactCard from "@/components/cards/ContactCard";
import CTA from "@/components/home/CTA";
import { Button } from "@/components/ui/button";

import { siteConfig } from "@/config/site";

export default function ContactPage() {
  return (
    <>
      <PageHero
        title="Contact Us"
        description="We're always happy to answer your questions and help you choose the right learning path."
      />

      {/* Contact Cards */}
      <section className="py-24">
        <Container>
          <div className="grid gap-8 md:grid-cols-2">
            <ContactCard
              icon={Phone}
              title="Call Us"
              value={siteConfig.phone}
              href={`tel:${siteConfig.phone}`}
            />

            <ContactCard
              icon={Mail}
              title="Email"
              value={siteConfig.email}
              href={`mailto:${siteConfig.email}`}
            />

            <ContactCard
              icon={MessageCircle}
              title="WhatsApp"
              value={siteConfig.whatsapp}
              href={`https://wa.me/${siteConfig.whatsapp.replace(/\D/g, "")}`}
            />

            <ContactCard
              icon={MapPin}
              title="Location"
              value={siteConfig.location}
              href="#location"
            />
          </div>
        </Container>
      </section>

      {/* Location */}
      <section
        id="location"
        className="bg-muted/30 py-24"
      >
        <Container>
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="text-4xl font-bold">
              Visit Us
            </h2>

            <p className="mt-4 text-lg text-muted-foreground">
              {siteConfig.location}
            </p>

            <div className="mt-10 overflow-hidden rounded-3xl border shadow-lg">
              <iframe
                src="https://maps.google.com/maps?q=Mumbai&t=&z=13&ie=UTF8&iwloc=&output=embed"
                width="100%"
                height="420"
                loading="lazy"
                allowFullScreen
                className="border-0"
              />
            </div>
          </div>
        </Container>
      </section>

      {/* WhatsApp CTA */}
      <section className="py-24">
        <Container>
          <div className="rounded-3xl bg-primary px-8 py-16 text-center text-primary-foreground">
            <h2 className="text-4xl font-bold">
              Ready to Start Learning?
            </h2>

            <p className="mx-auto mt-5 max-w-2xl text-lg opacity-90">
              Book a FREE one-on-one trial class and experience
              personalized learning with Tattva.
            </p>

            <Button
              asChild
              variant="secondary"
              size="lg"
              className="mt-8"
            >
              <a
                href={`https://wa.me/${siteConfig.whatsapp.replace(
                  /\D/g,
                  ""
                )}?text=Hi%20Tattva,%20I%20want%20to%20book%20a%20free%20trial%20class.`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle className="mr-2 h-5 w-5" />
                Chat on WhatsApp
              </a>
            </Button>
          </div>
        </Container>
      </section>

      <CTA />
    </>
  );
}