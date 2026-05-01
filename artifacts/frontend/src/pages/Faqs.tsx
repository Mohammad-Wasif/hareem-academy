import { useListFaqs } from "@workspace/api-client-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import CTAGroup from "@/components/CTAGroup";

export default function Faqs() {
  const { data: faqs = [], isLoading } = useListFaqs();

  // Group FAQs by category
  const grouped = faqs.reduce<Record<string, typeof faqs>>((acc, faq) => {
    const cat = faq.category || "General";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(faq);
    return acc;
  }, {});

  const categoryOrder = ["General", "Classes", "Enrollment"];
  const sortedCategories = categoryOrder.filter((c) => grouped[c]);

  return (
    <div className="min-h-screen bg-background pt-24 pb-24">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-5">
          <span className="inline-block text-xs font-bold tracking-widest text-primary uppercase">
            Frequently Asked Questions
          </span>
          <h1 className="font-serif font-bold text-4xl md:text-5xl text-foreground">
            We've got answers.
          </h1>
          <p className="text-lg text-muted-foreground">
            Everything you need to know about Hareem Academy — from enrollment
            to class schedules. Can't find your answer?{" "}
            <a href="/contact" className="text-primary font-medium hover:underline">
              Contact us
            </a>
            .
          </p>
        </div>

        {/* FAQ accordion grouped by category */}
        {isLoading ? (
          <div className="text-center py-20 text-muted-foreground">Loading FAQs...</div>
        ) : faqs.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            No FAQs available at the moment.
          </div>
        ) : (
          <div className="space-y-12">
            {sortedCategories.map((category) => (
              <div key={category}>
                <h2 className="font-serif font-bold text-2xl text-primary mb-5 flex items-center gap-3">
                  <span className="w-8 h-0.5 bg-accent inline-block rounded-full" />
                  {category}
                </h2>
                <Accordion type="single" collapsible className="w-full space-y-3">
                  {grouped[category].map((faq, index) => (
                    <AccordionItem
                      key={faq.id}
                      value={`${category}-${index}`}
                      className="bg-card border border-border rounded-xl px-6"
                    >
                      <AccordionTrigger className="hover:no-underline font-bold text-left py-4">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground pb-4 leading-relaxed">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            ))}
          </div>
        )}

        {/* CTA */}
        <div className="mt-20 text-center space-y-6">
          <h2 className="font-serif font-bold text-2xl md:text-3xl text-foreground">
            Still have questions?
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            We're always happy to help. Reach out on WhatsApp or book a free
            trial to experience our classes first-hand.
          </p>
          <CTAGroup />
        </div>
      </div>
    </div>
  );
}
