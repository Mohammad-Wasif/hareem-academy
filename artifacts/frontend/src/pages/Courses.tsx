import { useState } from "react";
import { useListCourses } from "@workspace/api-client-react";
import CourseCard from "@/components/CourseCard";
import CTAGroup from "@/components/CTAGroup";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Sparkles, ShieldCheck, Award } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function Courses() {
  const { t } = useTranslation();
  const { data: courses = [], isLoading } = useListCourses();
  const [filter, setFilter] = useState<"all" | "arabic" | "urdu">("all");

  const filteredCourses = courses.filter(
    (course) => filter === "all" || course.language === filter,
  );

  return (
    <div className="min-h-screen bg-background pt-24 pb-24">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Hero with CTA */}
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-5">
          <span className="inline-block text-xs font-bold tracking-widest text-primary uppercase">
            {t("courses_page.hero.label", "Live online classes")}
          </span>
          <h1 className="font-serif font-bold text-4xl md:text-5xl text-foreground">
            {t("courses_page.hero.title", "Find the right course for you.")}
          </h1>
          <p className="text-lg text-muted-foreground">
            {t("courses_page.hero.subtitle", "From absolute beginner to fluent reader. All classes are live, sisters-only, and start with a free trial.")}
          </p>

          {/* Trust strip */}
          <div className="flex flex-wrap justify-center gap-4 pt-2 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-primary" />
              {t("home.trust.teachers", "Female teachers only")}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-primary" />
              {t("home.trust.trial", "Free trial class")}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Award className="w-4 h-4 text-primary" />
              {t("courses.guarantee", "Money-back guarantee")}
            </span>
          </div>

          <div className="flex justify-center gap-2 pt-4 flex-wrap">
            <Button
              variant={filter === "all" ? "default" : "outline"}
              onClick={() => setFilter("all")}
              className="rounded-full"
            >
              {t("courses_page.filter.all", "All Courses")}
            </Button>
            <Button
              variant={filter === "arabic" ? "default" : "outline"}
              onClick={() => setFilter("arabic")}
              className="rounded-full"
            >
              {t("courses_page.filter.arabic", "Arabic")}
            </Button>
            <Button
              variant={filter === "urdu" ? "default" : "outline"}
              onClick={() => setFilter("urdu")}
              className="rounded-full"
            >
              {t("courses_page.filter.urdu", "Urdu")}
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
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        )}

        {!isLoading && filteredCourses.length === 0 && (
          <div className="text-center py-20 text-muted-foreground border border-dashed border-border rounded-2xl">
            {t("courses_page.no_results", "No courses found for this filter.")}
          </div>
        )}

        {/* Help band */}
        <div className="mt-16 bg-card border border-border rounded-3xl p-8 md:p-10 text-center max-w-3xl mx-auto">
          <h3 className="font-serif font-bold text-2xl md:text-3xl text-foreground mb-3">
            {t("courses_page.help.title", "Not sure which to pick?")}
          </h3>
          <p className="text-muted-foreground mb-6">
            {t("courses_page.help.subtitle", "Tell us your goal on WhatsApp and we'll recommend the right batch — usually within a few minutes.")}
          </p>
          <div className="flex justify-center">
            <CTAGroup variant="hero" align="center" trialMode />
          </div>
        </div>
      </div>
    </div>
  );
}
