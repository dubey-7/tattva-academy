"use client";

import Image from "next/image";
import { PlayCircle } from "lucide-react";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";

interface VideoCardProps {
  title: string;
  description: string;
  thumbnail: string;
  videoUrl: string;
}

export default function VideoCard({
  title,
  description,
  thumbnail,
  videoUrl,
}: VideoCardProps) {
  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
      className="overflow-hidden rounded-3xl border bg-card shadow-sm"
    >
      <div className="relative aspect-video overflow-hidden">
        <Image
          src={thumbnail}
          alt={title}
          fill
          className="object-cover transition duration-500 hover:scale-110"
        />
      </div>

      <div className="space-y-4 p-6">
        <h3 className="text-2xl font-bold">
          {title}
        </h3>

        <p className="text-muted-foreground">
          {description}
        </p>

        <Button asChild className="w-full">
          <a
            href={videoUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            <PlayCircle className="mr-2 h-5 w-5" />
            Watch Demo
          </a>
        </Button>
      </div>
    </motion.div>
  );
}