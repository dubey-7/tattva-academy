import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  badge?: string;
  title: string;
  description?: string;
  titleClassName?: string;
}

export default function SectionHeading({
  badge,
  title,
  description,
  titleClassName,
}: SectionHeadingProps) {
  return (
    <div className="mx-auto mb-12 max-w-3xl text-center sm:mb-16">
      {badge && (
        <span className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-xs font-semibold tracking-wide text-primary sm:text-sm">
          {badge}
        </span>
      )}

      <h2
        className={cn(
          "mt-5 text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl lg:text-5xl",
          titleClassName
        )}
      >
        {title}
      </h2>

      {description && (
        <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:mt-5 sm:text-lg">
          {description}
        </p>
      )}
    </div>
  );
}