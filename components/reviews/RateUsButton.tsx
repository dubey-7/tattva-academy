"use client";

import { useState } from "react";
import { Sparkles, PenSquare } from "lucide-react";

import ReviewModal from "./ReviewModal";

export default function RateUsButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="group relative inline-flex w-full items-center justify-center gap-2 overflow-hidden rounded-2xl bg-gradient-to-r from-primary via-primary to-indigo-600 px-6 py-4 text-sm font-bold text-white shadow-xl transition-all duration-300 hover:-translate-y-1 hover:scale-105 hover:shadow-2xl active:scale-95 sm:w-auto sm:gap-3 sm:px-8 sm:text-base"
      >
        {/* Shine Effect */}
        <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 group-hover:translate-x-full" />

        {/* Pulse Glow */}
        <span className="absolute inset-0 rounded-2xl bg-white/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        <Sparkles className="relative h-5 w-5 animate-pulse" />

        <span className="relative">
          ⭐ Loved Your Classes? Write a Review
        </span>

        <PenSquare className="relative h-5 w-5 transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110" />
      </button>

      <ReviewModal
        open={open}
        onOpenChange={setOpen}
      />
    </>
  );
}