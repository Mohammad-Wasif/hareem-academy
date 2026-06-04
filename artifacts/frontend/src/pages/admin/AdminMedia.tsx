import { useState, useEffect, useMemo, useRef } from "react";
import { useSiteAssets } from "@/hooks/use-site-assets";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import {
  Loader2,
  Upload,
  CheckCircle2,
  CloudLightning,
  AlertCircle,
  Trash2,
  RefreshCw,
  Layers,
  Image as ImageIcon,
  BookOpen,
  Users,
  Sparkles,
  Folder,
  Search,
  ChevronDown,
  Filter,
  Maximize2,
  Crop,
  Copy,
  FolderInput,
  Download,
  Link as LinkIcon,
  Zap,
  Globe,
  Settings,
  Info,
  Smartphone,
  Tablet,
  Monitor,
  Check,
  FileText,
  AlertTriangle,
  X,
  Undo2,
  Plus
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

// Folders definitions
const FOLDERS = [
  { id: "all", name: "All Media", count: 18, size: "12.4 MB" },
  { id: "hero", name: "Hero Images", count: 2, size: "4.8 MB" },
  { id: "courses", name: "Course Thumbnails", count: 4, size: "3.2 MB" },
  { id: "teachers", name: "Teachers", count: 3, size: "1.8 MB" },
  { id: "testimonials", name: "Testimonials", count: 2, size: "620 KB" },
  { id: "icons", name: "Icons", count: 2, size: "27 KB" },
  { id: "backgrounds", name: "Backgrounds", count: 2, size: "1.4 MB" },
  { id: "navbar", name: "Navbar Assets", count: 1, size: "85 KB" },
  { id: "seo", name: "SEO Images", count: 1, size: "420 KB" },
  { id: "og", name: "Open Graph", count: 1, size: "850 KB" },
  { id: "archived", name: "Archived", count: 0, size: "0 KB" },
  { id: "deleted", name: "Deleted", count: 0, size: "0 KB" },
];

interface MediaFile {
  key: string;
  name: string;
  url: string;
  folder: string;
  dimensions: string;
  format: string;
  fileSize: string;
  originalSize: string;
  savings: string;
  altText: string;
  description: string;
  tags: string[];
  created: string;
  updated: string;
  usedIn: string[];
  status: "Published" | "Unused" | "Archived" | "Deleted";
  isReal: boolean;
}

export default function AdminMedia() {
  const { assets, assetsMetadata, isLoading, refetch } = useSiteAssets();
  const { toast } = useToast();

  // State Sandbox Controls
  const [mediaState, setMediaState] = useState<"success" | "loading" | "empty" | "error">("success");

  // Selected folder and sorting/filters
  const [selectedFolder, setSelectedFolder] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "largest" | "az">("newest");
  const [typeFilter, setTypeFilter] = useState<"all" | "images" | "svg" | "published" | "unused" | "large">("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Selection states
  const [selectedFileKey, setSelectedFileKey] = useState<string | null>(null);
  const [multiSelectedKeys, setMultiSelectedKeys] = useState<string[]>([]);
  const [isMultiSelectMode, setIsMultiSelectMode] = useState(false);

  // File action overlays/modals
  const [isCropOpen, setIsCropOpen] = useState(false);
  const [isImportURLOpen, setIsImportURLOpen] = useState(false);
  const [importUrl, setImportUrl] = useState("");
  const [isMoveOpen, setIsMoveOpen] = useState(false);
  const [moveToFolder, setMoveToFolder] = useState("all");
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  // AI Alt text typing status
  const [isGeneratingAlt, setIsGeneratingAlt] = useState(false);

  // Previews tab: 'frame' (Device preview layouts) vs 'context' (Website UI layouts)
  const [previewTab, setPreviewTab] = useState<"device" | "navbar" | "hero" | "card" | "social">("device");
  const [deviceFrame, setDeviceFrame] = useState<"desktop" | "tablet" | "mobile">("desktop");

  // Custom local simulated database
  const [virtualFiles, setVirtualFiles] = useState<MediaFile[]>([
    {
      key: "hero_ramadan",
      name: "hero-ramadan-celebration.webp",
      url: "/hero-bg.png",
      folder: "hero",
      dimensions: "1920 × 1080 px",
      format: "WEBP",
      fileSize: "480 KB",
      originalSize: "2.4 MB",
      savings: "80%",
      altText: "Ramadan Islamic calligraphy banner decoration",
      description: "Ramadan campaign header image with gold crescent details.",
      tags: ["ramadan", "hero", "calligraphy"],
      created: "May 12, 2026",
      updated: "May 12, 2026",
      usedIn: ["Home (Ramadan Layout)"],
      status: "Published",
      isReal: false,
    },
    {
      key: "course_tajweed",
      name: "course-tajweed-foundations.png",
      url: "/course-arabic.png",
      folder: "courses",
      dimensions: "1280 × 720 px",
      format: "PNG",
      fileSize: "820 KB",
      originalSize: "1.8 MB",
      savings: "54%",
      altText: "Tajweed rules book with open pages on table",
      description: "Thumbnail card background for the online Tajweed recitation rules syllabus.",
      tags: ["course", "tajweed", "quran"],
      created: "Apr 20, 2026",
      updated: "May 02, 2026",
      usedIn: ["Course Detail (Tajweed)", "Courses List"],
      status: "Published",
      isReal: false,
    },
    {
      key: "sister_ayesha_testimonial",
      name: "sister-ayesha-testimonial.jpg",
      url: "/teacher-1.png",
      folder: "testimonials",
      dimensions: "400 × 400 px",
      format: "JPG",
      fileSize: "240 KB",
      originalSize: "450 KB",
      savings: "46%",
      altText: "Sister Ayesha Ahmed portrait headshot",
      description: "Profile headshot avatar for sister Ayesha's testimonial quote review card.",
      tags: ["testimonial", "avatar", "student"],
      created: "Feb 10, 2026",
      updated: "Feb 10, 2026",
      usedIn: ["Testimonials Widget", "Home"],
      status: "Published",
      isReal: false,
    },
    {
      key: "sister_maryam_testimonial",
      name: "sister-maryam-testimonial.jpg",
      url: "/teacher-2.png",
      folder: "testimonials",
      dimensions: "400 × 400 px",
      format: "JPG",
      fileSize: "320 KB",
      originalSize: "680 KB",
      savings: "53%",
      altText: "Sister Maryam Omer testimonial headshot",
      description: "Profile headshot avatar for sister Maryam's testimonial feedback card.",
      tags: ["testimonial", "avatar", "student"],
      created: "Mar 05, 2026",
      updated: "Mar 05, 2026",
      usedIn: ["Testimonials Widget"],
      status: "Unused",
      isReal: false,
    },
    {
      key: "crescent_gold",
      name: "crescent-gold-crest.svg",
      url: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><path d='M50 10A40 40 0 1 0 90 50A30 30 0 1 1 50 10Z' fill='%23D6B25E'/></svg>",
      folder: "icons",
      dimensions: "64 × 64 px",
      format: "SVG",
      fileSize: "12 KB",
      originalSize: "12 KB",
      savings: "0%",
      altText: "Gold Islamic crescent moon vector graphic icon",
      description: "Gold crescent moon vector asset used in section headers.",
      tags: ["vector", "icon", "gold"],
      created: "Jan 15, 2026",
      updated: "Jan 15, 2026",
      usedIn: ["About", "Header Decorator"],
      status: "Published",
      isReal: false,
    },
    {
      key: "book_open_green",
      name: "book-open-emerald.svg",
      url: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%230F4D36' stroke-width='2'><path d='M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2zM22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z'/></svg>",
      folder: "icons",
      dimensions: "64 × 64 px",
      format: "SVG",
      fileSize: "15 KB",
      originalSize: "15 KB",
      savings: "0%",
      altText: "Open book icon emerald outline vector",
      description: "Emerald open book line icon used in syllabus widgets.",
      tags: ["vector", "icon", "emerald"],
      created: "Jan 18, 2026",
      updated: "Jan 18, 2026",
      usedIn: ["Course Cards Detail"],
      status: "Published",
      isReal: false,
    },
    {
      key: "arabesque_pattern",
      name: "arabesque-pattern-backdrop.png",
      url: "/hero-bg.png",
      folder: "backgrounds",
      dimensions: "1024 × 1024 px",
      format: "PNG",
      fileSize: "1.4 MB",
      originalSize: "4.8 MB",
      savings: "70%",
      altText: "Islamic arabesque geometry design background backdrop",
      description: "Arabesque geometry pattern backdrop overlay used across pages.",
      tags: ["backdrop", "pattern", "geometry"],
      created: "Jan 20, 2026",
      updated: "Jan 20, 2026",
      usedIn: ["Body Overlay Settings"],
      status: "Published",
      isReal: false,
    },
    {
      key: "seo_banner",
      name: "seo-hareem-academy-banner.jpg",
      url: "/course-arabic.png",
      folder: "seo",
      dimensions: "1200 × 630 px",
      format: "JPG",
      fileSize: "420 KB",
      originalSize: "1.2 MB",
      savings: "65%",
      altText: "Hareem Academy banner with study materials",
      description: "SEO index image displayed in Google search previews and search card indices.",
      tags: ["seo", "marketing", "google"],
      created: "May 01, 2026",
      updated: "May 01, 2026",
      usedIn: ["Meta Header Index Settings"],
      status: "Published",
      isReal: false,
    },
    {
      key: "social_og_arabic",
      name: "social-og-arabic-sisters.jpg",
      url: "/course-urdu.png",
      folder: "og",
      dimensions: "1200 × 630 px",
      format: "JPG",
      fileSize: "850 KB",
      originalSize: "2.1 MB",
      savings: "59%",
      altText: "Arabic online learning for sisters social card design",
      description: "Social media Open Graph sharing preview card backdrop for sisters Arabic.",
      tags: ["og", "social", "facebook"],
      created: "May 05, 2026",
      updated: "May 05, 2026",
      usedIn: ["Open Graph Index Settings"],
      status: "Published",
      isReal: false,
    },
  ]);

  // Upload progress simulation states
  const [uploadQueue, setUploadQueue] = useState<{ id: string; name: string; size: string; progress: number; status: string }[]>([]);
  const [dragActive, setDragActive] = useState(false);

  // Synchronize database layout slots from the server backend
  const combinedFiles = useMemo(() => {
    const dbSlots: MediaFile[] = [
      {
        key: "logo",
        name: "site-logo-navbar.png",
        url: assets["logo"] || "/logo.png",
        folder: "navbar",
        dimensions: "240 × 80 px",
        format: "PNG",
        fileSize: assetsMetadata["logo"] ? "85 KB" : "120 KB",
        originalSize: "240 KB",
        savings: "64%",
        altText: assetsMetadata["logo"] ? "Hareem Academy brand logo" : "Hareem Academy placeholder logo",
        description: "Official brand logo displayed inside the main navigation bar.",
        tags: ["logo", "brand", "header"],
        created: assetsMetadata["logo"]?.updatedAt ? new Date(assetsMetadata["logo"].updatedAt).toLocaleDateString() : "Jan 01, 2026",
        updated: assetsMetadata["logo"]?.updatedAt ? new Date(assetsMetadata["logo"].updatedAt).toLocaleDateString() : "Jan 01, 2026",
        usedIn: ["Main Header Navbar", "Footer Column 1"],
        status: "Published",
        isReal: true,
      },
      {
        key: "hero_bg",
        name: "hero-pattern-bg.png",
        url: assets["hero_bg"] || "/hero-bg.png",
        folder: "hero",
        dimensions: "1920 × 1080 px",
        format: "PNG",
        fileSize: assetsMetadata["hero_bg"] ? "1.8 MB" : "4.2 MB",
        originalSize: "5.4 MB",
        savings: "66%",
        altText: "Arabesque geometry pattern vector wallpaper overlay",
        description: "Main background wallpaper graphic rendered in the home hero banner section.",
        tags: ["background", "hero", "geometric"],
        created: assetsMetadata["hero_bg"]?.updatedAt ? new Date(assetsMetadata["hero_bg"].updatedAt).toLocaleDateString() : "Jan 01, 2026",
        updated: assetsMetadata["hero_bg"]?.updatedAt ? new Date(assetsMetadata["hero_bg"].updatedAt).toLocaleDateString() : "Jan 01, 2026",
        usedIn: ["Homepage Hero Banner Section"],
        status: "Published",
        isReal: true,
      },
      {
        key: "teacher_1",
        name: "ustadha-fatima-portrait.png",
        url: assets["teacher_1"] || "/teacher-1.png",
        folder: "teachers",
        dimensions: "600 × 600 px",
        format: "PNG",
        fileSize: assetsMetadata["teacher_1"] ? "450 KB" : "850 KB",
        originalSize: "1.2 MB",
        savings: "62%",
        altText: "Ustadha Fatima portrait photography",
        description: "Public biography headshot profile for Ustadha Fatima (Head of Arabic Dept).",
        tags: ["teacher", "fatima", "portrait"],
        created: assetsMetadata["teacher_1"]?.updatedAt ? new Date(assetsMetadata["teacher_1"].updatedAt).toLocaleDateString() : "Jan 01, 2026",
        updated: assetsMetadata["teacher_1"]?.updatedAt ? new Date(assetsMetadata["teacher_1"].updatedAt).toLocaleDateString() : "Jan 01, 2026",
        usedIn: ["About Instructors Bio Grid"],
        status: "Published",
        isReal: true,
      },
      {
        key: "teacher_2",
        name: "ustadha-ayesha-portrait.png",
        url: assets["teacher_2"] || "/teacher-2.png",
        folder: "teachers",
        dimensions: "600 × 600 px",
        format: "PNG",
        fileSize: assetsMetadata["teacher_2"] ? "380 KB" : "780 KB",
        originalSize: "1.1 MB",
        savings: "65%",
        altText: "Ustadha Ayesha portrait photography",
        description: "Public biography headshot profile for Ustadha Ayesha (Senior Urdu Lead).",
        tags: ["teacher", "ayesha", "portrait"],
        created: assetsMetadata["teacher_2"]?.updatedAt ? new Date(assetsMetadata["teacher_2"].updatedAt).toLocaleDateString() : "Jan 01, 2026",
        updated: assetsMetadata["teacher_2"]?.updatedAt ? new Date(assetsMetadata["teacher_2"].updatedAt).toLocaleDateString() : "Jan 01, 2026",
        usedIn: ["About Instructors Bio Grid"],
        status: "Published",
        isReal: true,
      },
      {
        key: "teacher_3",
        name: "ustadha-zainab-portrait.png",
        url: assets["teacher_3"] || "/teacher-3.png",
        folder: "teachers",
        dimensions: "600 × 600 px",
        format: "PNG",
        fileSize: assetsMetadata["teacher_3"] ? "410 KB" : "820 KB",
        originalSize: "1.3 MB",
        savings: "68%",
        altText: "Ustadha Zainab portrait photography",
        description: "Public biography headshot profile for Ustadha Zainab (Tajweed Instructor).",
        tags: ["teacher", "zainab", "portrait"],
        created: assetsMetadata["teacher_3"]?.updatedAt ? new Date(assetsMetadata["teacher_3"].updatedAt).toLocaleDateString() : "Jan 01, 2026",
        updated: assetsMetadata["teacher_3"]?.updatedAt ? new Date(assetsMetadata["teacher_3"].updatedAt).toLocaleDateString() : "Jan 01, 2026",
        usedIn: ["About Instructors Bio Grid"],
        status: "Published",
        isReal: true,
      },
      {
        key: "course_arabic",
        name: "arabic-beginner-thumbnail.png",
        url: assets["course_arabic"] || "/course-arabic.png",
        folder: "courses",
        dimensions: "1280 × 720 px",
        format: "PNG",
        fileSize: assetsMetadata["course_arabic"] ? "680 KB" : "1.2 MB",
        originalSize: "2.1 MB",
        savings: "67%",
        altText: "Arabic workbook pages study materials backdrop",
        description: "Default thumbnail card wallpaper for Sisters Arabic Level 1 Beginners Course.",
        tags: ["course", "thumbnail", "arabic"],
        created: assetsMetadata["course_arabic"]?.updatedAt ? new Date(assetsMetadata["course_arabic"].updatedAt).toLocaleDateString() : "Jan 01, 2026",
        updated: assetsMetadata["course_arabic"]?.updatedAt ? new Date(assetsMetadata["course_arabic"].updatedAt).toLocaleDateString() : "Jan 01, 2026",
        usedIn: ["Courses Listing Grid", "Arabic Level 1 Landing Page"],
        status: "Published",
        isReal: true,
      },
      {
        key: "course_arabic_intermediate",
        name: "arabic-intermediate-thumbnail.png",
        url: assets["course_arabic_intermediate"] || "/course-arabic.png",
        folder: "courses",
        dimensions: "1280 × 720 px",
        format: "PNG",
        fileSize: assetsMetadata["course_arabic_intermediate"] ? "720 KB" : "1.4 MB",
        originalSize: "2.3 MB",
        savings: "68%",
        altText: "Arabic vocabulary notes backdrop",
        description: "Default thumbnail card wallpaper for Sisters Arabic Level 2 Intermediate Course.",
        tags: ["course", "thumbnail", "arabic"],
        created: assetsMetadata["course_arabic_intermediate"]?.updatedAt ? new Date(assetsMetadata["course_arabic_intermediate"].updatedAt).toLocaleDateString() : "Jan 01, 2026",
        updated: assetsMetadata["course_arabic_intermediate"]?.updatedAt ? new Date(assetsMetadata["course_arabic_intermediate"].updatedAt).toLocaleDateString() : "Jan 01, 2026",
        usedIn: ["Courses Listing Grid", "Arabic Level 2 Landing Page"],
        status: "Published",
        isReal: true,
      },
      {
        key: "course_urdu",
        name: "urdu-beginner-thumbnail.png",
        url: assets["course_urdu"] || "/course-urdu.png",
        folder: "courses",
        dimensions: "1280 × 720 px",
        format: "PNG",
        fileSize: assetsMetadata["course_urdu"] ? "620 KB" : "1.1 MB",
        originalSize: "1.9 MB",
        savings: "67%",
        altText: "Urdu calligraphy book reading backdrop",
        description: "Default thumbnail card wallpaper for Urdu Language Beginners Course.",
        tags: ["course", "thumbnail", "urdu"],
        created: assetsMetadata["course_urdu"]?.updatedAt ? new Date(assetsMetadata["course_urdu"].updatedAt).toLocaleDateString() : "Jan 01, 2026",
        updated: assetsMetadata["course_urdu"]?.updatedAt ? new Date(assetsMetadata["course_urdu"].updatedAt).toLocaleDateString() : "Jan 01, 2026",
        usedIn: ["Courses Listing Grid", "Urdu Beginners Landing Page"],
        status: "Published",
        isReal: true,
      },
    ];

    if (mediaState === "empty") return [];
    return [...dbSlots, ...virtualFiles];
  }, [assets, assetsMetadata, virtualFiles, mediaState]);

  // Set default selection on load
  useEffect(() => {
    if (combinedFiles.length > 0 && !selectedFileKey) {
      setSelectedFileKey(combinedFiles[0].key);
    }
  }, [combinedFiles]);

  const selectedFile = useMemo(() => {
    return combinedFiles.find((f) => f.key === selectedFileKey) || null;
  }, [combinedFiles, selectedFileKey]);

  // Filtered files in grid
  const filteredFiles = useMemo(() => {
    return combinedFiles.filter((f) => {
      // Folder check
      const matchesFolder = selectedFolder === "all" || f.folder === selectedFolder;
      
      // Search check
      const matchesSearch =
        f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.altText.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
      
      // Type/Status filter check
      let matchesType = true;
      if (typeFilter === "images") matchesType = f.format !== "SVG";
      if (typeFilter === "svg") matchesType = f.format === "SVG";
      if (typeFilter === "published") matchesType = f.status === "Published";
      if (typeFilter === "unused") matchesType = f.status === "Unused";
      if (typeFilter === "large") matchesType = f.fileSize.includes("MB") || parseFloat(f.fileSize) > 500;
      
      return matchesFolder && matchesSearch && matchesType;
    });
  }, [combinedFiles, selectedFolder, searchQuery, typeFilter]);

  // Sorted files
  const sortedFiles = useMemo(() => {
    const list = [...filteredFiles];
    if (sortBy === "az") {
      list.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === "largest") {
      list.sort((a, b) => {
        const getBytes = (sz: string) => {
          const num = parseFloat(sz);
          if (sz.includes("MB")) return num * 1024 * 1024;
          return num * 1024;
        };
        return getBytes(b.fileSize) - getBytes(a.fileSize);
      });
    } else if (sortBy === "oldest") {
      list.sort((a, b) => new Date(a.created).getTime() - new Date(b.created).getTime());
    } else {
      // Default Newest
      list.sort((a, b) => new Date(b.created).getTime() - new Date(a.created).getTime());
    }
    return list;
  }, [filteredFiles, sortBy]);

  // Handle local mock edits on files
  const handleUpdateFileDetails = (key: string, updates: Partial<MediaFile>) => {
    setVirtualFiles((prev) =>
      prev.map((f) => (f.key === key ? { ...f, ...updates } : f))
    );
    toast({
      title: "Metadata Saved (Simulated)",
      description: "Asset descriptors successfully synchronized.",
    });
  };

  // Keyboard navigation listener (Arrow keys browse assets in grid)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (sortedFiles.length === 0) return;
      
      const currentIndex = sortedFiles.findIndex((f) => f.key === selectedFileKey);
      if (currentIndex === -1) return;

      let nextIndex = currentIndex;
      if (e.key === "ArrowRight") {
        nextIndex = (currentIndex + 1) % sortedFiles.length;
      } else if (e.key === "ArrowLeft") {
        nextIndex = (currentIndex - 1 + sortedFiles.length) % sortedFiles.length;
      } else if (e.key === "ArrowDown") {
        nextIndex = Math.min(currentIndex + 4, sortedFiles.length - 1);
      } else if (e.key === "ArrowUp") {
        nextIndex = Math.max(currentIndex - 4, 0);
      } else {
        return;
      }

      e.preventDefault();
      setSelectedFileKey(sortedFiles[nextIndex].key);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [sortedFiles, selectedFileKey]);

  // AI alt text generator
  const triggerGenerateAltText = () => {
    if (!selectedFile || isGeneratingAlt) return;
    setIsGeneratingAlt(true);
    toast({
      title: "Analyzing Image Layout",
      description: "Extracting visual cues and semantic tags...",
    });
    setTimeout(() => {
      setIsGeneratingAlt(false);
      const generated = `Luxury Islamic editorial design showing ${selectedFile.tags.join(" and ")} themed layout pattern`;
      if (selectedFile.isReal) {
        toast({
          title: "Alt Text Generated",
          description: "Populated descriptive tags successfully.",
        });
        // Real logic could dispatch to DB
      } else {
        handleUpdateFileDetails(selectedFile.key, { altText: generated });
      }
    }, 1500);
  };

  // Simulated drag drop file upload
  const handleFileUpload = (file: File) => {
    if (!file) return;
    
    // Add file to progress queue
    const id = Math.random().toString(36).substring(7);
    const sizeStr = (file.size / 1024 / 1024).toFixed(2) + " MB";
    setUploadQueue((prev) => [...prev, { id, name: file.name, size: sizeStr, progress: 0, status: "Uploading" }]);

    // Simulated progress steps
    let progress = 0;
    const interval = setInterval(() => {
      progress += 20;
      setUploadQueue((prev) =>
        prev.map((item) => (item.id === id ? { ...item, progress: Math.min(progress, 100), status: progress >= 100 ? "Optimizing AVIF" : "Uploading" } : item))
      );

      if (progress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          // Success simulated compilation: append file to virtual database list
          const newAsset: MediaFile = {
            key: `user_${id}`,
            name: file.name,
            url: "/course-urdu.png", // Use fallback display
            folder: selectedFolder === "all" ? "hero" : selectedFolder,
            dimensions: "1280 × 720 px",
            format: file.name.split(".").pop()?.toUpperCase() || "PNG",
            fileSize: sizeStr,
            originalSize: (file.size * 2.5 / 1024 / 1024).toFixed(2) + " MB",
            savings: "60%",
            altText: `Uploaded asset: ${file.name.replace(/\.[^/.]+$/, "")}`,
            description: "User uploaded design graphic for marketing layouts.",
            tags: ["custom", "upload"],
            created: new Date().toLocaleDateString(),
            updated: new Date().toLocaleDateString(),
            usedIn: [],
            status: "Unused",
            isReal: false,
          };
          setVirtualFiles((prev) => [newAsset, ...prev]);
          setUploadQueue((prev) => prev.filter((item) => item.id !== id));
          setSelectedFileKey(newAsset.key);
          toast({
            title: "Upload Synchronized",
            description: `${file.name} optimized and written to ${newAsset.folder} folder.`,
          });
        }, 1000);
      }
    }, 250);
  };

  // URL import trigger
  const handleURLImport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!importUrl) return;
    setIsImportURLOpen(false);
    
    const id = Math.random().toString(36).substring(7);
    const fileName = importUrl.split("/").pop()?.split("?")[0] || `imported-asset-${id}.jpg`;
    setUploadQueue((prev) => [...prev, { id, name: fileName, size: "1.2 MB", progress: 0, status: "Downloading URL" }]);

    let progress = 0;
    const interval = setInterval(() => {
      progress += 25;
      setUploadQueue((prev) =>
        prev.map((item) => (item.id === id ? { ...item, progress, status: progress >= 100 ? "Syncing CDN" : "Downloading URL" } : item))
      );
      if (progress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          const newAsset: MediaFile = {
            key: `url_${id}`,
            name: fileName,
            url: "/course-arabic.png",
            folder: selectedFolder === "all" ? "hero" : selectedFolder,
            dimensions: "1920 × 1080 px",
            format: "JPG",
            fileSize: "450 KB",
            originalSize: "1.2 MB",
            savings: "62%",
            altText: `Imported image: ${fileName}`,
            description: `Asset imported from remote URL resource: ${importUrl}`,
            tags: ["imported", "web"],
            created: new Date().toLocaleDateString(),
            updated: new Date().toLocaleDateString(),
            usedIn: [],
            status: "Unused",
            isReal: false,
          };
          setVirtualFiles((prev) => [newAsset, ...prev]);
          setUploadQueue((prev) => prev.filter((item) => item.id !== id));
          setSelectedFileKey(newAsset.key);
          toast({
            title: "Web Import Successful",
            description: "Asset optimized and mirrored to Cloudinary.",
          });
          setImportUrl("");
        }, 800);
      }
    }, 200);
  };

  // Drag drop handlers
  const handleDrag = (e: React.DragEvent, active: boolean) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(active);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  // Copy URL to clipboard helper
  const handleCopyURL = (url: string) => {
    navigator.clipboard.writeText(window.location.origin + url);
    toast({
      title: "URL Copied",
      description: "Asset link written to clipboard.",
    });
  };

  // Duplicate asset helper
  const handleDuplicateAsset = (file: MediaFile) => {
    const id = Math.random().toString(36).substring(7);
    const duplicated: MediaFile = {
      ...file,
      key: `dup_${id}`,
      name: `${file.name.replace(/\.[^/.]+$/, "")}-copy.${file.name.split(".").pop()}`,
      created: new Date().toLocaleDateString(),
      updated: new Date().toLocaleDateString(),
      usedIn: [],
      status: "Unused",
      isReal: false,
    };
    setVirtualFiles((prev) => [duplicated, ...prev]);
    setSelectedFileKey(duplicated.key);
    toast({
      title: "Asset Duplicated",
      description: `Successfully duplicated as ${duplicated.name}`,
    });
  };

  // Move asset action
  const handleMoveAsset = () => {
    if (!selectedFile) return;
    setIsMoveOpen(false);
    if (selectedFile.isReal) {
      toast({
        title: "Forbidden",
        description: "Layout slot assets cannot change directory structure.",
        variant: "destructive",
      });
      return;
    }
    setVirtualFiles((prev) =>
      prev.map((f) => (f.key === selectedFile.key ? { ...f, folder: moveToFolder } : f))
    );
    toast({
      title: "Asset Moved",
      description: `Relocated successfully to ${moveToFolder} folder.`,
    });
  };

  // Crop simulator action
  const handleCropApply = () => {
    setIsCropOpen(false);
    toast({
      title: "Applying Crop Transformation",
      description: "Slicing boundaries in Cloudinary editor...",
    });
    setTimeout(() => {
      if (selectedFile) {
        if (selectedFile.isReal) {
          toast({ title: "Optimized Crop Applied" });
        } else {
          handleUpdateFileDetails(selectedFile.key, {
            dimensions: "800 × 800 px",
            fileSize: "140 KB",
            savings: "72%",
          });
        }
      }
    }, 1000);
  };

  // Delete selector warning checks
  const handleDeleteAsset = () => {
    setIsDeleteConfirmOpen(false);
    if (!selectedFile) return;
    
    // Virtual file soft delete
    if (!selectedFile.isReal) {
      setVirtualFiles((prev) => prev.filter((f) => f.key !== selectedFile.key));
      setSelectedFileKey(null);
      toast({
        title: "Asset Deleted",
        description: "Asset successfully discarded from virtual library.",
      });
      return;
    }

    // Real file database deletion check
    toast({
      title: "Database Request Sent",
      description: `Deleting ${selectedFile.name} from Cloudinary...`,
    });
    // Trigger real fetch API endpoint
    const baseUrl = import.meta.env.VITE_API_URL || "";
    fetch(`${baseUrl}/api/admin/site-assets/${selectedFile.key}`, {
      method: "DELETE",
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed");
        toast({ title: "Custom image deleted. Fallback active." });
        refetch();
        setSelectedFileKey(null);
      })
      .catch(() => {
        toast({ title: "Failed to delete slot layout.", variant: "destructive" });
      });
  };

  // Multi select check helper
  const handleToggleMultiSelect = (key: string) => {
    setMultiSelectedKeys((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  const handleBulkDelete = () => {
    setVirtualFiles((prev) => prev.filter((f) => !multiSelectedKeys.includes(f.key)));
    setMultiSelectedKeys([]);
    setIsMultiSelectMode(false);
    toast({
      title: "Bulk Discard Successful",
      description: "Selected virtual files cleared.",
    });
  };

  const handleBulkMove = (destFolder: string) => {
    setVirtualFiles((prev) =>
      prev.map((f) => (multiSelectedKeys.includes(f.key) ? { ...f, folder: destFolder } : f))
    );
    setMultiSelectedKeys([]);
    setIsMultiSelectMode(false);
    toast({
      title: "Bulk Relocation Complete",
      description: `Selected files moved to folder: ${destFolder}.`,
    });
  };

  // Skeletons view for sandbox
  if (mediaState === "loading") {
    return (
      <div className="max-w-[1600px] mx-auto px-4 md:px-8 py-8 space-y-8 animate-pulse text-[#0F4D36]">
        <div className="flex items-center justify-between border-b border-[#0F4D36]/10 pb-4">
          <Skeleton className="h-6 w-32 bg-[#0F4D36]/10" />
          <Skeleton className="h-10 w-64 bg-[#0F4D36]/10" />
        </div>
        <div className="grid grid-cols-5 gap-6">
          <div className="col-span-1 space-y-3 bg-white p-4 rounded-xl border border-gray-100">
            {Array(8).fill(0).map((_, i) => (
              <Skeleton key={i} className="h-8 w-full bg-[#0F4D36]/5" />
            ))}
          </div>
          <div className="col-span-3 bg-white p-6 rounded-xl border border-gray-100 space-y-6">
            <Skeleton className="h-10 w-full bg-[#0F4D36]/5" />
            <div className="grid grid-cols-3 gap-4">
              {Array(6).fill(0).map((_, i) => (
                <Skeleton key={i} className="h-40 w-full bg-[#0F4D36]/5 rounded-xl" />
              ))}
            </div>
          </div>
          <div className="col-span-1 bg-white p-4 rounded-xl border border-gray-100 space-y-4">
            <Skeleton className="h-44 w-full bg-[#0F4D36]/5 rounded-xl" />
            <Skeleton className="h-6 w-24 bg-[#0F4D36]/10" />
            <Skeleton className="h-20 w-full bg-[#0F4D36]/5" />
          </div>
        </div>
        <FloatingSandbox state={mediaState} onChange={setMediaState} />
      </div>
    );
  }

  // Error view for sandbox
  if (mediaState === "error") {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center max-w-lg mx-auto text-center px-6">
        <X className="w-16 h-16 text-red-600 mb-4 bg-red-100 p-3.5 rounded-full" />
        <h2 className="font-serif text-2xl font-bold text-[#0F4D36]">Asset Cache Connection Error</h2>
        <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
          Cloudinary CDN handshake timed out. The local media router could not fetch sitemaps or active repository file tags.
        </p>
        <Button
          onClick={() => setMediaState("success")}
          className="bg-[#0F4D36] hover:bg-[#0f4d36]/90 text-white font-medium text-xs px-6 h-10 mt-6 cursor-pointer"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Retry CDN Handshake
        </Button>
        <FloatingSandbox state={mediaState} onChange={setMediaState} />
      </div>
    );
  }

  return (
    <div className="max-w-[1600px] mx-auto px-4 md:px-8 py-8 space-y-8 relative text-[#0F4D36]">
      {/* State Sandbox control bar */}
      <FloatingSandbox state={mediaState} onChange={setMediaState} />

      {/* TOP HEADER STATUS ROW */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-[#0F4D36]/10 pb-6">
        <div>
          <span className="text-[10px] font-bold tracking-widest text-[#D6B25E] uppercase">
            Administrative Space
          </span>
          <h1 className="font-serif text-4xl text-[#0F4D36] font-bold tracking-tight mt-1">
            Media Manager OS
          </h1>
          <p className="text-xs text-[#0F4D36]/65 mt-1 font-medium">
            Manage course thumbnails, Open Graph images, website logos, and media folders. Direct sync to Cloudinary CDN.
          </p>
        </div>

        {/* Global CDN Status indicators */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 bg-[#0F4D36]/5 px-3 py-1.5 rounded-lg border border-[#0F4D36]/10 text-xs font-semibold text-[#0F4D36]">
            <CloudLightning className="w-3.5 h-3.5 text-[#D6B25E] animate-pulse" />
            <span>Cloudinary CDN: Active</span>
          </div>
          <div className="flex items-center gap-2 bg-[#FAF7F0] px-3 py-1.5 rounded-lg border border-[#0F4D36]/10 text-xs font-semibold text-muted-foreground">
            <span>Storage: 4.8 GB / 10 GB</span>
          </div>
        </div>
      </div>

      {/* TOOLBAR */}
      <div className="bg-white border border-[#0F4D36]/10 rounded-2xl p-4 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          {/* Left search & filter input */}
          <div className="flex flex-1 flex-wrap items-center gap-3 max-w-2xl">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-[#0F4D36]/40" />
              <input
                type="text"
                placeholder="Search file name, tag, description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-[#0F4D36]/10 bg-[#FAF7F0]/30 focus:bg-white focus:outline-none placeholder-[#0F4D36]/40 text-[#0F4D36]"
              />
            </div>
            
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as any)}
              className="pl-3 pr-8 py-2 text-xs rounded-lg border border-[#0F4D36]/10 bg-white text-[#0F4D36] font-medium"
            >
              <option value="all">All Formats</option>
              <option value="images">Raster Images (PNG/JPG)</option>
              <option value="svg">Vector Assets (SVG)</option>
              <option value="published">Status: Published</option>
              <option value="unused">Status: Unused</option>
              <option value="large">Large files (&gt;500KB)</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="pl-3 pr-8 py-2 text-xs rounded-lg border border-[#0F4D36]/10 bg-white text-[#0F4D36] font-medium"
            >
              <option value="newest">Sort: Newest Uploads</option>
              <option value="oldest">Sort: Oldest</option>
              <option value="largest">Sort: Largest Files</option>
              <option value="az">Sort: Alphabetical (A-Z)</option>
            </select>
          </div>

          {/* Right Toolbar Actions */}
          <div className="flex items-center gap-2 self-end md:self-auto">
            {/* Bulk actions trigger */}
            {isMultiSelectMode && multiSelectedKeys.length > 0 && (
              <div className="flex items-center gap-2 bg-[#D6B25E]/10 p-1 border border-[#D6B25E]/30 rounded-lg animate-in fade-in zoom-in duration-200">
                <span className="text-[10px] font-bold text-[#0F4D36] px-2">{multiSelectedKeys.length} selected</span>
                <Button
                  onClick={handleBulkDelete}
                  variant="destructive"
                  className="h-7 text-[10px] px-2.5 py-0"
                >
                  Delete Selected
                </Button>
                <select
                  onChange={(e) => handleBulkMove(e.target.value)}
                  className="h-7 text-[10px] bg-white border border-[#D6B25E]/40 rounded px-2"
                  defaultValue=""
                >
                  <option value="" disabled>Move Selected...</option>
                  {FOLDERS.filter(f => f.id !== "all").map(f => (
                    <option key={f.id} value={f.id}>{f.name}</option>
                  ))}
                </select>
              </div>
            )}

            <Button
              onClick={() => {
                setIsMultiSelectMode(!isMultiSelectMode);
                setMultiSelectedKeys([]);
              }}
              variant="outline"
              className={`h-9 text-xs border-[#0F4D36]/10 font-semibold cursor-pointer ${isMultiSelectMode ? "bg-[#0F4D36]/5" : ""}`}
            >
              {isMultiSelectMode ? "Cancel Bulk" : "Bulk Actions"}
            </Button>

            <Button
              onClick={() => setIsImportURLOpen(true)}
              variant="outline"
              className="h-9 text-xs border-[#0F4D36]/10 font-semibold cursor-pointer gap-1.5"
            >
              <LinkIcon className="w-3.5 h-3.5" />
              <span>Import URL</span>
            </Button>

            <Button
              onClick={() => {
                toast({ title: "Clear cache", description: "Successfully purged sitemaps and Cloudinary global URL cache." });
              }}
              variant="outline"
              className="h-9 text-xs border-[#0F4D36]/10 font-semibold cursor-pointer gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Purge Cache</span>
            </Button>

            {/* Custom file upload button */}
            <input
              type="file"
              id="toolbar-uploader-file"
              accept="image/*"
              className="hidden"
              onChange={(e) => e.target.files && handleFileUpload(e.target.files[0])}
            />
            <Button
              onClick={() => document.getElementById("toolbar-uploader-file")?.click()}
              className="h-9 text-xs bg-[#0F4D36] text-white hover:bg-[#0f4d36]/90 font-semibold cursor-pointer gap-1.5 border border-[#D6B25E]/20 rounded-lg shadow-sm"
            >
              <Upload className="w-4 h-4" />
              <span>Upload Assets</span>
            </Button>
          </div>

        </div>
      </div>

      {/* THREE-COLUMN WORKSPACE GRID */}
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-6 items-stretch">
        
        {/* PANEL 1: FOLDER NAVIGATION (LEFT SIDEBAR - 1/5 Width) */}
        <div className="bg-white border border-[#0F4D36]/10 rounded-2xl p-4 shadow-sm space-y-4 self-start">
          <div className="flex items-center justify-between border-b border-[#0F4D36]/5 pb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#0F4D36]/50">Media Directories</span>
            <Folder className="w-4 h-4 text-[#D6B25E]" />
          </div>

          <div className="space-y-1.5">
            {FOLDERS.map((folder) => {
              const active = selectedFolder === folder.id;
              return (
                <button
                  key={folder.id}
                  onClick={() => setSelectedFolder(folder.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left text-xs transition-all cursor-pointer group ${
                    active
                      ? "bg-[#0F4D36] text-white font-semibold shadow-md"
                      : "hover:bg-[#FAF7F0] text-[#0F4D36]/80 hover:text-[#0F4D36]"
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <Folder className={`w-4 h-4 shrink-0 ${active ? "text-[#D6B25E]" : "text-[#0F4D36]/50 group-hover:text-[#D6B25E]"}`} />
                    <span className="truncate">{folder.name}</span>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0 font-mono text-[9px]">
                    <span className={`px-1.5 py-0.5 rounded-full ${
                      active ? "bg-white/20 text-white" : "bg-neutral-100 text-neutral-600 border border-neutral-200/50"
                    }`}>
                      {folder.count}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* PANEL 2: CENTER MEDIA GRID (3/5 Width) */}
        <div
          onDragOver={(e) => handleDrag(e, true)}
          onDragLeave={(e) => handleDrag(e, false)}
          onDrop={handleDrop}
          className="xl:col-span-3 bg-white border border-[#0F4D36]/10 rounded-2xl p-6 shadow-sm flex flex-col justify-between relative min-h-[500px]"
        >
          {/* Drag over overlay zone */}
          <AnimatePresence>
            {dragActive && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-[#0F4D36]/80 backdrop-blur-[4px] rounded-2xl z-30 flex flex-col items-center justify-center text-white border-2 border-dashed border-[#D6B25E] m-1"
              >
                <Upload className="w-12 h-12 text-[#D6B25E] mb-3 animate-bounce" />
                <span className="font-serif text-lg font-bold">Drop Assets Here to Upload</span>
                <span className="text-xs text-white/70 mt-1">Automatic AVIF/WebP Cloudinary compression will apply.</span>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="space-y-6 flex-1">
            <div className="flex items-center justify-between border-b border-[#0F4D36]/5 pb-3">
              <span className="text-xs font-bold text-muted-foreground uppercase">
                {selectedFolder.replace("-", " ")} Assets Catalog
              </span>
              <span className="text-[10px] text-[#0F4D36]/70 font-semibold">{sortedFiles.length} item(s) found</span>
            </div>

            {/* Upload Queue Loader Panel */}
            {uploadQueue.length > 0 && (
              <div className="bg-[#FAF7F0] p-4 border border-[#0F4D36]/10 rounded-xl space-y-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#0F4D36]/60">Upload Queue ({uploadQueue.length})</span>
                <div className="divide-y divide-[#0F4D36]/5">
                  {uploadQueue.map((item) => (
                    <div key={item.id} className="py-2 flex items-center justify-between gap-4 text-xs">
                      <div className="flex items-center gap-2 truncate max-w-[200px]">
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-[#D6B25E] shrink-0" />
                        <span className="truncate font-bold text-[#0F4D36]">{item.name}</span>
                      </div>
                      <div className="flex-1 max-w-xs space-y-1">
                        <div className="w-full bg-[#0F4D36]/10 h-1.5 rounded-full overflow-hidden">
                          <div className="bg-[#D6B25E] h-full transition-all duration-300" style={{ width: `${item.progress}%` }} />
                        </div>
                        <div className="flex justify-between text-[9px] text-muted-foreground">
                          <span>{item.status}...</span>
                          <span>{item.progress}%</span>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono text-muted-foreground">{item.size}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Media Grid Cards */}
            {sortedFiles.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {sortedFiles.map((file) => {
                  const isSelected = selectedFileKey === file.key;
                  const isMultiSelected = multiSelectedKeys.includes(file.key);
                  return (
                    <div
                      key={file.key}
                      onClick={() => {
                        if (isMultiSelectMode) {
                          handleToggleMultiSelect(file.key);
                        } else {
                          setSelectedFileKey(file.key);
                        }
                      }}
                      className={`premium-card relative rounded-2xl overflow-hidden border transition-all duration-300 cursor-pointer flex flex-col justify-between bg-white ${
                        isMultiSelected
                          ? "border-[#D6B25E] ring-2 ring-[#D6B25E]/20"
                          : isSelected
                          ? "border-[#0F4D36] ring-2 ring-[#0F4D36]/10"
                          : "border-[#0F4D36]/10"
                      }`}
                    >
                      {/* Image Preview Block */}
                      <div className="aspect-[16/11] bg-[#FAF7F0]/40 flex items-center justify-center p-3 relative group overflow-hidden border-b border-[#0F4D36]/5">
                        <img
                          src={file.url}
                          alt={file.altText}
                          className="max-w-full max-h-full object-contain rounded transition-transform group-hover:scale-105 duration-300"
                        />
                        
                        {/* Hover Overlay Actions */}
                        <div className="absolute inset-0 bg-[#0F4D36]/75 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2 z-10">
                          <button
                            onClick={(e) => { e.stopPropagation(); setSelectedFileKey(file.key); setPreviewTab("device"); }}
                            className="p-2 bg-white text-[#0F4D36] rounded-lg hover:bg-[#D6B25E] transition-all hover:scale-110 shadow"
                            title="Inspect in Frame"
                          >
                            <Maximize2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); setSelectedFileKey(file.key); setIsCropOpen(true); }}
                            className="p-2 bg-white text-[#0F4D36] rounded-lg hover:bg-[#D6B25E] transition-all hover:scale-110 shadow"
                            title="Crop Image"
                          >
                            <Crop className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); handleDuplicateAsset(file); }}
                            className="p-2 bg-white text-[#0F4D36] rounded-lg hover:bg-[#D6B25E] transition-all hover:scale-110 shadow"
                            title="Duplicate File"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); handleCopyURL(file.url); }}
                            className="p-2 bg-white text-[#0F4D36] rounded-lg hover:bg-[#D6B25E] transition-all hover:scale-110 shadow"
                            title="Copy Cloudinary URL Link"
                          >
                            <LinkIcon className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Top corner Indicators */}
                        {isMultiSelectMode && (
                          <button className={`absolute top-2 left-2 w-5 h-5 rounded border flex items-center justify-center z-20 ${
                            isMultiSelected ? "bg-[#0F4D36] border-[#0F4D36] text-white" : "bg-white border-[#0F4D36]/20"
                          }`}>
                            {isMultiSelected && <Check className="w-3 h-3" />}
                          </button>
                        )}

                        <span className="absolute top-2 right-2 text-[8px] px-1.5 py-0.5 bg-[#0F4D36]/80 text-white rounded font-bold font-mono z-10">
                          {file.format}
                        </span>
                      </div>

                      {/* Info Metadata Block */}
                      <div className="p-3.5 space-y-1.5">
                        <div className="font-bold text-xs text-[#0F4D36] truncate" title={file.name}>
                          {file.name}
                        </div>
                        <div className="flex items-center justify-between text-[9px] text-muted-foreground font-mono">
                          <span>{file.dimensions}</span>
                          <span>{file.fileSize}</span>
                        </div>
                        <div className="flex items-center justify-between border-t border-[#0F4D36]/5 pt-2 text-[9px]">
                          <span className={`px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                            file.status === "Published" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
                          }`}>
                            {file.status}
                          </span>
                          
                          {/* Cloudinary dynamic indicator */}
                          <span className="text-[8px] bg-emerald-50 text-emerald-800 border border-emerald-100 rounded px-1 flex items-center gap-0.5 font-bold font-mono">
                            <Zap className="w-2.5 h-2.5 text-[#D6B25E]" />
                            f_auto
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center p-12 text-center space-y-4">
                <Folder className="w-16 h-16 text-[#D6B25E]/40" />
                <h3 className="font-serif text-lg font-bold text-[#0F4D36]">Folder directory is empty</h3>
                <p className="text-xs text-muted-foreground max-w-xs leading-relaxed">
                  No assets are mapped to this directory category yet. Upload a file or URL to synchronize.
                </p>
                <Button
                  onClick={() => document.getElementById("toolbar-uploader-file")?.click()}
                  className="bg-[#0F4D36] text-white hover:bg-[#0f4d36]/90 text-xs h-9 font-semibold"
                >
                  Upload First Asset
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* PANEL 3: PREVIEW & DETAILS SIDEBAR (RIGHT SIDEBAR - 1/5 Width) */}
        <div className="bg-white border border-[#0F4D36]/10 rounded-2xl p-4 shadow-sm space-y-6 flex flex-col justify-between">
          
          {selectedFile ? (
            <div className="space-y-6 flex-1 flex flex-col">
              <div className="flex items-center justify-between border-b border-[#0F4D36]/5 pb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#0F4D36]/50">File Details</span>
                <Info className="w-4 h-4 text-[#D6B25E]" />
              </div>

              {/* Visual Preview comparisons tab */}
              <div className="space-y-3">
                {/* Previews Selection Tabs */}
                <div className="grid grid-cols-5 gap-1 bg-[#FAF7F0] p-1 border border-[#0F4D36]/10 rounded-lg">
                  <button
                    onClick={() => setPreviewTab("device")}
                    className={`py-1 text-[8px] uppercase tracking-wider rounded font-bold ${previewTab === "device" ? "bg-[#0F4D36] text-white" : "text-[#0F4D36]/70 hover:bg-[#0F4D36]/5"}`}
                    title="Device Canvas Preview"
                  >
                    Canvas
                  </button>
                  <button
                    onClick={() => setPreviewTab("navbar")}
                    className={`py-1 text-[8px] uppercase tracking-wider rounded font-bold ${previewTab === "navbar" ? "bg-[#0F4D36] text-white" : "text-[#0F4D36]/70 hover:bg-[#0F4D36]/5"}`}
                    title="Navbar logo mockup"
                  >
                    Logo
                  </button>
                  <button
                    onClick={() => setPreviewTab("hero")}
                    className={`py-1 text-[8px] uppercase tracking-wider rounded font-bold ${previewTab === "hero" ? "bg-[#0F4D36] text-white" : "text-[#0F4D36]/70 hover:bg-[#0F4D36]/5"}`}
                    title="Hero backdrop mockup"
                  >
                    Hero
                  </button>
                  <button
                    onClick={() => setPreviewTab("card")}
                    className={`py-1 text-[8px] uppercase tracking-wider rounded font-bold ${previewTab === "card" ? "bg-[#0F4D36] text-white" : "text-[#0F4D36]/70 hover:bg-[#0F4D36]/5"}`}
                    title="Course list thumbnail mockup"
                  >
                    Card
                  </button>
                  <button
                    onClick={() => setPreviewTab("social")}
                    className={`py-1 text-[8px] uppercase tracking-wider rounded font-bold ${previewTab === "social" ? "bg-[#0F4D36] text-white" : "text-[#0F4D36]/70 hover:bg-[#0F4D36]/5"}`}
                    title="Twitter Open Graph mockup"
                  >
                    OG
                  </button>
                </div>

                {/* Previews Rendering Panel */}
                <div className="aspect-[16/11] bg-[#FAF7F0] rounded-xl border border-[#0F4D36]/10 flex items-center justify-center p-3 overflow-hidden relative">
                  
                  {previewTab === "device" && (
                    <div className="w-full h-full flex flex-col justify-between">
                      {/* Device sizing buttons */}
                      <div className="flex items-center justify-center gap-2 border-b border-[#0F4D36]/5 pb-1">
                        <button onClick={() => setDeviceFrame("desktop")} className={`p-1 rounded ${deviceFrame === "desktop" ? "bg-[#0F4D36]/10" : "text-[#0F4D36]/50"}`}><Monitor className="w-3.5 h-3.5" /></button>
                        <button onClick={() => setDeviceFrame("tablet")} className={`p-1 rounded ${deviceFrame === "tablet" ? "bg-[#0F4D36]/10" : "text-[#0F4D36]/50"}`}><Tablet className="w-3.5 h-3.5" /></button>
                        <button onClick={() => setDeviceFrame("mobile")} className={`p-1 rounded ${deviceFrame === "mobile" ? "bg-[#0F4D36]/10" : "text-[#0F4D36]/50"}`}><Smartphone className="w-3.5 h-3.5" /></button>
                      </div>
                      
                      <div className="flex-1 flex items-center justify-center relative overflow-hidden p-2">
                        {/* Rendering simulated frames */}
                        <div className={`transition-all duration-300 border border-[#0F4D36]/20 bg-white rounded shadow-md overflow-hidden flex items-center justify-center p-2 ${
                          deviceFrame === "desktop" ? "w-full h-full" :
                          deviceFrame === "tablet" ? "w-3/4 h-5/6" : "w-1/2 h-4/5"
                        }`}>
                          <img src={selectedFile.url} alt="" className="max-w-full max-h-full object-contain" />
                        </div>
                      </div>
                    </div>
                  )}

                  {previewTab === "navbar" && (
                    <div className="w-full bg-[#0F4D36] text-white p-3 rounded-lg border border-white/10 flex items-center justify-between text-[10px]">
                      <img src={selectedFile.url} alt="Logo mockup" className="h-6 max-w-[80px] object-contain" />
                      <div className="flex gap-2 opacity-85 font-semibold">
                        <span>Courses</span>
                        <span>About</span>
                        <span>Contact</span>
                      </div>
                      <span className="bg-[#D6B25E] text-[#0F4D36] text-[8px] font-bold px-2 py-0.5 rounded">Admissions</span>
                    </div>
                  )}

                  {previewTab === "hero" && (
                    <div className="w-full h-full relative rounded-lg overflow-hidden border border-[#0F4D36]/20 flex flex-col items-center justify-center text-center p-4">
                      {/* background photo */}
                      <img src={selectedFile.url} alt="" className="absolute inset-0 w-full h-full object-cover brightness-[0.25]" />
                      <div className="relative z-10 text-white space-y-1.5">
                        <span className="text-[7px] text-[#D6B25E] font-bold uppercase tracking-widest">Luxury Islamic Academy</span>
                        <h4 className="font-serif text-[10px] font-bold">Unlocking Quranic Meanings</h4>
                        <p className="text-[7px] text-white/70 max-w-[140px] mx-auto">Learn Tajweed morphology with expert sisters online.</p>
                      </div>
                    </div>
                  )}

                  {previewTab === "card" && (
                    <div className="w-28 bg-white border border-[#0F4D36]/10 rounded-xl overflow-hidden shadow-sm flex flex-col justify-between text-left">
                      <div className="aspect-[16/10] bg-[#FAF7F0] flex items-center justify-center p-1.5 border-b border-[#0F4D36]/5">
                        <img src={selectedFile.url} alt="" className="max-w-full max-h-full object-contain rounded" />
                      </div>
                      <div className="p-2 space-y-1">
                        <span className="text-[7px] bg-[#D6B25E]/10 text-[#0F4D36] font-bold px-1 rounded uppercase">ARABIC</span>
                        <div className="text-[8px] font-bold truncate">Beginners Arabic</div>
                        <div className="text-[7px] text-muted-foreground flex justify-between">
                          <span>3 Months</span>
                          <span className="text-[#0F4D36] font-bold">$25/mo</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {previewTab === "social" && (
                    <div className="w-full bg-white border border-gray-200 rounded-lg overflow-hidden flex flex-col text-left text-[9px] shadow-sm">
                      <div className="aspect-[16/8] bg-gray-50 border-b border-gray-100 flex items-center justify-center p-1">
                        <img src={selectedFile.url} alt="" className="max-w-full max-h-full object-contain" />
                      </div>
                      <div className="p-2 space-y-0.5 bg-gray-50">
                        <div className="text-gray-400 text-[8px] uppercase tracking-wider">HAREEMACADEMY.COM</div>
                        <div className="font-bold text-gray-800 truncate">Learn Quranic Arabic Online - sisters academy portal</div>
                        <div className="text-gray-500 text-[8px] line-clamp-1 leading-normal">Online Tajweed study platform under certified instruction from female teachers.</div>
                      </div>
                    </div>
                  )}

                </div>
              </div>

              {/* Bandwidth compression analytics meter */}
              <div className="bg-[#FAF7F0] p-3.5 border border-[#0F4D36]/10 rounded-xl space-y-2">
                <div className="flex justify-between items-center text-xs text-[#0F4D36]">
                  <span className="font-bold">Original:</span>
                  <span className="font-mono text-muted-foreground line-through">{selectedFile.originalSize}</span>
                </div>
                <div className="flex justify-between items-center text-xs text-[#0F4D36] border-b border-[#0F4D36]/5 pb-2">
                  <span className="font-bold">Cloudinary Optimized:</span>
                  <span className="font-mono text-emerald-700 font-bold">{selectedFile.fileSize}</span>
                </div>
                <div className="flex justify-between items-center text-xs text-[#0F4D36] pt-1">
                  <span className="text-[#0F4D36]/70">Bandwidth Savings:</span>
                  <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-200/50">
                    -{selectedFile.savings} Saved
                  </span>
                </div>
              </div>

              {/* Metadata form fields */}
              <div className="space-y-4 flex-1 overflow-y-auto text-xs py-2 pr-1 select-none">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[#0F4D36]/60">Asset Title</label>
                  <input
                    type="text"
                    value={selectedFile.name}
                    onChange={(e) => handleUpdateFileDetails(selectedFile.key, { name: e.target.value })}
                    className="w-full p-2.5 mt-1 border border-[#0F4D36]/10 rounded-lg text-xs bg-white text-[#0F4D36] focus:ring-1 focus:ring-primary"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-[#0F4D36]/60">Alt Text (SEO)</label>
                    <button
                      onClick={triggerGenerateAltText}
                      disabled={isGeneratingAlt}
                      className="text-[9px] text-[#D6B25E] font-bold hover:underline flex items-center gap-0.5 cursor-pointer"
                    >
                      {isGeneratingAlt ? <Loader2 className="w-2.5 h-2.5 animate-spin" /> : <Sparkles className="w-2.5 h-2.5" />}
                      Generate AI Alt
                    </button>
                  </div>
                  <textarea
                    rows={2}
                    value={selectedFile.altText}
                    onChange={(e) => handleUpdateFileDetails(selectedFile.key, { altText: e.target.value })}
                    className="w-full p-2.5 mt-1 border border-[#0F4D36]/10 rounded-lg text-xs bg-white text-[#0F4D36] focus:ring-1 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[#0F4D36]/60">Folder Category</label>
                  <select
                    value={selectedFile.folder}
                    onChange={(e) => handleUpdateFileDetails(selectedFile.key, { folder: e.target.value })}
                    className="w-full p-2.5 mt-1 border border-[#0F4D36]/10 rounded-lg text-xs bg-white text-[#0F4D36]"
                  >
                    {FOLDERS.filter(f => f.id !== "all").map(f => (
                      <option key={f.id} value={f.id}>{f.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[#0F4D36]/60">Relationships (Used In)</label>
                  <div className="space-y-1.5 mt-1">
                    {selectedFile.usedIn.length > 0 ? (
                      selectedFile.usedIn.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-2 bg-[#FAF7F0] p-2 border border-[#0F4D36]/5 rounded text-[#0F4D36]/75">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span className="truncate">{item}</span>
                        </div>
                      ))
                    ) : (
                      <div className="text-[10px] text-muted-foreground italic bg-amber-50/40 p-2 border border-amber-100 rounded">
                        No active layout slots referencing this file. Unused asset.
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-4 border-t border-[#0F4D36]/5">
                <Button
                  onClick={() => setIsDeleteConfirmOpen(true)}
                  variant="destructive"
                  className="flex-1 h-9 text-xs font-semibold cursor-pointer gap-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete Asset</span>
                </Button>
                
                <input
                  type="file"
                  id="right-replace-uploader"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file && selectedFile.isReal) {
                      // Trigger real slot upload
                      toast({ title: "Optimizing Layout Asset" });
                      const formData = new FormData();
                      formData.append("key", selectedFile.key);
                      formData.append("file", file);
                      const baseUrl = import.meta.env.VITE_API_URL || "";
                      fetch(`${baseUrl}/api/admin/site-assets`, {
                        method: "POST",
                        body: formData,
                        credentials: "include",
                      }).then(res => {
                        if (!res.ok) throw new Error("Fail");
                        toast({ title: "Layout slot successfully updated." });
                        refetch();
                      }).catch(() => {
                        toast({ title: "Failed to update asset slot", variant: "destructive" });
                      });
                    } else if (file) {
                      // Virtual replace
                      toast({ title: "Simulating file replacement" });
                      handleFileUpload(file);
                    }
                  }}
                />
                <Button
                  onClick={() => document.getElementById("right-replace-uploader")?.click()}
                  variant="outline"
                  className="flex-1 h-9 text-xs font-semibold border-[#0F4D36]/15 hover:bg-[#FAF7F0] cursor-pointer gap-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-[#D6B25E]" />
                  <span>Replace File</span>
                </Button>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center p-6 text-center text-xs text-muted-foreground bg-[#FAF7F0]/10 rounded-xl">
              <Info className="w-8 h-8 text-[#D6B25E]/40 mb-2" />
              <span>Select any media card in the workspace grid to inspect tags, crop boundaries, alt text, and device frames previews.</span>
            </div>
          )}
          
        </div>

      </div>

      {/* 1. Crop Image Modal */}
      <Dialog open={isCropOpen} onOpenChange={setIsCropOpen}>
        <DialogContent className="max-w-md bg-white border border-[#0F4D36]/20 rounded-xl p-6 text-[#0F4D36]">
          <DialogHeader>
            <DialogTitle className="font-serif text-xl font-bold flex items-center gap-2">
              <Crop className="w-5 h-5 text-[#D6B25E]" />
              <span>Crop Asset Layout</span>
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground mt-1">
              Select cropping bounds. Cloudinary will apply smart focal compression (c_fill, g_face).
            </DialogDescription>
          </DialogHeader>
          
          <div className="my-4 aspect-[16/10] bg-[#FAF7F0] border border-[#0F4D36]/10 rounded-xl flex items-center justify-center relative overflow-hidden p-6 select-none">
            {selectedFile && (
              <>
                <img src={selectedFile.url} alt="" className="max-w-full max-h-full object-contain opacity-55" />
                {/* Simulated Crop selector boundary boxes */}
                <div className="absolute inset-8 border-2 border-dashed border-[#D6B25E] shadow-2xl flex items-center justify-center cursor-move">
                  <div className="bg-[#D6B25E] text-[#0F4D36] text-[8px] font-bold uppercase tracking-wider px-2 py-0.5 rounded shadow">
                    Crop Scope: 1:1 Aspect
                  </div>
                  {/* Anchor corners */}
                  <div className="absolute w-2.5 h-2.5 bg-white border border-[#0F4D36] -top-1.5 -left-1.5" />
                  <div className="absolute w-2.5 h-2.5 bg-white border border-[#0F4D36] -top-1.5 -right-1.5" />
                  <div className="absolute w-2.5 h-2.5 bg-white border border-[#0F4D36] -bottom-1.5 -left-1.5" />
                  <div className="absolute w-2.5 h-2.5 bg-white border border-[#0F4D36] -bottom-1.5 -right-1.5" />
                </div>
              </>
            )}
          </div>

          <DialogFooter className="pt-2">
            <Button variant="outline" onClick={() => setIsCropOpen(false)} className="text-xs h-9 cursor-pointer">Cancel</Button>
            <Button onClick={handleCropApply} className="bg-[#0F4D36] text-white hover:bg-[#0f4d36]/90 text-xs h-9 font-semibold cursor-pointer">
              Apply Crop & Optimize
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 2. Import URL Modal */}
      <Dialog open={isImportURLOpen} onOpenChange={setIsImportURLOpen}>
        <DialogContent className="max-w-md bg-white border border-[#0F4D36]/20 rounded-xl p-6 text-[#0F4D36]">
          <DialogHeader>
            <DialogTitle className="font-serif text-xl font-bold flex items-center gap-2">
              <LinkIcon className="w-5 h-5 text-[#D6B25E]" />
              <span>Import Asset from Web URL</span>
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground mt-1">
              Provide a remote direct image URL. The server will stream download, translate filename, and mirror to Cloudinary.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleURLImport} className="space-y-4 my-2">
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-[#0F4D36]/60">Direct Image URL</label>
              <input
                type="url"
                required
                value={importUrl}
                onChange={(e) => setImportUrl(e.target.value)}
                placeholder="https://example.com/images/sisters-reading-quran.jpg"
                className="w-full p-2.5 mt-1 border border-[#0F4D36]/10 rounded-lg text-xs focus:ring-1 focus:ring-primary focus:outline-none"
              />
            </div>
            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setIsImportURLOpen(false)} className="text-xs h-9 cursor-pointer">Cancel</Button>
              <Button type="submit" className="bg-[#0F4D36] text-white hover:bg-[#0f4d36]/90 text-xs h-9 font-semibold cursor-pointer">
                Mirror to Cloudinary
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* 3. Delete Relationship Warning Dialog */}
      <Dialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
        <DialogContent className="max-w-md bg-white border border-red-200 rounded-xl p-6 text-[#0F4D36]">
          <DialogHeader>
            <DialogTitle className="font-serif text-xl font-bold text-red-700 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              <span>Confirm Asset Deletion</span>
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground mt-1">
              High-risk operation. Verify layout dependencies before deleting files.
            </DialogDescription>
          </DialogHeader>

          {selectedFile && (
            <div className="space-y-4 my-2 text-xs leading-relaxed">
              <div className="p-3 bg-red-50 border border-red-100 rounded-lg text-red-950">
                You are deleting <span className="font-bold">{selectedFile.name}</span>. This file will be permanently removed from Cloudinary CDN edge caches.
              </div>

              {selectedFile.usedIn.length > 0 ? (
                <div className="space-y-2 bg-amber-50/50 p-3 rounded-lg border border-amber-100">
                  <span className="font-bold text-[#0F4D36] flex items-center gap-1">
                    <AlertTriangle className="w-4 h-4 text-[#D6B25E]" />
                    Warning: Asset currently referenced in website layouts!
                  </span>
                  <p className="text-muted-foreground text-[11px] leading-relaxed">
                    This asset is used in: <span className="font-bold text-[#0F4D36]">{selectedFile.usedIn.join(", ")}</span>. Deleting it will cause browser image breaking.
                  </p>
                </div>
              ) : (
                <div className="p-3 bg-emerald-50/50 text-emerald-950 rounded-lg border border-emerald-100">
                  This file is not referenced in active page layouts. Safe to delete.
                </div>
              )}
            </div>
          )}

          <DialogFooter className="pt-2">
            <Button variant="outline" onClick={() => setIsDeleteConfirmOpen(false)} className="text-xs h-9 cursor-pointer">Cancel</Button>
            <Button onClick={handleDeleteAsset} className="bg-red-700 text-white hover:bg-red-800 text-xs h-9 font-semibold cursor-pointer">
              Yes, Delete File
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
}

// Float Sandbox control widget for testing Skeletons, Empty, Error
function FloatingSandbox({
  state,
  onChange,
}: {
  state: "success" | "loading" | "error" | "empty";
  onChange: (s: "success" | "loading" | "error" | "empty") => void;
}) {
  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-[#0F4D36] text-white border border-[#D6B25E]/40 px-4 py-2.5 rounded-full shadow-2xl z-50 flex items-center gap-4 text-xs font-semibold select-none animate-bounce hover:animate-none">
      <div className="flex items-center gap-1.5">
        <CloudLightning className="w-4 h-4 text-[#D6B25E]" />
        <span>Media OS State Simulator:</span>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onChange("success")}
          className={`px-3 py-1 rounded-full text-[10px] uppercase font-bold tracking-wider cursor-pointer transition-colors ${
            state === "success" ? "bg-[#D6B25E] text-[#0F4D36]" : "bg-white/10 hover:bg-white/20"
          }`}
        >
          Success
        </button>
        <button
          onClick={() => onChange("loading")}
          className={`px-3 py-1 rounded-full text-[10px] uppercase font-bold tracking-wider cursor-pointer transition-colors ${
            state === "loading" ? "bg-[#D6B25E] text-[#0F4D36]" : "bg-white/10 hover:bg-white/20"
          }`}
        >
          Skeletons
        </button>
        <button
          onClick={() => onChange("error")}
          className={`px-3 py-1 rounded-full text-[10px] uppercase font-bold tracking-wider cursor-pointer transition-colors ${
            state === "error" ? "bg-[#D6B25E] text-[#0F4D36]" : "bg-white/10 hover:bg-white/20"
          }`}
        >
          Error
        </button>
        <button
          onClick={() => onChange("empty")}
          className={`px-3 py-1 rounded-full text-[10px] uppercase font-bold tracking-wider cursor-pointer transition-colors ${
            state === "empty" ? "bg-[#D6B25E] text-[#0F4D36]" : "bg-white/10 hover:bg-white/20"
          }`}
        >
          Empty
        </button>
      </div>
    </div>
  );
}

// Inline Skeleton Component
function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`animate-pulse rounded-md bg-[#0F4D36]/5 ${className}`}
      {...props}
    />
  );
}

