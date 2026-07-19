"use client";

import { useState } from "react";

import { Review } from "@/types/review";

import ReviewCard from "./ReviewCard";
import RateUsButton from "./RateUsButton";

import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";

interface Props {
  reviews: Review[];
}

export default function ReviewsClient({
  reviews,
}: Props) {
  const [showAll, setShowAll] = useState(false);

  const visibleReviews = showAll
    ? reviews
    : reviews.slice(0, 4);

  return (
    <>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {visibleReviews.map((review) => (
          <ReviewCard
            key={review.id}
            name={review.name}
            review={review.review}
            rating={review.rating}
            country={review.country}
            date={review.created_at}
          />
        ))}
      </div>

      {reviews.length > 4 && (
        <div className="mt-12 flex justify-center">
            <Button
            size="lg"
            onClick={() => setShowAll(!showAll)}
            className="rounded-xl px-8"
            >
            {showAll ? (
                <>
                Show Less
                <ChevronUp className="ml-2 h-5 w-5" />
                </>
            ) : (
                <>
                View More Reviews
                <ChevronDown className="ml-2 h-5 w-5" />
                </>
            )}
            </Button>
        </div>
        )}
    </>
  );
}