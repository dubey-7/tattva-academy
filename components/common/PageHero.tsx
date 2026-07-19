import Container from "@/components/common/Container";

interface PageHeroProps {
  title: string;
  description: string;
}

export default function PageHero({
  title,
  description,
}: PageHeroProps) {
  return (
    <section className="border-b bg-muted/30 py-20">
      <Container>
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-4xl font-bold md:text-5xl">
            {title}
          </h1>

          <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
            {description}
          </p>
        </div>
      </Container>
    </section>
  );
}