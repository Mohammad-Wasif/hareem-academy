import { Link } from "wouter";
import { Clock, GraduationCap, Video } from "lucide-react";
import { Course } from "@workspace/api-client-react";

export default function CourseCard({ course }: { course: Course }) {
  return (
    <Link href={`/courses/${course.slug}`}>
      <div className="group bg-card rounded-2xl border border-border overflow-hidden hover:border-accent/50 hover:shadow-xl transition-all duration-300 flex flex-col h-full cursor-pointer relative block">
        {course.featured && (
          <div className="absolute top-4 right-4 z-10 bg-accent text-accent-foreground text-xs font-bold px-3 py-1 rounded-full shadow-sm">
            Featured
          </div>
        )}
        
        <div className="h-48 bg-primary/5 flex items-center justify-center p-6 border-b border-border overflow-hidden relative">
          <div className="absolute inset-0 opacity-[0.03] bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdib3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMwMDAwMDAiIGZpbGwtb3BhY2l0eT0iMSI+PHBhdGggZD0iTTM2IDM0djIwaDItMjB2LTJoMjhWMzR6TTI2IDM0VjE0aC0ydjIwaC0yOFYzNHoiLz48L2c+PC9nPjwvc3ZnPg==')]"></div>
          {course.language === "arabic" ? (
            <img src="/course-arabic.png" alt="Arabic Course" className="w-full h-full object-cover rounded-xl" />
          ) : (
            <img src="/course-urdu.png" alt="Urdu Course" className="w-full h-full object-cover rounded-xl" />
          )}
        </div>
        
        <div className="p-6 flex-grow flex flex-col">
          <div className="inline-block px-2 py-1 bg-primary/10 text-primary text-xs font-bold rounded mb-3 w-max uppercase tracking-wider">
            {course.language}
          </div>
          <h3 className="font-serif font-bold text-2xl text-foreground mb-2 group-hover:text-primary transition-colors">
            {course.title}
          </h3>
          <p className="text-muted-foreground text-sm line-clamp-2 mb-6">
            {course.summary}
          </p>
          
          <div className="mt-auto space-y-3">
            <div className="flex items-center gap-2 text-sm text-foreground/80">
              <Clock className="w-4 h-4 text-accent" />
              <span>{course.durationMonths} Months • {course.timings}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-foreground/80">
              <Video className="w-4 h-4 text-accent" />
              <span>Via {course.platform} (Live Classes)</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-foreground/80">
              <GraduationCap className="w-4 h-4 text-accent" />
              <span>{course.level} Level</span>
            </div>
          </div>
        </div>
        
        <div className="p-6 pt-0 mt-4 flex items-center justify-between">
          <div className="font-serif font-bold text-xl text-primary">
            {course.currency} {course.feeMonthly}<span className="text-sm font-sans font-normal text-muted-foreground">/mo</span>
          </div>
          <span className="text-primary font-medium text-sm group-hover:underline underline-offset-4">
            View Details →
          </span>
        </div>
      </div>
    </Link>
  );
}
