import Link from "next/link";
import Image from "next/image";

import { siteConfig } from "@/config/site";

export default function Logo() {
  return (
    <Link
      href="/"
      className="flex items-center gap-3 transition-transform duration-300 hover:scale-105"
    >
      <Image
        src={siteConfig.logo}
        alt={siteConfig.name}
        width={52}
        height={52}
        priority
        className="rounded-xl object-contain shadow-lg"
      />

      <div>
        <h2 className="text-xl font-bold tracking-tight">
          {siteConfig.name}
        </h2>

        <p className="whitespace-nowrap font-handwritten text-base font-semibold leading-none text-primary sm:text-lg">
          {siteConfig.tagline}
        </p>
      </div>
    </Link>
  );
}