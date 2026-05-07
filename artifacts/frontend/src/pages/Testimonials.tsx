import { useListTestimonials } from "@workspace/api-client-react";
import { Star, Quote } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import CTAGroup from "@/components/CTAGroup";
import { getFlag, getInitials, getAvatarColor } from "@/lib/country";
import { useTranslation } from "react-i18next";

export default function Testimonials() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const { data: testimonials = [], isLoading } = useListTestimonials();

  return (
    <div className="min-h-screen bg-background pt-24 pb-24">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Hero */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-5">
          <span className="inline-block text-xs font-bold tracking-widest text-primary uppercase">
            {t("home.testimonials.label", "Real stories")}
          </span>
          <h1 className="font-serif font-bold text-4xl md:text-5xl text-foreground">
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
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} className="h-72 w-full rounded-2xl" />
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((t) => {
              const palette = getAvatarColor(t.studentName);
              const flag = getFlag(t.location);
              const localizedQuote = lang === "ur" ? (t as any).quote_ur || t.quote : lang === "ar" ? (t as any).quote_ar || t.quote : t.quote;
              const sentences = localizedQuote.split(/[.!?]/).filter(Boolean);
              const highlight = sentences[0]?.trim() || localizedQuote;
              const rest = sentences
                .slice(1)
                .map((s: string) => s.trim())
                .filter(Boolean)
                .join(". ");

              return (
                <div
                  key={t.id}
                  className="bg-card p-6 rounded-2xl border border-border hover:border-primary/30 hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col h-full relative"
                >
                  <Quote className="absolute top-5 right-5 w-8 h-8 text-primary/10" />

                  <div className="flex gap-1 mb-4 text-accent">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>

                  {/* Highlighted opener */}
                  <p className="font-serif text-xl text-foreground leading-snug mb-3">
                    "{highlight}."
                  </p>

                  {/* Body */}
                  {rest && (
                    <p className="text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-3">
                      {rest}.
                    </p>
                  )}

                  {/* Bottom Text Highlight */}
                  {((lang === 'ur' ? (t as any).bottomText_ur : lang === 'ar' ? (t as any).bottomText_ar : (t as any).bottomText) || '').trim() && (
                    <div className="bg-primary/5 p-3 rounded-lg border border-primary/10 mb-6">
                      <p className="text-xs font-bold text-primary italic leading-snug">
                        "{lang === 'ur' ? (t as any).bottomText_ur : lang === 'ar' ? (t as any).bottomText_ar : (t as any).bottomText}"
                      </p>
                    </div>
                  )}

                  {/* Author */}
                  <div className="mt-auto flex items-center gap-3 pt-4 border-t border-border">
                    <div
                      className={`w-12 h-12 rounded-full ${palette.bg} ${palette.text} flex items-center justify-center font-bold shrink-0`}
                    >
                      {getInitials(t.studentName)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-bold text-foreground truncate">{t.studentName}</div>
                      <div className="text-xs text-muted-foreground truncate">
                        <span className="mr-1">{flag}</span>
                        {t.location}
                        {t.course && (
                          <>
                            <span className="mx-1.5 text-foreground/30">•</span>
                            <span className="text-primary font-medium">{t.course}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Closing CTA */}
        <div className="mt-20 bg-primary text-primary-foreground rounded-3xl p-10 md:p-14 text-center max-w-4xl mx-auto">
          <h2 className="font-serif font-bold text-3xl md:text-4xl text-white mb-3">
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
