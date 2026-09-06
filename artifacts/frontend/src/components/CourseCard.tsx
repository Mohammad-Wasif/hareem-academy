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

  const courseFallback = isUrduCourse ? "/course-urdu.png" : "/course-arabic.png";

  const currencySymbol = course.currency === "INR" ? "₹" : "$";
  const formattedFee = course.feeMonthly
    ? `${currencySymbol}${course.feeMonthly.toLocaleString()} / month`
    : "Contact for fee";

  return (
    <Link href={`/courses/${course.slug}`} className="block h-full cursor-pointer group">
      <div className="bg-white rounded-2xl overflow-hidden shadow-[0_4px_20px_rgba(0,53,39,0.04)] hover:shadow-[0_10px_30px_rgba(0,53,39,0.08)] border border-gray-200/80 group-hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between h-full">
        <div>
          {/* Image Header with Arch Mask */}
          <div className="h-44 relative overflow-hidden bg-[#003527]/5">
            <div
              className="w-full h-full relative group-hover:scale-105 transition-transform duration-700 overflow-hidden"
              style={{
                clipPath: "ellipse(150% 100% at 50% 100%)",
              }}
            >
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
            <div className="absolute top-3 right-3 bg-[#003527]/90 backdrop-blur-xs text-[#86d881] px-2.5 py-0.5 rounded-full font-sans text-[10px] font-bold shadow-xs uppercase tracking-wider z-10">
              {course.language || "Language"}
            </div>
          </div>

          {/* Content Details */}
          <div className="p-5 space-y-3">
            <div className="flex items-center space-x-1.5 text-[#735c00] font-sans text-[11px] font-bold tracking-wide uppercase">
              <GraduationCap className="w-3.5 h-3.5" />
              <span>{course.level}</span>
            </div>
            <h3 className="font-serif font-bold text-lg md:text-xl text-[#00450d] leading-snug group-hover:text-[#003527] transition-colors">
              {course.title}
            </h3>
            <p className="text-[#41493e] font-sans text-xs leading-relaxed line-clamp-3">
              {course.summary}
            </p>

            {/* Prominent Course Meta: Duration & Fee */}
            <div className="grid grid-cols-2 gap-2 pt-2.5 border-t border-gray-100 font-sans">
              <div className="bg-[#f8f9fa] p-2 rounded-xl border border-gray-200/70 flex flex-col justify-center">
                <div className="text-[10px] font-medium text-gray-500 flex items-center gap-1 mb-0.5">
                  <Clock className="w-3 h-3 text-[#00450d]" />
                  <span>Duration</span>
                </div>
                <div className="text-xs sm:text-sm font-bold text-[#00450d]">
                  {course.durationMonths} Months
                </div>
              </div>

              <div className="bg-[#00450d]/5 p-2 rounded-xl border border-[#00450d]/10 flex flex-col justify-center">
                <div className="text-[10px] font-medium text-[#735c00] flex items-center gap-1 mb-0.5">
                  <CreditCard className="w-3 h-3 text-[#735c00]" />
                  <span>Monthly Fee</span>
                </div>
                <div className="text-xs sm:text-sm font-bold text-[#00450d]">
                  {formattedFee}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Action */}
        <div className="p-5 pt-0">
          <div className="pt-3 flex items-center justify-end border-t border-gray-100">
            <span className="text-[#735c00] group-hover:text-[#00450d] font-sans text-xs font-bold flex items-center transition-colors">
              Enroll Now{" "}
              <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
