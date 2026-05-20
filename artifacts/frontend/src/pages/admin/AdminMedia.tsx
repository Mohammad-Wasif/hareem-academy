import { useState } from "react";
import { useSiteAssets } from "@/hooks/use-site-assets";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Loader2, Upload, CheckCircle2, CloudLightning } from "lucide-react";
import { toast } from "sonner";

const MEDIA_SLOTS = [
  {
    key: "hero_bg",
    name: "Hero Background Image",
    description: "The background pattern displayed in the hero section at the top of the homepage.",
    fallback: "/hero-bg.png",
    aspectRatio: "aspect-[16/9] w-full max-w-sm rounded-lg object-cover border border-border/50",
  },
  {
    key: "teacher_1",
    name: "Ustadha Fatima Portrait",
    description: "Headshot portrait image for Ustadha Fatima (Head of Arabic) on the About page.",
    fallback: "/teacher-1.png",
    aspectRatio: "aspect-[1/1] w-28 h-28 rounded-full object-cover border border-border/50",
  },
  {
    key: "teacher_2",
    name: "Ustadha Ayesha Portrait",
    description: "Headshot portrait image for Ustadha Ayesha (Senior Urdu Instructor) on the About page.",
    fallback: "/teacher-2.png",
    aspectRatio: "aspect-[1/1] w-28 h-28 rounded-full object-cover border border-border/50",
  },
  {
    key: "teacher_3",
    name: "Ustadha Zainab Portrait",
    description: "Headshot portrait image for Ustadha Zainab (Arabic & Tajweed Instructor) on the About page.",
    fallback: "/teacher-3.png",
    aspectRatio: "aspect-[1/1] w-28 h-28 rounded-full object-cover border border-border/50",
  },
];

export default function AdminMedia() {
  const { assets, isLoading, refetch } = useSiteAssets();
  const [uploadingKeys, setUploadingKeys] = useState<Record<string, boolean>>({});

  const handleFileUpload = async (key: string, file: File) => {
    if (!file) return;

    setUploadingKeys(prev => ({ ...prev, [key]: true }));

    const formData = new FormData();
    formData.append("key", key);
    formData.append("file", file);

    try {
      const baseUrl = import.meta.env.VITE_API_URL || "";
      const response = await fetch(`${baseUrl}/api/admin/site-assets`, {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || "Failed to upload image");
      }

      toast.success("Image uploaded and optimized successfully!");
      refetch();
    } catch (error: any) {
      console.error("Upload error:", error);
      toast.error(error.message || "Failed to upload file");
    } finally {
      setUploadingKeys(prev => ({ ...prev, [key]: false }));
    }
  };

  if (isLoading) {
    return (
      <div className="py-16 flex justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20">
      {/* Top sticky bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 sticky top-0 z-10 bg-[#FAF7F0]/80 backdrop-blur-md py-4 border-b border-border/20">
        <div>
          <h1 className="font-serif text-3xl text-primary font-bold">Media Manager</h1>
          <p className="text-muted-foreground mt-1">
            Replace and optimize core landing page backgrounds and teacher profile pictures in real-time.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-emerald-50 text-emerald-700 px-4 py-2 rounded-full border border-emerald-100 text-sm font-semibold">
          <CloudLightning className="w-4 h-4 text-emerald-600 animate-pulse" />
          Cloudinary CDN Active
        </div>
      </div>

      {/* Grid of media slots */}
      <div className="grid gap-6 md:grid-cols-2">
        {MEDIA_SLOTS.map(slot => {
          const activeUrl = assets[slot.key];
          const isUploaded = !!activeUrl;
          const currentSrc = activeUrl || slot.fallback;
          const isUploading = uploadingKeys[slot.key];

          return (
            <Card key={slot.key} className="border-border/50 bg-white hover:shadow-md transition-all">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="font-serif text-xl text-primary">{slot.name}</CardTitle>
                  {isUploaded ? (
                    <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full uppercase font-bold tracking-wider flex items-center gap-1 border border-emerald-200">
                      <CheckCircle2 className="w-3 h-3" />
                      Dynamic CDN
                    </span>
                  ) : (
                    <span className="text-[10px] bg-muted text-muted-foreground px-2 py-0.5 rounded-full uppercase font-bold tracking-wider border border-border/30">
                      Default Static
                    </span>
                  )}
                </div>
                <CardDescription className="text-sm mt-1.5">{slot.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Visual Preview */}
                <div className="flex flex-col items-center justify-center p-6 bg-[#FAF7F0]/40 rounded-xl border border-border/30 min-h-[160px]">
                  <img
                    src={currentSrc}
                    alt={slot.name}
                    className={slot.aspectRatio}
                  />
                  <div className="text-[10px] text-muted-foreground font-mono mt-3 text-center max-w-[280px] break-all truncate">
                    {isUploaded ? activeUrl : `Local fallback: ${slot.fallback}`}
                  </div>
                </div>

                {/* Upload Action */}
                <div className="space-y-2">
                  <Label htmlFor={`file-input-${slot.key}`} className="text-xs uppercase tracking-wider text-muted-foreground font-bold">
                    Upload New Image
                  </Label>
                  <div className="flex items-center gap-3">
                    <input
                      type="file"
                      id={`file-input-${slot.key}`}
                      accept="image/*"
                      className="hidden"
                      onChange={e => {
                        const file = e.target.files?.[0];
                        if (file) handleFileUpload(slot.key, file);
                      }}
                      disabled={isUploading}
                    />
                    <Button
                      variant="outline"
                      className="w-full h-11 border-dashed border-border/60 hover:border-primary hover:bg-primary/5 transition-all text-sm font-semibold flex items-center justify-center gap-2"
                      onClick={() => document.getElementById(`file-input-${slot.key}`)?.click()}
                      disabled={isUploading}
                    >
                      {isUploading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin text-primary" />
                          Uploading & Compressing...
                        </>
                      ) : (
                        <>
                          <Upload className="w-4 h-4 text-primary" />
                          Select New Image file
                        </>
                      )}
                    </Button>
                  </div>
                  <p className="text-[10px] text-muted-foreground leading-relaxed">
                    Uploaded images are automatically processed by Cloudinary CDN, delivering responsive formatting, auto WebP/AVIF translation (<code className="text-primary font-mono font-bold">f_auto</code>), and high-fidelity compression (<code className="text-primary font-mono font-bold">q_auto</code>).
                  </p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
