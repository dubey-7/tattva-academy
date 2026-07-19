import Container from "@/components/common/Container";
import SectionHeading from "@/components/common/SectionHeading";

import ReviewsClient from "@/components/reviews/ReviewsClient";
import RateUsButton from "@/components/reviews/RateUsButton";

import { Star } from "lucide-react";

import {
  getApprovedReviews,
  getReviewSummary,
} from "@/lib/reviews";

export default async function FeaturedReviews() {
  const reviews = await getApprovedReviews();
  const summary = await getReviewSummary();

  if (!reviews.length) return null;

  return (
    <section
      id="reviews"
      className="py-24"
    >
      <Container>

        <SectionHeading
          badge="Student Reviews"
          title="Loved by Students & Parents"
          description="Real feedback from learners and parents who experienced personalized one-on-one tutoring with Tattva."
        />

        {/* Rating Header */}

        <div className="mb-16 flex flex-col items-center justify-between gap-8 border-b border-border pb-10 lg:flex-row">

          <div className="flex items-center gap-6">

            <div className="text-6xl font-bold tracking-tight text-primary">
              {summary.averageRating.toFixed(1)}
            </div>

            <div>

              <div className="mb-2 flex items-center gap-1">

                {Array.from({ length: 5 }).map((_, index) => (
                  <Star
                    key={index}
                    className="h-5 w-5 fill-yellow-500 text-yellow-500"
                  />
                ))}

              </div>

              <p className="font-medium">
                Excellent Rating
              </p>

              <p className="text-sm text-muted-foreground">
                Based on {summary.totalReviews} verified student reviews
              </p>

            </div>

          </div>

          <RateUsButton />

        </div>

        <ReviewsClient reviews={reviews} />

      </Container>
    </section>
  );
}