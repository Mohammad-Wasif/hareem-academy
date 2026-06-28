import { useState, useEffect } from "react";
import { useListFaqs } from "@workspace/api-client-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import CTAGroup from "@/components/CTAGroup";
import { SEO } from "@/components/SEO";
import { adminApi } from "@/lib/adminApi";

export default function Faqs() {
  const { data: faqs = [], isLoading } = useListFaqs();
  const [pageData, setPageData] = useState<any>(null);

  useEffect(() => {
    adminApi.getLandingPage("faqs")
      .then((data) => {
        if (data && data.config) {
          setPageData({
            title: data.title,
            metaDescription: data.metaDescription || "",
            ...data.config,
          });
        }
      })
      .catch((err) => {
        console.warn("Could not load faqs overrides:", err);
      });
  }, []);

  // Group FAQs by category
  const grouped = faqs.reduce<Record<string, any[]>>((acc, faq) => {
    const cat = faq.category || "General";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(faq);
    return acc;
  }, {});

  const categoryOrder = ["General", "Classes", "Enrollment"];
  const sortedCategories = categoryOrder.filter((c) => grouped[c]);

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://hareemacademy.com"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "FAQs",
        "item": "https://hareemacademy.com/faqs"
      }
    ]
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map((faq: any) => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  const computedFont =
    pageData?.theme?.fontFamily === "sans"
      ? "font-sans"
      : pageData?.theme?.fontFamily === "mono"
      ? "font-mono"
      : "font-serif";

  const sizeClass =
    pageData?.theme?.baseFontSize === "lg"
      ? "text-lg"
      : pageData?.theme?.baseFontSize === "sm"
      ? "text-sm"
      : "text-base";

  const primaryColor = pageData?.theme?.primaryColor || "#0F4D36";
  const accentColor = pageData?.theme?.accentColor || "#ECC565";
  const backgroundColor = pageData?.theme?.backgroundColor || "#FDFCF7";

  return (
    <div 
      className={`min-h-screen pt-24 pb-24 transition-colors duration-300 ${computedFont} ${sizeClass}`}
      style={pageData?.theme ? { backgroundColor } as React.CSSProperties : undefined}
    >
      <SEO
        title={pageData?.title || "Frequently Asked Questions"}
        description={pageData?.metaDescription || "Find answers to common questions about Hareem Academy: enrollment, batch timings, sisters-only privacy measures, fee structures, and free trials."}
        schema={[breadcrumbSchema, faqSchema]}
      />
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-5">
          <span 
            className="inline-block text-xs font-bold tracking-widest uppercase"
            style={{ color: primaryColor }}
          >
            {pageData?.geoContext || "Frequently Asked Questions"}
          </span>
          <h1 
            className="font-serif font-bold text-4xl md:text-5xl"
            style={{ color: primaryColor }}
          >
            {pageData?.heroTitle || "We've got answers."}
          </h1>
          <p className="text-lg text-muted-foreground">
            {pageData?.heroSubtitle || "Everything you need to know about Hareem Academy — from enrollment to class schedules."}
            {" "}
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
                  {grouped[category].map((faq: any, index: number) => {
                    const question = faq.question;
                    const answer = faq.answer;
                    
                    return (
                      <AccordionItem
                        key={faq.id}
                        value={`${category}-${index}`}
                        className="bg-card border border-border rounded-xl px-6"
                      >
                        <AccordionTrigger className="hover:no-underline font-bold text-left py-4">
                          {question}
                        </AccordionTrigger>
                        <AccordionContent className="text-muted-foreground pb-4 leading-relaxed">
                          {answer}
                        </AccordionContent>
                      </AccordionItem>
                    );
                  })}
                </Accordion>
              </div>
            ))}
          </div>
        )}

        {/* CTA */}
        <div className="mt-20 text-center space-y-6">
          <h2 
            className="font-serif font-bold text-2xl md:text-3xl"
            style={{ color: primaryColor }}
          >
            {pageData?.closingTitle || "Still have questions?"}
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            {pageData?.closingSubtitle || "We're always happy to help. Reach out on WhatsApp or book a free trial to experience our classes first-hand."}
          </p>
          <div className="flex justify-center">
            <CTAGroup align="center" primaryLabel={pageData?.primaryCTA} />
          </div>
        </div>
      </div>
    </div>
  );
}
