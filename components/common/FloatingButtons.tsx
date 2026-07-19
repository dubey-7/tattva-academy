"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";

import { siteConfig } from "@/config/site";

export default function FloatingButtons() {
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowTop(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* WhatsApp */}
      <a
        href={`https://wa.me/${siteConfig.whatsapp}?text=Hi%20Tattva,%20I%20would%20like%20to%20book%20a%20free%20trial%20class.`}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-green-500 text-white shadow-xl transition hover:scale-110"
      >
        <FaWhatsapp className="h-7 w-7" />
      </a>

      {/* Scroll to Top */}
      {showTop && (
        <button
          onClick={() =>
            window.scrollTo({
              top: 0,
              behavior: "smooth",
            })
          }
          className="fixed bottom-24 right-6 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-xl transition hover:scale-110"
        >
          <ArrowUp className="h-5 w-5" />
        </button>
      )}
    </>
  );
}