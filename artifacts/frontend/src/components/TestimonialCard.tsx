import { Star, Quote } from "lucide-react";
import { getFlag, getInitials, getAvatarColor } from "@/lib/country";
import { useTranslation } from "react-i18next";

export type TestimonialProps = {
  testimonial: {
    id: number;
    studentName: string;
    location?: string;
    course?: string;
    rating: number;
    quote: string;
    featured?: boolean;
    quote_ur?: string;
    quote_ar?: string;
    bottomText?: string;
    bottomText_ur?: string;
    bottomText_ar?: string;
  };
};

export default function TestimonialCard({ testimonial: t }: TestimonialProps) {
  const { i18n } = useTranslation();
  const lang = i18n.language;
  
  const palette = getAvatarColor(t.studentName);
  const flag = getFlag(t.location || "");
  
  const localizedQuote = lang === "ur" ? t.quote_ur || t.quote : lang === "ar" ? t.quote_ar || t.quote : t.quote;
  const localizedBottom = lang === "ur" ? t.bottomText_ur : lang === "ar" ? t.bottomText_ar : t.bottomText;

  return (
    <div
      className="bg-card p-5 sm:p-6 rounded-2xl border border-border hover:border-primary/30 hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col h-full relative"
    >
      <Quote className="absolute top-5 right-5 w-8 h-8 text-primary/10" />

      <div className="flex gap-1 mb-4 text-accent">
        {[...Array(t.rating)].map((_, i) => (
          <Star key={i} className="w-4 h-4 fill-current" />
        ))}
      </div>

      {/* Main Quote */}
      <p className="font-serif text-base sm:text-lg text-foreground leading-relaxed mb-6">
        "{localizedQuote}"
      </p>

      {/* Bottom Text Highlight */}
      {(localizedBottom || '').trim() && (
        <div className="bg-primary/5 p-3 rounded-lg border border-primary/10 mb-6">
          <p className="text-[10px] font-bold text-primary italic leading-snug">
            "{localizedBottom}"
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
}
