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

        <div className="grid grid-cols-3 gap-2 sm:gap-5 md:gap-8">
          {steps.map((step, index) => {
            const Icon = step.icon;

            return (
              <div
                key={step.title}
                className="card-glow relative flex flex-col items-center rounded-xl border bg-card p-2.5 text-center transition duration-300 hover:-translate-y-2 sm:rounded-2xl sm:p-5 md:rounded-3xl md:p-8"
              >
                <span className="absolute right-2 top-2 hidden text-xs font-bold text-primary/25 sm:block sm:right-4 sm:top-4 sm:text-base">
                  0{index + 1}
                </span>

                <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 sm:mb-4 sm:h-14 sm:w-14 md:mb-6 md:h-16 md:w-16 md:rounded-2xl">
                  <Icon className="h-4.5 w-4.5 text-primary sm:h-6 sm:w-6 md:h-8 md:w-8" />
                </div>

                <h3 className="text-[11px] font-bold leading-tight sm:text-base md:text-xl">
                  {step.title}
                </h3>

                <p className="mt-1.5 hidden text-sm leading-6 text-muted-foreground sm:block md:mt-4 md:leading-7">
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