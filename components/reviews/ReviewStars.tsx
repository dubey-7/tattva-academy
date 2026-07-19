"use client";

import { useState } from "react";
import { Star } from "lucide-react";

interface ReviewStarsProps {
  rating: number;
  setRating: (rating: number) => void;
}

export default function ReviewStars({
  rating,
  setRating,
}: ReviewStarsProps) {
  const [hoverRating, setHoverRating] = useState(0);

  return (
    <div className="flex justify-center gap-2">
      {[1, 2, 3, 4, 5].map((star) => {
        const active =
          hoverRating > 0
            ? star <= hoverRating
            : star <= rating;

        return (
          <button
            key={star}
            type="button"
            onClick={() => setRating(star)}
            onMouseEnter={() => setHoverRating(star)}
            onMouseLeave={() => setHoverRating(0)}
            className="transition-transform hover:scale-125"
          >
            <Star
              className={`h-10 w-10 transition-all ${
                active
                  ? "fill-yellow-400 text-yellow-400"
                  : "fill-transparent text-gray-300"
              }`}
            />
          </button>
        );
      })}
    </div>
  );
}