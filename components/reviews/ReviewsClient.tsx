"use client";

import { useState } from "react";

import { Review } from "@/types/review";

import ReviewCard from "./ReviewCard";

import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";

interface Props {
  reviews: Review[];
}

const PREVIEW_COUNT = 4;

export default function ReviewsClient({ reviews }: Props) {
  const [showAll, setShowAll] = useState(false);

  const preview = reviews.slice(0, PREVIEW_COUNT);
  const hasMore = reviews.length > PREVIEW_COUNT;

  return (
    <>
      {!showAll ? (
        /* Collapsed: a single row, card by card, left to right — on every screen size */
        <div className="relative -mx-4 sm:mx-0">
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 hidden w-12 bg-gradient-to-r from-background to-transparent sm:block" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 hidden w-12 bg-gradient-to-l from-background to-transparent sm:block" />

          <div className="no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth px-4 pb-2 sm:gap-6 sm:px-0">
            {preview.map((review) => (
              <div
                key={review.id}
                className="w-[78vw] max-w-[300px] shrink-0 snap-start sm:w-[320px]"
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
        </div>
      ) : (
        /* Expanded: every review in a clean, wrapping grid */
        <div className="grid gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
          {reviews.map((review) => (
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
      )}

      {hasMore && (
        <div className="mt-10 flex justify-center sm:mt-12">
          <Button
            size="lg"
            onClick={() => setShowAll((v) => !v)}
            className="shine-button rounded-xl px-8 shadow-lg shadow-primary/25"
          >
            {showAll ? (
              <>
                Show Less
                <ChevronUp className="ml-2 h-5 w-5" />
              </>
            ) : (
              <>
                Show More Reviews
                <ChevronDown className="ml-2 h-5 w-5" />
              </>
            )}
          </Button>
        </div>
      )}
    </>
  );
}
