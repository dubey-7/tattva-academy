import { Mail, Phone, MapPin, MessageCircle } from "lucide-react";

import {
  FaYoutube,
  FaLinkedinIn,
} from "react-icons/fa";

import Container from "@/components/common/Container";
import Logo from "@/components/common/Logo";
import { siteConfig } from "@/config/site";

export default function Footer() {
  return (
    <footer className="mt-24 border-t bg-gradient-to-b from-muted/20 to-muted/70">
      <Container>
        <div className="grid gap-16 py-20 md:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr]">

          {/* Brand */}
          <div className="space-y-5">
            <Logo />

            <p className="text-sm leading-7 text-muted-foreground">
              Personalized one-on-one online tutoring designed to build
              confidence, strengthen concepts, and help every learner succeed.
            </p>

            <a
              href={`https://wa.me/${siteConfig.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative inline-flex items-center gap-2 overflow-hidden rounded-xl bg-[#25D366] px-6 py-3 text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl"
            >
              {/* Shine Effect */}
              <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-1000 group-hover:translate-x-full" />

              <MessageCircle className="relative h-5 w-5" />
              <span className="relative">WhatsApp Us</span>
            </a>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-5 text-lg font-semibold">
              Contact
            </h3>

            <div className="space-y-4 text-sm">

              <a
                href={`tel:${siteConfig.phone}`}
                className="flex items-center gap-3 text-muted-foreground transition hover:text-primary"
              >
                <Phone className="h-4 w-4" />
                {siteConfig.phone}
              </a>

              <a
                href={`mailto:${siteConfig.email}`}
                className="flex items-center gap-3 text-muted-foreground transition hover:text-primary"
              >
                <Mail className="h-4 w-4" />
                {siteConfig.email}
              </a>

              <div className="flex items-start gap-3 text-muted-foreground">
                <MapPin className="mt-1 h-4 w-4" />
                {siteConfig.location}
              </div>

            </div>
          </div>

          {/* Social */}
          <div>
            <h3 className="mb-5 text-lg font-semibold">
              Follow Us
            </h3>

            <p className="mb-5 text-sm text-muted-foreground">
              Stay updated with our latest classes, tips and learning resources.
            </p>

            <div className="flex gap-4">

              {siteConfig.social.youtube && (
                <a
                  href={siteConfig.social.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-xl border p-3 transition hover:bg-primary hover:text-primary-foreground hover:scale-110"
                >
                  <FaYoutube className="h-5 w-5" />
                </a>
              )}

              {siteConfig.social.linkedin && (
                <a
                  href={siteConfig.social.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-xl border p-3 transition hover:bg-primary hover:text-primary-foreground hover:scale-110"
                >
                  <FaLinkedinIn className="h-5 w-5" />
                </a>
              )}

            </div>
          </div>

        </div>

        <div className="border-t py-6 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
          <br />
          Made with ❤️ in India
        </div>
      </Container>
    </footer>
  );
}