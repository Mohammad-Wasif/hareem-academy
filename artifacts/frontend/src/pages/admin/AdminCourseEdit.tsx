import { useEffect, useState } from "react";
import { useLocation, useRoute } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminApi, AdminCourseInput } from "@/lib/adminApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Loader2, Plus, X, ArrowLeft, Globe } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const EMPTY: AdminCourseInput = {
  slug: "",
  title: "",
  language: "Arabic",
  level: "Beginner",
  durationMonths: 6,
  timings: "Mon–Fri, 8:00–9:30 PM IST",
  platform: "Zoom",
  feeMonthly: 1000,
  currency: "INR",
  startDate: "",
  summary: "",
  highlights: [],
  curriculum: [],
  forWhom: "",
  seatsRemaining: null,
  featured: false,
  title_ur: "",
  summary_ur: "",
  timings_ur: "",
  title_ar: "",
  summary_ar: "",
  timings_ar: "",
};

export default function AdminCourseEdit() {
  const [, setLocation] = useLocation();
  const [, params] = useRoute("/admin/courses/:id/edit");
  const isEditing = !!params?.id;
  const courseId = params?.id ? Number(params.id) : null;
  const qc = useQueryClient();

  const { data: existing, isLoading } = useQuery({
    queryKey: ["admin", "courses", courseId],
    queryFn: () => adminApi.getCourse(courseId!),
    enabled: isEditing,
  });

  const [form, setForm] = useState<AdminCourseInput>(EMPTY);

  useEffect(() => {
    if (existing) {
      const { id: _id, ...rest } = existing;
      setForm({ ...rest, startDate: rest.startDate ?? "" });
    }
  }, [existing]);

  const saveMut = useMutation({
    mutationFn: () =>
      isEditing
        ? adminApi.updateCourse(courseId!, form)
        : adminApi.createCourse(form),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "courses"] });
      qc.invalidateQueries({ queryKey: ["/api/courses"] });
      setLocation("/admin/courses");
    },
  });

  const update = <K extends keyof AdminCourseInput>(
    key: K,
    value: AdminCourseInput[K],
  ) => setForm((f) => ({ ...f, [key]: value }));

  if (isEditing && isLoading) {
    return (
      <div className="py-16 flex justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div>
      <Button
        variant="ghost"
        className="mb-4 -ml-3"
        onClick={() => setLocation("/admin/courses")}
      >
        <ArrowLeft className="w-4 h-4 mr-2" /> Back
      </Button>

      <div className="mb-6">
        <h1 className="font-serif text-3xl text-primary font-bold">
          {isEditing ? "Edit Course" : "New Course"}
        </h1>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          saveMut.mutate();
        }}
        className="space-y-6 bg-white rounded-xl border border-border/50 p-6"
      >
        <Tabs defaultValue="en" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="en">English (Default)</TabsTrigger>
            <TabsTrigger value="ur">Urdu (اردو)</TabsTrigger>
            <TabsTrigger value="ar">Arabic (العربية)</TabsTrigger>
          </TabsList>

          <TabsContent value="en" className="space-y-6 mt-0">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Title</Label>
                <Input
                  value={form.title}
                  onChange={(e) => update("title", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Slug (URL identifier)</Label>
                <Input
                  value={form.slug}
                  onChange={(e) => update("slug", e.target.value)}
                  placeholder="basic-arabic"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Summary</Label>
              <Textarea
                value={form.summary}
                rows={3}
                onChange={(e) => update("summary", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Timings</Label>
              <Input
                value={form.timings}
                onChange={(e) => update("timings", e.target.value)}
              />
            </div>
          </TabsContent>

          <TabsContent value="ur" className="space-y-6 mt-0" dir="rtl">
            <div className="space-y-2">
              <Label>کورس کا نام (Title in Urdu)</Label>
              <Input
                value={form.title_ur || ""}
                onChange={(e) => update("title_ur", e.target.value)}
                className="font-arabic text-right"
              />
            </div>
            <div className="space-y-2">
              <Label>مختصر تعارف (Summary in Urdu)</Label>
              <Textarea
                value={form.summary_ur || ""}
                rows={3}
                onChange={(e) => update("summary_ur", e.target.value)}
                className="font-arabic text-right"
              />
            </div>
            <div className="space-y-2">
              <Label>اوقات (Timings in Urdu)</Label>
              <Input
                value={form.timings_ur || ""}
                onChange={(e) => update("timings_ur", e.target.value)}
                className="font-arabic text-right"
              />
            </div>
          </TabsContent>

          <TabsContent value="ar" className="space-y-6 mt-0" dir="rtl">
            <div className="space-y-2">
              <Label>اسم الدورة (Title in Arabic)</Label>
              <Input
                value={form.title_ar || ""}
                onChange={(e) => update("title_ar", e.target.value)}
                className="font-arabic text-right"
              />
            </div>
            <div className="space-y-2">
              <Label>ملخص الدورة (Summary in Arabic)</Label>
              <Textarea
                value={form.summary_ar || ""}
                rows={3}
                onChange={(e) => update("summary_ar", e.target.value)}
                className="font-arabic text-right"
              />
            </div>
            <div className="space-y-2">
              <Label>الأوقات (Timings in Arabic)</Label>
              <Input
                value={form.timings_ar || ""}
                onChange={(e) => update("timings_ar", e.target.value)}
                className="font-arabic text-right"
              />
            </div>
          </TabsContent>
        </Tabs>

        <div className="border-t border-border/50 pt-6 space-y-6">
          <h3 className="font-medium flex items-center gap-2">
            <Globe className="w-4 h-4 text-primary" />
            General Information
          </h3>

        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label>Language</Label>
            <Input
              value={form.language}
              onChange={(e) => update("language", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Level</Label>
            <Input
              value={form.level}
              onChange={(e) => update("level", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Duration (months)</Label>
            <Input
              type="number"
              value={form.durationMonths}
              onChange={(e) =>
                update("durationMonths", Number(e.target.value))
              }
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Platform</Label>
            <Input
              value={form.platform}
              onChange={(e) => update("platform", e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label>Fee (per month)</Label>
            <Input
              type="number"
              value={form.feeMonthly}
              onChange={(e) => update("feeMonthly", Number(e.target.value))}
            />
          </div>
          <div className="space-y-2">
            <Label>Currency</Label>
            <Input
              value={form.currency}
              onChange={(e) => update("currency", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Seats Remaining (optional)</Label>
            <Input
              type="number"
              value={form.seatsRemaining ?? ""}
              onChange={(e) =>
                update(
                  "seatsRemaining",
                  e.target.value === "" ? null : Number(e.target.value),
                )
              }
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Start Date (display text, optional)</Label>
          <Input
            value={form.startDate ?? ""}
            onChange={(e) => update("startDate", e.target.value)}
            placeholder="e.g. 1st of every month"
          />
        </div>

        <div className="space-y-2">
          <Label>Summary (Internal/English fallback)</Label>
          <Textarea
            value={form.summary}
            rows={2}
            onChange={(e) => update("summary", e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label>For Whom (optional)</Label>
          <Textarea
            value={form.forWhom ?? ""}
            rows={2}
            onChange={(e) => update("forWhom", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label className="flex items-center justify-between">
            Highlights / Bullet Points
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => update("highlights", [...form.highlights, ""])}
            >
              <Plus className="w-3 h-3 mr-1" /> Add
            </Button>
          </Label>
          <div className="space-y-2">
            {form.highlights.map((h, i) => (
              <div key={i} className="flex gap-2">
                <Input
                  value={h}
                  onChange={(e) => {
                    const next = [...form.highlights];
                    next[i] = e.target.value;
                    update("highlights", next);
                  }}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() =>
                    update(
                      "highlights",
                      form.highlights.filter((_, idx) => idx !== i),
                    )
                  }
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label className="flex items-center justify-between">
            Curriculum Modules
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() =>
                update("curriculum", [
                  ...form.curriculum,
                  { title: "", description: "" },
                ])
              }
            >
              <Plus className="w-3 h-3 mr-1" /> Add Module
            </Button>
          </Label>
          <div className="space-y-3">
            {form.curriculum.map((m, i) => (
              <div
                key={i}
                className="border border-border/50 rounded-lg p-3 space-y-2"
              >
                <div className="flex gap-2 items-start">
                  <div className="flex-1 space-y-2">
                    <Input
                      value={m.title}
                      placeholder="Module title"
                      onChange={(e) => {
                        const next = [...form.curriculum];
                        next[i] = { ...next[i]!, title: e.target.value };
                        update("curriculum", next);
                      }}
                    />
                    <Textarea
                      value={m.description ?? ""}
                      rows={2}
                      placeholder="Description (optional)"
                      onChange={(e) => {
                        const next = [...form.curriculum];
                        next[i] = {
                          ...next[i]!,
                          description: e.target.value,
                        };
                        update("curriculum", next);
                      }}
                    />
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() =>
                      update(
                        "curriculum",
                        form.curriculum.filter((_, idx) => idx !== i),
                      )
                    }
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Switch
            checked={form.featured}
            onCheckedChange={(v) => update("featured", v)}
          />
          <Label className="!m-0">Featured course (shown on homepage)</Label>
        </div>

        <div className="flex gap-3 pt-4 border-t border-border/50">
          <Button type="submit" disabled={saveMut.isPending}>
            {saveMut.isPending ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : null}
            {isEditing ? "Save Changes" : "Create Course"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => setLocation("/admin/courses")}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
