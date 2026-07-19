import {
  CalendarCheck,
  BookOpen,
  GraduationCap,
} from "lucide-react";

import Container from "@/components/common/Container";
import SectionHeading from "@/components/common/SectionHeading";

const steps = [
  {
    icon: CalendarCheck,
    title: "Book a Free Trial",
    description:
      "Schedule a free one-on-one demo class at your preferred time.",
  },
  {
    icon: BookOpen,
    title: "Personalized Learning Plan",
    description:
      "A customized study plan is created based on the student's strengths and goals.",
  },
  {
    icon: GraduationCap,
    title: "Achieve Better Results",
    description:
      "Regular guidance, practice and feedback help students improve consistently.",
  },
];

export default function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="py-24"
    >
      <Container>
        <SectionHeading
          badge="Simple Process"
          title="How It Works"
          description="Learning with Tattva is simple, personalized and focused on results."
        />

        <div className="grid gap-8 md:grid-cols-3">
          {steps.map((step) => {
            const Icon = step.icon;

            return (
              <div
                key={step.title}
                className="rounded-3xl border bg-card p-8 text-center shadow-sm transition hover:-translate-y-2 hover:shadow-xl"
              >
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
                  <Icon className="h-8 w-8 text-primary" />
                </div>

                <h3 className="text-xl font-bold">
                  {step.title}
                </h3>

                <p className="mt-4 leading-7 text-muted-foreground">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}