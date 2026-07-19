"use client";

import { ReactNode, useState } from "react";
import { X, MessageCircle } from "lucide-react";

import { navigation } from "@/config/navigation";
import { siteConfig } from "@/config/site";

import { Button } from "@/components/ui/button";
import TrialButton from "@/components/trial/TrialButton";

interface MobileMenuProps {
  children: ReactNode;
}

export default function MobileMenu({
  children,
}: MobileMenuProps) {
  const [open, setOpen] = useState(false);

  function handleClick(id: string) {
    setOpen(false);

    setTimeout(() => {
      document
        .getElementById(id.replace("#", ""))
        ?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
    }, 150);
  }

  return (
    <>
      <div onClick={() => setOpen(true)}>
        {children}
      </div>

      {open && (
        <>
          {/* Backdrop */}

          <div
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />

          {/* Drawer */}

          <aside className="fixed right-0 top-0 z-50 flex h-screen w-[85%] max-w-[340px] flex-col bg-background shadow-2xl">

            {/* Header */}

            <div className="flex items-center justify-between border-b px-6 py-5">

              <div>
                <h2 className="text-xl font-bold">
                  Menu
                </h2>

                <p className="text-sm text-muted-foreground">
                  Tattva Academy
                </p>
              </div>

              <Button
                size="icon"
                variant="ghost"
                onClick={() => setOpen(false)}
              >
                <X className="h-6 w-6" />
              </Button>

            </div>

            {/* Navigation */}

            <nav className="flex-1 overflow-y-auto px-6 py-6">

              <div className="space-y-2">

                {navigation.map((item) => (
                  <button
                    key={item.title}
                    onClick={() => handleClick(item.href)}
                    className="w-full rounded-xl px-4 py-4 text-left text-base font-medium transition-all duration-200 hover:bg-primary/10 hover:text-primary"
                  >
                    {item.title}
                  </button>
                ))}

              </div>

              {/* CTA */}

              <div className="mt-8 space-y-4">

                <TrialButton className="w-full justify-center" />

                <a
                  href={`https://wa.me/${siteConfig.whatsapp.replace(
                    /\D/g,
                    ""
                  )}?text=Hi%20Tattva,%20I%20would%20like%20to%20know%20more%20about%20your%20classes.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex w-full items-center justify-center rounded-2xl border border-green-500 bg-green-500 px-5 py-4 font-semibold text-white transition-all duration-300 hover:scale-[1.02] hover:bg-green-600"
                >
                  <MessageCircle className="mr-2 h-5 w-5" />
                  Chat on WhatsApp
                </a>

              </div>

            </nav>

          </aside>
        </>
      )}
    </>
  );
}