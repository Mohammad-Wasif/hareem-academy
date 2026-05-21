import { useListTestimonials } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import CTAGroup from "@/components/CTAGroup";
import TestimonialCard from "@/components/TestimonialCard";
import { useTranslation } from "react-i18next";

export default function Testimonials() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const { data: testimonials = [], isLoading } = useListTestimonials();

  return (
    <div className="min-h-screen bg-background pt-20 pb-12 lg:pt-24 lg:pb-24 w-full overflow-x-hidden">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Hero */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-5">
          <span className="inline-block text-xs font-bold tracking-widest text-primary uppercase">
            {t("home.testimonials.label", "Real stories")}
          </span>
          <h1 className="font-serif font-bold text-3xl sm:text-4xl md:text-5xl text-foreground">
            {t("testimonials_page.hero.title_part1", "Sisters from around the world")}
            <br /> {t("testimonials_page.hero.title_part2", "who started where you are.")}
          </h1>
          <p className="text-lg text-muted-foreground">
            {t("testimonials_page.hero.subtitle", "Alhamdulillah, hundreds of sisters have transformed their relationship with the Quran and Arabic through Hareem Academy.")}
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
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <TestimonialCard key={t.id} testimonial={t as any} />
            ))}
          </div>
        )}

        {/* Closing CTA */}
        <div className="mt-12 lg:mt-20 bg-primary text-primary-foreground rounded-3xl px-5 py-8 sm:p-10 md:p-14 text-center max-w-4xl mx-auto">
          <h2 className="font-serif font-bold text-2xl sm:text-3xl md:text-4xl text-white mb-3">
            {t("testimonials_page.closing.title", "Your story could be next.")}
          </h2>
          <p className="text-primary-foreground/85 mb-7 max-w-xl mx-auto">
            {t("testimonials_page.closing.subtitle", "Book a free trial and experience the difference for yourself.")}
          </p>
          <div className="flex justify-center">
            <CTAGroup variant="hero" align="center" theme="dark" trialMode />
          </div>
        </div>
      </div>
    </div>
  );
}
