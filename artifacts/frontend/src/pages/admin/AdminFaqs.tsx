import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminApi, AdminFaq, AdminFaqInput } from "@/lib/adminApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Plus, Pencil, Trash2 } from "lucide-react";

const EMPTY: AdminFaqInput = {
  question: "",
  question_ur: "",
  question_ar: "",
  answer: "",
  answer_ur: "",
  answer_ar: "",
  category: "",
  sortOrder: 0,
};

export default function AdminFaqs() {
  const qc = useQueryClient();
  const [editing, setEditing] = useState<AdminFaq | null>(null);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<AdminFaqInput>(EMPTY);

  const { data, isLoading } = useQuery({
    queryKey: ["admin", "faqs"],
    queryFn: () => adminApi.listFaqs(),
  });

  const saveMut = useMutation({
    mutationFn: () =>
      editing
        ? adminApi.updateFaq(editing.id, form)
        : adminApi.createFaq(form),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "faqs"] });
      qc.invalidateQueries({ queryKey: ["/api/faqs"] });
      setOpen(false);
    },
  });

  const delMut = useMutation({
    mutationFn: (id: number) => adminApi.deleteFaq(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "faqs"] });
      qc.invalidateQueries({ queryKey: ["/api/faqs"] });
    },
  });

  function openNew() {
    setEditing(null);
    setForm({ ...EMPTY, sortOrder: (data?.length ?? 0) + 1 });
    setOpen(true);
  }

  function openEdit(f: AdminFaq) {
    setEditing(f);
    const { id: _id, ...rest } = f;
    setForm({
      ...rest,
      category: rest.category ?? "",
      question_ur: rest.question_ur ?? "",
      question_ar: rest.question_ar ?? "",
      answer_ur: rest.answer_ur ?? "",
      answer_ar: rest.answer_ar ?? "",
    });
    setOpen(true);
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl text-primary font-bold">FAQs</h1>
          <p className="text-muted-foreground mt-1">
            Manage frequently asked questions on the Contact page.
          </p>
        </div>
        <Button onClick={openNew}>
          <Plus className="w-4 h-4 mr-2" /> New FAQ
        </Button>
      </div>

      {isLoading ? (
        <div className="py-16 flex justify-center">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </div>
      ) : !data?.length ? (
        <div className="bg-white rounded-xl border border-border/50 p-10 text-center text-muted-foreground">
          No FAQs yet.
        </div>
      ) : (
        <div className="space-y-3">
          {data.map((f) => (
            <div
              key={f.id}
              className="bg-white rounded-xl border border-border/50 p-5"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="text-xs text-muted-foreground mb-1">
                    #{f.sortOrder}
                    {f.category ? ` · ${f.category}` : ""}
                  </div>
                  <div className="font-medium mb-1">{f.question}</div>
                  <p className="text-sm text-foreground/70">{f.answer}</p>
                </div>
                <div className="flex gap-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => openEdit(f)}
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-destructive hover:text-destructive"
                    onClick={() => {
                      if (confirm("Delete this FAQ?")) delMut.mutate(f.id);
                    }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-serif text-primary">
              {editing ? "Edit FAQ" : "New FAQ"}
            </DialogTitle>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              saveMut.mutate();
            }}
            className="space-y-4"
          >
            <Tabs defaultValue="en" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-4">
                <TabsTrigger value="en">English</TabsTrigger>
                <TabsTrigger value="ur">اردو (Urdu)</TabsTrigger>
                <TabsTrigger value="ar">العربية (Arabic)</TabsTrigger>
              </TabsList>

              <TabsContent value="en" className="space-y-4">
                <div className="space-y-2">
                  <Label>Question (English)</Label>
                  <Input
                    value={form.question}
                    onChange={(e) =>
                      setForm({ ...form, question: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Answer (English)</Label>
                  <Textarea
                    value={form.answer}
                    rows={4}
                    onChange={(e) => setForm({ ...form, answer: e.target.value })}
                    required
                  />
                </div>
              </TabsContent>

              <TabsContent value="ur" className="space-y-4">
                <div className="space-y-2">
                  <Label className="block text-right font-urdu">سوال (Urdu)</Label>
                  <Input
                    className="text-right font-urdu"
                    dir="rtl"
                    value={form.question_ur ?? ""}
                    onChange={(e) =>
                      setForm({ ...form, question_ur: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label className="block text-right font-urdu">جواب (Urdu)</Label>
                  <Textarea
                    className="text-right font-urdu min-h-[100px]"
                    dir="rtl"
                    value={form.answer_ur ?? ""}
                    onChange={(e) =>
                      setForm({ ...form, answer_ur: e.target.value })
                    }
                  />
                </div>
              </TabsContent>

              <TabsContent value="ar" className="space-y-4">
                <div className="space-y-2">
                  <Label className="block text-right font-serif">السؤال (Arabic)</Label>
                  <Input
                    className="text-right font-serif"
                    dir="rtl"
                    value={form.question_ar ?? ""}
                    onChange={(e) =>
                      setForm({ ...form, question_ar: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label className="block text-right font-serif">الإجابة (Arabic)</Label>
                  <Textarea
                    className="text-right font-serif min-h-[100px]"
                    dir="rtl"
                    value={form.answer_ar ?? ""}
                    onChange={(e) =>
                      setForm({ ...form, answer_ar: e.target.value })
                    }
                  />
                </div>
              </TabsContent>
            </Tabs>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="space-y-2">
                <Label>Category (optional)</Label>
                <Input
                  value={form.category ?? ""}
                  onChange={(e) =>
                    setForm({ ...form, category: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Sort Order</Label>
                <Input
                  type="number"
                  value={form.sortOrder}
                  onChange={(e) =>
                    setForm({ ...form, sortOrder: Number(e.target.value) })
                  }
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={saveMut.isPending}>
                {saveMut.isPending && (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                )}
                Save
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
