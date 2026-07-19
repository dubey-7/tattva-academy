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
      <div className="scroll-row -mx-4 gap-4 px-4 sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-6 sm:overflow-visible sm:px-0 lg:grid-cols-4">
        {visibleReviews.map((review) => (
          <div
            key={review.id}
            className="w-[78vw] max-w-[300px] shrink-0 sm:w-auto sm:max-w-none"
          >
            <ReviewCard
              name={review.name}
              review={review.review}
              rating={review.rating}
              country={review.country}
              date={review.created_at}
            />
          </div>
        ))}
      </div>

      {reviews.length > 4 && (
        <div className="mt-10 flex justify-center sm:mt-12">
            <Button
            size="lg"
            onClick={() => setShowAll(!showAll)}
            className="shine-button rounded-xl px-8 shadow-lg shadow-primary/25"
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