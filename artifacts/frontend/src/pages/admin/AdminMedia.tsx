import { useState, useEffect } from "react";
import { useSiteAssets } from "@/hooks/use-site-assets";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Loader2,
  Upload,
  CheckCircle2,
  CloudLightning,
  AlertCircle,
  Trash2,
  RefreshCw,
  FileImage,
  Check,
  Calendar,
  Layers,
  Image as ImageIcon
} from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

const MEDIA_SLOTS = [
  {
    key: "hero_bg",
    name: "Hero Background Image",
    description: "The background pattern displayed in the hero section at the top of the homepage.",
    fallback: "/hero-bg.png",
    aspectRatio: "aspect-[16/9] w-full max-w-sm rounded-lg object-cover border border-border/40",
  },
  {
    key: "teacher_1",
    name: "Ustadha Fatima Portrait",
    description: "Headshot portrait image for Ustadha Fatima (Head of Arabic) on the About page.",
    fallback: "/teacher-1.png",
    aspectRatio: "aspect-[1/1] w-28 h-28 rounded-full object-cover border border-border/40",
  },
  {
    key: "teacher_2",
    name: "Ustadha Ayesha Portrait",
    description: "Headshot portrait image for Ustadha Ayesha (Senior Urdu Instructor) on the About page.",
    fallback: "/teacher-2.png",
    aspectRatio: "aspect-[1/1] w-28 h-28 rounded-full object-cover border border-border/40",
  },
  {
    key: "teacher_3",
    name: "Ustadha Zainab Portrait",
    description: "Headshot portrait image for Ustadha Zainab (Arabic & Tajweed Instructor) on the About page.",
    fallback: "/teacher-3.png",
    aspectRatio: "aspect-[1/1] w-28 h-28 rounded-full object-cover border border-border/40",
  },
  {
    key: "logo",
    name: "Site Logo",
    description: "Main website logo displayed in the navigation bar.",
    fallback: "/logo.png",
    aspectRatio: "w-32 h-12 object-contain bg-muted/10 border border-border/40 rounded-lg p-2",
  },
  {
    key: "course_arabic",
    name: "Arabic Course Thumbnail",
    description: "Default thumbnail for Arabic language courses.",
    fallback: "/course-arabic.png",
    aspectRatio: "aspect-[16/9] w-full max-w-sm rounded-lg object-cover border border-border/40",
  },
  {
    key: "course_urdu",
    name: "Urdu Course Thumbnail",
    description: "Default thumbnail for Urdu/Islamic Studies courses.",
    fallback: "/course-urdu.png",
    aspectRatio: "aspect-[16/9] w-full max-w-sm rounded-lg object-cover border border-border/40",
  },
];

interface PremiumImagePreviewProps {
  src: string;
  alt: string;
  className: string;
  isUploading: boolean;
  progress: number;
  error?: string;
  updatedAt?: string;
}

// A premium cache-busting image preloader to eliminate stale CDN flashing
function PremiumImagePreview({
  src,
  alt,
  className,
  isUploading,
  progress,
  error,
  updatedAt
}: PremiumImagePreviewProps) {
  const [currentSrc, setCurrentSrc] = useState(src);
  const [loadingNewSrc, setLoadingNewSrc] = useState(false);

  // Generate cache-busted URL using updatedAt timestamp or version query parameter
  const getCacheBustedUrl = (url: string, time?: string) => {
    if (url.startsWith("data:") || url.startsWith("blob:")) return url;
    const cacheBuster = time ? new Date(time).getTime() : Date.now();
    return url.includes("?") ? `${url}&v=${cacheBuster}` : `${url}?v=${cacheBuster}`;
  };

  useEffect(() => {
    const targetSrc = getCacheBustedUrl(src, updatedAt);
    
    // Only preload if the target source is actually different
    if (targetSrc !== currentSrc) {
      setLoadingNewSrc(true);
      const img = new Image();
      img.src = targetSrc;
      img.onload = () => {
        setCurrentSrc(targetSrc);
        setLoadingNewSrc(false);
      };
      img.onerror = () => {
        // Fallback to direct assignment if preload fails
        setCurrentSrc(targetSrc);
        setLoadingNewSrc(false);
      };
    }
  }, [src, updatedAt]);

  return (
    <div className="relative overflow-hidden w-full h-full flex items-center justify-center bg-[#FAF7F0]/40 rounded-xl min-h-[180px] p-4 group">
      {/* Soft background blurred glow of the image */}
      {currentSrc && (
        <img
          src={currentSrc}
          alt=""
          className="absolute inset-0 w-full h-full object-cover blur-2xl opacity-15 scale-110 pointer-events-none transition-all duration-700"
        />
      )}

      {/* Main Image Container */}
      <div className="relative z-10 flex items-center justify-center w-full h-full">
        <motion.img
          key={currentSrc}
          src={currentSrc}
          alt={alt}
          className={`${className} shadow-sm group-hover:scale-[1.02] transition-all duration-500 ease-out ${
            loadingNewSrc ? "brightness-90 blur-[1px] scale-98" : ""
          }`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* Uploading progress overlay */}
      <AnimatePresence>
        {isUploading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-20 bg-primary/75 backdrop-blur-[3px] flex flex-col items-center justify-center p-4 text-white"
          >
            <Loader2 className="w-8 h-8 animate-spin text-[#D4A359] mb-3" />
            <span className="text-xs font-bold tracking-widest uppercase mb-1">Optimizing Assets</span>
            <span className="text-[10px] text-white/70 mb-3">Syncing to Cloudinary CDN</span>
            <div className="w-36 bg-white/20 h-1.5 rounded-full overflow-hidden border border-white/5 shadow-inner">
              <motion.div
                className="bg-[#D4A359] h-full rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.2 }}
              />
            </div>
            <span className="text-[10px] font-mono mt-1.5 text-[#D4A359] font-bold">{progress}%</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Upload Error overlay */}
      <AnimatePresence>
        {error && !isUploading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-20 bg-red-950/80 backdrop-blur-[3px] flex flex-col items-center justify-center p-4 text-white text-center"
          >
            <AlertCircle className="w-9 h-9 text-red-400 mb-2 animate-bounce" />
            <span className="text-xs font-bold uppercase tracking-wider text-red-300">Upload Failed</span>
            <p className="text-[10px] mt-1.5 max-w-[220px] leading-relaxed text-red-200 line-clamp-2 px-2">
              {error}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function AdminMedia() {
  const { assets, assetsMetadata, isLoading, refetch } = useSiteAssets();
  const [uploadingKeys, setUploadingKeys] = useState<Record<string, boolean>>({});
  
  // Custom states for drag-and-drop & optimistic UI
  const [dragActive, setDragActive] = useState<Record<string, boolean>>({});
  const [localPreviews, setLocalPreviews] = useState<Record<string, string>>({});
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});
  const [uploadErrors, setUploadErrors] = useState<Record<string, string>>({});
  const [failedFiles, setFailedFiles] = useState<Record<string, File>>({});
  const [deletingKeys, setDeletingKeys] = useState<Record<string, boolean>>({});

  const handleFileUpload = async (key: string, file: File) => {
    if (!file) return;

    // Reset slot error/failed states
    setUploadErrors(prev => {
      const copy = { ...prev };
      delete copy[key];
      return copy;
    });
    setFailedFiles(prev => {
      const copy = { ...prev };
      delete copy[key];
      return copy;
    });

    setUploadingKeys(prev => ({ ...prev, [key]: true }));
    setUploadProgress(prev => ({ ...prev, [key]: 10 }));

    // Generate optimistic UI local preview URL
    const previewUrl = URL.createObjectURL(file);
    setLocalPreviews(prev => ({ ...prev, [key]: previewUrl }));

    // Simulate progress while uploading
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        const current = prev[key] || 10;
        if (current < 92) {
          const increment = Math.floor(Math.random() * 12) + 4;
          return { ...prev, [key]: Math.min(current + increment, 92) };
        }
        return prev;
      });
    }, 300);

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

      clearInterval(progressInterval);

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || "Failed to upload image");
      }

      setUploadProgress(prev => ({ ...prev, [key]: 100 }));
      toast.success("Image updated and optimized successfully!");
      
      // Clean up local preview object URL
      setTimeout(() => {
        setLocalPreviews(prev => {
          const copy = { ...prev };
          if (copy[key]) {
            URL.revokeObjectURL(copy[key]);
            delete copy[key];
          }
          return copy;
        });
        setUploadProgress(prev => {
          const copy = { ...prev };
          delete copy[key];
          return copy;
        });
      }, 400);

      refetch();
    } catch (error: any) {
      clearInterval(progressInterval);
      console.error("Upload error:", error);
      const errMsg = error.message || "Failed to upload file";
      
      setUploadErrors(prev => ({ ...prev, [key]: errMsg }));
      setFailedFiles(prev => ({ ...prev, [key]: file }));
      toast.error(errMsg);
    } finally {
      setUploadingKeys(prev => ({ ...prev, [key]: false }));
    }
  };

  const handleFileDelete = async (key: string) => {
    setDeletingKeys(prev => ({ ...prev, [key]: true }));

    try {
      const baseUrl = import.meta.env.VITE_API_URL || "";
      const response = await fetch(`${baseUrl}/api/admin/site-assets/${key}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || "Failed to remove custom asset");
      }

      toast.success("Custom asset removed. Reverted back to default template asset.");
      refetch();
    } catch (error: any) {
      console.error("Delete error:", error);
      toast.error(error.message || "Failed to remove custom asset");
    } finally {
      setDeletingKeys(prev => ({ ...prev, [key]: false }));
    }
  };

  const handleRetryUpload = (key: string) => {
    const file = failedFiles[key];
    if (file) {
      handleFileUpload(key, file);
    }
  };

  const handleCancelUpload = (key: string) => {
    setUploadErrors(prev => {
      const copy = { ...prev };
      delete copy[key];
      return copy;
    });
    setFailedFiles(prev => {
      const copy = { ...prev };
      delete copy[key];
      return copy;
    });
    setLocalPreviews(prev => {
      const copy = { ...prev };
      if (copy[key]) {
        URL.revokeObjectURL(copy[key]);
        delete copy[key];
      }
      return copy;
    });
  };

  const handleDrag = (e: React.DragEvent, key: string, active: boolean) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(prev => ({ ...prev, [key]: active }));
  };

  const handleDrop = (e: React.DragEvent, key: string) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(prev => ({ ...prev, [key]: false }));

    const file = e.dataTransfer.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast.error("Please upload an image file format (.png, .jpg, .webp)");
        return;
      }
      handleFileUpload(key, file);
    }
  };

  const formatTimestamp = (isoString?: string) => {
    if (!isoString) return "Default Asset";
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      });
    } catch {
      return "Recently Updated";
    }
  };

  if (isLoading) {
    return (
      <div className="py-24 flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
        <p className="text-sm font-medium text-muted-foreground animate-pulse">
          Loading Media Space Configuration...
        </p>
      </div>
    );
  }

  // Calculate metrics for top status display
  const totalSlots = MEDIA_SLOTS.length;
  const customUploadsCount = Object.keys(assets).length;
  const defaultStaticCount = totalSlots - customUploadsCount;

  return (
    <div className="space-y-8 pb-24">
      {/* Premium Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-border/40 pb-6">
        <div className="space-y-1.5">
          <span className="text-xs font-bold tracking-widest text-[#D4A359] uppercase">
            Administrative Space
          </span>
          <h1 className="font-serif text-4xl text-primary font-bold tracking-tight">
            Media Manager
          </h1>
          <p className="text-sm text-muted-foreground max-w-xl">
            Modify and optimize high-fidelity assets. Changes deploy instantly to students worldwide via Cloudinary's global content delivery network.
          </p>
        </div>
        
        {/* Pulsing Status Badge */}
        <div className="flex items-center gap-3 bg-[#133E2B]/5 px-4 py-2.5 rounded-full border border-primary/10 text-xs font-semibold text-primary self-start lg:self-auto">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <CloudLightning className="w-3.5 h-3.5 text-primary" />
          Cloudinary CDN Active
        </div>
      </div>

      {/* Top Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-border/50 p-5 flex items-center gap-4 shadow-sm">
          <div className="w-10 h-10 rounded-lg bg-primary/5 flex items-center justify-center text-primary">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Total Slots</div>
            <div className="text-xl font-bold text-foreground mt-0.5">{totalSlots} Slots</div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-border/50 p-5 flex items-center gap-4 shadow-sm">
          <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-700">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Custom Optimized</div>
            <div className="text-xl font-bold text-emerald-800 mt-0.5">{customUploadsCount} Active</div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-border/50 p-5 flex items-center gap-4 shadow-sm">
          <div className="w-10 h-10 rounded-lg bg-[#FAF7F0] flex items-center justify-center text-muted-foreground">
            <ImageIcon className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Static Defaults</div>
            <div className="text-xl font-bold text-muted-foreground mt-0.5">{defaultStaticCount} Fallbacks</div>
          </div>
        </div>
      </div>

      {/* Grid of media slots */}
      <div className="grid gap-6 md:grid-cols-2">
        {MEDIA_SLOTS.map(slot => {
          const activeUrl = assets[slot.key];
          const metadata = assetsMetadata[slot.key];
          const isUploaded = !!activeUrl;
          const isUploading = uploadingKeys[slot.key];
          
          // Determine the source to show: local preview if uploading, active Cloudinary URL if available, fallback static asset otherwise.
          const currentSrc = localPreviews[slot.key] || activeUrl || slot.fallback;
          const dragOver = dragActive[slot.key];
          const progress = uploadProgress[slot.key] || 0;
          const errorMsg = uploadErrors[slot.key];
          const isDeleting = deletingKeys[slot.key];

          return (
            <motion.div
              layout
              key={slot.key}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              whileHover={{ y: -3, transition: { duration: 0.2 } }}
              className="bg-white rounded-2xl border border-border/60 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col justify-between"
            >
              {/* Card Header */}
              <div className="p-6 border-b border-border/30">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-serif text-lg text-primary font-bold leading-tight">
                      {slot.name}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
                      {slot.description}
                    </p>
                  </div>

                  {/* Status Badge */}
                  {isUploaded ? (
                    <span className="text-[10px] bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full uppercase font-bold tracking-wider flex items-center gap-1 border border-emerald-200/50 shrink-0">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      Custom CDN
                    </span>
                  ) : (
                    <span className="text-[10px] bg-neutral-100 text-neutral-500 px-2.5 py-1 rounded-full uppercase font-bold tracking-wider border border-neutral-200/30 shrink-0">
                      Default Static
                    </span>
                  )}
                </div>
              </div>

              {/* Visual Preview Section */}
              <div className="px-6 py-4 bg-[#FAF7F0]/20 flex flex-col items-center">
                <PremiumImagePreview
                  src={currentSrc}
                  alt={slot.name}
                  className={slot.aspectRatio}
                  isUploading={isUploading}
                  progress={progress}
                  error={errorMsg}
                  updatedAt={metadata?.updatedAt}
                />
                
                {/* Meta details footer inside the preview area */}
                <div className="w-full flex items-center justify-between mt-3 text-[10px] text-muted-foreground px-1 select-all font-mono truncate gap-4">
                  <span className="truncate max-w-[200px]">
                    {isUploaded ? activeUrl : `Fallback: ${slot.fallback}`}
                  </span>
                  {metadata?.updatedAt && (
                    <span className="flex items-center gap-1 text-[9px] text-muted-foreground bg-white border border-border/30 px-1.5 py-0.5 rounded shrink-0">
                      <Calendar className="w-2.5 h-2.5 text-[#D4A359]" />
                      {formatTimestamp(metadata.updatedAt)}
                    </span>
                  )}
                </div>
              </div>

              {/* Upload Zone & Action Buttons */}
              <div className="p-6 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor={`file-input-${slot.key}`} className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold block mb-1">
                    Upload & Deploy Area
                  </Label>

                  {/* Stateful Drag and Drop Box */}
                  <div
                    onDragOver={e => handleDrag(e, slot.key, true)}
                    onDragLeave={e => handleDrag(e, slot.key, false)}
                    onDrop={e => handleDrop(e, slot.key)}
                    className={`relative rounded-xl border border-dashed text-center p-5 transition-all duration-300 flex flex-col items-center justify-center cursor-pointer ${
                      dragOver
                        ? "border-[#D4A359] bg-[#FAF7F0] scale-[1.01]"
                        : errorMsg
                        ? "border-red-300 bg-red-50/20 hover:bg-red-50/40"
                        : "border-border/60 hover:border-primary/40 hover:bg-primary/2"
                    }`}
                    onClick={() => {
                      if (!isUploading && !errorMsg) {
                        document.getElementById(`file-input-${slot.key}`)?.click();
                      }
                    }}
                  >
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

                    {errorMsg ? (
                      /* Error State Inside Upload Area */
                      <div className="space-y-3 w-full flex flex-col items-center">
                        <AlertCircle className="w-6 h-6 text-red-500" />
                        <div className="text-xs text-red-950 font-semibold">Upload interrupted</div>
                        <div className="flex gap-2 w-full max-w-[240px]">
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            className="w-full h-8 text-[11px] font-bold"
                            onClick={e => {
                              e.stopPropagation();
                              handleRetryUpload(slot.key);
                            }}
                          >
                            <RefreshCw className="w-3.5 h-3.5 mr-1" />
                            Retry
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="w-full h-8 text-[11px] font-bold border-red-200 text-red-800 hover:bg-red-50"
                            onClick={e => {
                              e.stopPropagation();
                              handleCancelUpload(slot.key);
                            }}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      /* Default Upload Interface */
                      <div className="space-y-2">
                        <div className="p-2.5 rounded-full bg-[#FAF7F0] text-[#D4A359] inline-flex items-center justify-center border border-border/20 group-hover:scale-105 transition-transform duration-300">
                          {isUploading ? (
                            <Loader2 className="w-5 h-5 animate-spin text-[#D4A359]" />
                          ) : (
                            <FileImage className="w-5 h-5 text-primary" />
                          )}
                        </div>
                        <div className="text-xs font-semibold text-foreground">
                          {isUploading ? "Uploading file..." : "Drag & Drop Image"}
                        </div>
                        <div className="text-[10px] text-muted-foreground">
                          Supports JPG, PNG, WEBP up to 8MB
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Replace & Remove buttons */}
                <div className="flex gap-2 pt-1 border-t border-border/20">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1 h-10 text-xs font-semibold border-border/60 hover:bg-primary/5 hover:text-primary transition-all flex items-center justify-center gap-1.5"
                    disabled={isUploading}
                    onClick={() => document.getElementById(`file-input-${slot.key}`)?.click()}
                  >
                    <Upload className="w-3.5 h-3.5" />
                    Replace Image
                  </Button>

                  {/* Remove custom asset back to template default */}
                  {isUploaded && (
                    <Button
                      type="button"
                      variant="ghost"
                      className="h-10 px-3 text-xs font-semibold text-red-600 hover:text-red-700 hover:bg-red-50/60 transition-all flex items-center justify-center gap-1.5 border border-transparent hover:border-red-100 rounded-lg"
                      disabled={isUploading || isDeleting}
                      onClick={() => handleFileDelete(slot.key)}
                    >
                      {isDeleting ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Trash2 className="w-3.5 h-3.5" />
                      )}
                    </Button>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
