import PageHero from "@/components/common/PageHero";
import Container from "@/components/common/Container";
import CoursesGrid from "@/components/courses/CoursesGrid";
import CTA from "@/components/home/CTA";

export default function CoursesPage() {
  return (
    <>
      <PageHero
        title="Our Courses"
        description="Personalized one-on-one coaching designed to strengthen concepts, improve academic performance, and build confidence in every learner."
      />

      <section className="py-24">
        <Container>
          <CoursesGrid />
        </Container>
      </section>

      <CTA />
    </>
  );
}