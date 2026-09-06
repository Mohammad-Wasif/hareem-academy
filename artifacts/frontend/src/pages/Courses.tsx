import { useState } from "react";
import { useListCourses } from "@workspace/api-client-react";
import { SEO } from "@/components/SEO";
import { Link } from "wouter";
import {
  GraduationCap,
  Clock,
  ArrowRight,
  CreditCard,
  Sparkles,
  BookOpen,
  CalendarCheck,
  Video,
  TrendingUp,
  MessageCircle,
} from "lucide-react";
import EnrollmentModal from "@/components/EnrollmentModal";
import { useWhatsApp } from "@/hooks/use-whatsapp";
import { FaWhatsapp } from "react-icons/fa";
import PremiumImage from "@/components/PremiumImage";

import CourseCard from "@/components/CourseCard";

export default function Courses() {
  const { data: courses = [], isLoading } = useListCourses();
  const [filter, setFilter] = useState<"all" | "arabic" | "urdu">("all");
  const { whatsappUrl } = useWhatsApp();

  const filteredCourses = courses.filter(
    (course) => filter === "all" || course.language?.toLowerCase() === filter,
  );

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://hareemacademy.com",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Courses",
        item: "https://hareemacademy.com/courses",
      },
    ],
  };

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    numberOfItems: courses.length,
    itemListElement: courses.map((course, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      url: `https://hareemacademy.com/courses/${course.slug}`,
      name: course.title,
    })),
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] text-[#191c1d] flex flex-col pt-6 md:pt-10 pb-8 md:pb-12 font-sans">
      <SEO
        title="Our Arabic & Urdu Programs"
        description="Explore live, sisters-only Arabic and Urdu courses at Hareem Academy. Certified female teachers, small interactive online groups, and free trials."
        keywords={[
          "arabic courses for women",
          "urdu language classes online",
          "quran reading course for sisters",
          "sisters only islamic academy",
          "live online language classes",
          "beginner arabic course online",
          "hareem academy courses"
        ]}
        schema={[breadcrumbSchema, itemListSchema]}
      />

      <main className="flex-grow w-full max-w-[1280px] mx-auto px-4 md:px-12 space-y-10 md:space-y-14">
        {/* Hero Section */}
        <section className="text-center max-w-2xl mx-auto space-y-3 pt-2">
          <span className="inline-block text-[11px] font-bold tracking-widest uppercase text-[#00450d] bg-[#00450d]/5 px-3 py-0.5 rounded-full border border-[#00450d]/10 font-sans">
            Hareem Academy
          </span>
          <h1 className="font-serif font-bold text-2xl sm:text-3xl md:text-4xl text-[#00450d] leading-tight">
            Find the right course for you.
          </h1>
          <p className="font-sans text-xs md:text-sm text-[#41493e] leading-relaxed">
            From absolute beginner to fluent reader. All classes are live, sisters-only, and start with a free trial.
          </p>
        </section>

        {/* Course Filter / Categories Section */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-gray-200 pb-4">
            <div>
              <h2 className="font-serif font-bold text-xl md:text-2xl text-[#00450d]">
                Our Courses
              </h2>
              <p className="text-xs text-[#525e54] font-sans mt-0.5">
                Live interactive classes designed exclusively for sisters
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-1.5 bg-white p-1 rounded-xl shadow-xs border border-gray-200/80 max-w-full">
              <button
                onClick={() => setFilter("all")}
                className={`px-3.5 py-1.5 rounded-lg font-sans text-xs font-semibold transition-all cursor-pointer ${
                  filter === "all"
                    ? "bg-[#fed65b] text-[#745c00] shadow-xs"
                    : "text-[#41493e] hover:bg-gray-100"
                }`}
              >
                All Courses
              </button>
              <button
                onClick={() => setFilter("urdu")}
                className={`px-3.5 py-1.5 rounded-lg font-sans text-xs font-semibold transition-all cursor-pointer ${
                  filter === "urdu"
                    ? "bg-[#fed65b] text-[#745c00] shadow-xs"
                    : "text-[#41493e] hover:bg-gray-100"
                }`}
              >
                Urdu Studies
              </button>
              <button
                onClick={() => setFilter("arabic")}
                className={`px-3.5 py-1.5 rounded-lg font-sans text-xs font-semibold transition-all cursor-pointer ${
                  filter === "arabic"
                    ? "bg-[#fed65b] text-[#745c00] shadow-xs"
                    : "text-[#41493e] hover:bg-gray-100"
                }`}
              >
                Arabic Studies
              </button>
            </div>
          </div>

          {/* Bento Grid Layout for Courses */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
              {[1, 2, 3].map((n) => (
                <div
                  key={n}
                  className="bg-white rounded-2xl overflow-hidden border border-gray-200/80 shadow-[0_4px_20px_rgba(0,53,39,0.04)] animate-pulse flex flex-col justify-between h-[420px]"
                >
                  <div>
                    <div className="h-44 bg-gray-100" />
                    <div className="p-5 space-y-3">
                      <div className="h-3 w-24 bg-gray-200 rounded" />
                      <div className="h-5 w-44 bg-gray-200 rounded" />
                      <div className="h-3 w-full bg-gray-100 rounded" />
                      <div className="h-3 w-3/4 bg-gray-100 rounded" />
                      <div className="grid grid-cols-2 gap-2 pt-2.5 border-t border-gray-100">
                        <div className="h-12 bg-gray-100 rounded-xl" />
                        <div className="h-12 bg-gray-100 rounded-xl" />
                      </div>
                    </div>
                  </div>
                  <div className="p-5 pt-0">
                    <div className="pt-3 border-t border-gray-100 flex justify-end">
                      <div className="h-4 w-20 bg-gray-200 rounded" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredCourses.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-gray-300 text-muted-foreground font-sans text-xs">
              No courses found for this subject filter.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
              {filteredCourses.map((course: any) => (
                <CourseCard key={course.id || course.slug} course={course} />
              ))}
            </div>
          )}
        </section>

        {/* How Learning Works / A Simple Path to Progress */}
        <section className="bg-[#f3f4f5] rounded-3xl p-6 sm:p-8 md:p-10 shadow-[0_4px_20px_rgba(0,53,39,0.03)] border border-gray-200/60 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#91d78a] opacity-15 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none" />

          <div className="text-center max-w-xl mx-auto mb-6 sm:mb-8 relative z-10 space-y-2">
            <span className="inline-block text-[11px] font-bold tracking-widest uppercase text-[#00450d] bg-[#00450d]/5 px-3 py-0.5 rounded-full border border-[#00450d]/10 font-sans">
              How Learning Works
            </span>
            <h2 className="font-serif font-bold text-xl md:text-2xl text-[#00450d]">
              A Simple Path to Progress
            </h2>
            <p className="font-sans text-xs md:text-sm text-[#41493e] leading-relaxed">
              From your first trial class to consistent learning, our process is
              designed to make getting started simple and comfortable.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 relative z-10">
            {/* Step 1 */}
            <div className="flex flex-col items-center text-center space-y-2 bg-white p-4 sm:p-5 rounded-2xl border border-gray-200/70 shadow-xs hover:-translate-y-0.5 hover:shadow-sm transition-all">
              <div className="w-10 h-10 rounded-full bg-[#00450d]/5 flex items-center justify-center border border-[#00450d]/10 text-[#00450d] shrink-0">
                <BookOpen className="w-4 h-4" />
              </div>
              <h4 className="font-serif font-bold text-sm sm:text-base text-[#00450d]">
                1. Choose Your Course
              </h4>
              <p className="font-sans text-xs text-[#525e54] leading-relaxed">
                Explore our courses and select the program that matches your current level and learning goals.
              </p>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col items-center text-center space-y-2 bg-white p-4 sm:p-5 rounded-2xl border border-gray-200/70 shadow-xs hover:-translate-y-0.5 hover:shadow-sm transition-all">
              <div className="w-10 h-10 rounded-full bg-[#00450d]/5 flex items-center justify-center border border-[#00450d]/10 text-[#00450d] shrink-0">
                <CalendarCheck className="w-4 h-4" />
              </div>
              <h4 className="font-serif font-bold text-sm sm:text-base text-[#00450d]">
                2. Book Your Free Trial
              </h4>
              <p className="font-sans text-xs text-[#525e54] leading-relaxed">
                Experience a live class, meet your teacher, and get a feel for the learning environment before enrolling.
              </p>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col items-center text-center space-y-2 bg-white p-4 sm:p-5 rounded-2xl border border-gray-200/70 shadow-xs hover:-translate-y-0.5 hover:shadow-sm transition-all">
              <div className="w-10 h-10 rounded-full bg-[#00450d]/5 flex items-center justify-center border border-[#00450d]/10 text-[#00450d] shrink-0">
                <Video className="w-4 h-4" />
              </div>
              <h4 className="font-serif font-bold text-sm sm:text-base text-[#00450d]">
                3. Start Learning
              </h4>
              <p className="font-sans text-xs text-[#525e54] leading-relaxed">
                Join your scheduled live classes and learn through structured lessons, practice, questions, and teacher guidance.
              </p>
            </div>

            {/* Step 4 */}
            <div className="flex flex-col items-center text-center space-y-2 bg-white p-4 sm:p-5 rounded-2xl border border-gray-200/70 shadow-xs hover:-translate-y-0.5 hover:shadow-sm transition-all">
              <div className="w-10 h-10 rounded-full bg-[#00450d]/5 flex items-center justify-center border border-[#00450d]/10 text-[#00450d] shrink-0">
                <TrendingUp className="w-4 h-4" />
              </div>
              <h4 className="font-serif font-bold text-sm sm:text-base text-[#00450d]">
                4. Progress With Confidence
              </h4>
              <p className="font-sans text-xs text-[#525e54] leading-relaxed">
                Stay consistent, practice regularly, and build your skills throughout the course with continued guidance from your teacher.
              </p>
            </div>
          </div>
        </section>

        {/* Closing Guidance Card (Neat connection to footer) */}
        <section className="text-center pt-2">
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-200/80 flex flex-col items-center max-w-2xl mx-auto shadow-[0_4px_20px_rgba(0,53,39,0.03)] space-y-3">
            <span className="inline-block text-[11px] font-bold tracking-widest uppercase text-[#00450d] bg-[#00450d]/5 px-3 py-0.5 rounded-full border border-[#00450d]/10 font-sans">
              Need Guidance?
            </span>
            <h3 className="font-serif font-bold text-lg md:text-xl text-[#00450d]">
              Not sure which course is right for you?
            </h3>
            <p className="font-sans text-xs text-[#41493e] leading-relaxed max-w-lg">
              Book a free trial class to meet a qualified female teacher, or chat with our friendly team on WhatsApp to find the ideal batch.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <EnrollmentModal mode="trial">
                <button className="bg-[#00450d] text-white px-5 py-2.5 rounded-full font-sans text-xs font-bold shadow-xs hover:bg-[#003527] transition-all cursor-pointer">
                  Book Your Free Trial
                </button>
              </EnrollmentModal>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#25D366]/10 text-[#128C7E] hover:bg-[#25D366]/20 px-4 py-2.5 rounded-full font-sans text-xs font-bold transition-all border border-[#25D366]/20"
              >
                <FaWhatsapp className="w-4 h-4 text-[#25D366]" />
                Chat on WhatsApp
              </a>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
