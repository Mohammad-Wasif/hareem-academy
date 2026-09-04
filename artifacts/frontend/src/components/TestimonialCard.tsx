import { Star, Quote, MapPin } from "lucide-react";

export type TestimonialProps = {
  testimonial: {
    id: number | string;
    studentName: string;
    location?: string;
    course?: string;
    rating?: number;
    quote: string;
    featured?: boolean;
    quote_ur?: string;
    quote_ar?: string;
    bottomText?: string;
  };
  index?: number;
  isDark?: boolean;
};

function getCleanCourseName(course?: string) {
  if (!course) return course;
  const lower = course.toLowerCase();
  if (lower.includes("urdu")) return "Urdu Essentials";
  if (lower.includes("intermediate") || lower.includes("advanced") || lower.includes("level 2")) return "Intermediate Arabic";
  if (lower.includes("arabic") || lower.includes("quran") || lower.includes("foundations") || lower.includes("basic") || lower.includes("level 1")) return "Arabic Foundations";
  return course;
}

export default function TestimonialCard({
  testimonial: t,
  index = 0,
  isDark: forceDark,
}: TestimonialProps) {
  // If explicitly dark or 3rd card (index === 2), render dark card variant matching testimonials page
  const isDark = forceDark !== undefined ? forceDark : index === 2;
  const rating = t.rating || 5;
  const courseName = getCleanCourseName(t.course);

  if (isDark) {
    return (
      <div className="bg-[#003527] text-white rounded-2xl p-6 shadow-[0_4px_20px_rgba(0,53,39,0.08)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(0,53,39,0.15)] flex flex-col justify-between h-full relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex gap-1 text-[#cca72f] mb-3">
            {[...Array(rating)].map((_, i) => (
              <Star key={i} className="w-3.5 h-3.5 fill-[#cca72f] text-[#cca72f]" />
            ))}
          </div>
          <p className="font-serif font-medium text-sm sm:text-base text-white mb-4 leading-relaxed">
            "{t.quote}"
          </p>
        </div>
        <div className="relative z-10 pt-3 border-t border-white/10 mt-auto">
          <div className="font-sans font-bold text-xs text-white flex items-center gap-1.5 flex-wrap">
            <span>{t.studentName}</span>
            {t.location && (
              <span className="inline-flex items-center gap-1 text-[10px] font-normal text-[#62fae3] bg-[#62fae3]/15 px-1.5 py-0.5 rounded-md">
                <MapPin className="w-2.5 h-2.5" />
                {t.location}
              </span>
            )}
          </div>
          {courseName && (
            <div className="font-sans text-[10px] md:text-[11px] text-[#80bea6] mt-0.5">
              {courseName}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-[0_4px_20px_rgba(0,53,39,0.04)] border border-gray-200/80 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_25px_rgba(0,53,39,0.07)] relative overflow-hidden flex flex-col justify-between h-full">
      <div className="absolute top-0 right-0 w-20 h-20 bg-[#003527]/5 rounded-bl-full pointer-events-none" />
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-3">
          <Quote className="w-6 h-6 text-[#cca72f] opacity-40" />
          <div className="flex gap-1 text-[#cca72f]">
            {[...Array(rating)].map((_, i) => (
              <Star key={i} className="w-3.5 h-3.5 fill-[#cca72f] text-[#cca72f]" />
            ))}
          </div>
        </div>
        <p className="font-serif font-semibold text-sm sm:text-base text-[#003527] mb-4 leading-relaxed">
          "{t.quote}"
        </p>
      </div>
      <div className="relative z-10 pt-3 border-t border-gray-100 mt-auto">
        <div className="font-sans font-bold text-xs text-[#191c1e] flex items-center gap-1.5 flex-wrap">
          <span>{t.studentName}</span>
          {t.location && (
            <span className="inline-flex items-center gap-1 text-[10px] font-normal text-[#007165] bg-[#007165]/10 px-1.5 py-0.5 rounded-md">
              <MapPin className="w-2.5 h-2.5" />
              {t.location}
            </span>
          )}
        </div>
        {courseName && (
          <div className="font-sans text-[10px] md:text-[11px] text-[#404944] mt-0.5">
            {courseName}
          </div>
        )}
      </div>
    </div>
  );
}
