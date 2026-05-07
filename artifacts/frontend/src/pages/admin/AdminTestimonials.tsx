import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  adminApi,
  AdminTestimonial,
  AdminTestimonialInput,
} from "@/lib/adminApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Loader2, Plus, Pencil, Trash2, Star, Globe } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const EMPTY: AdminTestimonialInput = {
  studentName: "",
  location: "",
  course: "",
  rating: 5,
  quote: "",
  bottomText: "",
  featured: false,
  quote_ur: "",
  quote_ar: "",
  bottomText_ur: "",
  bottomText_ar: "",
};

export default function AdminTestimonials() {
  const qc = useQueryClient();
  const [editing, setEditing] = useState<AdminTestimonial | null>(null);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<AdminTestimonialInput>(EMPTY);

  const { data, isLoading } = useQuery({
    queryKey: ["admin", "testimonials"],
    queryFn: () => adminApi.listTestimonials(),
  });

  const saveMut = useMutation({
    mutationFn: () =>
      editing
        ? adminApi.updateTestimonial(editing.id, form)
        : adminApi.createTestimonial(form),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "testimonials"] });
      qc.invalidateQueries({ queryKey: ["/api/testimonials"] });
      setOpen(false);
    },
  });

  const delMut = useMutation({
    mutationFn: (id: number) => adminApi.deleteTestimonial(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "testimonials"] });
      qc.invalidateQueries({ queryKey: ["/api/testimonials"] });
    },
  });

  function openNew() {
    setEditing(null);
    setForm(EMPTY);
    setOpen(true);
  }

  function openEdit(t: AdminTestimonial) {
    setEditing(t);
    const { id: _id, ...rest } = t;
    setForm({ ...rest, location: rest.location ?? "", course: rest.course ?? "" });
    setOpen(true);
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl text-primary font-bold">
            Testimonials
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage student stories shown on your website.
          </p>
        </div>
        <Button onClick={openNew}>
          <Plus className="w-4 h-4 mr-2" /> New Testimonial
        </Button>
      </div>

      {isLoading ? (
        <div className="py-16 flex justify-center">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </div>
      ) : !data?.length ? (
        <div className="bg-white rounded-xl border border-border/50 p-10 text-center text-muted-foreground">
          No testimonials yet.
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {data.map((t) => (
            <div
              key={t.id}
              className="bg-white rounded-xl border border-border/50 p-5"
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="font-medium">{t.studentName}</div>
                  <div className="text-xs text-muted-foreground">
                    {[t.location, t.course].filter(Boolean).join(" · ")}
                  </div>
                </div>
                <div className="flex gap-1">
                  {t.featured && (
                    <Star className="w-4 h-4 fill-accent text-accent mr-1" />
                  )}
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => openEdit(t)}
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-destructive hover:text-destructive"
                    onClick={() => {
                      if (confirm(`Delete testimonial from ${t.studentName}?`))
                        delMut.mutate(t.id);
                    }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <div className="flex mb-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${i < t.rating ? "fill-accent text-accent" : "text-muted-foreground/30"}`}
                  />
                ))}
              </div>
              <p className="text-sm text-foreground/80">"{t.quote}"</p>
            </div>
          ))}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-serif text-primary">
              {editing ? "Edit Testimonial" : "New Testimonial"}
            </DialogTitle>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              saveMut.mutate();
            }}
            className="space-y-4"
          >
            <div className="space-y-2">
              <Label>Student Name</Label>
              <Input
                value={form.studentName}
                onChange={(e) =>
                  setForm({ ...form, studentName: e.target.value })
                }
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Location</Label>
                <Input
                  value={form.location ?? ""}
                  onChange={(e) =>
                    setForm({ ...form, location: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Course</Label>
                <Input
                  value={form.course ?? ""}
                  onChange={(e) =>
                    setForm({ ...form, course: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Rating (1–5)</Label>
              <Input
                type="number"
                min={1}
                max={5}
                value={form.rating}
                onChange={(e) =>
                  setForm({ ...form, rating: Number(e.target.value) })
                }
              />
            </div>
            <Tabs defaultValue="en" className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger value="en">English</TabsTrigger>
                <TabsTrigger value="ur">Urdu</TabsTrigger>
                <TabsTrigger value="ar">Arabic</TabsTrigger>
              </TabsList>

              <TabsContent value="en" className="space-y-4 mt-0">
                <div className="space-y-2">
                  <Label>Quote</Label>
                  <Textarea
                    value={form.quote}
                    rows={4}
                    onChange={(e) => setForm({ ...form, quote: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Bottom Text (Highlight/Tagline)</Label>
                  <Input
                    value={form.bottomText || ""}
                    onChange={(e) => setForm({ ...form, bottomText: e.target.value })}
                    placeholder="e.g. The lessons are detailed without ever feeling overwhelming."
                  />
                </div>
              </TabsContent>

              <TabsContent value="ur" className="space-y-4 mt-0" dir="rtl">
                <div className="space-y-2">
                  <Label>تاثرات (Urdu Quote)</Label>
                  <Textarea
                    value={form.quote_ur || ""}
                    rows={4}
                    onChange={(e) => setForm({ ...form, quote_ur: e.target.value })}
                    className="font-arabic text-right"
                  />
                </div>
                <div className="space-y-2">
                  <Label>نمایاں جملہ (Urdu Bottom Text)</Label>
                  <Input
                    value={form.bottomText_ur || ""}
                    onChange={(e) => setForm({ ...form, bottomText_ur: e.target.value })}
                    className="font-arabic text-right"
                  />
                </div>
              </TabsContent>

              <TabsContent value="ar" className="space-y-4 mt-0" dir="rtl">
                <div className="space-y-2">
                  <Label>رأي الطالبة (Arabic Quote)</Label>
                  <Textarea
                    value={form.quote_ar || ""}
                    rows={4}
                    onChange={(e) => setForm({ ...form, quote_ar: e.target.value })}
                    className="font-arabic text-right"
                  />
                </div>
                <div className="space-y-2">
                  <Label>نص مميز (Arabic Bottom Text)</Label>
                  <Input
                    value={form.bottomText_ar || ""}
                    onChange={(e) => setForm({ ...form, bottomText_ar: e.target.value })}
                    className="font-arabic text-right"
                  />
                </div>
              </TabsContent>
            </Tabs>
            <div className="flex items-center gap-3">
              <Switch
                checked={form.featured}
                onCheckedChange={(v) => setForm({ ...form, featured: v })}
              />
              <Label className="!m-0">Featured</Label>
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
