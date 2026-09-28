import { siteConfig } from "@/config/site";

function digitsOnly(value: string) {
  return value.replace(/\D/g, "");
}

export function buildWhatsAppUrl(message: string, phone?: string) {
  const number = digitsOnly(phone ?? siteConfig.whatsapp);

  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

/* ---------------- Context-specific messages ---------------- */

export const whatsappMessages = {
  /** Hero / Book Free Trial / Trial CTA buttons */
  trialCta: `Hey Tanvi! I would like to know more about your classes.

I am looking for:

Student Name:
Parent Name:
Grade:
Subject:
Time-zone:`,

  /** About Teacher section */
  aboutTeacher: `Hey Tanvi!

I would like to know more about how it works.`,

  /** "Still Have Questions?" / FAQ section */
  faq: `Hey Tanvi! I would like to know more about your classes.

I am looking for:

Student Name:
Parent Name:
Grade:
Subject:
Time-zone:
Query:`,

  /** Navbar WhatsApp button */
  navbar: `Hey Tanvi!

Got a minute to discuss more about classes?`,

  /** Floating WhatsApp button (bottom right) */
  floating: `Hey Tanvi!

I came from the Tattva website.

Got a minute to discuss more about classes?`,

  /** Contact Us section */
  contact: `Hey Tanvi!

Got a minute to discuss more about classes?`,
} as const;
