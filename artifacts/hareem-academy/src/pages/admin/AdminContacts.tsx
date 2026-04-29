import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminApi } from "@/lib/adminApi";
import { Button } from "@/components/ui/button";
import { Loader2, Trash2 } from "lucide-react";

export default function AdminContacts() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["admin", "contacts"],
    queryFn: () => adminApi.listContacts(),
  });
  const delMut = useMutation({
    mutationFn: (id: number) => adminApi.deleteContact(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "contacts"] }),
  });

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-serif text-3xl text-primary font-bold">Messages</h1>
        <p className="text-muted-foreground mt-1">
          {data?.length ?? 0} contact form message
          {data?.length === 1 ? "" : "s"}
        </p>
      </div>

      {isLoading ? (
        <div className="py-16 flex justify-center">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </div>
      ) : !data?.length ? (
        <div className="bg-white rounded-xl border border-border/50 p-10 text-center text-muted-foreground">
          No messages yet.
        </div>
      ) : (
        <div className="space-y-4">
          {data.map((m) => (
            <div
              key={m.id}
              className="bg-white rounded-xl border border-border/50 p-5"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="font-medium">{m.fullName}</div>
                  <div className="text-xs text-muted-foreground mt-0.5 space-x-3">
                    {m.email && <span>{m.email}</span>}
                    {m.whatsappNumber && <span>{m.whatsappNumber}</span>}
                    <span>{new Date(m.createdAt).toLocaleString()}</span>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-destructive hover:text-destructive"
                  onClick={() => {
                    if (confirm(`Delete message from ${m.fullName}?`))
                      delMut.mutate(m.id);
                  }}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
              {m.subject && (
                <div className="text-sm font-medium mb-1">{m.subject}</div>
              )}
              <p className="text-sm text-foreground/80 whitespace-pre-wrap">
                {m.message}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
