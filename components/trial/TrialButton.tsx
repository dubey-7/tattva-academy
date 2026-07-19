"use client";

import { useState } from "react";
import { MessageCircle } from "lucide-react";

import TrialModal from "./TrialModal";
import { cn } from "@/lib/utils";

interface TrialButtonProps {
  className?: string;
}

export default function TrialButton({
  className,
}: TrialButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={cn(
          "group relative inline-flex items-center justify-center overflow-hidden rounded-2xl",
          "bg-primary text-primary-foreground",
          "px-8 py-5",
          "text-lg font-bold",
          "shadow-[0_15px_40px_rgba(99,102,241,0.45)]",
          "transition-all duration-300",
          "hover:-translate-y-2 hover:scale-105",
          "hover:shadow-[0_22px_60px_rgba(99,102,241,0.6)]",
          "active:scale-95",
          "animate-[float_3.5s_ease-in-out_infinite]",
          className
        )}
      >
        {/* Shine */}
        <span className="absolute inset-0 overflow-hidden rounded-2xl">
          <span className="absolute -left-40 top-0 h-full w-20 -skew-x-12 bg-primary/25 blur-[1px] animate-[shine_2.8s_linear_infinite]" />
        </span>

        {/* Hover Glow */}
        <span className="absolute inset-0 rounded-2xl bg-primary-foreground/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        {/* Soft Glow */}
        <span className="absolute inset-0 rounded-2xl bg-primary/20 blur-xl animate-pulse" />

        <MessageCircle className="relative mr-3 h-5 w-5 animate-pulse" />

        <span className="relative tracking-wide">
          Book Free Trial
        </span>
      </button>

      <TrialModal
        open={open}
        onOpenChange={setOpen}
      />
    </>
  );
}