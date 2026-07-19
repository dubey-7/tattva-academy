import { Star, Quote } from "lucide-react";

interface ReviewCardProps {
  name: string;
  review: string;
  rating: number;
  country?: string | null;
  date: string;
}

function getTimeAgo(dateString: string) {
  const reviewDate = new Date(dateString);
  const now = new Date();

  if (isNaN(reviewDate.getTime())) {
    return "Recently";
  }

  const diffMs = now.getTime() - reviewDate.getTime();

  if (diffMs <= 0) return "Today";

  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "1 day ago";
  if (diffDays < 30) return `${diffDays} days ago`;

  const diffMonths = Math.floor(diffDays / 30);

  if (diffMonths < 12) {
    return diffMonths === 1
      ? "1 month ago"
      : `${diffMonths} months ago`;
  }

  const diffYears = Math.floor(diffDays / 365);

  return diffYears === 1
    ? "1 year ago"
    : `${diffYears} years ago`;
}

export default function ReviewCard({
  name,
  review,
  rating,
  country,
  date,
}: ReviewCardProps) {
  const reviewDate = new Date(date);

  const formattedDate = isNaN(reviewDate.getTime())
    ? "Recent review"
    : reviewDate.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });

  return (
    <div className="group flex h-full flex-col rounded-3xl border bg-card p-8 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">

      <div className="mb-5 flex items-center justify-between">

        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={`h-5 w-5 ${
                star <= rating
                  ? "fill-yellow-400 text-yellow-400"
                  : "fill-transparent text-gray-300"
              }`}
            />
          ))}
        </div>

        <Quote className="h-7 w-7 text-primary/20 transition group-hover:scale-110" />

      </div>

      <p className="flex-1 leading-8 text-muted-foreground">
        "{review}"
      </p>

      <div className="mt-8 flex items-center gap-4 border-t pt-6">

        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-lg font-bold text-primary">
          {name.charAt(0).toUpperCase()}
        </div>

        <div>
          <h3 className="font-semibold">
            {name}
          </h3>

          {country && (
            <p className="text-sm text-primary font-medium">
              🌍 {country}
            </p>
          )}

          <p className="text-sm text-muted-foreground">
            {formattedDate} • {getTimeAgo(date)}
          </p>
        </div>

      </div>

    </div>
  );
}