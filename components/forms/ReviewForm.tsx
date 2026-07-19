"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Star } from "lucide-react";

import { Button } from "@/components/ui/button";

const reviewSchema = z.object({
  name: z.string().min(2, "Please enter your name."),
  role: z.enum(["Student", "Parent"], {
    message: "Please select your role.",
  }), 
  country: z.string().optional(),
  review: z
    .string()
    .min(10, "Review should be at least 10 characters."),
  rating: z.number().min(1, "Please give a rating."),
});

type ReviewFormData = z.infer<typeof reviewSchema>;

export default function ReviewForm() {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<ReviewFormData>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      rating: 5,
      role: "Student",
      country: "",
    },
  });

  const rating = watch("rating");

  async function onSubmit(data: ReviewFormData) {
    try {
      setLoading(true);

      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message);
      }

      setSubmitted(true);
      reset();
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <div className="rounded-3xl border border-border bg-card p-12 text-center shadow-lg">
        <h2 className="text-3xl font-bold">
          🎉 Thank You!
        </h2>

        <p className="mt-4 text-lg text-muted-foreground">
          Your review has been submitted successfully.
        </p>

        <p className="mt-2 text-muted-foreground">
          It will appear on our website after approval.
        </p>

        <Button
          className="mt-8"
          onClick={() => setSubmitted(false)}
        >
          Submit Another Review
        </Button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-8 rounded-3xl border border-border bg-card p-8 shadow-xl"
    >
      {/* Rating */}
      <div>
        <label className="mb-3 block text-lg font-semibold">
          Rating
        </label>

        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setValue("rating", star)}
            >
              <Star
                className={`h-8 w-8 transition ${
                  star <= rating
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-gray-400"
                }`}
              />
            </button>
          ))}
        </div>

        {errors.rating && (
          <p className="mt-2 text-sm text-red-500">
            {errors.rating.message}
          </p>
        )}
      </div>

      {/* Name */}
      <div>
        <label className="mb-2 block font-semibold">
          Full Name
        </label>

        <input
          {...register("name")}
          className="w-full rounded-xl border border-border bg-background px-4 py-3 outline-none transition focus:border-primary"
          placeholder="Enter your name"
        />

        {errors.name && (
          <p className="mt-2 text-sm text-red-500">
            {errors.name.message}
          </p>
        )}
      </div>

      {/* Role */}
      <div>
        <label className="mb-2 block font-semibold">
          I am a
        </label>

        <select
          {...register("role")}
          className="w-full rounded-xl border border-border bg-background px-4 py-3"
        >
          <option value="Student">
            Student
          </option>

          <option value="Parent">
            Parent
          </option>
        </select>
      </div>

      {/* Country */}
      <div>
        <label className="mb-2 block font-semibold">
          Country
        </label>

        <input
          {...register("country")}
          className="w-full rounded-xl border border-border bg-background px-4 py-3 outline-none transition focus:border-primary"
          placeholder="India"
        />
      </div>

      {/* Review */}
      <div>
        <label className="mb-2 block font-semibold">
          Your Review
        </label>

        <textarea
          {...register("review")}
          rows={6}
          className="w-full rounded-xl border border-border bg-background px-4 py-3 outline-none transition focus:border-primary"
          placeholder="Share your experience..."
        />

        {errors.review && (
          <p className="mt-2 text-sm text-red-500">
            {errors.review.message}
          </p>
        )}
      </div>

      {/* Submit */}
      <Button
        type="submit"
        size="lg"
        className="w-full"
        disabled={loading}
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Submitting...
          </>
        ) : (
          "Submit Review"
        )}
      </Button>
    </form>
  );
}