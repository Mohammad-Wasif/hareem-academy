import { Link } from "wouter";
import { ShieldCheck, Video, Heart, BookOpen, Star, Users, Clock } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import CourseCard from "@/components/CourseCard";
import EnrollmentModal from "@/components/EnrollmentModal";
import { Button } from "@/components/ui/button";
import { useListCourses, useListTestimonials, useGetSiteStats } from "@workspace/api-client-react";
import calligraphyYellow from "@assets/Asset_1@4x_1777409230830.png";
import calligraphyGreen from "@assets/Asset_8@4x_1777409251771.png";

export default function Home() {
  const { data: courses = [] } = useListCourses();
  const { data: testimonials = [] } = useListTestimonials();
  const { data: stats } = useGetSiteStats();

  const featuredCourse = courses.find(c => c.featured) || courses[0];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-background overflow-hidden min-h-[90vh] flex items-center">
        <div className="absolute inset-0 z-0">
          <img src="/hero-bg.png" alt="Quran Study" className="w-full h-full object-cover opacity-10" />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/90 to-background/50"></div>
        </div>
        
        <div className="container relative z-10 px-4 py-20 lg:py-32 grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/5 border border-primary/10 text-primary font-medium text-sm tracking-wide">
              <ShieldCheck className="w-4 h-4 text-accent" />
              100% Female-Only Environment
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-serif font-bold text-foreground leading-[1.1]">
              Learn Arabic & Urdu in a <span className="text-primary relative inline-block">
                private space.
                <img src={calligraphyGreen} alt="Hareem" className="absolute -bottom-6 right-0 h-16 opacity-20 pointer-events-none" />
              </span>
            </h1>
            
            <p className="text-lg lg:text-xl text-muted-foreground max-w-2xl leading-relaxed">
              Join a global community of sisters learning to read the Quran with understanding. Live classes from home, flexible timings, and trusted female teachers.
            </p>
            
            <div className="flex flex-wrap gap-4 pt-4">
              <EnrollmentModal>
                <Button className="h-14 px-8 text-lg font-serif rounded-full bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20">
                  Begin Your Journey
                </Button>
              </EnrollmentModal>
              <Button variant="outline" className="h-14 px-8 text-lg font-serif rounded-full border-primary/20 text-primary hover:bg-primary/5" asChild>
                <Link href="/courses">Explore Courses</Link>
              </Button>
            </div>
            
            <div className="flex items-center gap-6 pt-8 border-t border-border/50">
              <div className="flex -space-x-3">
                {[1,2,3,4].map(i => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-background bg-primary/10 flex items-center justify-center text-primary text-xs font-bold">
                    <Heart className="w-4 h-4" />
                  </div>
                ))}
              </div>
              <div className="text-sm">
                <p className="font-bold text-foreground">Trusted by {stats?.totalStudents || 500}+ sisters</p>
                <p className="text-muted-foreground">across {stats?.countriesReached || 12}+ countries</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Bar */}
      <div className="bg-primary text-primary-foreground py-6 border-y border-primary/20">
        <div className="container px-4">
          <div className="flex flex-wrap justify-center gap-8 md:gap-16">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-6 h-6 text-accent" />
              <span className="font-medium tracking-wide">For Girls & Women Only</span>
            </div>
            <div className="flex items-center gap-3">
              <Heart className="w-6 h-6 text-accent" />
              <span className="font-medium tracking-wide">No Age Limit</span>
            </div>
            <div className="flex items-center gap-3">
              <Video className="w-6 h-6 text-accent" />
              <span className="font-medium tracking-wide">Live on Zoom</span>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Course */}
      <section className="py-24 bg-card relative overflow-hidden">
        <img src={calligraphyGreen} alt="Ornament" className="absolute top-0 right-0 h-64 opacity-[0.03] pointer-events-none" />
        <div className="container px-4">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
            <h2 className="font-serif font-bold text-4xl text-foreground">Begin With The Basics</h2>
            <p className="text-muted-foreground text-lg">Our flagship course designed for absolute beginners to start understanding the language of the Quran.</p>
          </div>
          
          {featuredCourse && (
            <div className="max-w-5xl mx-auto bg-background rounded-3xl border border-primary/10 shadow-xl shadow-primary/5 overflow-hidden grid md:grid-cols-2">
              <div className="p-8 lg:p-12 flex flex-col justify-center">
                <div className="inline-block px-3 py-1 bg-accent/20 text-accent-foreground text-sm font-bold rounded-full mb-6 w-max">
                  Most Popular
                </div>
                <h3 className="font-serif font-bold text-3xl mb-4">{featuredCourse.title}</h3>
                <p className="text-muted-foreground mb-8 text-lg">
                  {featuredCourse.summary}
                </p>
                <ul className="space-y-4 mb-8">
                  {featuredCourse.highlights.slice(0, 3).map((highlight, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                      <span className="text-foreground/80">{highlight}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-auto">
                  <EnrollmentModal defaultCourseSlug={featuredCourse.slug}>
                    <Button className="w-full sm:w-auto h-12 px-8 font-serif text-lg rounded-full bg-primary text-primary-foreground hover:bg-primary/90">
                      Enroll in {featuredCourse.title}
                    </Button>
                  </EnrollmentModal>
                </div>
              </div>
              <div className="bg-primary/5 relative hidden md:block">
                <img src="/course-arabic.png" alt="Arabic Course" className="w-full h-full object-cover" />
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-24 bg-primary text-primary-foreground relative overflow-hidden">
        <img src={calligraphyYellow} alt="Ornament" className="absolute -left-20 bottom-0 h-96 opacity-10 pointer-events-none" />
        <div className="container px-4 relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="font-serif font-bold text-4xl mb-4 text-white">Why Learn With Us?</h2>
            <p className="text-primary-foreground/80 text-lg">We understand the unique needs of Muslim women seeking knowledge.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: ShieldCheck, title: "100% Privacy", desc: "A safe, sisters-only environment where you can comfortably turn on your camera and ask questions." },
              { icon: Clock, title: "Flexible Timings", desc: "Evening and weekend batches designed to fit around your studies, work, or family commitments." },
              { icon: BookOpen, title: "Structured Curriculum", desc: "Step-by-step guidance from basics to advanced, with regular assessments and personal attention." }
            ].map((feature, idx) => (
              <div key={idx} className="bg-primary-foreground/5 border border-primary-foreground/10 rounded-2xl p-8 text-center hover:bg-primary-foreground/10 transition-colors">
                <div className="w-16 h-16 mx-auto bg-accent rounded-2xl flex items-center justify-center text-primary mb-6 rotate-3 hover:rotate-0 transition-transform">
                  <feature.icon className="w-8 h-8" />
                </div>
                <h3 className="font-serif font-bold text-2xl mb-3 text-white">{feature.title}</h3>
                <p className="text-primary-foreground/80">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-background">
        <div className="container px-4">
          <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-16">
            <div className="max-w-2xl">
              <h2 className="font-serif font-bold text-4xl text-foreground mb-4">Stories From Our Sisters</h2>
              <p className="text-muted-foreground text-lg">Don't just take our word for it. Hear from students who started exactly where you are.</p>
            </div>
            <Button variant="outline" className="rounded-full border-primary/20 text-primary" asChild>
              <Link href="/testimonials">Read All Stories</Link>
            </Button>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.slice(0, 3).map((t) => (
              <div key={t.id} className="bg-card p-8 rounded-2xl border border-border">
                <div className="flex gap-1 mb-6 text-accent">
                  {[...Array(t.rating)].map((_, i) => <Star key={i} className="w-5 h-5 fill-current" />)}
                </div>
                <blockquote className="text-lg text-foreground mb-6 font-serif italic">
                  "{t.quote}"
                </blockquote>
                <div>
                  <div className="font-bold text-primary">{t.studentName}</div>
                  <div className="text-sm text-muted-foreground">{t.location} • {t.course}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* RTL Preview Feature */}
      <section className="py-20 border-t border-border bg-card overflow-hidden">
        <div className="container px-4 text-center">
          <h2 className="font-serif font-bold text-3xl mb-8">Experience The Beauty of The Language</h2>
          <div className="max-w-3xl mx-auto space-y-8">
            <div className="bg-background p-8 rounded-2xl border border-primary/10 shadow-sm">
              <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-4">Arabic Script</div>
              <p className="font-arabic text-4xl leading-relaxed text-foreground" dir="rtl">
                بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
              </p>
              <p className="text-sm text-muted-foreground mt-4">In the name of Allah, the Entirely Merciful, the Especially Merciful.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-primary text-center px-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdib3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMSI+PHBhdGggZD0iTTM2IDM0djIwaDItMjB2LTJoMjhWMzR6TTI2IDM0VjE0aC0ydjIwaC0yOFYzNHoiLz48L2c+PC9nPjwvc3ZnPg==')]"></div>
        <div className="container relative z-10 max-w-3xl mx-auto space-y-8">
          <h2 className="font-serif font-bold text-4xl lg:text-5xl text-white">Ready to begin your learning journey?</h2>
          <p className="text-xl text-primary-foreground/80">Join our upcoming batch and start learning from the comfort of your home.</p>
          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <EnrollmentModal>
              <Button className="h-14 px-10 text-lg font-serif rounded-full bg-accent text-primary hover:bg-accent/90">
                Enroll Today
              </Button>
            </EnrollmentModal>
            <Button asChild className="h-14 px-10 text-lg font-serif rounded-full bg-[#25D366] text-white hover:bg-[#128C7E]">
              <a href="https://wa.me/919315118289" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                <FaWhatsapp className="w-5 h-5" />
                Chat on WhatsApp
              </a>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

function CheckCircle2(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  )
}
