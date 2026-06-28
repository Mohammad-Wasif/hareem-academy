import { useListTestimonials } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import CTAGroup from "@/components/CTAGroup";
import TestimonialCard from "@/components/TestimonialCard";
import { SEO } from "@/components/SEO";
import { motion, type Variants } from "framer-motion";

const staggerContainer: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.06,
    },
  },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
    },
  },
};

export default function Testimonials() {
  const { data: testimonials = [], isLoading } = useListTestimonials();

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

  return (
    <div className="min-h-screen bg-background pt-20 pb-12 lg:pt-24 lg:pb-24 w-full overflow-x-hidden">
      <SEO
        title="Student Testimonials"
        description="Read real stories and experiences from sisters around the world who have learned Arabic, Tajweed, and Urdu with Hareem Academy's qualified female teachers."
        schema={[breadcrumbSchema, ...reviewSchemas]}
      />
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Hero */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-5">
          <span className="inline-block text-xs font-bold tracking-widest text-primary uppercase">
            Real stories
          </span>
          <h1 className="font-serif font-bold text-3xl sm:text-4xl md:text-5xl text-foreground">
            Sisters from around the world
            <br /> who started where you are.
          </h1>
          <p className="text-lg text-muted-foreground">
            Alhamdulillah, hundreds of sisters have transformed their relationship with the Quran and Arabic through Hareem Academy.
          </p>
          <div className="flex justify-center pt-2">
            <CTAGroup variant="hero" align="center" trialMode />
          </div>
        </div>

        {/* Testimonials grid */}
        {isLoading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} className="h-72 w-full rounded-2xl" />
            ))}
          </div>
        ) : (
          <motion.div
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={staggerContainer}
            initial="hidden"
            animate="show"
          >
            {testimonials.map((t) => (
              <motion.div key={t.id} variants={fadeUp}>
                <TestimonialCard testimonial={t as any} />
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Closing CTA */}
        <div className="mt-12 lg:mt-20 bg-primary text-primary-foreground rounded-3xl px-5 py-8 sm:p-10 md:p-14 text-center max-w-4xl mx-auto">
          <h2 className="font-serif font-bold text-2xl sm:text-3xl md:text-4xl text-white mb-3">
            Your story could be next.
          </h2>
          <p className="text-primary-foreground/85 mb-7 max-w-xl mx-auto">
            Book a free trial and experience the difference for yourself.
          </p>
          <div className="flex justify-center">
            <CTAGroup variant="hero" align="center" theme="dark" trialMode />
          </div>
        </div>
      </div>
    </div>
  );
}
