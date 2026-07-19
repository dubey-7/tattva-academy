"use client";

import { ArrowRight } from "lucide-react";

import { siteConfig } from "@/config/site";

import Link from "next/link";
import {
  Menu,
  LogOut,
  UserCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";

import Logo from "@/components/common/Logo";
import ThemeToggle from "./ThemeToggle";
import MobileMenu from "./MobileMenu";
import Container from "@/components/common/Container";
import AuthDialog from "@/components/auth/AuthDialog";

import TrialButton from "@/components/trial/TrialButton";
import { navigation } from "@/config/navigation";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import TrialModal from "../trial/TrialModal";

export default function Navbar() {
  const supabase = createClient();

  const [activeSection, setActiveSection] =
    useState("home");

  const [authOpen, setAuthOpen] =
    useState(false);

  const [user, setUser] =
    useState<User | null>(null);

  const [trialOpen, setTrialOpen] = useState(false);

  /* ---------------- Active Section ---------------- */

  useEffect(() => {
    const sectionIds = navigation.map((item) =>
      item.href.replace("#", "")
    );

    function updateActiveSection() {
      const scrollPos = window.scrollY + 140;

      let current = sectionIds[0];
      let bestOffset = -Infinity;

      for (const id of sectionIds) {
        const section = document.getElementById(id);

        if (
          section &&
          section.offsetTop <= scrollPos &&
          section.offsetTop > bestOffset
        ) {
          current = id;
          bestOffset = section.offsetTop;
        }
      }

      setActiveSection(current);
    }

    updateActiveSection();

    window.addEventListener("scroll", updateActiveSection, {
      passive: true,
    });

    window.addEventListener("resize", updateActiveSection);

    return () => {
      window.removeEventListener("scroll", updateActiveSection);
      window.removeEventListener("resize", updateActiveSection);
    };
  }, []);

  /* ---------------- Authentication ---------------- */

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (_, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  async function logout() {
    await supabase.auth.signOut();
  }

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-border/60 bg-background/85 backdrop-blur-xl">
        <Container className="flex h-[4.5rem] items-center justify-between py-3 sm:h-20">
          <Logo />

          {/* Desktop Navigation */}

          <nav className="hidden items-center gap-1 rounded-full border border-border/60 bg-muted/40 px-2 py-1.5 lg:flex">
            {navigation.map((item) => {
              const id = item.href.replace(
                "#",
                ""
              );

              const active =
                activeSection === id;

              return (
                <Link
                  key={item.title}
                  href={item.href}
                  scroll={false}
                  onClick={(e) => {
                    e.preventDefault();

                    document
                      .getElementById(id)
                      ?.scrollIntoView({
                        behavior: "smooth",
                        block: "start",
                      });
                  }}
                  className={`relative rounded-full px-4 py-2 text-sm font-medium transition-all duration-300 ${
                    active
                      ? "bg-primary text-primary-foreground shadow-md shadow-primary/30"
                      : "text-muted-foreground hover:bg-background hover:text-foreground"
                  }`}
                >
                  {item.title}
                </Link>
              );
            })}
          </nav>

          {/* Right Side */}

          <div className="flex items-center gap-2 sm:gap-3">
            <ThemeToggle />

            {/* Book Free Trial */}

            <Button
              onClick={() => setTrialOpen(true)}
              className="animate-premium shine-button hidden rounded-xl px-6 font-semibold shadow-xl transition-all duration-300 hover:scale-105 lg:inline-flex"
            >
              Book Free Trial
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>

            {user ? (
              <Button
                variant="outline"
                onClick={logout}
                className="hidden lg:flex"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            ) : (
              <Button
                onClick={() => setAuthOpen(true)}
                className="hidden lg:flex"
              >
                <UserCircle className="mr-2 h-4 w-4" />
                Login / Register
              </Button>
            )}

            {/* Mobile */}

            <div className="lg:hidden">
              <MobileMenu>
                <Button
                  size="icon"
                  variant="ghost"
                >
                  <Menu className="h-6 w-6" />
                </Button>
              </MobileMenu>
            </div>
          </div>
        </Container>
      </header>
      <AuthDialog
        open={authOpen}
        onOpenChange={setAuthOpen}
      />
      <TrialModal
        open={trialOpen}
        onOpenChange={setTrialOpen}
      />

    </>
  );
}