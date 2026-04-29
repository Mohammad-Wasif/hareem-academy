import { useState } from "react";
import { useListCourses } from "@workspace/api-client-react";
import CourseCard from "@/components/CourseCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

export default function Courses() {
  const { data: courses = [], isLoading } = useListCourses();
  const [filter, setFilter] = useState<"all" | "arabic" | "urdu">("all");

  const filteredCourses = courses.filter(
    course => filter === "all" || course.language === filter
  );

  return (
    <div className="min-h-screen bg-background pt-8 pb-24">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-6">
          <h1 className="font-serif font-bold text-5xl text-primary">Our Courses</h1>
          <p className="text-lg text-muted-foreground">
            Structured programs designed to take you from absolute beginner to confident reader. All classes are live, interactive, and exclusively for sisters.
          </p>
          
          <div className="flex justify-center gap-2 pt-4">
            <Button 
              variant={filter === "all" ? "default" : "outline"} 
              onClick={() => setFilter("all")}
              className="rounded-full"
            >
              All Courses
            </Button>
            <Button 
              variant={filter === "arabic" ? "default" : "outline"} 
              onClick={() => setFilter("arabic")}
              className="rounded-full"
            >
              Arabic
            </Button>
            <Button 
              variant={filter === "urdu" ? "default" : "outline"} 
              onClick={() => setFilter("urdu")}
              className="rounded-full"
            >
              Urdu
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map(i => (
              <div key={i} className="space-y-4">
                <Skeleton className="h-48 w-full rounded-2xl" />
                <Skeleton className="h-8 w-2/3" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-4/5" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCourses.map(course => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        )}
        
        {!isLoading && filteredCourses.length === 0 && (
          <div className="text-center py-20 text-muted-foreground border border-dashed border-border rounded-2xl">
            No courses found for the selected filter.
          </div>
        )}
      </div>
    </div>
  );
}
