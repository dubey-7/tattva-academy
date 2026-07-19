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
    <section className="bg-[#F8FAFC] py-16">
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
          className="overflow-hidden rounded-[34px] border bg-white shadow-lg"
        >

          <div className="grid items-center gap-10 px-12 py-12 lg:grid-cols-[240px_1fr_330px]">

            {/* LEFT */}

            <div>

              <p className="text-3xl font-bold leading-snug text-[#0D1B4C]">

                Trusted by
                <br />
                students from

              </p>

              <h3 className="mt-4 text-5xl font-extrabold text-[#6D28D9]">

                15+

              </h3>

              <p className="text-xl font-semibold text-[#0D1B4C]">

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

              <div className="grid grid-cols-5 gap-3">

                {countries.map((country) => (

                  <div
                    key={country.name}
                    className="flex h-14 w-14 items-center justify-center rounded-xl border bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                  >

                    <Image
                      src={country.flag}
                      alt={country.name}
                      width={36}
                      height={36}
                      className="rounded-full object-cover"
                    />

                  </div>

                ))}

                <div className="flex h-14 w-14 items-center justify-center rounded-xl border bg-white text-lg font-bold text-[#6D28D9] shadow-sm">

                  +5

                </div>

              </div>

              <p className="mt-6 text-center text-base font-medium text-gray-600">

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
          className="mt-10 overflow-hidden rounded-[30px] border bg-white shadow-lg"
        >
          <div className="grid divide-y md:grid-cols-5 md:divide-x md:divide-y-0">

            {stats.map((item) => {

              const Icon = item.icon;

              return (

                <div
                  key={item.label}
                  className="flex flex-col items-center justify-center px-8 py-10 transition-all hover:bg-[#F8FAFC]"
                >

                  <div className="mb-5">

                    <Icon
                      strokeWidth={1.8}
                      className="h-12 w-12 text-[#6D28D9]"
                    />

                  </div>

                  <h3 className="text-5xl font-extrabold text-[#0D1B4C]">

                    {item.value}

                  </h3>

                  <p className="mt-3 text-center text-base font-medium text-gray-500">

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