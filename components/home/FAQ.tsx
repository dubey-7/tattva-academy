import Container from "@/components/common/Container";
import SectionHeading from "@/components/common/SectionHeading";

import { faq } from "@/data/faq";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function FAQ() {
  return (
    <section className="bg-muted/30 py-24">
      <Container>
        <SectionHeading
          badge="Frequently Asked Questions"
          title="Have Questions?"
          description="Find answers to the most common questions about our personalized online tutoring programs."
        />

        <div className="mx-auto max-w-4xl">
          <Accordion
            type="single"
            collapsible
            className="space-y-4"
          >
            {faq.map((item) => (
              <AccordionItem
                key={item.id}
                value={`item-${item.id}`}
                className="overflow-hidden rounded-2xl border bg-card px-6 transition-all duration-300 hover:shadow-lg"
              >
                <AccordionTrigger className="text-left text-lg font-semibold hover:no-underline">
                  {item.question}
                </AccordionTrigger>

                <AccordionContent className="pb-5 leading-7 text-muted-foreground">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </Container>
    </section>
  );
}