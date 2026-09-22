import { Link } from "wouter";
import { Clock, GraduationCap, ArrowRight, CreditCard } from "lucide-react";
import { Course } from "@workspace/api-client-react";
import PremiumImage from "@/components/PremiumImage";

export default function CourseCard({ course }: { course: Course }) {
  const isUrduCourse =
    course.language?.toLowerCase() === "urdu" ||
    course.slug?.toLowerCase().includes("urdu");

  const isIntermediateCourse =
    course.slug?.toLowerCase().includes("intermediate") ||
    course.level?.toLowerCase().includes("intermediate");

  const courseAssetKey = isUrduCourse
    ? "course_urdu"
    : isIntermediateCourse
      ? "course_arabic_intermediate"
      : "course_arabic";

  const courseFallback = isUrduCourse ? "/course-urdu.webp" : "/course-arabic.webp";

  const currencySymbol = course.currency === "INR" ? "₹" : "$";
  const formattedFee = course.feeMonthly
    ? `${currencySymbol}${course.feeMonthly.toLocaleString()} / month`
    : "Contact for fee";

  return (
    <Link href={`/courses/${course.slug}`} className="block h-full cursor-pointer group">
      <div className="bg-[#003527] text-white rounded-t-[44px] rounded-b-2xl overflow-hidden shadow-[0_4px_20px_rgba(0,53,39,0.12)] hover:shadow-[0_12px_35px_rgba(0,53,39,0.25)] border border-[#003527] hover:border-white/20 group-hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between h-full">
        <div>
          {/* Image Header */}
          <div className="h-44 relative overflow-hidden bg-[#00281d]">
            <div className="w-full h-full relative group-hover:scale-105 transition-transform duration-700 overflow-hidden">
              <PremiumImage
                assetKey={courseAssetKey}
                fallback={courseFallback}
                alt={course.title}
                className="w-full h-full object-cover"
                widthClass="w-full"
                heightClass="h-full"
                width={480}
              />
            </div>
            <div className="absolute top-3.5 right-4 bg-[#001f16]/90 backdrop-blur-xs text-[#86d881] border border-white/10 px-2.5 py-0.5 rounded-full font-sans text-[10px] font-bold shadow-xs uppercase tracking-wider z-10">
              {course.language || "Language"}
            </div>
          </div>

          {/* Content Details */}
          <div className="p-5 space-y-3">
            <div className="flex items-center space-x-1.5 text-[#ffe088] font-sans text-[11px] font-bold tracking-wide uppercase">
              <GraduationCap className="w-3.5 h-3.5 text-[#ffe088]" />
              <span>{course.level}</span>
            </div>
            <h3 className="font-serif font-bold text-lg md:text-xl text-white leading-snug group-hover:text-[#ffe088] transition-colors">
              {course.title}
            </h3>
            <p className="text-white/80 font-sans text-xs leading-relaxed line-clamp-3">
              {course.summary}
            </p>

            {/* Prominent Course Meta: Duration & Fee */}
            <div className="grid grid-cols-2 gap-2 pt-2.5 border-t border-white/10 font-sans">
              <div className="bg-white/10 p-2 rounded-xl border border-white/10 flex flex-col justify-center">
                <div className="text-[10px] font-medium text-white/70 flex items-center gap-1 mb-0.5">
                  <Clock className="w-3 h-3 text-[#ffe088]" />
                  <span>Duration</span>
                </div>
                <div className="text-xs sm:text-sm font-bold text-white">
                  {course.durationMonths} Months
                </div>
              </div>

              <div className="bg-[#ffe088]/15 p-2 rounded-xl border border-[#ffe088]/20 flex flex-col justify-center">
                <div className="text-[10px] font-medium text-[#ffe088] flex items-center gap-1 mb-0.5">
                  <CreditCard className="w-3 h-3 text-[#ffe088]" />
                  <span>Monthly Fee</span>
                </div>
                <div className="text-[11px] min-[360px]:text-xs sm:text-sm font-bold text-[#ffe088] truncate">
                  {formattedFee}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Action */}
        <div className="p-5 pt-0">
          <div className="pt-3 flex items-center justify-end border-t border-white/10">
            <span className="text-[#ffe088] group-hover:text-white font-sans text-xs font-bold flex items-center transition-colors">
              Enroll Now{" "}
              <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
