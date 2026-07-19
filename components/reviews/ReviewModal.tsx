"use client";

import { useState } from "react";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

import ReviewStars from "./ReviewStars";

interface ReviewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ReviewModal({
  open,
  onOpenChange,
}: ReviewModalProps) {
  const [name, setName] = useState("");
  const [country, setCountry] = useState("India");
  const [countryOther, setCountryOther] = useState("");
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
    console.log("FORM SUBMITTED");

    e.preventDefault();

    if (loading) return;

    if (name.trim().length < 2) {
      toast.error("Please enter your name.");
      return;
    }

    if (rating === 0) {
      toast.error("Please select a rating.");
      return;
    }

    const finalCountry =
      country === "Other" ? countryOther.trim() : country;

    if (!finalCountry) {
      toast.error("Please specify your country.");
      return;
    }

    if (review.trim().length < 15) {
      toast.error(
        "Please write at least 15 characters."
      );
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/reviews", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          name: name.trim(),
          country: finalCountry,
          rating,
          review: review.trim(),
        }),
      });

      if (!response.ok) {
        const error = await response.json();

        console.error(error);

        toast.error(error.message);

        setLoading(false);

        return;
      }

      toast.success(
        "Review submitted successfully!"
      );

      setSuccess(true);

      setTimeout(() => {
        setSuccess(false);

        setName("");
        setCountry("India");
        setCountryOther("");
        setRating(5);
        setReview("");

        onOpenChange(false);

        setLoading(false);
      }, 1800);

    } catch (error) {
      console.error(error);

      toast.error(
        "Something went wrong. Please try again."
      );

      setLoading(false);
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="sm:max-w-lg rounded-3xl">

        {success ? (
          <div className="space-y-4 py-12 text-center">

            <div className="text-6xl">
              🎉
            </div>

            <h2 className="text-2xl font-bold">
              Thank You!
            </h2>

            <p className="text-muted-foreground">
              Your review has been submitted successfully.
              It will appear after approval.
            </p>

          </div>
        ) : (
          <>
            <DialogHeader>

              <DialogTitle className="text-2xl">
                ⭐ Rate Your Experience
              </DialogTitle>

              <DialogDescription>
                Share your learning experience with Tattva.
              </DialogDescription>

            </DialogHeader>

            <form
              onSubmit={handleSubmit}
              className="space-y-6 pt-2"
            >

              <div>

                <label className="mb-2 block font-medium">
                  Your Name <span className="text-red-500">*</span>
                </label>

                <input
                  required
                  value={name}
                  placeholder="Enter your name"
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-xl border bg-background px-4 py-3 outline-none focus:border-primary"
                />

                {name.length > 0 && name.length < 3 && (
                  <p className="mt-2 text-xs text-red-500">
                    Minimum 3 characters ({name.length}/3)
                  </p>
                )}

              </div>

              <div>

                <label className="mb-2 block font-medium">
                  Country <span className="text-red-500">*</span>
                </label>

                <select
                  value={country}
                  onChange={(e) =>
                    setCountry(e.target.value)
                  }
                  className="w-full rounded-xl border bg-background px-4 py-3 outline-none focus:border-primary"
                >
                  <option>India</option>
                  <option>USA</option>
                  <option>United Kingdom</option>
                  <option>Canada</option>
                  <option>Australia</option>
                  <option>Singapore</option>
                  <option>UAE</option>
                  <option>Other</option>
                </select>

                {country === "Other" && (
                  <input
                    type="text"
                    value={countryOther}
                    onChange={(e) => setCountryOther(e.target.value)}
                    placeholder="Please specify your country"
                    className="mt-3 w-full rounded-xl border bg-background px-4 py-3 outline-none focus:border-primary"
                  />
                )}

              </div>

              <div>

                <label className="mb-3 block font-medium">
                  Rating <span className="text-red-500">*</span>
                </label>

                <ReviewStars
                  rating={rating}
                  setRating={setRating}
                />

              </div>

              <div>

                <label className="mb-2 block font-medium">
                  Review <span className="text-red-500">*</span>
                </label>

                <textarea
                  required
                  rows={5}
                  value={review}
                  placeholder="Tell us about your learning experience..."
                  onChange={(e) =>
                    setReview(e.target.value)
                  }
                  className="w-full resize-none rounded-xl border bg-background px-4 py-3 outline-none focus:border-primary"
                />

                <div className="mt-2 flex items-center justify-between text-xs">

                  <span className="text-muted-foreground">
                    {review.length < 15
                      ? `15/1000 minimum`
                      : `${review.length}/1000`}
                  </span>

                  {review.length > 0 && review.length < 15 && (
                    <span className="text-red-500">
                      Minimum 15 characters ({review.length}/15)
                    </span>
                  )}

                </div>

              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-primary py-3 font-semibold text-primary-foreground transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading
                  ? "Submitting Review..."
                  : "Submit My Review"}
              </button>

            </form>
          </>
        )}

      </DialogContent>
    </Dialog>
  );
}