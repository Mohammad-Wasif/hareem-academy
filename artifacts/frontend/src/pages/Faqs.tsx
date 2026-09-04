import { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { SEO } from "@/components/SEO";
import { ChevronRight, Headphones, ArrowRight, HelpCircle } from "lucide-react";
import { useWhatsApp } from "@/hooks/use-whatsapp";

const OFFICIAL_FAQS = [
  {
    id: 1,
    category: "General",
    question: "Who can join Hareem Academy?",
    answer: "Hareem Academy is exclusively for girls and women — sisters only. We welcome learners from different ages and backgrounds, whether you're starting from the basics or looking to strengthen your existing skills."
  },
  {
    id: 2,
    category: "General",
    question: "Do I need any prior knowledge of Arabic or Urdu?",
    answer: "Our Urdu course is beginner-friendly and starts from the basics.\n\nFor Arabic courses, students should be comfortable reading basic Urdu, as lessons and explanations are supported in Urdu to make learning Arabic easier and more effective."
  },
  {
    id: 3,
    category: "Admissions",
    question: "Are the courses available for Indian sisters living abroad?",
    answer: "Yes. Hareem Academy is designed to serve sisters in India as well as Indian families living abroad. Join our live online classes from the UAE, UK, or wherever you are, and learn comfortably with teachers familiar with the language and cultural background of Indian students."
  },
  {
    id: 4,
    category: "Classes",
    question: "How are the classes conducted?",
    answer: "Classes are held live online through Google Meet. You can interact with your teacher in real time, ask questions, practice during the lesson, and receive guidance throughout the class."
  },
  {
    id: 5,
    category: "Classes",
    question: "What are the class timings?",
    answer: "Each course has its own schedule. For example, Arabic Foundations currently runs Monday to Friday from 8:00 PM to 9:00 PM IST.\n\nPlease check the individual course page for the latest timings and batch availability."
  },
  {
    id: 6,
    category: "Classes",
    question: "What if I miss a class?",
    answer: "We understand that sometimes you may not be able to attend a class. If you miss a lesson, you can connect with your teacher or our team to understand what was covered and stay on track with the course."
  },
  {
    id: 7,
    category: "Admissions",
    question: "Is there a free trial?",
    answer: "Yes! Every course offers a free trial class, allowing you to experience the teaching style and classroom environment before enrolling.\n\nSimply click “Book Your Free Trial” on the relevant course page to get started."
  },
  {
    id: 8,
    category: "Admissions",
    question: "How much do the courses cost?",
    answer: "Fees vary depending on the course and level. You can find the latest pricing and course details on each individual course page."
  },
  {
    id: 9,
    category: "Admissions",
    question: "How do I enroll?",
    answer: "Choose the course you're interested in and click “Book Your Free Trial” or “Enroll Now.” Submit your details, and our team will contact you on WhatsApp to guide you through the next steps and confirm your place."
  }
];

export default function Faqs() {
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const { whatsappUrl } = useWhatsApp();

  const categoriesSet = new Set<string>(["All"]);
  OFFICIAL_FAQS.forEach((item) => {
    if (item.category) categoriesSet.add(item.category);
  });
  const categories = Array.from(categoriesSet);

  const filteredFaqs = activeCategory === "All"
    ? OFFICIAL_FAQS
    : OFFICIAL_FAQS.filter((f) => f.category === activeCategory);

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
    "mainEntity": OFFICIAL_FAQS.map((faq) => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] text-[#191c1d] flex flex-col pt-10 pb-16">
      <SEO
        title="Frequently Asked Questions"
        description="Find answers to common questions about Hareem Academy: live online batches, sisters-only privacy, timings, certification, and free trials."
        keywords={[
          "hareem academy faqs",
          "online quran class questions",
          "female arabic tutor queries",
          "sisters only arabic classes timings",
          "online urdu classes questions",
          "free trial arabic class"
        ]}
        schema={[breadcrumbSchema, faqSchema]}
      />

      <main className="flex-grow flex flex-col items-center px-4 md:px-12 max-w-[1280px] mx-auto w-full">
        {/* Header Section */}
        <div className="max-w-3xl w-full text-center mb-10 md:mb-12">
          <span className="inline-block text-[11px] font-bold tracking-widest uppercase text-[#00450d] bg-[#00450d]/5 px-3 py-0.5 rounded-full border border-[#00450d]/10 mb-3 font-sans">
            Frequently Asked Questions
          </span>
          <h1 className="font-serif font-bold text-2xl md:text-4xl text-[#00450d] mb-3 leading-tight">
            We've got answers.
          </h1>
          <p className="font-sans text-xs md:text-sm text-[#41493e] leading-relaxed">
            Everything you need to know about Hareem Academy — from enrollment to class schedules.
          </p>
        </div>

        {/* FAQ Layout Grid */}
        <div className="w-full grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-10">
          {/* Categories Sidebar */}
          <aside className="md:col-span-4 flex flex-col">
            <div className="bg-white rounded-2xl p-4 md:p-5 shadow-[0_12px_40px_rgba(0,53,39,0.03)] border border-gray-200/80 md:sticky md:top-28">
              <h3 className="font-serif text-base md:text-lg font-bold text-[#00450d] mb-3 md:mb-4 pb-2 md:pb-2.5 border-b border-gray-100 flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-[#00450d]" />
                Categories
              </h3>
              <ul className="flex md:flex-col overflow-x-auto pb-1 md:pb-0 gap-1.5 md:space-y-1.5 scrollbar-none">
                {categories.map((cat) => {
                  const isActive = activeCategory === cat;
                  return (
                    <li key={cat} className="shrink-0">
                      <button
                        onClick={() => setActiveCategory(cat)}
                        className={`w-auto md:w-full whitespace-nowrap text-left px-3.5 py-2 md:py-2.5 rounded-xl font-sans text-xs md:text-sm font-semibold transition-all flex justify-between items-center gap-2 group cursor-pointer ${
                          isActive
                            ? "bg-[#00450d] text-white shadow-sm"
                            : "text-[#41493e] hover:bg-[#f3f4f5] hover:text-[#00450d] bg-gray-50 md:bg-transparent"
                        }`}
                      >
                        <span>{cat}</span>
                        <ChevronRight
                          className={`hidden md:block w-3.5 h-3.5 transition-transform ${
                            isActive
                              ? "text-white"
                              : "opacity-0 group-hover:opacity-100 transition-opacity"
                          }`}
                        />
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          </aside>

          {/* Accordion List */}
          <div className="md:col-span-8 flex flex-col space-y-3">
            <Accordion type="single" collapsible className="w-full space-y-3">
              {filteredFaqs.map((faq, index) => (
                <AccordionItem
                  key={faq.id || index}
                  value={`item-${faq.id || index}`}
                  className="bg-white rounded-2xl shadow-[0_4px_16px_rgba(0,53,39,0.03)] border border-gray-200/70 overflow-hidden transition-all duration-200 px-1"
                >
                  <AccordionTrigger className="w-full flex justify-between items-center p-4 md:p-5 text-left font-serif font-semibold text-base md:text-lg text-[#00450d] hover:no-underline cursor-pointer">
                    <span>{faq.question}</span>
                  </AccordionTrigger>
                  <AccordionContent className="bg-[#f8f9fa] px-5 py-4 text-xs md:text-sm text-[#41493e] leading-relaxed border-t border-gray-100/80 whitespace-pre-line">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>

        {/* Still Have Questions CTA */}
        <div className="mt-14 w-full max-w-3xl relative rounded-2xl overflow-hidden p-6 md:p-10 text-center bg-white border border-gray-200/80 shadow-[0_16px_40px_rgba(0,53,39,0.05)]">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/40 via-white to-amber-50/30 opacity-70 pointer-events-none" />
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-[#00450d]/10 flex items-center justify-center mb-4 text-[#00450d]">
              <Headphones className="w-6 h-6" />
            </div>
            <h2 className="font-serif font-bold text-xl md:text-2xl text-[#00450d] mb-2">
              Still have questions?
            </h2>
            <p className="font-sans text-xs md:text-sm text-[#41493e] mb-6 max-w-md leading-relaxed">
              We're happy to help. If you're unsure which course is right for you, have questions about timings, or simply want to know more about Hareem Academy, speak with our team on WhatsApp.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center font-sans font-bold text-xs md:text-sm bg-[#00450d] text-white px-6 py-3 rounded-xl hover:bg-[#00450d]/90 transition-all shadow-md shadow-[#00450d]/10 hover:-translate-y-0.5 cursor-pointer"
              >
                Contact Us
                <ArrowRight className="ml-2 w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
