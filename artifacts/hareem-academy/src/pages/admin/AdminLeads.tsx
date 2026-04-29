import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminApi } from "@/lib/adminApi";
import { Button } from "@/components/ui/button";
import { Loader2, Trash2, ExternalLink } from "lucide-react";

export default function AdminLeads() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["admin", "leads"],
    queryFn: () => adminApi.listLeads(),
  });
  const delMut = useMutation({
    mutationFn: (id: number) => adminApi.deleteLead(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "leads"] }),
  });

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-serif text-3xl text-primary font-bold">Leads</h1>
        <p className="text-muted-foreground mt-1">
          {data?.length ?? 0} lead{data?.length === 1 ? "" : "s"} captured
        </p>
      </div>

      {isLoading ? (
        <div className="py-16 flex justify-center">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </div>
      ) : !data?.length ? (
        <div className="bg-white rounded-xl border border-border/50 p-10 text-center text-muted-foreground">
          No leads yet.
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-border/50 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-primary/5">
              <tr className="text-left text-xs uppercase tracking-wider text-muted-foreground">
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">WhatsApp</th>
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3 font-medium">Source</th>
                <th className="px-4 py-3 font-medium">Date</th>
                <th className="px-4 py-3 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {data.map((l) => (
                <tr key={l.id} className="border-t border-border/50">
                  <td className="px-4 py-3 font-medium">
                    {l.fullName ?? "—"}
                  </td>
                  <td className="px-4 py-3">
                    <a
                      href={`https://wa.me/${l.whatsappNumber.replace(/\D/g, "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline inline-flex items-center gap-1"
                    >
                      {l.whatsappNumber}
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </td>
                  <td className="px-4 py-3">{l.email ?? "—"}</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 bg-accent/20 text-foreground/80 rounded text-xs">
                      {l.source}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {new Date(l.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-destructive hover:text-destructive"
                      onClick={() => {
                        if (confirm("Delete this lead?")) delMut.mutate(l.id);
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
