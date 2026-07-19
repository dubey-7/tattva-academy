import PageHero from "@/components/common/PageHero";
import Container from "@/components/common/Container";
import SubjectCard from "@/components/cards/SubjectCard";
import CTA from "@/components/home/CTA";

import { courses } from "@/data/courses";

export default function CoursesPage() {
  return (
    <>
      <PageHero
        title="Our Courses"
        description="Personalized one-on-one coaching designed to strengthen concepts, improve academic performance, and build confidence in every learner."
      />

      <section className="py-24">
        <Container>
          <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-2">
            {courses.map((course) => (
              <SubjectCard
                key={course.id}
                title={course.title}
                description={course.description}
              />
            ))}
          </div>
        </Container>
      </section>

      <CTA />
    </>
  );
}