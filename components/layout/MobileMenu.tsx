"use client";

import { ReactNode, useState } from "react";
import Link from "next/link";
import { ArrowRight, X } from "lucide-react";

import { navigation } from "@/config/navigation";
import { siteConfig } from "@/config/site";

import { Button } from "@/components/ui/button";
import TrialButton from "../trial/TrialButton";

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
          <div
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />

          <aside className="fixed right-0 top-0 z-50 h-screen w-80 bg-background shadow-2xl">

            <div className="flex items-center justify-between border-b p-6">
              <h2 className="text-xl font-bold">
                Menu
              </h2>

              <Button
                size="icon"
                variant="ghost"
                onClick={() => setOpen(false)}
              >
                <X />
              </Button>
            </div>

            <nav className="flex flex-col gap-2 p-6">
              {navigation.map((item) => (
                <button
                  key={item.title}
                  onClick={() => handleClick(item.href)}
                  className="rounded-xl px-4 py-3 text-left transition hover:bg-muted"
                >
                  {item.title}
                </button>
              ))}

              
              <TrialButton />
            </nav>

          </aside>
        </>
      )}
    </>
  );
}