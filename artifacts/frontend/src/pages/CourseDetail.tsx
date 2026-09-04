import { SEO } from "@/components/SEO";
import { useParams, Link } from "wouter";
import { useGetCourse, useListTestimonials } from "@workspace/api-client-react";
import { getGetCourseQueryKey } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import EnrollmentModal from "@/components/EnrollmentModal";
import CTAGroup from "@/components/CTAGroup";
import { useWhatsApp } from "@/hooks/use-whatsapp";
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
} from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import TestimonialCard from "@/components/TestimonialCard";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function CourseDetail() {
  const params = useParams();
  const slug = params.slug || "";
  const { whatsappUrl } = useWhatsApp();

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

  // Select fields
  const isUrdu =
    course.language?.toLowerCase() === "urdu" ||
    course.slug?.toLowerCase().includes("urdu");

  const isIntermediate =
    course.slug?.toLowerCase().includes("intermediate");

  const title = course.title;
  const summary = course.summary;
  const courseLevel = course.level;
  const timings = course.timings;

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
  const isArabic = course.language?.toLowerCase() === "arabic";
  const transformations = isArabic
    ? [
      { icon: Heart, text: "Pray Salah understanding every word" },
      { icon: Sparkles, text: "Read the Quran with Tajweed and meaning" },
      { icon: Award, text: "Build a daily Arabic study habit" },
      { icon: Users, text: "Join a global circle of sisters on the same path" },
    ]
    : [
      { icon: Heart, text: "Read Urdu fluently and confidently" },
      { icon: Sparkles, text: "Connect with Islamic literature and poetry" },
      { icon: Award, text: "Speak and write Urdu in everyday life" },
      { icon: Users, text: "Join a sisterhood that celebrates the language" },
    ];

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://hareemacademy.com"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Courses",
        "item": "https://hareemacademy.com/courses"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": title,
        "item": `https://hareemacademy.com/courses/${course.slug}`
      }
    ]
  };

  const courseSchema = {
    "@context": "https://schema.org",
    "@type": "Course",
    "name": title,
    "description": summary,
    "provider": {
      "@type": "Organization",
      "name": "Hareem Academy",
      "sameAs": "https://hareemacademy.com"
    },
    "educationalLevel": course.level,
    "timeRequired": `P${course.durationMonths}M`,
    "offers": {
      "@type": "Offer",
      "price": (course as any).feeAmount || "0",
      "priceCurrency": (course as any).feeCurrency || "INR",
      "category": "Education",
      "availability": (course as any).enrollmentStatus === "closed" ? "https://schema.org/SoldOut" : "https://schema.org/InStock",
      "url": `https://hareemacademy.com/courses/${course.slug}`
    },
    "hasCourseInstance": {
      "@type": "CourseInstance",
      "courseMode": "Online",
      "courseWorkload": course.timings,
      "instructor": {
        "@type": "Person",
        "name": "Qualified Female Educator",
        "jobTitle": "Islamic Instructor"
      }
    }
  };

  const courseKeywords = isArabic
    ? [
        course.title,
        "learn arabic online",
        "arabic classes for sisters",
        "female arabic tutor online",
        "quranic arabic classes",
        "tajweed for women",
        "hareem academy"
      ]
    : [
        course.title,
        "learn urdu online",
        "urdu reading classes for sisters",
        "urdu course for beginners",
        "female urdu teacher online",
        "urdu foundations",
        "hareem academy"
      ];

  const courseImage = `https://hareemacademy.com/${isUrdu ? "course-urdu.png" : "course-arabic.png"}`;

  return (
    <div className="min-h-screen bg-background pb-28 md:pb-16 pt-2 sm:pt-4">
      <SEO
        title={title}
        description={summary}
        keywords={courseKeywords}
        imageUrl={courseImage}
        url={`https://hareemacademy.com/courses/${course.slug}`}
        schema={[breadcrumbSchema, courseSchema]}
      />
      {/* HERO */}
      <div className="bg-primary text-primary-foreground py-10 sm:py-12 lg:py-20">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="inline-block px-3 py-1 bg-accent/20 text-accent font-bold text-xs uppercase tracking-widest rounded-full">
              {course.language} • {courseLevel}
            </span>
            {course.featured && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-accent text-primary font-bold text-xs uppercase tracking-widest rounded-full">
                <Sparkles className="w-3 h-3" /> Most Popular
              </span>
            )}
            {lowSeats && (course as any).enrollmentStatus !== "closed" && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-rose-500 text-white font-bold text-xs uppercase tracking-widest rounded-full animate-pulse">
                <Flame className="w-3 h-3" /> Only {course.seatsRemaining} seats left
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
                primaryLabel="Enroll Now"
                defaultCourseSlug={course.slug}
              />
            )}
            <div className="font-serif font-bold text-2xl md:ml-2">
              {course.currency} {course.feeMonthly}
              <span className="text-sm font-sans font-normal opacity-70"> / month</span>
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
                  What you'll achieve
                </h2>
              </div>
              <p className="text-muted-foreground mb-5">
                By the end of this course, in shaa Allah:
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
                What you'll learn
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
            <section className="bg-card p-6 sm:p-8 rounded-3xl border border-border shadow-sm">
              <h2 className="font-serif font-bold text-2xl md:text-3xl text-primary mb-6">
                The curriculum
              </h2>
              <Accordion type="single" collapsible className="w-full space-y-3">
                {course.curriculum.map((module, i) => (
                  <AccordionItem
                    key={i}
                    value={`item-${i}`}
                    className="border border-border/80 rounded-xl px-4 bg-background transition-custom hover:border-accent/30"
                  >
                    <AccordionTrigger className="hover:no-underline py-4">
                      <div className="flex items-center gap-4 text-left">
                        <div className="w-8 h-8 rounded-full bg-primary/5 text-primary flex items-center justify-center font-bold font-serif text-sm shrink-0 border border-primary/10">
                          {i + 1}
                        </div>
                        <span className="font-bold font-serif text-base text-foreground leading-snug">
                          {module.title}
                        </span>
                      </div>
                    </AccordionTrigger>
                    {module.description && (
                      <AccordionContent className="pb-4 pt-1 pl-12 text-sm text-muted-foreground leading-relaxed font-sans">
                        {module.description}
                      </AccordionContent>
                    )}
                  </AccordionItem>
                ))}
              </Accordion>

              {/* Mid-page CTA */}
              <div className="mt-8 pt-8 border-t border-border">
                {(course as any).enrollmentStatus === "closed" ? (
                  <Button disabled className="h-12 px-8 rounded-full opacity-50">
                    Enrollments Closed
                  </Button>
                ) : (
                  <CTAGroup
                    trialMode={false}
                    primaryLabel="Enroll in This Course"
                    defaultCourseSlug={course.slug}
                  />
                )}
              </div>
            </section>

            {/* Testimonials */}
            {showTestimonials.length > 0 && (
              <section className="bg-card p-7 md:p-9 rounded-3xl border border-border shadow-sm">
                <h2 className="font-serif font-bold text-2xl md:text-3xl text-primary mb-2">
                  Sisters love this course.
                </h2>
                <p className="text-muted-foreground mb-6">
                  Real words from sisters who took the leap.
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
                Ready to begin?
              </h3>
              <p className="text-primary-foreground/85 mb-6 text-sm">
                Book a free trial first, or enroll directly. Either way — you'll be on WhatsApp with us within minutes.
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
                    Monthly Fee
                  </div>
                  <div className="font-serif font-bold text-3xl text-primary">
                    {course.currency} {course.feeMonthly}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Free trial — no payment to start
                  </div>
                </div>

                {lowSeats && (
                  <div className="bg-rose-50 border border-rose-200 text-rose-700 rounded-xl p-3 flex items-center gap-2 text-sm">
                    <Flame className="w-4 h-4 shrink-0" />
                    <span>
                      Only <strong>{course.seatsRemaining} seats</strong> left this batch
                    </span>
                  </div>
                )}

                {(course as any).enrollmentStatus === "closed" ? (
                  <Button disabled className="w-full h-12 font-sans text-base rounded-lg font-semibold opacity-50">
                    Enrollments Closed
                  </Button>
                ) : (
                  <>
                    <EnrollmentModal mode="trial" defaultCourseSlug={course.slug}>
                      <Button className="w-full h-12 font-sans text-base rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 font-semibold cursor-pointer">
                        <Sparkles className="w-4 h-4 mr-2" /> Begin Your Journey
                      </Button>
                    </EnrollmentModal>

                    <EnrollmentModal defaultCourseSlug={course.slug}>
                      <Button
                        variant="outline"
                        className="w-full h-12 font-sans text-base rounded-lg border-primary/30 text-primary hover:bg-primary/5 font-semibold cursor-pointer"
                      >
                        Enroll Now
                      </Button>
                    </EnrollmentModal>
                  </>
                )}

                <Button
                  asChild
                  className="w-full h-12 font-sans text-base rounded-lg bg-[#0F4D36] text-white hover:bg-[#0A3828] border border-[#ECC565]/20 shadow-sm font-semibold cursor-pointer"
                >
                  <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                    <FaWhatsapp className="w-4 h-4 mr-2" /> Speak With Our Team
                  </a>
                </Button>

                <div className="pt-4 border-t border-border space-y-3 text-sm">
                  <Detail icon={Clock} label="Duration" value={`${course.durationMonths} Months`} />
                  <Detail icon={Calendar} label="Timings" value={timings} />
                  {course.platform && (
                    <Detail icon={Video} label="Platform" value={`Live on ${course.platform}`} />
                  )}
                  <Detail icon={GraduationCap} label="Level" value={course.level} />
                  {course.forWhom && (
                    <Detail icon={Users} label="For" value={course.forWhom} />
                  )}
                </div>

                <div className="pt-4 border-t border-border space-y-2 text-xs text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-3.5 h-3.5 text-primary" />
                    100% sisters-only classroom
                  </div>
                  <div className="flex items-center gap-2">
                    <Award className="w-3.5 h-3.5 text-primary" />
                    Money-back guarantee
                  </div>
                </div>
              </div>

              {/* Related Learning Paths */}
              <div className="bg-card p-6 rounded-3xl border border-border shadow-sm space-y-4">
                <h4 className="font-serif font-bold text-lg text-primary">Related Programs</h4>
                <div className="space-y-3">
                  {course.slug === "basic-arabic" && (
                    <>
                      <Link href="/courses/quranic-arabic-intermediate" className="block text-sm text-foreground hover:text-primary transition-colors hover:underline">
                        → Quranic Arabic — Intermediate
                      </Link>
                      <Link href="/courses/urdu-foundations" className="block text-sm text-foreground hover:text-primary transition-colors hover:underline">
                        → Urdu Foundations
                      </Link>
                      <Link href="/online-tajweed-classes" className="block text-sm text-foreground hover:text-primary transition-colors hover:underline">
                        → Online Tajweed Classes (Specialized)
                      </Link>
                    </>
                  )}
                  {course.slug === "quranic-arabic-intermediate" && (
                    <>
                      <Link href="/courses/basic-arabic" className="block text-sm text-foreground hover:text-primary transition-colors hover:underline">
                        → Basic Arabic Course (Beginner)
                      </Link>
                      <Link href="/courses/urdu-foundations" className="block text-sm text-foreground hover:text-primary transition-colors hover:underline">
                        → Urdu Foundations
                      </Link>
                      <Link href="/understand-quranic-arabic" className="block text-sm text-foreground hover:text-primary transition-colors hover:underline">
                        → Understand Quranic Arabic (Specialized)
                      </Link>
                    </>
                  )}
                  {course.slug === "urdu-foundations" && (
                    <>
                      <Link href="/courses/basic-arabic" className="block text-sm text-foreground hover:text-primary transition-colors hover:underline">
                        → Basic Arabic Course (Beginner)
                      </Link>
                      <Link href="/courses/quranic-arabic-intermediate" className="block text-sm text-foreground hover:text-primary transition-colors hover:underline">
                        → Quranic Arabic — Intermediate
                      </Link>
                      <Link href="/learn-urdu-online" className="block text-sm text-foreground hover:text-primary transition-colors hover:underline">
                        → Learn Urdu Online (Specialized)
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MOBILE STICKY BAR */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-background/95 backdrop-blur border-t border-border p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] flex gap-2 shadow-2xl">
        {(course as any).enrollmentStatus === "closed" ? (
          <Button disabled className="flex-1 h-12 rounded-lg opacity-50 font-sans font-semibold">
            Enrollments Closed
          </Button>
        ) : (
          <EnrollmentModal mode="trial" defaultCourseSlug={course.slug}>
            <Button className="flex-1 h-12 rounded-lg bg-primary text-primary-foreground font-sans font-semibold cursor-pointer">
              <Sparkles className="w-4 h-4 mr-1.5" /> Begin Your Journey
            </Button>
          </EnrollmentModal>
        )}
        <Button
          asChild
          className="h-12 px-4 rounded-lg bg-[#0F4D36] text-white hover:bg-[#0A3828] border border-[#ECC565]/20 shadow-sm cursor-pointer"
          aria-label="WhatsApp"
        >
          <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
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
