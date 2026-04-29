import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminApi } from "@/lib/adminApi";
import { Button } from "@/components/ui/button";
import { Loader2, Trash2, ExternalLink } from "lucide-react";

export default function AdminEnrollments() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["admin", "enrollments"],
    queryFn: () => adminApi.listEnrollments(),
  });
  const delMut = useMutation({
    mutationFn: (id: number) => adminApi.deleteEnrollment(id),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: ["admin", "enrollments"] }),
  });

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-serif text-3xl text-primary font-bold">
          Enrollments
        </h1>
        <p className="text-muted-foreground mt-1">
          {data?.length ?? 0} total enrollment{data?.length === 1 ? "" : "s"}
        </p>
      </div>

      {isLoading ? (
        <div className="py-16 flex justify-center">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </div>
      ) : !data?.length ? (
        <div className="bg-white rounded-xl border border-border/50 p-10 text-center text-muted-foreground">
          No enrollments yet.
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-border/50 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-primary/5">
              <tr className="text-left text-xs uppercase tracking-wider text-muted-foreground">
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Age</th>
                <th className="px-4 py-3 font-medium">WhatsApp</th>
                <th className="px-4 py-3 font-medium">Location</th>
                <th className="px-4 py-3 font-medium">Course</th>
                <th className="px-4 py-3 font-medium">Date</th>
                <th className="px-4 py-3 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {data.map((e) => (
                <tr key={e.id} className="border-t border-border/50">
                  <td className="px-4 py-3 font-medium">{e.fullName}</td>
                  <td className="px-4 py-3">{e.age}</td>
                  <td className="px-4 py-3">
                    <a
                      href={`https://wa.me/${e.whatsappNumber.replace(/\D/g, "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline inline-flex items-center gap-1"
                    >
                      {e.whatsappNumber}
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </td>
                  <td className="px-4 py-3">
                    {e.city}
                    {e.country ? `, ${e.country}` : ""}
                  </td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 bg-accent/20 text-foreground/80 rounded text-xs">
                      {e.courseSlug}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {new Date(e.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-destructive hover:text-destructive"
                      onClick={() => {
                        if (confirm(`Delete enrollment from ${e.fullName}?`))
                          delMut.mutate(e.id);
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
