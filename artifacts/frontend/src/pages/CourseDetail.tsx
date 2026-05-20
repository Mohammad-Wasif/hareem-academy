import { SEO } from "@/components/SEO";
import { useParams } from "wouter";
import { useGetCourse, useListTestimonials } from "@workspace/api-client-react";
import { getGetCourseQueryKey } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import EnrollmentModal from "@/components/EnrollmentModal";
import CTAGroup, { WHATSAPP_URL } from "@/components/CTAGroup";
import NotFound from "./not-found";
import {
  Clock,
  GraduationCap,
  Video,
  Users,
  CheckCircle2,
  Calendar,
  Flame,
  Sparkles,
  Award,
  Heart,
  ShieldCheck,
  Star,
} from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import TestimonialCard from "@/components/TestimonialCard";

export default function CourseDetail() {
  const { i18n, t } = useTranslation();
  const lang = i18n.language;
  const params = useParams();
  const slug = params.slug || "";

  const { data: course, isLoading, isError } = useGetCourse(slug, {
    query: {
      enabled: !!slug,
      queryKey: getGetCourseQueryKey(slug),
    },
  });
  const { data: testimonials = [] } = useListTestimonials();

  if (isLoading)
    return (
      <div className="container mx-auto px-4 py-32 space-y-8 max-w-5xl">
        <Skeleton className="h-12 w-1/2" />
        <Skeleton className="h-6 w-1/3" />
        <Skeleton className="h-64 w-full rounded-3xl" />
      </div>
    );

  if (isError || !course) return <NotFound />;

  // Select localized fields
  const title = lang === "ur" ? (course as any).title_ur || course.title : lang === "ar" ? (course as any).title_ar || course.title : course.title;
  const summary = lang === "ur" ? (course as any).summary_ur || course.summary : lang === "ar" ? (course as any).summary_ar || course.summary : course.summary;
  const timings = lang === "ur" ? (course as any).timings_ur || course.timings : lang === "ar" ? (course as any).timings_ar || course.timings : course.timings;

  const lowSeats =
    typeof course.seatsRemaining === "number" &&
    course.seatsRemaining > 0 &&
    course.seatsRemaining <= 8;

  // Course-related testimonials, fallback to all
  const courseTestimonials = testimonials
    .filter(
      (t) =>
        t.course && t.course.toLowerCase().includes(course.title.toLowerCase().split(" ")[0]!),
    )
    .slice(0, 3);
  const showTestimonials =
    courseTestimonials.length > 0 ? courseTestimonials : testimonials.slice(0, 3);

  // Generic transformations based on language
  const isArabic = course.language === "arabic";
  const transformations = isArabic
    ? [
        { icon: Heart, text: t("course_detail.achieve.salah", "Pray Salah understanding every word") },
        { icon: Sparkles, text: t("course_detail.achieve.tajweed", "Read the Quran with Tajweed and meaning") },
        { icon: Award, text: t("course_detail.achieve.habit", "Build a daily Arabic study habit") },
        { icon: Users, text: t("course_detail.achieve.sisterhood", "Join a global circle of sisters on the same path") },
      ]
    : [
        { icon: Heart, text: t("course_detail.achieve.urdu_fluent", "Read Urdu fluently and confidently") },
        { icon: Sparkles, text: t("course_detail.achieve.urdu_lit", "Connect with Islamic literature and poetry") },
        { icon: Award, text: t("course_detail.achieve.urdu_life", "Speak and write Urdu in everyday life") },
        { icon: Users, text: t("course_detail.achieve.urdu_sisterhood", "Join a sisterhood that celebrates the language") },
      ];

  return (
    <div className="min-h-screen bg-background pb-32 pt-20">
      <SEO 
        title={title} 
        description={summary}
      />
      {/* HERO */}
      <div className="bg-primary text-primary-foreground py-10 sm:py-12 lg:py-20">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="inline-block px-3 py-1 bg-accent/20 text-accent font-bold text-xs uppercase tracking-widest rounded-full">
              {course.language} • {course.level}
            </span>
            {course.featured && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-accent text-primary font-bold text-xs uppercase tracking-widest rounded-full">
                <Sparkles className="w-3 h-3" /> {t("courses.most_popular", "Most Popular")}
              </span>
            )}
            {lowSeats && (course as any).enrollmentStatus !== "closed" && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-rose-500 text-white font-bold text-xs uppercase tracking-widest rounded-full animate-pulse">
                <Flame className="w-3 h-3" /> {t("courses.only", "Only")} {course.seatsRemaining} {t("courses.seats_left", "seats left")}
              </span>
            )}
            {(course as any).enrollmentStatus === "closed" && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-rose-100 text-rose-700 font-bold text-xs uppercase tracking-widest rounded-full border border-rose-200">
                Enrollments Closed
              </span>
            )}
          </div>

          <h1 className="font-serif font-bold text-2xl sm:text-3xl md:text-5xl mb-5 text-white leading-tight">
            {title}
          </h1>
          <p className="text-lg md:text-xl text-primary-foreground/80 max-w-3xl leading-relaxed mb-6">
            {summary}
          </p>

          <div className="flex flex-col sm:flex-row flex-wrap gap-4 items-start sm:items-center pt-6 border-t border-primary-foreground/10">
            {(course as any).enrollmentStatus === "closed" ? (
              <Button disabled className="h-12 px-8 rounded-full opacity-50 cursor-not-allowed">
                Enrollments Closed
              </Button>
            ) : (
              <CTAGroup
                variant="hero"
                theme="dark"
                trialMode={false}
                primaryLabel={t("common.enroll_now", "Enroll Now")}
                defaultCourseSlug={course.slug}
              />
            )}
            <div className="font-serif font-bold text-2xl md:ml-2">
              {course.currency} {course.feeMonthly}
              <span className="text-sm font-sans font-normal opacity-70"> / {t("courses.month", "month")}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-5xl -mt-6 relative z-10">
        <div className="grid md:grid-cols-3 gap-8">
          {/* MAIN */}
          <div className="md:col-span-2 space-y-10">
            {/* What you'll achieve */}
            <section className="bg-card p-7 md:p-9 rounded-3xl border border-border shadow-sm">
              <div className="flex items-center gap-2 mb-5">
                <Sparkles className="w-5 h-5 text-accent" />
                <h2 className="font-serif font-bold text-2xl md:text-3xl text-primary">
                  {t("course_detail.what_achieve", "What you'll achieve")}
                </h2>
              </div>
              <p className="text-muted-foreground mb-5">
                {t("course_detail.end_of_course", "By the end of this course, in shaa Allah:")}
              </p>
              <div className="grid sm:grid-cols-2 gap-3">
                {transformations.map((t, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 bg-background p-4 rounded-xl border border-border"
                  >
                    <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                      <t.icon className="w-4 h-4" />
                    </div>
                    <span className="text-sm text-foreground/90">{t.text}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* What you'll learn */}
            <section className="bg-card p-7 md:p-9 rounded-3xl border border-border shadow-sm">
              <h2 className="font-serif font-bold text-2xl md:text-3xl text-primary mb-5">
                {t("course_detail.what_learn", "What you'll learn")}
              </h2>
              <ul className="space-y-3">
                {course.highlights.map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <span className="text-foreground/85 leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* Curriculum */}
            <section className="bg-card p-7 md:p-9 rounded-3xl border border-border shadow-sm">
              <h2 className="font-serif font-bold text-2xl md:text-3xl text-primary mb-6">
                {t("course_detail.curriculum", "The curriculum")}
              </h2>
              <div className="space-y-5">
                {course.curriculum.map((module, i) => (
                  <div key={i} className="flex gap-5">
                    <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold font-serif shrink-0">
                      {i + 1}
                    </div>
                    <div className="pt-1.5">
                      <h3 className="font-bold text-lg mb-1.5">{module.title}</h3>
                      {module.description && (
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {module.description}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Mid-page CTA */}
              <div className="mt-8 pt-8 border-t border-border">
                {(course as any).enrollmentStatus === "closed" ? (
                  <Button disabled className="h-12 px-8 rounded-full opacity-50">
                    Enrollments Closed
                  </Button>
                ) : (
                  <CTAGroup
                    trialMode={false}
                    primaryLabel={t("course_detail.enroll_btn", "Enroll in This Course")}
                    defaultCourseSlug={course.slug}
                  />
                )}
              </div>
            </section>

            {/* Testimonials */}
            {showTestimonials.length > 0 && (
              <section className="bg-card p-7 md:p-9 rounded-3xl border border-border shadow-sm">
                <h2 className="font-serif font-bold text-2xl md:text-3xl text-primary mb-2">
                  {t("course_detail.testimonials_title", "Sisters love this course.")}
                </h2>
                <p className="text-muted-foreground mb-6">
                  {t("course_detail.testimonials_subtitle", "Real words from sisters who took the leap.")}
                </p>
                <div className="grid sm:grid-cols-1 gap-6">
                  {showTestimonials.map((t) => (
                    <TestimonialCard key={t.id} testimonial={t as any} />
                  ))}
                </div>
              </section>
            )}

            {/* Final CTA on main column */}
            <section className="bg-primary text-primary-foreground rounded-3xl p-8 text-center">
              <Sparkles className="w-8 h-8 text-accent mx-auto mb-3" />
              <h3 className="font-serif font-bold text-2xl text-white mb-2">
                {t("course_detail.ready_title", "Ready to begin?")}
              </h3>
              <p className="text-primary-foreground/85 mb-6 text-sm">
                {t("course_detail.ready_subtitle", "Book a free trial first, or enroll directly. Either way — you'll be on WhatsApp with us within minutes.")}
              </p>
              {(course as any).enrollmentStatus === "closed" ? (
                <div className="bg-rose-500/20 text-rose-200 px-6 py-3 rounded-full font-bold">
                  Enrollments are currently closed for this batch.
                </div>
              ) : (
                <div className="flex justify-center">
                  <CTAGroup
                    variant="hero"
                    align="center"
                    theme="dark"
                    trialMode
                    defaultCourseSlug={course.slug}
                  />
                </div>
              )}
            </section>
          </div>

          {/* SIDEBAR */}
          <div className="space-y-6">
            {/* Sticky enroll card on desktop */}
            <div className="md:sticky md:top-24 space-y-6">
              <div className="bg-card p-6 rounded-3xl border border-border shadow-sm space-y-5">
                <div className="text-center pb-4 border-b border-border">
                  <div className="text-xs uppercase tracking-widest text-muted-foreground mb-1">
                    {t("courses.monthly_fee", "Monthly Fee")}
                  </div>
                  <div className="font-serif font-bold text-3xl text-primary">
                    {course.currency} {course.feeMonthly}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {t("courses.free_trial_no_payment", "Free trial — no payment to start")}
                  </div>
                </div>

                {lowSeats && (
                  <div className="bg-rose-50 border border-rose-200 text-rose-700 rounded-xl p-3 flex items-center gap-2 text-sm">
                    <Flame className="w-4 h-4 shrink-0" />
                    <span>
                      {t("courses.only", "Only")} <strong>{course.seatsRemaining} {t("courses.seats", "seats")}</strong> {t("courses.left_batch", "left this batch")}
                    </span>
                  </div>
                )}

                {(course as any).enrollmentStatus === "closed" ? (
                  <Button disabled className="w-full h-12 font-serif text-base rounded-full opacity-50">
                    Enrollments Closed
                  </Button>
                ) : (
                  <>
                    <EnrollmentModal mode="trial" defaultCourseSlug={course.slug}>
                      <Button className="w-full h-12 font-serif text-base rounded-full bg-primary text-primary-foreground hover:bg-primary/90">
                        <Sparkles className="w-4 h-4 mr-2" /> {t("common.book_trial", "Book Free Trial")}
                      </Button>
                    </EnrollmentModal>

                    <EnrollmentModal defaultCourseSlug={course.slug}>
                      <Button
                        variant="outline"
                        className="w-full h-12 font-serif text-base rounded-full border-primary/30 text-primary hover:bg-primary/5"
                      >
                        {t("common.enroll_now", "Enroll Now")}
                      </Button>
                    </EnrollmentModal>
                  </>
                )}

                <Button
                  asChild
                  className="w-full h-12 font-serif text-base rounded-full bg-[#25D366] text-white hover:bg-[#128C7E]"
                >
                  <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
                    <FaWhatsapp className="w-4 h-4 mr-2" /> {t("common.chat_whatsapp", "Chat on WhatsApp")}
                  </a>
                </Button>

                <div className="pt-4 border-t border-border space-y-3 text-sm">
                  <Detail icon={Clock} label={t("courses.duration", "Duration")} value={`${course.durationMonths} ${t("courses.months", "Months")}`} />
                  <Detail icon={Calendar} label={t("courses.timings_label", "Timings")} value={timings} />
                  {course.platform && (
                    <Detail icon={Video} label={t("courses.platform", "Platform")} value={`${t("courses.live_on", "Live on")} ${course.platform}`} />
                  )}
                  <Detail icon={GraduationCap} label={t("courses.level_label", "Level")} value={course.level} />
                  {course.forWhom && (
                    <Detail icon={Users} label={t("courses.for_label", "For")} value={course.forWhom} />
                  )}
                </div>

                <div className="pt-4 border-t border-border space-y-2 text-xs text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-3.5 h-3.5 text-primary" />
                    {t("courses.sisters_only_class", "100% sisters-only classroom")}
                  </div>
                  <div className="flex items-center gap-2">
                    <Award className="w-3.5 h-3.5 text-primary" />
                    {t("courses.guarantee", "Money-back guarantee")}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MOBILE STICKY BAR */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-background/95 backdrop-blur border-t border-border p-3 flex gap-2 shadow-2xl">
        {(course as any).enrollmentStatus === "closed" ? (
          <Button disabled className="flex-1 h-12 rounded-full opacity-50">
            Enrollments Closed
          </Button>
        ) : (
          <EnrollmentModal mode="trial" defaultCourseSlug={course.slug}>
            <Button className="flex-1 h-12 rounded-full bg-primary text-primary-foreground font-serif">
              <Sparkles className="w-4 h-4 mr-1.5" /> {t("common.free_trial_btn", "Free Trial")}
            </Button>
          </EnrollmentModal>
        )}
        <Button
          asChild
          className="h-12 px-4 rounded-full bg-[#25D366] text-white"
          aria-label="WhatsApp"
        >
          <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
            <FaWhatsapp className="w-5 h-5" />
          </a>
        </Button>
      </div>
    </div>
  );
}

function Detail({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Clock;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
        <Icon className="w-4 h-4" />
      </div>
      <div className="min-w-0">
        <div className="font-bold text-xs text-foreground">{label}</div>
        <div className="text-muted-foreground text-xs truncate">{value}</div>
      </div>
    </div>
  );
}
