import {
  Phone,
  Mail,
  MessageCircle,
} from "lucide-react";

import Container from "@/components/common/Container";
import { Button } from "@/components/ui/button";

import { siteConfig } from "@/config/site";

export default function ContactSection() {
  return (
    <section
      id="contact"
      className="py-24"
    >
      <Container>

        <div className="mx-auto max-w-3xl text-center">

          <span className="rounded-full bg-primary/10 px-4 py-2 text-sm font-semibold text-primary">
            Contact Us
          </span>

          <h2 className="mt-6 text-4xl font-bold md:text-5xl">
            Let&apos;s Connect
          </h2>

          <p className="mt-5 text-lg leading-8 text-muted-foreground">
            Have questions about our courses or want to book a free trial?
            We&apos;d love to help you choose the right learning path.
          </p>

        </div>

        {/* Contact Information */}

        <div className="mx-auto mt-16 max-w-2xl space-y-6 rounded-[2rem] border bg-card p-10 shadow-lg">

          <a
            href={`tel:${siteConfig.phone}`}
            className="flex items-center gap-5 rounded-xl p-4 transition hover:bg-muted"
          >
            <div className="rounded-xl bg-primary/10 p-3">
              <Phone className="h-6 w-6 text-primary" />
            </div>

            <div>
              <p className="text-sm text-muted-foreground">
                Phone
              </p>

              <p className="font-semibold">
                {siteConfig.phone}
              </p>
            </div>
          </a>

          <a
            href={`mailto:${siteConfig.email}`}
            className="flex items-center gap-5 rounded-xl p-4 transition hover:bg-muted"
          >
            <div className="rounded-xl bg-primary/10 p-3">
              <Mail className="h-6 w-6 text-primary" />
            </div>

            <div>
              <p className="text-sm text-muted-foreground">
                Email
              </p>

              <p className="font-semibold break-all">
                {siteConfig.email}
              </p>
            </div>
          </a>

          <a
            href={`https://wa.me/${siteConfig.whatsapp.replace(/\D/g, "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-5 rounded-xl p-4 transition hover:bg-muted"
          >
            <div className="rounded-xl bg-primary/10 p-3">
              <MessageCircle className="h-6 w-6 text-primary" />
            </div>

            <div>
              <p className="text-sm text-muted-foreground">
                WhatsApp
              </p>

              <p className="font-semibold">
                {siteConfig.whatsapp}
              </p>
            </div>
          </a>

        </div>

        {/* CTA */}

        <div className="mx-auto mt-16 max-w-4xl overflow-hidden rounded-[2rem] bg-gradient-to-r from-primary to-primary/80 px-6 py-12 text-center text-primary-foreground shadow-2xl sm:px-10 sm:py-16">

          <h2 className="text-2xl font-bold sm:text-3xl lg:text-4xl">
            Still Have Questions?
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-7 opacity-90 sm:text-lg sm:leading-8">
            Speak directly with our mentor, discuss your learning goals,
            and schedule your FREE Trial Class at a time that&apos;s convenient for you.
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

      </Container>
    </section>
  );
}