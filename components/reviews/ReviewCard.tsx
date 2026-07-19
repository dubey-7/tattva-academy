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
    <div className="card-glow group flex h-full flex-col rounded-2xl border bg-card p-4 transition-all duration-300 hover:-translate-y-2 sm:rounded-3xl sm:p-8">

      <div className="mb-3 flex items-center justify-between sm:mb-5">

        <div className="flex gap-0.5 sm:gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={`h-3.5 w-3.5 sm:h-5 sm:w-5 ${
                star <= rating
                  ? "fill-yellow-400 text-yellow-400"
                  : "fill-transparent text-muted-foreground/30"
              }`}
            />
          ))}
        </div>

        <Quote className="h-5 w-5 text-primary/20 transition group-hover:scale-110 sm:h-7 sm:w-7" />

      </div>

      <p className="flex-1 text-sm leading-6 text-muted-foreground sm:text-base sm:leading-8">
        &ldquo;{review}&rdquo;
      </p>

      <div className="mt-5 flex items-center gap-3 border-t pt-4 sm:mt-8 sm:gap-4 sm:pt-6">

        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary sm:h-12 sm:w-12 sm:text-lg">
          {name.charAt(0).toUpperCase()}
        </div>

        <div className="min-w-0">
          <h3 className="truncate text-sm font-semibold sm:text-base">
            {name}
          </h3>

          {country && (
            <p className="truncate text-xs font-medium text-primary sm:text-sm">
              🌍 {country}
            </p>
          )}

          <p className="truncate text-xs text-muted-foreground sm:text-sm">
            {formattedDate} • {getTimeAgo(date)}
          </p>
        </div>

      </div>

    </div>
  );
}