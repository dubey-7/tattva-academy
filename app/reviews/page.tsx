import PageHero from "@/components/common/PageHero";
import Container from "@/components/common/Container";
import CTA from "@/components/home/CTA";

import ReviewCard from "@/components/reviews/ReviewCard";
import ReviewSummary from "@/components/reviews/ReviewSummary";
import RateUsButton from "@/components/reviews/RateUsButton";

import {
  getApprovedReviews,
  getReviewSummary,
} from "@/lib/reviews";

export default async function ReviewsPage() {
  const reviews = await getApprovedReviews();
  const summary = await getReviewSummary();

  return (
    <>
      <PageHero
        title="Student Reviews"
        description="The success of our students is the greatest measure of our teaching. Here's what learners and parents say about their experience with Tattva."
      />

      <section className="py-24">
        <Container>
          {/* Review Summary */}
          <ReviewSummary
            averageRating={summary.averageRating}
            totalReviews={summary.totalReviews}
          />

          {/* Rate Us */}
          <RateUsButton />

          {/* Reviews */}
          <div className="mt-16 grid gap-8 md:grid-cols-2">
            {reviews.map((review) => (
              <ReviewCard
                key={review.id}
                name={review.name}
                review={review.review}
                rating={review.rating}
                date={review.created_at}
              />
            ))}
          </div>
        </Container>
      </section>

      <CTA />
    </>
  );
}