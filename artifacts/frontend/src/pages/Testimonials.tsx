import { useListTestimonials } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import { SEO } from "@/components/SEO";
import { motion, type Variants } from "framer-motion";
import { Star, Quote, Sparkles, ArrowRight, MapPin } from "lucide-react";
import { useWhatsApp } from "@/hooks/use-whatsapp";
import { FaWhatsapp } from "react-icons/fa";

const staggerContainer: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
      ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
    },
  },
};

export default function Testimonials() {
  const { data: testimonials = [], isLoading } = useListTestimonials();
  const { whatsappUrl } = useWhatsApp();

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
        "name": "Testimonials",
        "item": "https://hareemacademy.com/testimonials"
      }
    ]
  };

  const reviewSchemas = testimonials.map((testimonial) => ({
    "@context": "https://schema.org",
    "@type": "Review",
    "itemReviewed": {
      "@type": "Course",
      "name": testimonial.course || "Quran & Arabic Classes",
      "provider": {
        "@type": "Organization",
        "name": "Hareem Academy"
      }
    },
    "reviewRating": {
      "@type": "Rating",
      "ratingValue": testimonial.rating || 5,
      "bestRating": 5
    },
    "author": {
      "@type": "Person",
      "name": testimonial.studentName
    },
    "reviewBody": testimonial.quote
  }));

function getCleanCourseName(course?: string) {
  if (!course) return course;
  const lower = course.toLowerCase();
  if (lower.includes("urdu")) return "Urdu Essentials";
  if (lower.includes("intermediate") || lower.includes("advanced") || lower.includes("level 2")) return "Intermediate Arabic";
  if (lower.includes("arabic") || lower.includes("quran") || lower.includes("foundations") || lower.includes("basic") || lower.includes("level 1")) return "Arabic Foundations";
  return course;
}

  const defaultStories = [
    {
      id: "1",
      studentName: "Fatima K.",
      location: "London, UK",
      course: "Arabic Foundations",
      quote: "The depth of scholarship here is unparalleled. Studying Classical Arabic at Hareem Academy didn't just teach me a language; it connected me to a centuries-old tradition of female scholarship. The environment is both rigorous and profoundly supportive.",
    },
    {
      id: "2",
      studentName: "Mariam S.",
      location: "Dubai, UAE",
      course: "Urdu Essentials",
      quote: "The Urdu Literature program opened a window into my cultural heritage that I had never fully appreciated. The instructors are genuinely invested in our understanding.",
    },
    {
      id: "3",
      studentName: "Zaynab A.",
      location: "Mumbai, India",
      course: "Intermediate Arabic",
      quote: "Finding a community of like-minded, ambitious women striving for academic excellence has been the most rewarding part of my journey here.",
    },
    {
      id: "4",
      studentName: "Aisha M.",
      location: "Toronto, Canada",
      course: "Urdu Essentials",
      quote: "Returning to study after many years was daunting, but the flexible structure and patient educators at Hareem Academy made it seamless. The curriculum is challenging, yet deeply fulfilling. I've found a renewed sense of purpose.",
    }
  ];

  const displayList = testimonials.length > 0 ? testimonials : defaultStories;

  return (
    <div className="min-h-screen bg-[#f7f9fb] text-[#191c1e] font-sans antialiased selection:bg-[#064e3b] selection:text-[#80bea6] pt-6 pb-4 md:pb-6">
      <SEO
        title="Student Testimonials | Hareem Academy"
        description="Discover real stories and experiences from sisters around the world who have transformed their Arabic and Quranic studies at Hareem Academy."
        schema={[breadcrumbSchema, ...reviewSchemas]}
      />

      <style>{`
        .bg-pattern {
          background-image: radial-gradient(rgba(0, 53, 39, 0.05) 1px, transparent 1px);
          background-size: 24px 24px;
        }
      `}</style>

      <main className="pt-4 md:pt-6 pb-4">
        {/* Hero Section */}
        <section className="px-4 md:px-12 max-w-[1280px] mx-auto mb-8 md:mb-10 relative">
          <div className="absolute inset-0 bg-pattern opacity-50 pointer-events-none -z-10" />
          <div className="max-w-3xl mx-auto text-center space-y-2">
            <span className="inline-block text-[11px] font-bold tracking-widest uppercase text-[#003527] bg-[#003527]/5 px-3 py-0.5 rounded-full border border-[#003527]/10 font-sans">
              Testimonials
            </span>
            <h1 className="font-serif font-bold text-xl sm:text-2xl md:text-3xl text-[#003527] tracking-tight leading-tight">
              Our Community Stories
            </h1>
            <p className="font-sans text-xs md:text-xs text-[#404944] max-w-xl mx-auto leading-relaxed">
              Discover the transformative academic journeys and personal growth of women who have found their intellectual home at Hareem Academy.
            </p>
          </div>
        </section>

        {/* Compact Testimonials Bento Grid */}
        <section className="px-4 md:px-12 max-w-[1280px] mx-auto mb-8 md:mb-10">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              <Skeleton className="md:col-span-8 h-48 rounded-xl" />
              <Skeleton className="md:col-span-4 h-48 rounded-xl" />
              <Skeleton className="md:col-span-4 h-48 rounded-xl" />
              <Skeleton className="md:col-span-8 h-48 rounded-xl" />
            </div>
          ) : (
            <motion.div
              className="grid grid-cols-1 md:grid-cols-12 gap-4 items-stretch"
              variants={staggerContainer}
              initial="hidden"
              animate="show"
            >
              {/* Card 1: Large Highlight (8 Cols) */}
              <motion.div
                variants={fadeUp}
                className="md:col-span-8 bg-white rounded-xl p-5 md:p-6 shadow-[0_4px_20px_rgba(0,53,39,0.04)] border border-gray-200/80 transition-transform duration-300 hover:-translate-y-1 hover:shadow-[0_8px_25px_rgba(0,53,39,0.07)] relative overflow-hidden flex flex-col justify-between"
              >
                <div className="absolute top-0 right-0 w-20 h-20 bg-[#003527]/5 rounded-bl-full pointer-events-none" />
                <div>
                  <Quote className="w-6 h-6 text-[#cca72f] mb-3 opacity-40" />
                  <p className="font-serif font-semibold text-xs sm:text-sm md:text-base text-[#003527] mb-4 relative z-10 leading-relaxed">
                    "{displayList[0]?.quote || defaultStories[0].quote}"
                  </p>
                </div>
                <div className="relative z-10 pt-2.5 border-t border-gray-100">
                  <div className="font-sans font-bold text-xs text-[#191c1e] flex items-center gap-1.5">
                    <span>{displayList[0]?.studentName || defaultStories[0].studentName}</span>
                    <span className="inline-flex items-center gap-1 text-[10px] font-normal text-[#007165] bg-[#007165]/10 px-1.5 py-0.5 rounded-md">
                      <MapPin className="w-2.5 h-2.5" />
                      {(displayList[0] as any)?.location || defaultStories[0].location}
                    </span>
                  </div>
                  <div className="font-sans text-[10px] md:text-[11px] text-[#404944] mt-0.5">
                    {getCleanCourseName(displayList[0]?.course || defaultStories[0].course)}
                  </div>
                </div>
              </motion.div>

              {/* Card 2: Small Light Card (4 Cols) */}
              <motion.div
                variants={fadeUp}
                className="md:col-span-4 bg-white rounded-xl p-5 shadow-[0_4px_20px_rgba(0,53,39,0.04)] border border-gray-200/80 transition-transform duration-300 hover:-translate-y-1 hover:shadow-[0_8px_25px_rgba(0,53,39,0.07)] flex flex-col justify-between"
              >
                <div>
                  <Quote className="w-5 h-5 text-[#003527] mb-2.5 opacity-40" />
                  <p className="font-sans text-xs text-[#191c1e] mb-3 leading-relaxed">
                    "{displayList[1]?.quote || defaultStories[1].quote}"
                  </p>
                </div>
                <div className="pt-2.5 border-t border-gray-100">
                  <div className="font-sans font-bold text-xs text-[#191c1e] flex items-center gap-1.5 flex-wrap">
                    <span>{displayList[1]?.studentName || defaultStories[1].studentName}</span>
                    <span className="inline-flex items-center gap-1 text-[10px] font-normal text-[#007165] bg-[#007165]/10 px-1.5 py-0.5 rounded-md">
                      <MapPin className="w-2.5 h-2.5" />
                      {(displayList[1] as any)?.location || defaultStories[1].location}
                    </span>
                  </div>
                  <div className="font-sans text-[10px] md:text-[11px] text-[#404944] mt-0.5">
                    {getCleanCourseName(displayList[1]?.course || defaultStories[1].course)}
                  </div>
                </div>
              </motion.div>

              {/* Card 3: Small Dark Featured Card (4 Cols) */}
              <motion.div
                variants={fadeUp}
                className="md:col-span-4 bg-[#003527] text-white rounded-xl p-5 shadow-[0_4px_20px_rgba(0,53,39,0.08)] transition-transform duration-300 hover:-translate-y-1 flex flex-col justify-between relative overflow-hidden"
              >
                <div className="relative z-10">
                  <div className="flex gap-1 text-[#cca72f] mb-2.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-[#cca72f]" />
                    ))}
                  </div>
                  <p className="font-sans text-xs text-white mb-3 leading-relaxed">
                    "{displayList[2]?.quote || defaultStories[2].quote}"
                  </p>
                </div>
                <div className="relative z-10 pt-2.5 border-t border-white/10">
                  <div className="font-sans font-bold text-xs text-white flex items-center gap-1.5 flex-wrap">
                    <span>{displayList[2]?.studentName || defaultStories[2].studentName}</span>
                    <span className="inline-flex items-center gap-1 text-[10px] font-normal text-[#62fae3] bg-[#62fae3]/15 px-1.5 py-0.5 rounded-md">
                      <MapPin className="w-2.5 h-2.5" />
                      {(displayList[2] as any)?.location || defaultStories[2].location}
                    </span>
                  </div>
                  <div className="font-sans text-[10px] md:text-[11px] text-[#80bea6] mt-0.5">
                    {getCleanCourseName(displayList[2]?.course || defaultStories[2].course)}
                  </div>
                </div>
              </motion.div>

              {/* Card 4: Medium Card (8 Cols) */}
              <motion.div
                variants={fadeUp}
                className="md:col-span-8 bg-white rounded-xl p-5 md:p-6 shadow-[0_4px_20px_rgba(0,53,39,0.04)] border border-gray-200/80 transition-transform duration-300 hover:-translate-y-1 hover:shadow-[0_8px_25px_rgba(0,53,39,0.07)] flex flex-col justify-between"
              >
                <div className="space-y-2.5 text-left">
                  <Quote className="w-6 h-6 text-[#cca72f] opacity-40" />
                  <p className="font-serif font-semibold text-xs sm:text-sm md:text-base text-[#003527] leading-relaxed">
                    "{displayList[3]?.quote || defaultStories[3].quote}"
                  </p>
                </div>
                <div className="pt-2.5 border-t border-gray-100 mt-3">
                  <div className="font-sans font-bold text-xs text-[#191c1e] flex items-center gap-1.5">
                    <span>{displayList[3]?.studentName || defaultStories[3].studentName}</span>
                    <span className="inline-flex items-center gap-1 text-[10px] font-normal text-[#007165] bg-[#007165]/10 px-1.5 py-0.5 rounded-md">
                      <MapPin className="w-2.5 h-2.5" />
                      {(displayList[3] as any)?.location || defaultStories[3].location}
                    </span>
                  </div>
                  <div className="font-sans text-[10px] md:text-[11px] text-[#404944] mt-0.5">
                    {getCleanCourseName(displayList[3]?.course || defaultStories[3].course)}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </section>

        {/* CTA Section */}
        <section className="px-4 md:px-12 max-w-[1280px] mx-auto text-center mt-6 md:mt-8">
          <div className="bg-[#f2f4f6] rounded-2xl p-5 md:p-7 border border-gray-200 flex flex-col items-center max-w-3xl mx-auto shadow-xs">
            <Sparkles className="w-6 h-6 text-[#003527] mb-2" />
            <h2 className="font-serif font-bold text-lg md:text-xl text-[#003527] mb-1">
              Your story could be next.
            </h2>
            <p className="font-sans text-xs text-[#404944] mb-4 max-w-md leading-relaxed">
              Book a free trial and experience the difference for yourself.
            </p>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#003527] text-white font-sans font-bold text-xs px-5 py-3 rounded-xl hover:-translate-y-0.5 transition-all shadow-md cursor-pointer"
            >
              <span>Book Your Free Trial</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </a>
          </div>
        </section>
      </main>
    </div>
  );
}
