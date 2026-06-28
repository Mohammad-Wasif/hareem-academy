import { useState, useEffect } from "react";
import { useListCourses } from "@workspace/api-client-react";
import CourseCard from "@/components/CourseCard";
import CTAGroup from "@/components/CTAGroup";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Sparkles, ShieldCheck, Award } from "lucide-react";
import { SEO } from "@/components/SEO";
import { motion, type Variants } from "framer-motion";
import { adminApi } from "@/lib/adminApi";

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
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
    },
  },
};

export default function Courses() {
  const { data: courses = [], isLoading } = useListCourses();
  const [filter, setFilter] = useState<"all" | "arabic" | "urdu">("all");
  const [pageData, setPageData] = useState<any>(null);

  useEffect(() => {
    adminApi.getLandingPage("courses")
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
        console.warn("Could not load courses overrides:", err);
      });
  }, []);

  const filteredCourses = courses.filter(
    (course) => filter === "all" || course.language?.toLowerCase() === filter,
  );

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
        "name": "Courses",
        "item": "https://hareemacademy.com/courses"
      }
    ]
  };

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "numberOfItems": courses.length,
    "itemListElement": courses.map((course, idx) => ({
      "@type": "ListItem",
      "position": idx + 1,
      "url": `https://hareemacademy.com/courses/${course.slug}`,
      "name": course.title
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
        title={pageData?.title || "Arabic & Urdu Courses"}
        description={pageData?.metaDescription || "Explore live, sisters-only Arabic and Urdu batches at Hareem Academy. Certified female teachers, small interactive online groups, and free trials."}
        schema={[breadcrumbSchema, itemListSchema]}
      />
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Hero with CTA */}
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-5">
          <span 
            className="inline-block text-xs font-bold tracking-widest uppercase"
            style={{ color: primaryColor }}
          >
            {pageData?.geoContext || "Live online classes"}
          </span>
          <h1 
            className="font-serif font-bold text-4xl md:text-5xl"
            style={{ color: primaryColor }}
          >
            {pageData?.heroTitle || "Find the right course for you."}
          </h1>
          <p className="text-lg text-muted-foreground">
            {pageData?.heroSubtitle || "From absolute beginner to fluent reader. All classes are live, sisters-only, and start with a free trial."}
          </p>

          {/* Trust strip */}
          <div className="flex flex-wrap justify-center gap-4 pt-2 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-primary" />
              Female teachers only
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-primary" />
              Free trial class
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Award className="w-4 h-4 text-primary" />
              Money-back guarantee
            </span>
          </div>

          <div className="flex justify-center gap-2 pt-4 flex-wrap">
            <Button
              variant={filter === "all" ? "default" : "outline"}
              onClick={() => setFilter("all")}
              className="rounded-full"
            >
              All Courses
            </Button>
            <Button
              variant={filter === "arabic" ? "default" : "outline"}
              onClick={() => setFilter("arabic")}
              className="rounded-full"
            >
              Arabic
            </Button>
            <Button
              variant={filter === "urdu" ? "default" : "outline"}
              onClick={() => setFilter("urdu")}
              className="rounded-full"
            >
              Urdu
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="h-44 w-full rounded-2xl" />
                <Skeleton className="h-8 w-2/3" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-4/5" />
              </div>
            ))}
          </div>
        ) : (
          <motion.div
            key={filter}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={staggerContainer}
            initial="hidden"
            animate="show"
          >
            {filteredCourses.map((course) => (
              <motion.div key={course.id} variants={fadeUp}>
                <CourseCard course={course} />
              </motion.div>
            ))}
          </motion.div>
        )}

        {!isLoading && filteredCourses.length === 0 && (
          <div className="text-center py-20 text-muted-foreground border border-dashed border-border rounded-2xl">
            No courses found for this filter.
          </div>
        )}

        {/* Help band */}
        <div className="mt-16 bg-card border border-border rounded-3xl p-8 md:p-10 text-center max-w-3xl mx-auto">
          <h3 
            className="font-serif font-bold text-2xl md:text-3xl mb-3"
            style={{ color: primaryColor }}
          >
            {pageData?.closingTitle || "Not sure which to pick?"}
          </h3>
          <p className="text-muted-foreground mb-6">
            {pageData?.closingSubtitle || "Tell us your goal on WhatsApp and we'll recommend the right batch — usually within a few minutes."}
          </p>
          <div className="flex justify-center">
            <CTAGroup variant="hero" align="center" trialMode primaryLabel={pageData?.primaryCTA} />
          </div>
        </div>
      </div>
    </div>
  );
}
