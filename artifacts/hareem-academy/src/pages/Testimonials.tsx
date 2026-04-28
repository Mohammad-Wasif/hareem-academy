import { useListTestimonials } from "@workspace/api-client-react";
import { Star } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function Testimonials() {
  const { data: testimonials = [], isLoading } = useListTestimonials();

  return (
    <div className="min-h-screen bg-background pt-8 pb-24">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-6">
          <h1 className="font-serif font-bold text-5xl text-primary">Student Stories</h1>
          <p className="text-lg text-muted-foreground">
            Alhamdulillah, hundreds of sisters have transformed their relationship with the Quran and Arabic through our academy. Read their experiences below.
          </p>
        </div>

        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <Skeleton key={i} className="h-64 w-full rounded-2xl" />
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map(t => (
              <div key={t.id} className="bg-card p-8 rounded-2xl border border-border hover:border-primary/30 transition-colors flex flex-col h-full">
                <div className="flex gap-1 mb-6 text-accent">
                  {[...Array(t.rating)].map((_, i) => <Star key={i} className="w-5 h-5 fill-current" />)}
                </div>
                <blockquote className="text-lg text-foreground mb-8 font-serif italic flex-grow">
                  "{t.quote}"
                </blockquote>
                <div className="mt-auto border-t border-border pt-4">
                  <div className="font-bold text-primary">{t.studentName}</div>
                  <div className="text-sm text-muted-foreground">{t.location} {t.course && `• ${t.course}`}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
