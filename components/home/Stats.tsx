"use client";

import {
  Users,
  Star,
  Globe,
  GraduationCap,
  Clock3,
  MapPin,
} from "lucide-react";

import { motion } from "framer-motion";

import Image from "next/image";

import Container from "@/components/common/Container";

const countries = [
  { name: "USA", flag: "/flags/us.png" },
  { name: "Canada", flag: "/flags/canada.png" },
  { name: "UK", flag: "/flags/uk.png" },
  { name: "UAE", flag: "/flags/uae.png" },
  { name: "Singapore", flag: "/flags/singapore.png" },
  { name: "Australia", flag: "/flags/australia.png" },
  { name: "India", flag: "/flags/india.png" },
  { name: "Qatar", flag: "/flags/qatar.png" },
  { name: "Kuwait", flag: "/flags/kuwait.png" },
];

const stats = [
  {
    icon: Users,
    value: "150+",
    label: "Happy Students",
  },
  {
    icon: Star,
    value: "98%",
    label: "Parent Satisfaction",
  },
  {
    icon: Globe,
    value: "15+",
    label: "Countries Reached",
  },
  {
    icon: GraduationCap,
    value: "6+",
    label: "Years Experience",
  },
  {
    icon: Clock3,
    value: "5000+",
    label: "Classes Delivered",
  },
];

export default function Stats() {
  return (
    <section className="bg-muted/30 py-16">
      <Container>

        {/* ================= COUNTRIES ================= */}

        <motion.div
          initial={{
            opacity: 0,
            y: 40,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.6,
          }}
          viewport={{ once: true }}
          className="overflow-hidden rounded-[34px] border bg-card shadow-lg"
        >

          <div className="grid items-center gap-6 px-5 py-6 sm:gap-10 sm:px-8 sm:py-10 lg:grid-cols-[240px_1fr_330px] lg:px-12 lg:py-12">

            {/* LEFT */}

            <div className="text-center lg:text-left">

              <p className="text-lg font-bold leading-snug text-foreground sm:text-3xl">

                Trusted by students from

              </p>

              <h3 className="mt-2 text-3xl font-extrabold text-primary sm:mt-4 sm:text-5xl">

                15+

              </h3>

              <p className="text-base font-semibold text-foreground sm:text-xl">

                Countries

              </p>

            </div>

            {/* WORLD MAP */}

            <div className="relative flex justify-center">

              <Image
                src="/images/map.jpg"
                alt="World Map"
                width={720}
                height={330}
                className="h-auto w-full max-w-[650px] opacity-75"
                priority
              />

            
            </div>

            {/* FLAGS */}

            <div>

              <div className="grid grid-cols-5 gap-2 sm:gap-3">

                {countries.map((country) => (

                  <div
                    key={country.name}
                    className="flex h-9 w-9 items-center justify-center rounded-lg border bg-card shadow-sm transition hover:-translate-y-1 hover:shadow-md sm:h-14 sm:w-14 sm:rounded-xl"
                  >

                    <Image
                      src={country.flag}
                      alt={country.name}
                      width={36}
                      height={36}
                      className="h-5 w-5 rounded-full object-cover sm:h-9 sm:w-9"
                    />

                  </div>

                ))}

                <div className="flex h-9 w-9 items-center justify-center rounded-lg border bg-card text-xs font-bold text-primary shadow-sm sm:h-14 sm:w-14 sm:rounded-xl sm:text-lg">

                  +5

                </div>

              </div>

              <p className="mt-4 text-center text-sm font-medium text-muted-foreground sm:mt-6 sm:text-base">

                ...and many more

              </p>

            </div>

          </div>

        </motion.div>
        {/* ================= STATISTICS ================= */}

        <motion.div
          initial={{
            opacity: 0,
            y: 30,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.6,
            delay: 0.15,
          }}
          viewport={{ once: true }}
          className="mt-6 overflow-hidden rounded-[22px] border bg-card shadow-lg sm:mt-10 sm:rounded-[30px]"
        >
          <div className="grid grid-cols-5 divide-x">

            {stats.map((item) => {

              const Icon = item.icon;

              return (

                <div
                  key={item.label}
                  className="flex flex-col items-center justify-center px-1.5 py-4 text-center transition-all hover:bg-muted sm:px-6 sm:py-8 md:px-8 md:py-10"
                >

                  <div className="mb-1.5 sm:mb-5">

                    <Icon
                      strokeWidth={1.8}
                      className="h-5 w-5 text-primary sm:h-10 sm:w-10 md:h-12 md:w-12"
                    />

                  </div>

                  <h3 className="text-sm font-extrabold text-foreground sm:text-3xl md:text-5xl">

                    {item.value}

                  </h3>

                  <p className="mt-1 text-center text-[9px] leading-tight font-medium text-muted-foreground sm:mt-3 sm:text-sm md:text-base">

                    {item.label}

                  </p>

                </div>

              );

            })}

          </div>
        </motion.div>

      </Container>
    </section>
  );
}