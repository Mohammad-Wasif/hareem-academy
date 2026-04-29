import { useParams } from "wouter";
import { useGetCourse } from "@workspace/api-client-react";
import { getGetCourseQueryKey } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import EnrollmentModal from "@/components/EnrollmentModal";
import NotFound from "./not-found";
import { Clock, GraduationCap, Video, Users, CheckCircle2, Calendar } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";

export default function CourseDetail() {
  const params = useParams();
  const slug = params.slug || "";
  
  const { data: course, isLoading, isError } = useGetCourse(slug, {
    query: {
      enabled: !!slug,
      queryKey: getGetCourseQueryKey(slug)
    }
  });

  if (isLoading) return (
    <div className="container mx-auto px-4 py-20 space-y-8">
      <Skeleton className="h-12 w-1/2" />
      <Skeleton className="h-6 w-1/3" />
      <Skeleton className="h-64 w-full rounded-3xl" />
    </div>
  );

  if (isError || !course) return <NotFound />;

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Hero Header */}
      <div className="bg-primary text-primary-foreground py-16 lg:py-24">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="inline-block px-3 py-1 bg-accent/20 text-accent font-bold text-xs uppercase tracking-widest rounded mb-6">
            {course.language} COURSE
          </div>
          <h1 className="font-serif font-bold text-4xl md:text-6xl mb-6 text-white">{course.title}</h1>
          <p className="text-xl md:text-2xl text-primary-foreground/80 max-w-3xl leading-relaxed mb-8">
            {course.summary}
          </p>
          
          <div className="flex flex-wrap gap-4 items-center border-t border-primary-foreground/10 pt-8 mt-8">
            <EnrollmentModal defaultCourseSlug={course.slug}>
              <Button className="h-14 px-8 text-lg font-serif rounded-full bg-accent text-primary hover:bg-accent/90">
                Enroll Now
              </Button>
            </EnrollmentModal>
            <div className="font-serif font-bold text-2xl ml-4">
              {course.currency} {course.feeMonthly} <span className="text-sm font-sans font-normal opacity-70">/ month</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-5xl -mt-8 relative z-10">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="md:col-span-2 space-y-12 bg-card p-8 rounded-3xl border border-border shadow-sm">
            
            <section>
              <h2 className="font-serif font-bold text-3xl text-primary mb-6">What You'll Learn</h2>
              <ul className="space-y-4">
                {course.highlights.map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 text-accent shrink-0 mt-0.5" />
                    <span className="text-lg text-foreground/80 leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            <hr className="border-border" />

            <section>
              <h2 className="font-serif font-bold text-3xl text-primary mb-6">Curriculum</h2>
              <div className="space-y-6">
                {course.curriculum.map((module, i) => (
                  <div key={i} className="flex gap-6">
                    <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold font-serif shrink-0">
                      {i + 1}
                    </div>
                    <div>
                      <h3 className="font-bold text-xl mb-2">{module.title}</h3>
                      {module.description && (
                        <p className="text-muted-foreground">{module.description}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
            
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-card p-6 rounded-3xl border border-border shadow-sm space-y-6">
              <h3 className="font-serif font-bold text-2xl text-primary mb-4">Course Details</h3>
              
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-bold text-sm">Duration</div>
                    <div className="text-muted-foreground">{course.durationMonths} Months</div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-bold text-sm">Timings</div>
                    <div className="text-muted-foreground">{course.timings}</div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <Video className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-bold text-sm">Platform</div>
                    <div className="text-muted-foreground">Live on {course.platform}</div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <GraduationCap className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-bold text-sm">Level</div>
                    <div className="text-muted-foreground">{course.level}</div>
                  </div>
                </div>

                {course.forWhom && (
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                      <Users className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-bold text-sm">For Whom</div>
                      <div className="text-muted-foreground">{course.forWhom}</div>
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-6 border-t border-border mt-6">
                <div className="text-sm font-bold mb-2">Seats Remaining</div>
                <div className="text-primary font-serif text-2xl">{course.seatsRemaining || "Limited"}</div>
              </div>
            </div>

            <div className="bg-primary/5 p-6 rounded-3xl border border-primary/10 text-center">
              <h3 className="font-bold mb-2">Have Questions?</h3>
              <p className="text-sm text-muted-foreground mb-4">Speak directly with a teacher on WhatsApp to see if this course is right for you.</p>
              <Button variant="outline" className="w-full rounded-full border-primary/20 text-primary bg-white" asChild>
                <a href="https://wa.me/919315118289" target="_blank" rel="noopener noreferrer">
                  <FaWhatsapp className="w-4 h-4 mr-2 text-[#25D366]" /> Chat With Us
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
