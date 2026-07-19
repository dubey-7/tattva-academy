import { supabase } from "./supabase-server";
import { Review } from "@/types/review";

export async function getApprovedReviews(): Promise<Review[]> {
  const { data, error } = await supabase
    .from("reviews")
    .select("*")
    .eq("status", "approved")
    .order("display_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    return [];
  }

  return data ?? [];
}

export async function getReviewSummary() {
  const reviews = await getApprovedReviews();

  const totalReviews = reviews.length;

  const averageRating =
    totalReviews === 0
      ? 0
      : reviews.reduce((sum, review) => sum + review.rating, 0) /
        totalReviews;

  return {
    totalReviews,
    averageRating,
  };
}

export async function getFeaturedReviews() {
  const { data, error } = await supabase
    .from("reviews")
    .select("*")
    .eq("status", "approved")
    .eq("is_featured", true)
    .order("display_order", { ascending: true });

  if (error) {
    console.error(error);
    return [];
  }

  return data ?? [];
}