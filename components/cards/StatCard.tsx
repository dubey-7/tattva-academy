"use client";

import { motion } from "framer-motion";

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ElementType;
}

export default function StatCard({
  title,
  value,
  icon: Icon,
}: StatCardProps) {
  return (
    <div className="rounded-2xl border border-border bg-card p-6 text-center shadow-md transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
      <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10">
        <Icon className="h-7 w-7 text-primary" />
      </div>

      <h3 className="text-3xl font-bold text-foreground">
        {value}
      </h3>

      <p className="mt-2 text-sm font-medium text-muted-foreground">
        {title}
      </p>
    </div>
  );
}