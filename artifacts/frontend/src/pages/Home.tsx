import { Link } from "wouter";
import {
  ShieldCheck,
  Video,
  Heart,
  BookOpen,
  Star,
  Clock,
  HeartCrack,
  Sparkles,
  CheckCircle2,
  Award,
  ArrowRight,
} from "lucide-react";
import CourseCard from "@/components/CourseCard";
import CTAGroup from "@/components/CTAGroup";
import { Button } from "@/components/ui/button";
import { useListCourses, useListTestimonials, useGetSiteStats } from "@workspace/api-client-react";
import { getFlag, getInitials, getAvatarColor } from "@/lib/country";
import calligraphyYellow from "@assets/Asset_1@4x_1777409230830.png";
import calligraphyGreen from "@assets/Asset_8@4x_1777409251771.png";

export default function Home() {
  const { data: courses = [] } = useListCourses();
  const { data: testimonials = [] } = useListTestimonials();
  const { data: stats } = useGetSiteStats();

  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. HERO — Hook + dual CTA above the fold */}
      <section className="relative bg-background overflow-hidden min-h-[88vh] flex items-center pt-20">
        <div className="absolute inset-0 z-0">
          <img src="/hero-bg.png" alt="" className="w-full h-full object-cover opacity-10" />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/95 to-background/60" />
        </div>

        <div className="container relative z-10 px-4 py-16 lg:py-24 grid lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7 space-y-7">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/5 border border-primary/10 text-primary font-medium text-sm tracking-wide">
              <ShieldCheck className="w-4 h-4 text-accent" />
              100% Female-Only • Live on Zoom
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-foreground leading-[1.1]">
              Read the Quran with{" "}
              <span className="text-primary relative inline-block">
                meaning
                <img
                  src={calligraphyGreen}
                  alt=""
                  className="absolute -bottom-5 right-0 h-12 opacity-20 pointer-events-none"
                />
              </span>
              <br />— from your living room.
            </h1>

            <p className="text-lg text-muted-foreground max-w-xl leading-relaxed">
              Live Arabic & Urdu classes for sisters, taught by qualified female teachers.
              Flexible timings, no judgment, your camera on a safe space.
            </p>

            <CTAGroup variant="hero" trialMode />

            <div className="flex items-center gap-6 pt-6 border-t border-border/50">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-9 h-9 rounded-full border-2 border-background bg-primary/10 flex items-center justify-center text-primary"
                  >
                    <Heart className="w-4 h-4 fill-current" />
                  </div>
                ))}
              </div>
              <div className="text-sm">
                <p className="font-bold text-foreground">
                  {stats?.totalStudents || 500}+ sisters learning
                </p>
                <p className="text-muted-foreground">
                  across {stats?.countriesReached || 12}+ countries
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Bar */}
      <div className="bg-primary text-primary-foreground py-5 border-y border-primary/20">
        <div className="container px-4">
          <div className="flex flex-wrap justify-center gap-6 md:gap-12 text-sm">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-accent" />
              <span className="font-medium">Female teachers only</span>
            </div>
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-accent" />
              <span className="font-medium">No age limit</span>
            </div>
            <div className="flex items-center gap-2">
              <Video className="w-5 h-5 text-accent" />
              <span className="font-medium">Live on Zoom</span>
            </div>
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-accent" />
              <span className="font-medium">Free trial class</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. PAIN — Why we exist */}
      <section className="py-20 bg-background">
        <div className="container px-4 max-w-5xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="inline-block text-xs font-bold tracking-widest text-primary uppercase mb-3">
              We get it
            </span>
            <h2 className="font-serif font-bold text-3xl md:text-4xl text-foreground">
              Learning Quran shouldn't feel impossible.
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: HeartCrack,
                title: "Mixed-gender classes feel uncomfortable",
                desc: "You hesitate to turn on your camera or ask questions.",
              },
              {
                icon: Clock,
                title: "Local madrasas don't fit your schedule",
                desc: "Between work, kids, and household — fixed timings just don't work.",
              },
              {
                icon: BookOpen,
                title: "You can read Arabic but don't understand it",
                desc: "Reading without meaning leaves you spiritually disconnected.",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="bg-card border border-border rounded-2xl p-6 text-center"
              >
                <div className="w-12 h-12 mx-auto bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mb-4">
                  <item.icon className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-foreground mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. TRANSFORMATION */}
      <section className="py-20 bg-card">
        <div className="container px-4 max-w-5xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="inline-block text-xs font-bold tracking-widest text-primary uppercase mb-3">
              Imagine
            </span>
            <h2 className="font-serif font-bold text-3xl md:text-4xl text-foreground">
              Six months from now, in shaa Allah…
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            {[
              "Reading the Quran with proper Tajweed, not just pronunciation",
              "Understanding what you're reciting in Salah",
              "Teaching basic Arabic to your children at home",
              "A community of sisters from 12+ countries by your side",
            ].map((item, i) => (
              <div
                key={i}
                className="flex items-start gap-3 bg-background p-5 rounded-xl border border-border"
              >
                <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <span className="text-foreground/90">{item}</span>
              </div>
            ))}
          </div>

          <div className="flex justify-center mt-10">
            <CTAGroup variant="hero" align="center" trialMode />
          </div>
        </div>
      </section>

      {/* 4. COURSES */}
      <section className="py-20 bg-background relative overflow-hidden">
        <img
          src={calligraphyGreen}
          alt=""
          className="absolute top-0 right-0 h-64 opacity-[0.03] pointer-events-none"
        />
        <div className="container px-4">
          <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-10">
            <div className="max-w-2xl">
              <span className="inline-block text-xs font-bold tracking-widest text-primary uppercase mb-2">
                Programs
              </span>
              <h2 className="font-serif font-bold text-3xl md:text-4xl text-foreground">
                Pick what fits your level.
              </h2>
            </div>
            <Button
              variant="outline"
              className="rounded-full border-primary/20 text-primary hover-elevate active-elevate-2"
              asChild
            >
              <Link href="/courses">View all courses →</Link>
            </Button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.slice(0, 3).map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        </div>
      </section>

      {/* 5. TRUST — Why us */}
      <section className="py-20 bg-primary text-primary-foreground relative overflow-hidden">
        <img
          src={calligraphyYellow}
          alt=""
          className="absolute -left-20 bottom-0 h-96 opacity-10 pointer-events-none"
        />
        <div className="container px-4 relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="inline-block text-xs font-bold tracking-widest text-accent uppercase mb-3">
              Why us
            </span>
            <h2 className="font-serif font-bold text-3xl md:text-4xl text-white">
              Built for sisters, by sisters.
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: ShieldCheck,
                title: "100% Privacy",
                desc: "Sisters-only classroom. Camera-on freely without a niqab.",
              },
              {
                icon: Clock,
                title: "Flexible Timings",
                desc: "Evening & weekend batches that work around your life.",
              },
              {
                icon: BookOpen,
                title: "Real Curriculum",
                desc: "Step-by-step from alphabet to fluency, with weekly checks.",
              },
            ].map((feature, idx) => (
              <div
                key={idx}
                className="bg-primary-foreground/5 border border-primary-foreground/10 rounded-2xl p-7 text-center"
              >
                <div className="w-14 h-14 mx-auto bg-accent rounded-2xl flex items-center justify-center text-primary mb-5">
                  <feature.icon className="w-7 h-7" />
                </div>
                <h3 className="font-serif font-bold text-xl mb-2 text-white">{feature.title}</h3>
                <p className="text-primary-foreground/80 text-sm">{feature.desc}</p>
              </div>
            ))}
          </div>

          <div className="flex justify-center mt-10">
            <CTAGroup variant="hero" align="center" theme="dark" trialMode />
          </div>
        </div>
      </section>

      {/* 6. TESTIMONIALS */}
      <section className="py-20 bg-background">
        <div className="container px-4 max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-10">
            <div className="max-w-2xl">
              <span className="inline-block text-xs font-bold tracking-widest text-primary uppercase mb-2">
                Real stories
              </span>
              <h2 className="font-serif font-bold text-3xl md:text-4xl text-foreground">
                Sisters who started where you are.
              </h2>
            </div>
            <Button
              variant="outline"
              className="rounded-full border-primary/20 text-primary"
              asChild
            >
              <Link href="/testimonials">Read all stories →</Link>
            </Button>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {testimonials.slice(0, 3).map((t) => {
              const palette = getAvatarColor(t.studentName);
              const flag = getFlag(t.location);
              const firstSentence =
                t.quote.split(/[.!?]/).filter(Boolean)[0]?.trim() || t.quote;
              const rest = t.quote.replace(firstSentence, "").replace(/^[.!?\s]+/, "");
              return (
                <div
                  key={t.id}
                  className="bg-card p-6 rounded-2xl border border-border hover:border-primary/30 hover:shadow-lg transition-all flex flex-col"
                >
                  <div className="flex gap-1 mb-4 text-accent">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <p className="font-serif text-lg text-foreground leading-snug mb-3">
                    "{firstSentence}."
                  </p>
                  {rest && (
                    <p className="text-sm text-muted-foreground leading-relaxed mb-5 line-clamp-3">
                      {rest}
                    </p>
                  )}
                  <div className="flex items-center gap-3 mt-auto pt-4 border-t border-border">
                    <div
                      className={`w-11 h-11 rounded-full ${palette.bg} ${palette.text} flex items-center justify-center font-bold text-sm shrink-0`}
                    >
                      {getInitials(t.studentName)}
                    </div>
                    <div className="min-w-0">
                      <div className="font-bold text-foreground text-sm truncate">
                        {t.studentName}
                      </div>
                      <div className="text-xs text-muted-foreground truncate">
                        <span className="mr-1">{flag}</span>
                        {t.location}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 7. RTL Preview */}
      <section className="py-16 border-t border-border bg-card">
        <div className="container px-4 text-center max-w-3xl mx-auto">
          <h2 className="font-serif font-bold text-2xl md:text-3xl mb-6">
            Experience the beauty of the language.
          </h2>
          <div className="bg-background p-8 rounded-2xl border border-primary/10 shadow-sm">
            <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-3">
              Arabic Script
            </div>
            <p
              className="font-arabic text-3xl md:text-4xl leading-relaxed text-foreground"
              dir="rtl"
            >
              بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
            </p>
            <p className="text-sm text-muted-foreground mt-4">
              In the name of Allah, the Entirely Merciful, the Especially Merciful.
            </p>
          </div>
        </div>
      </section>

      {/* 8. FINAL CTA */}
      <section className="py-20 bg-primary text-center px-4 relative overflow-hidden">
        <div className="container relative z-10 max-w-3xl mx-auto space-y-6">
          <Sparkles className="w-10 h-10 text-accent mx-auto" />
          <h2 className="font-serif font-bold text-3xl md:text-5xl text-white leading-tight">
            Your free trial is one click away.
          </h2>
          <p className="text-lg text-primary-foreground/85">
            Try a real class with our teacher. No payment, no commitment — see if it's
            right for you.
          </p>
          <div className="flex justify-center pt-2">
            <CTAGroup variant="hero" align="center" theme="dark" trialMode />
          </div>
          <p className="text-sm text-primary-foreground/70 inline-flex items-center gap-2">
            <ArrowRight className="w-4 h-4" />
            We reply on WhatsApp within minutes.
          </p>
        </div>
      </section>
    </div>
  );
}
