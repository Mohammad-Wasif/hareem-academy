import { Link } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminApi } from "@/lib/adminApi";
import { Button } from "@/components/ui/button";
import { Loader2, Plus, Pencil, Trash2, Star } from "lucide-react";

export default function AdminCourses() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["admin", "courses"],
    queryFn: () => adminApi.listCourses(),
  });
  const delMut = useMutation({
    mutationFn: (id: number) => adminApi.deleteCourse(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "courses"] });
      qc.invalidateQueries({ queryKey: ["/api/courses"] });
    },
  });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl text-primary font-bold">
            Courses
          </h1>
          <p className="text-muted-foreground mt-1">
            Add, edit, or remove courses shown on your website.
          </p>
        </div>
        <Link href="/admin/courses/new">
          <Button>
            <Plus className="w-4 h-4 mr-2" /> New Course
          </Button>
        </Link>
      </div>

      {isLoading ? (
        <div className="py-16 flex justify-center">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </div>
      ) : !data?.length ? (
        <div className="bg-white rounded-xl border border-border/50 p-10 text-center text-muted-foreground">
          No courses yet.
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-border/50 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-primary/5">
              <tr className="text-left text-xs uppercase tracking-wider text-muted-foreground">
                <th className="px-4 py-3 font-medium">Title</th>
                <th className="px-4 py-3 font-medium">Language</th>
                <th className="px-4 py-3 font-medium">Level</th>
                <th className="px-4 py-3 font-medium">Fee</th>
                <th className="px-4 py-3 font-medium">Duration</th>
                <th className="px-4 py-3 font-medium">Featured</th>
                <th className="px-4 py-3 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {data.map((c) => (
                <tr key={c.id} className="border-t border-border/50">
                  <td className="px-4 py-3">
                    <div className="font-medium">{c.title}</div>
                    <div className="text-xs text-muted-foreground">
                      /{c.slug}
                    </div>
                  </td>
                  <td className="px-4 py-3">{c.language}</td>
                  <td className="px-4 py-3">{c.level}</td>
                  <td className="px-4 py-3">
                    {c.currency} {c.feeMonthly}/mo
                  </td>
                  <td className="px-4 py-3">{c.durationMonths} mo</td>
                  <td className="px-4 py-3">
                    {c.featured && (
                      <Star className="w-4 h-4 fill-accent text-accent" />
                    )}
                  </td>
                  <td className="px-4 py-3 text-right space-x-1">
                    <Link href={`/admin/courses/${c.id}/edit`}>
                      <Button size="sm" variant="ghost">
                        <Pencil className="w-4 h-4" />
                      </Button>
                    </Link>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-destructive hover:text-destructive"
                      onClick={() => {
                        if (confirm(`Delete course "${c.title}"?`))
                          delMut.mutate(c.id);
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
