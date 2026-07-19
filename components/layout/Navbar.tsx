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
    const sections = navigation.map((item) =>
      item.href.replace("#", "")
    );

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        threshold: 0.45,
      }
    );

    sections.forEach((id) => {
      const section =
        document.getElementById(id);

      if (section) {
        observer.observe(section);
      }
    });

    return () => observer.disconnect();
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
      <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <Container className="flex h-20 items-center justify-between">
          <Logo />

          {/* Desktop Navigation */}

          <nav className="hidden items-center gap-8 lg:flex">
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
                  className={`relative text-sm font-medium transition-colors ${
                    active
                      ? "text-primary"
                      : "text-muted-foreground hover:text-primary"
                  }`}
                >
                  {item.title}

                  {active && (
                    <span className="absolute -bottom-2 left-0 h-0.5 w-full rounded-full bg-primary" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Side */}

          {/* Right Side */}

          <div className="flex items-center gap-3">
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