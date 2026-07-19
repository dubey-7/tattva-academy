"use client";

import { Star } from "lucide-react";

interface ReviewSummaryProps {
  averageRating: number;
  totalReviews: number;
}

export default function ReviewSummary({
  averageRating,
  totalReviews,
}: ReviewSummaryProps) {
  return (
    <div className="mb-16 rounded-[2rem] border bg-card p-10 shadow-sm">

      <div className="flex flex-col items-center">

        <div className="mb-4 flex">
          {Array.from({ length: 5 }).map((_, index) => (
            <Star
              key={index}
              className="h-7 w-7 fill-yellow-400 text-yellow-400"
            />
          ))}
        </div>

        <h2 className="text-6xl font-extrabold tracking-tight">
          {averageRating.toFixed(1)}
        </h2>

        <p className="mt-2 text-xl font-semibold">
          Excellent
        </p>

        <p className="mt-2 text-muted-foreground">
          Based on{" "}
          <span className="font-semibold text-foreground">
            {totalReviews}
          </span>{" "}
          verified student reviews
        </p>

      </div>

    </div>
  );
}