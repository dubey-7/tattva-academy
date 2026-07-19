interface SectionHeadingProps {
  badge?: string;
  title: string;
  description?: string;
}

export default function SectionHeading({
  badge,
  title,
  description,
}: SectionHeadingProps) {
  return (
    <div className="mx-auto mb-16 max-w-3xl text-center">
      {badge && (
        <span className="inline-flex rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
          {badge}
        </span>
      )}

      <h2 className="mt-5 text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">
        {title}
      </h2>

      {description && (
        <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
          {description}
        </p>
      )}
    </div>
  );
}