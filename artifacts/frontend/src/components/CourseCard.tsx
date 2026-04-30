import { Link } from "wouter";
import { Clock, GraduationCap, Video, Users, Flame, Sparkles } from "lucide-react";
import { Course } from "@workspace/api-client-react";

export default function CourseCard({ course }: { course: Course }) {
  const lowSeats =
    typeof course.seatsRemaining === "number" && course.seatsRemaining > 0 && course.seatsRemaining <= 8;
  const isBeginner = (course.level ?? "").toLowerCase().includes("beginner");

  return (
    <Link href={`/courses/${course.slug}`} className="block h-full">
      <div className="group bg-card rounded-2xl border border-border overflow-hidden hover:border-primary/40 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full cursor-pointer relative">
        {/* Top badges */}
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
          {course.featured && (
            <div className="bg-accent text-accent-foreground text-xs font-bold px-3 py-1 rounded-full shadow-md flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              Most Popular
            </div>
          )}
          {isBeginner && !course.featured && (
            <div className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full shadow-sm">
              Beginner Friendly
            </div>
          )}
        </div>
        {lowSeats && (
          <div className="absolute top-3 right-3 z-10 bg-rose-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md flex items-center gap-1 animate-pulse">
            <Flame className="w-3 h-3" />
            {course.seatsRemaining} seats left
          </div>
        )}

        {/* Image */}
        <div className="h-44 bg-primary/5 flex items-center justify-center overflow-hidden relative">
          {course.language === "arabic" ? (
            <img src="/course-arabic.png" alt="Arabic Course" className="w-full h-full object-cover" />
          ) : (
            <img src="/course-urdu.png" alt="Urdu Course" className="w-full h-full object-cover" />
          )}
        </div>

        {/* Content */}
        <div className="p-6 flex-grow flex flex-col">
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            <span className="px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-bold rounded uppercase tracking-wider">
              {course.language}
            </span>
            <span className="px-2 py-0.5 bg-secondary text-secondary-foreground text-[10px] font-bold rounded uppercase tracking-wider">
              {course.level}
            </span>
          </div>

          <h3 className="font-serif font-bold text-xl text-foreground mb-2 group-hover:text-primary transition-colors leading-snug">
            {course.title}
          </h3>
          <p className="text-muted-foreground text-sm line-clamp-2 mb-5">
            {course.summary}
          </p>

          {/* Key details — scannable */}
          <div className="grid grid-cols-2 gap-x-3 gap-y-2 text-xs mb-5 mt-auto">
            <div className="flex items-center gap-1.5 text-foreground/80">
              <Clock className="w-3.5 h-3.5 text-primary" />
              <span>{course.durationMonths} months</span>
            </div>
            <div className="flex items-center gap-1.5 text-foreground/80">
              <Video className="w-3.5 h-3.5 text-primary" />
              <span>Live on {course.platform}</span>
            </div>
            <div className="flex items-center gap-1.5 text-foreground/80">
              <GraduationCap className="w-3.5 h-3.5 text-primary" />
              <span>{course.timings}</span>
            </div>
            <div className="flex items-center gap-1.5 text-foreground/80">
              <Users className="w-3.5 h-3.5 text-primary" />
              <span>Sisters only</span>
            </div>
          </div>
        </div>

        {/* Footer with price + CTA */}
        <div className="px-6 pb-6 flex items-center justify-between gap-4 border-t border-border pt-4">
          <div>
            <div className="font-serif font-bold text-2xl text-primary leading-none">
              {course.currency} {course.feeMonthly}
              <span className="text-xs font-sans font-normal text-muted-foreground">/mo</span>
            </div>
            <div className="text-[10px] text-muted-foreground mt-1 uppercase tracking-wider">
              Free trial available
            </div>
          </div>
          <span className="text-primary font-bold text-sm group-hover:translate-x-1 transition-transform whitespace-nowrap">
            See Full Curriculum →
          </span>
        </div>
      </div>
    </Link>
  );
}
