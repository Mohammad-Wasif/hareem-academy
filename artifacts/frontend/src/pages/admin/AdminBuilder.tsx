import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { adminApi } from "@/lib/adminApi";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  FileText,
  ArrowUp,
  ArrowDown,
  Eye,
  EyeOff,
  Trash2,
  Copy,
  Plus,
  Monitor,
  Tablet,
  Smartphone,
  ZoomIn,
  ZoomOut,
  Undo2,
  Redo2,
  AlertTriangle,
  ChevronDown,
  ExternalLink,
  Settings,
  Share2,
  Palette,
  Type,
  CheckCircle,
} from "lucide-react";
import { toast } from "sonner";
import { seoLandingPages } from "@/data/seoLandingPages";

// Theme configuration interface
interface PageTheme {
  fontFamily: "serif" | "sans" | "mono";
  primaryColor: string;
  accentColor: string;
  backgroundColor: string;
  baseFontSize: "sm" | "base" | "lg";
}

// Page configuration interface
interface ExtendedPageConfig {
  slug: string;
  title: string;
  metaDescription: string;
  sections: { id: string; name: string; visible: boolean }[];
  theme?: PageTheme;
  
  // Custom pages configs
  heroTitle?: string;
  heroSubtitle?: string;
  aiAnswerBlock?: string;
  benefitsTitle?: string;
  benefits?: { title: string; description: string }[];
  curriculumTitle?: string;
  curriculum?: { title: string; description: string }[];
  moatPoints?: { title: string; description: string }[];
  testimonials?: { name: string; location: string; quote: string }[];
  faqs?: { question: string; answer: string }[];
  internalLinks?: { label: string; href: string }[];
  primaryCTA?: string;
  targetCourseSlug?: string;
  geoContext?: string;

  // Prose pages (legal / policies)
  proseTitle?: string;
  proseBody?: string;
}

// Default static prose configs for legal pages seed
const defaultProseConfigs: Record<string, Partial<ExtendedPageConfig>> = {
  privacy: {
    title: "Privacy Policy | Hareem Academy",
    metaDescription: "Privacy policy and data protection guidelines for Hareem Academy students and visitors.",
    proseTitle: "Privacy Policy",
    proseBody: `At Hareem Academy, we take your privacy seriously. We are committed to protecting the personal information of our students and visitors, especially given our focus on providing a secure, female-only environment.\n\n### 1. Information We Collect\nWhen you enroll or contact us, we collect necessary information including your name, WhatsApp number, email address, age, and location.\n\n### 2. How We Use Your Information\nWe use your information solely to process your enrollment, communicate class links, and respond to inquiries.\n\n### 3. Data Protection\nYour data is stored securely. We do not sell, trade, or rent your personal information to third parties. Class Zoom feeds are strictly protected.`,
  },
  terms: {
    title: "Terms of Service | Hareem Academy",
    metaDescription: "Terms of service and learning code of conduct for Hareem Academy students.",
    proseTitle: "Terms of Service",
    proseBody: `Welcome to Hareem Academy. By accessing our classes and resources, you agree to comply with the following terms and guidelines.\n\n### 1. Classroom Conduct\nClasses are strictly female-only batches. Direct screenshotting, sharing room credentials, or distributing session recordings without written authorization is prohibited.\n\n### 2. Batch Attendance & Scheduling\nSchedules are set based on batch registration. Makeup classes are provided at teacher discretion for pre-approved leaves.\n\n### 3. Account Security\nCredentials should be kept confidential and never shared with other family members.`,
  },
  refund: {
    title: "Refund Policy | Hareem Academy",
    metaDescription: "Refund and deposit cancellation guidelines for Hareem Academy courses.",
    proseTitle: "Refund Policy",
    proseBody: `Thank you for studying with us. Please review our course registration refund terms:\n\n### 1. Trial Batches\nFree trial classes require no credit card information or deposits. You may attend the first class without obligation.\n\n### 2. Cancellations\nOnce paid monthly fees are processed, cancellations take effect from the next billing cycle. Refund of active running month fees is not permitted unless under extenuating circumstances verified by administration.`,
  }
};

// Default Home Page Config Seed
const defaultHomeConfig: Partial<ExtendedPageConfig> = {
  title: "Online Quran & Arabic Classes for Sisters | Hareem Academy",
  metaDescription: "Live, female-only online Quran and Arabic classes. Learn Tajweed and meaning in a comfortable, judgment-free environment.",
  heroTitle: "Structured Arabic & Urdu Learning for Sisters",
  heroSubtitle: "Live online Arabic and Urdu classes taught by qualified female teachers through structured, beginner-friendly lessons designed for sisters worldwide.",
  primaryCTA: "Explore Courses",
  benefitsTitle: "Why Sisters Choose Our Online batches",
  geoContext: "Exclusively for Girls & Sisters globally.",
  proseTitle: "Welcome to Hareem Academy",
  proseBody: "Providing premium female-led Islamic instruction in absolute privacy.",
  sections: [
    { id: "hero", name: "Hero Banner", visible: true },
    { id: "overview", name: "Dynamic Overview", visible: true },
    { id: "benefits", name: "Core Benefits", visible: true },
    { id: "moat", name: "Privacy Moat", visible: true },
    { id: "cta", name: "Closing Call-to-Action", visible: true }
  ]
};

export default function AdminBuilder() {
  const [, setLocation] = useLocation();

  // Page DB states
  const [pages, setPages] = useState<Record<string, ExtendedPageConfig>>({});
  const [selectedSlug, setSelectedSlug] = useState<string>("learn-arabic-online-for-sisters");
  const [activePage, setActivePage] = useState<ExtendedPageConfig | null>(null);

  // Layout states
  const [activeDevice, setActiveDevice] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [selectedSectionId, setSelectedSectionId] = useState<string>("hero");

  // Undo/Redo history states
  const [historyStack, setHistoryStack] = useState<ExtendedPageConfig[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);

  // Dialog states
  const [isNewPageOpen, setIsNewPageOpen] = useState(false);
  const [isSectionLibraryOpen, setIsSectionLibraryOpen] = useState(false);

  // Form states
  const [newPageForm, setNewPageForm] = useState({ title: "", slug: "custom-landing-page" });
  const [activeTab, setActiveTab] = useState<string>("content");

  // Inline edit state
  const [inlineEditingField, setInlineEditingField] = useState<{ sectionId: string; field: string } | null>(null);
  const [inlineEditText, setInlineEditText] = useState("");

  // Load from database (with static fallback seed)
  useEffect(() => {
    let active = true;

    const loadData = async () => {
      try {
        const rows = await adminApi.listLandingPages();
        if (!active) return;

        let loadedPages: Record<string, ExtendedPageConfig> = {};
        rows.forEach((row: any) => {
          const config = row.config || {};
          loadedPages[row.slug] = {
            ...config,
            slug: row.slug,
            title: row.title,
            metaDescription: row.metaDescription || "",
          };
        });

        // Seed core default pages if not existing
        const coreSeeds: Record<string, Partial<ExtendedPageConfig>> = {
          home: defaultHomeConfig,
          privacy: defaultProseConfigs.privacy,
          terms: defaultProseConfigs.terms,
          refund: defaultProseConfigs.refund,
        };

        for (const [slug, defaults] of Object.entries(coreSeeds)) {
          if (!loadedPages[slug]) {
            const pageData = {
              sections: defaults.sections || [
                { id: "prose", name: "Document Prose Content", visible: true },
              ],
              theme: {
                fontFamily: "serif" as const,
                primaryColor: "#0F4D36",
                accentColor: "#ECC565",
                backgroundColor: "#FDFCF7",
                baseFontSize: "base" as const
              },
              ...defaults,
            };

            try {
              await adminApi.createLandingPage({
                slug,
                title: defaults.title || "Legal Page",
                metaDescription: defaults.metaDescription || "",
                config: pageData,
              });

              loadedPages[slug] = {
                ...pageData,
                slug,
                title: defaults.title || "Legal Page",
                metaDescription: defaults.metaDescription || "",
              };
            } catch (err) {
              console.error(`Failed to seed core page (${slug}):`, err);
            }
          }
        }

        // Seed static landing pages if missing
        for (const [slug, cfg] of Object.entries(seoLandingPages)) {
          if (!loadedPages[slug]) {
            const pageData = {
              sections: [
                { id: "hero", name: "Hero Banner", visible: true },
                { id: "overview", name: "Overview Summary", visible: true },
                { id: "benefits", name: "Core Benefits", visible: true },
                { id: "moat", name: "Privacy Moat", visible: true },
                { id: "curriculum", name: "Curriculum Roadmap", visible: true },
                { id: "testimonials", name: "Student Reviews", visible: true },
                { id: "faqs", name: "FAQs Accordion", visible: true },
                { id: "related", name: "Related Programs", visible: true },
                { id: "cta", name: "Closing Call-to-Action", visible: true },
              ],
              theme: {
                fontFamily: "serif" as const,
                primaryColor: "#0F4D36",
                accentColor: "#ECC565",
                backgroundColor: "#FDFCF7",
                baseFontSize: "base" as const
              },
              ...cfg,
            };

            try {
              await adminApi.createLandingPage({
                slug,
                title: cfg.title,
                metaDescription: cfg.metaDescription || "",
                config: pageData,
              });

              loadedPages[slug] = {
                ...pageData,
                slug,
                title: cfg.title,
                metaDescription: cfg.metaDescription || "",
              };
            } catch (err) {
              console.error("Failed to seed landing page in DB:", err);
            }
          }
        }

        setPages(loadedPages);
        if (loadedPages[selectedSlug]) {
          setActivePage(loadedPages[selectedSlug]);
          setHistoryStack([loadedPages[selectedSlug]]);
          setHistoryIndex(0);
        }
      } catch (err) {
        console.error("Error loading visual builder data:", err);
        toast.error("Failed to load landing pages from backend database.");
      }
    };

    loadData();

    return () => {
      active = false;
    };
  }, []);

  // Update page configurations and record history
  const updateActivePage = (nextPage: ExtendedPageConfig, recordHistory = true) => {
    setActivePage(nextPage);
    setPages((prev) => ({ ...prev, [nextPage.slug]: nextPage }));

    if (recordHistory) {
      const nextStack = historyStack.slice(0, historyIndex + 1);
      nextStack.push(JSON.parse(JSON.stringify(nextPage)));
      setHistoryStack(nextStack);
      setHistoryIndex(nextStack.length - 1);
    }
  };

  // Undo/Redo triggers
  const handleUndo = () => {
    if (historyIndex > 0) {
      const prevIndex = historyIndex - 1;
      setHistoryIndex(prevIndex);
      setActivePage(historyStack[prevIndex]);
      setPages((prev) => ({ ...prev, [historyStack[prevIndex].slug]: historyStack[prevIndex] }));
      toast.info("Undo: Reverted last edit.");
    }
  };

  const handleRedo = () => {
    if (historyIndex < historyStack.length - 1) {
      const nextIndex = historyIndex + 1;
      setHistoryIndex(nextIndex);
      setActivePage(historyStack[nextIndex]);
      setPages((prev) => ({ ...prev, [historyStack[nextIndex].slug]: historyStack[nextIndex] }));
      toast.info("Redo: Restored edit.");
    }
  };

  // Move section nodes in sidebar list
  const moveSection = (index: number, direction: "up" | "down") => {
    if (!activePage) return;
    const nextSections = [...activePage.sections];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= nextSections.length) return;

    const temp = nextSections[index];
    nextSections[index] = nextSections[targetIndex];
    nextSections[targetIndex] = temp;

    const nextPage = { ...activePage, sections: nextSections };
    updateActivePage(nextPage);
    toast.success(`Moved ${temp.name} ${direction}.`);
  };

  // Toggle visibility of sections
  const toggleVisibility = (index: number) => {
    if (!activePage) return;
    const nextSections = [...activePage.sections];
    nextSections[index].visible = !nextSections[index].visible;
    const nextPage = { ...activePage, sections: nextSections };
    updateActivePage(nextPage);
    toast.success(`${nextSections[index].name} visibility updated.`);
  };

  // Save Page Changes to Database
  const handleSaveDraft = async () => {
    if (!activePage) return;
    try {
      const { slug, title, metaDescription, ...config } = activePage;
      await adminApi.updateLandingPage(slug, {
        title,
        metaDescription: metaDescription || "",
        config,
      });
      toast.success("Draft saved successfully in the database!");
    } catch (err: any) {
      toast.error(`Failed to save draft: ${err.message}`);
    }
  };

  // Publish Page Changes
  const handlePublishPage = async () => {
    if (!activePage) return;
    try {
      const { slug, title, metaDescription, ...config } = activePage;
      await adminApi.updateLandingPage(slug, {
        title,
        metaDescription: metaDescription || "",
        config,
      });
      toast.success(`Published page "${activePage.title}" to live website!`);
    } catch (err: any) {
      toast.error(`Failed to publish page: ${err.message}`);
    }
  };

  // Create custom new landing page
  const handleCreateNewPage = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanSlug = newPageForm.slug.toLowerCase().replace(/[^a-z0-9-_]/g, "");
    if (pages[cleanSlug]) {
      toast.error("A page with this URL slug already exists!");
      return;
    }

    const baseTemplate = seoLandingPages["learn-arabic-online-for-sisters"] || {
      heroTitle: newPageForm.title,
      heroSubtitle: "Interactive learning courses designed exclusively for sisters.",
    };

    const newPage: ExtendedPageConfig = {
      ...baseTemplate,
      slug: cleanSlug,
      title: newPageForm.title,
      metaDescription: `Join our dynamic classes for ${newPageForm.title} online.`,
      sections: [
        { id: "hero", name: "Hero Banner", visible: true },
        { id: "overview", name: "Dynamic Overview", visible: true },
        { id: "benefits", name: "Core Benefits", visible: true },
        { id: "moat", name: "Privacy Moat", visible: true },
        { id: "faqs", name: "FAQs Accordion", visible: true },
        { id: "cta", name: "Closing Call-to-Action", visible: true },
      ],
      theme: {
        fontFamily: "serif" as const,
        primaryColor: "#0F4D36",
        accentColor: "#ECC565",
        backgroundColor: "#FDFCF7",
        baseFontSize: "base" as const
      },
    };

    try {
      const { slug, title, metaDescription, ...config } = newPage;
      await adminApi.createLandingPage({
        slug,
        title,
        metaDescription: metaDescription || "",
        config,
      });

      setPages((prev) => ({ ...prev, [newPage.slug]: newPage }));
      setSelectedSlug(newPage.slug);
      setActivePage(newPage);
      setHistoryStack([newPage]);
      setHistoryIndex(0);
      setIsNewPageOpen(false);
      toast.success(`Created custom page "${newPage.title}" successfully.`);
    } catch (err: any) {
      toast.error(`Failed to create page: ${err.message}`);
    }
  };

  // Delete dynamic custom page configuration
  const handleDeletePage = async () => {
    if (!activePage) return;
    const coreSlugs = ["home", "privacy", "terms", "refund", "learn-arabic-online-for-sisters"];
    if (coreSlugs.includes(activePage.slug)) {
      toast.error("Cannot delete core system or primary landing pages!");
      return;
    }

    try {
      await adminApi.deleteLandingPage(activePage.slug);
      const nextPages = { ...pages };
      delete nextPages[activePage.slug];
      setPages(nextPages);

      const fallbackSlug = Object.keys(nextPages)[0];
      setSelectedSlug(fallbackSlug);
      setActivePage(nextPages[fallbackSlug]);
      setHistoryStack([nextPages[fallbackSlug]]);
      setHistoryIndex(0);
      toast.success("Custom page deleted from database.");
    } catch (err: any) {
      toast.error(`Failed to delete page: ${err.message}`);
    }
  };

  // Double click visual texts editor
  const handleInlineEditStart = (sectionId: string, field: string, initialValue: string) => {
    setInlineEditingField({ sectionId, field });
    setInlineEditText(initialValue);
  };

  const handleInlineEditSave = () => {
    if (!activePage || !inlineEditingField) return;
    const { sectionId, field } = inlineEditingField;
    let nextPage = { ...activePage };

    if (sectionId === "hero") {
      if (field === "heroTitle") nextPage.heroTitle = inlineEditText;
      if (field === "heroSubtitle") nextPage.heroSubtitle = inlineEditText;
    } else if (sectionId === "overview") {
      if (field === "aiAnswerBlock") nextPage.aiAnswerBlock = inlineEditText;
    } else if (sectionId === "prose") {
      if (field === "proseTitle") nextPage.proseTitle = inlineEditText;
    }

    updateActivePage(nextPage);
    setInlineEditingField(null);
    toast.success("Canvas text updated!");
  };

  // Toggle page selection dropdown
  const handlePageSelect = (slug: string) => {
    if (pages[slug]) {
      setSelectedSlug(slug);
      setActivePage(pages[slug]);
      setHistoryStack([pages[slug]]);
      setHistoryIndex(0);
      setSelectedSectionId(pages[slug].sections[0]?.id || "hero");
    }
  };

  // Google SEO Auditor Score
  const auditSEOScore = () => {
    if (!activePage) return 0;
    let score = 65;
    if (activePage.title?.length > 25) score += 15;
    if (activePage.metaDescription?.length > 70) score += 15;
    if (activePage.metaDescription?.toLowerCase().includes("sister") || activePage.metaDescription?.toLowerCase().includes("academy")) score += 5;
    return Math.min(100, score);
  };

  if (!activePage) {
    return (
      <div className="py-24 flex flex-col items-center justify-center text-[#0F4D36]">
        <div className="w-10 h-10 border-4 border-[#ECC565]/20 border-t-[#0F4D36] rounded-full animate-spin mb-4" />
        <span className="text-xs font-bold uppercase tracking-widest animate-pulse">Loading visual builder configurations...</span>
      </div>
    );
  }

  // Group pages for selector
  const corePageSlugs = ["home", "privacy", "terms", "refund"];
  const corePagesList = Object.values(pages).filter(p => corePageSlugs.includes(p.slug));
  const landingPagesList = Object.values(pages).filter(p => !corePageSlugs.includes(p.slug));

  // Visual Theme mapping variables
  const computedFont =
    activePage.theme?.fontFamily === "sans"
      ? "font-sans"
      : activePage.theme?.fontFamily === "mono"
      ? "font-mono"
      : "font-serif";

  const sizeClass =
    activePage.theme?.baseFontSize === "lg"
      ? "text-lg"
      : activePage.theme?.baseFontSize === "sm"
      ? "text-sm"
      : "text-base";

  const dynamicStyles = {
    "--primary-color": activePage.theme?.primaryColor || "#0F4D36",
    "--accent-color": activePage.theme?.accentColor || "#ECC565",
    backgroundColor: activePage.theme?.backgroundColor || "#FDFCF7",
  } as React.CSSProperties;

  return (
    <div className="space-y-6 pb-20 text-[#0F4D36] font-sans">
      
      {/* 1. Header Toolbar */}
      <div className="bg-white border border-[#0F4D36]/10 rounded-2xl p-4 flex flex-col gap-4 shadow-sm relative z-30">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#0F4D36]/5 text-[#0F4D36]">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={activePage.title}
                  onChange={e => updateActivePage({ ...activePage, title: e.target.value })}
                  className="font-serif text-lg font-bold text-[#0F4D36] bg-transparent border-b border-transparent hover:border-amber-400 focus:border-amber-500 focus:outline-none py-0.5 max-w-sm"
                  title="Page title tag"
                />
                <span className="text-[9px] bg-emerald-100 border border-emerald-200 text-emerald-800 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                  Live
                </span>
              </div>
              <div className="flex items-center gap-1 mt-0.5">
                <span className="text-[10px] text-muted-foreground uppercase font-semibold">URL Path:</span>
                <span className="text-[10px] text-muted-foreground font-mono">/{activePage.slug}</span>
              </div>
            </div>
          </div>

          {/* Desktop/Tablet/Mobile controls */}
          <div className="flex items-center gap-4 bg-[#FAF7F0] p-1.5 rounded-lg border border-[#0F4D36]/5">
            <div className="flex items-center border-r border-[#0F4D36]/10 pr-2">
              <button
                onClick={() => setActiveDevice("desktop")}
                className={`p-1.5 rounded transition-all cursor-pointer ${activeDevice === "desktop" ? "bg-[#0F4D36] text-white" : "text-muted-foreground hover:bg-black/5"}`}
                title="Desktop View"
              >
                <Monitor className="w-4 h-4" />
              </button>
              <button
                onClick={() => setActiveDevice("tablet")}
                className={`p-1.5 rounded transition-all cursor-pointer ${activeDevice === "tablet" ? "bg-[#0F4D36] text-white" : "text-muted-foreground hover:bg-black/5"}`}
                title="Tablet View"
              >
                <Tablet className="w-4 h-4" />
              </button>
              <button
                onClick={() => setActiveDevice("mobile")}
                className={`p-1.5 rounded transition-all cursor-pointer ${activeDevice === "mobile" ? "bg-[#0F4D36] text-white" : "text-muted-foreground hover:bg-black/5"}`}
                title="Mobile View"
              >
                <Smartphone className="w-4 h-4" />
              </button>
            </div>
            
            <div className="flex items-center gap-1">
              <button
                onClick={handleUndo}
                disabled={historyIndex <= 0}
                className="p-1.5 hover:bg-black/5 rounded text-muted-foreground disabled:opacity-20 hover:text-[#0F4D36] cursor-pointer"
                title="Undo last edit"
              >
                <Undo2 className="w-4 h-4" />
              </button>
              <button
                onClick={handleRedo}
                disabled={historyIndex >= historyStack.length - 1}
                className="p-1.5 hover:bg-black/5 rounded text-muted-foreground disabled:opacity-20 hover:text-[#0F4D36] cursor-pointer"
                title="Redo edit"
              >
                <Redo2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Action triggers */}
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="border-[#0F4D36]/10 text-xs h-9 cursor-pointer">
                  Page Actions
                  <ChevronDown className="w-3.5 h-3.5 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-white border border-[#0F4D36]/15 rounded-lg p-1 text-xs text-[#0F4D36] z-50">
                <DropdownMenuItem onClick={() => window.open(`/${activePage.slug}`, "_blank")} className="flex items-center gap-2 p-2 hover:bg-[#FAF7F0] rounded cursor-pointer">
                  <ExternalLink className="w-3.5 h-3.5" />
                  View Live Page
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => {
                  navigator.clipboard.writeText(JSON.stringify(activePage, null, 2));
                  toast.success("Page schema configuration copied!");
                }} className="flex items-center gap-2 p-2 hover:bg-[#FAF7F0] rounded cursor-pointer">
                  <Share2 className="w-3.5 h-3.5" />
                  Export Schema
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-[#0F4D36]/5" />
                <DropdownMenuItem onClick={handleDeletePage} className="flex items-center gap-2 p-2 hover:bg-red-50 text-red-700 rounded cursor-pointer">
                  <Trash2 className="w-3.5 h-3.5" />
                  Delete Custom Page
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button variant="outline" onClick={handleSaveDraft} className="border-[#0F4D36]/10 text-xs h-9 cursor-pointer font-semibold">
              Save Draft
            </Button>
            <Button onClick={handlePublishPage} className="bg-[#0F4D36] hover:bg-[#0F4D36]/90 text-white text-xs h-9 rounded-lg font-bold shadow-md shadow-black/10 cursor-pointer">
              Publish Page
            </Button>
          </div>
        </div>

        {/* Dynamic Selector Row */}
        <div className="flex items-center justify-between border-t border-[#0F4D36]/5 pt-3.5 mt-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-muted-foreground">Select Active Page:</span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-1.5 px-3 py-1.5 bg-[#FAF7F0] hover:bg-[#0F4D36]/5 rounded-lg border border-[#0F4D36]/10 text-xs font-bold cursor-pointer">
                  <span>{activePage.title}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-[#ECC565]" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-white border border-[#0F4D36]/15 rounded-lg p-1.5 text-xs text-[#0F4D36] w-64 max-h-[350px] overflow-y-auto z-50">
                <DropdownMenuLabel className="font-bold text-[10px] uppercase text-muted-foreground tracking-wider p-1">Core Website Pages</DropdownMenuLabel>
                {corePagesList.map(p => (
                  <DropdownMenuItem key={p.slug} onClick={() => handlePageSelect(p.slug)} className="p-2 hover:bg-[#FAF7F0] rounded cursor-pointer font-bold">
                    {p.title.split(" | ")[0]}
                  </DropdownMenuItem>
                ))}
                
                <DropdownMenuSeparator className="bg-[#0F4D36]/5" />
                <DropdownMenuLabel className="font-bold text-[10px] uppercase text-muted-foreground tracking-wider p-1">Landing Pages</DropdownMenuLabel>
                {landingPagesList.map(p => (
                  <DropdownMenuItem key={p.slug} onClick={() => handlePageSelect(p.slug)} className="p-2 hover:bg-[#FAF7F0] rounded cursor-pointer">
                    {p.title.split(" | ")[0]}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <Button onClick={() => setIsNewPageOpen(true)} className="bg-[#0F4D36]/5 hover:bg-[#0F4D36]/10 border border-[#0F4D36]/10 text-[#0F4D36] text-[10px] h-7 px-2.5 rounded-md font-bold cursor-pointer">
              <Plus className="w-3 h-3 mr-1" />
              New Page
            </Button>
          </div>

          <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
            <span>Status: <strong className="font-semibold text-emerald-700">Synched</strong></span>
          </div>
        </div>
      </div>

      {/* 2. Workspace Tri-panel Layout */}
      <div className="grid lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Panel: Sections list (3 columns) */}
        <div className="lg:col-span-3 space-y-4 bg-white border border-[#0F4D36]/10 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-[#0F4D36]/5 pb-2.5">
            <h3 className="font-serif text-sm font-bold uppercase tracking-wider text-[#0F4D36]">Page Layout</h3>
            <span className="text-[10px] text-muted-foreground">{activePage.sections.length} Sections</span>
          </div>

          <div className="space-y-1.5 max-h-[360px] overflow-y-auto pr-1">
            {activePage.sections.map((sec, idx) => {
              const isSelected = selectedSectionId === sec.id;
              return (
                <div
                  key={sec.id}
                  onClick={() => setSelectedSectionId(sec.id)}
                  className={`flex items-center justify-between p-2.5 rounded-lg text-xs font-semibold cursor-pointer transition-all border ${
                    isSelected
                      ? "bg-[#ECC565]/10 border-[#ECC565] text-[#0F4D36]"
                      : "border-[#0F4D36]/5 hover:bg-black/5 hover:border-black/5"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${sec.visible ? "bg-emerald-600" : "bg-muted-foreground/35"}`} />
                    <span className="truncate">{sec.name}</span>
                  </div>
                  <div className="flex items-center gap-1" onClick={e => e.stopPropagation()}>
                    <button
                      onClick={() => toggleVisibility(idx)}
                      className="p-1 hover:bg-black/5 rounded text-muted-foreground hover:text-[#0F4D36]"
                      title="Toggle Visibility"
                    >
                      {sec.visible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                    </button>
                    <button
                      onClick={() => moveSection(idx, "up")}
                      disabled={idx === 0}
                      className="p-1 hover:bg-black/5 rounded text-muted-foreground disabled:opacity-20 hover:text-[#0F4D36]"
                      title="Move Up"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => moveSection(idx, "down")}
                      disabled={idx === activePage.sections.length - 1}
                      className="p-1 hover:bg-black/5 rounded text-muted-foreground disabled:opacity-20 hover:text-[#0F4D36]"
                      title="Move Down"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {!corePageSlugs.includes(activePage.slug) && (
            <Button onClick={() => setIsSectionLibraryOpen(true)} className="w-full bg-[#0F4D36]/5 hover:bg-[#0F4D36]/10 border border-[#0F4D36]/15 text-[#0F4D36] text-xs h-9 rounded-lg font-bold cursor-pointer">
              <Plus className="w-4 h-4 mr-1 text-[#ECC565]" />
              Add Layout Block
            </Button>
          )}

          <div className="pt-3 border-t border-[#0F4D36]/5 space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">SEO Metrics</span>
            <div className="p-3 bg-[#FAF7F0] rounded-xl border border-[#0F4D36]/5 text-center text-xs">
              <div className="font-bold text-lg text-emerald-700">{auditSEOScore()}%</div>
              <div className="text-[9px] text-muted-foreground uppercase mt-0.5">Google Search Health</div>
            </div>
          </div>
        </div>

        {/* Center Panel: Interactive Mockup Canvas (6 columns) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="flex items-center justify-between px-1 text-xs">
            <span className="font-semibold text-muted-foreground uppercase tracking-wider text-[10px]">Canvas Mockup View</span>
            <div className="flex items-center gap-1.5 bg-white px-2 py-1 rounded-md border border-[#0F4D36]/10 shadow-sm text-[10px] font-bold">
              <button onClick={() => setZoomLevel(prev => Math.max(50, prev - 25))} className="hover:text-[#ECC565]"><ZoomOut className="w-3.5 h-3.5" /></button>
              <span>{zoomLevel}%</span>
              <button onClick={() => setZoomLevel(prev => Math.min(125, prev + 25))} className="hover:text-[#ECC565]"><ZoomIn className="w-3.5 h-3.5" /></button>
            </div>
          </div>

          <div className="flex justify-center w-full overflow-hidden bg-neutral-200/50 p-6 rounded-2xl border border-[#0F4D36]/10 min-h-[560px] max-h-[85vh] overflow-y-auto">
            <div
              style={{
                width: activeDevice === "mobile" ? "375px" : activeDevice === "tablet" ? "768px" : "100%",
                transform: `scale(${zoomLevel / 100})`,
                transformOrigin: "top center",
                ...dynamicStyles,
              }}
              className={`bg-white rounded-xl shadow-2xl border border-black/15 overflow-hidden transition-all duration-500 shrink-0 h-fit ${computedFont} ${sizeClass}`}
            >
              {/* Browser Address Bar */}
              <div className="bg-[#FAF7F0] border-b border-[#0F4D36]/10 px-4 py-2 flex items-center justify-between text-xs select-none">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                </div>
                <div className="bg-white/80 border border-[#0F4D36]/5 px-6 py-0.5 rounded text-[10px] text-muted-foreground font-mono tracking-wider w-80 truncate text-center shadow-inner">
                  https://hareemacademy.com/{activePage.slug === "home" ? "" : activePage.slug}
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-muted-foreground cursor-pointer hover:text-black" onClick={() => window.open(`/${activePage.slug}`, "_blank")} />
              </div>

              {/* RENDER CANVAS CORE CONTENT */}
              <div className="w-full relative min-h-[400px]">
                {activePage.slug === "privacy" || activePage.slug === "terms" || activePage.slug === "refund" ? (
                  /* Prose Layout for Legal Pages */
                  <div className="p-8 sm:p-12 max-w-2xl mx-auto text-left">
                    {inlineEditingField?.sectionId === "prose" && inlineEditingField.field === "proseTitle" ? (
                      <div className="flex gap-2 items-center mb-6" onClick={e => e.stopPropagation()}>
                        <Input
                          value={inlineEditText}
                          onChange={e => setInlineEditText(e.target.value)}
                          className="text-xs h-9"
                          autoFocus
                        />
                        <Button onClick={handleInlineEditSave} size="sm" className="bg-[#0F4D36] text-white">Save</Button>
                      </div>
                    ) : (
                      <h1
                        onDoubleClick={() => handleInlineEditStart("prose", "proseTitle", activePage.proseTitle || "")}
                        className="font-serif font-bold text-3xl mb-6 border-b border-[#0F4D36]/10 pb-4 text-[#0F4D36] cursor-text hover:bg-amber-50/50 p-1 border border-dashed border-transparent hover:border-amber-400"
                      >
                        {activePage.proseTitle}
                      </h1>
                    )}

                    <div className="text-xs text-muted-foreground mb-4">Last Updated: {new Date().toLocaleDateString()}</div>
                    <div className="prose prose-stone leading-relaxed whitespace-pre-line text-foreground/80">
                      {activePage.proseBody}
                    </div>
                  </div>
                ) : (
                  /* Standard Dynamic Layout & Home Layout */
                  <div className="space-y-0 w-full">
                    {activePage.sections.map((sec) => {
                      if (!sec.visible) return null;
                      const isSelected = selectedSectionId === sec.id;

                      return (
                        <div
                          key={sec.id}
                          onClick={() => setSelectedSectionId(sec.id)}
                          className={`relative border-b border-[#0F4D36]/5 ${
                            isSelected ? "ring-2 ring-[#ECC565]" : ""
                          }`}
                        >
                          {sec.id === "hero" && (
                            <div className="py-16 px-6 text-center bg-gradient-to-b from-[#FAF7F0] to-white flex flex-col items-center justify-center">
                              <div className="max-w-2xl space-y-4">
                                <span className="inline-block text-[9px] font-bold tracking-widest text-[#ECC565] uppercase bg-[#0F4D36]/5 border border-[#0F4D36]/10 px-2.5 py-0.5 rounded-full">
                                  {activePage.geoContext || "100% Sisters Only • Taught by Women"}
                                </span>

                                {inlineEditingField?.sectionId === "hero" && inlineEditingField.field === "heroTitle" ? (
                                  <div className="flex gap-2 justify-center items-center py-2" onClick={e => e.stopPropagation()}>
                                    <Input
                                      value={inlineEditText}
                                      onChange={e => setInlineEditText(e.target.value)}
                                      className="max-w-md h-9 text-xs"
                                      autoFocus
                                    />
                                    <Button onClick={handleInlineEditSave} size="sm" className="h-9 px-3 bg-[#0F4D36] text-white">Save</Button>
                                  </div>
                                ) : (
                                  <h1
                                    onDoubleClick={() => handleInlineEditStart("hero", "heroTitle", activePage.heroTitle || "")}
                                    className="font-serif font-bold text-2xl sm:text-3xl text-[#0F4D36] leading-tight select-none cursor-text hover:bg-yellow-50/50 p-1 rounded border border-dashed border-transparent hover:border-amber-400"
                                    style={{ color: activePage.theme?.primaryColor }}
                                  >
                                    {activePage.heroTitle}
                                  </h1>
                                )}

                                {inlineEditingField?.sectionId === "hero" && inlineEditingField.field === "heroSubtitle" ? (
                                  <div className="flex gap-2 justify-center items-center" onClick={e => e.stopPropagation()}>
                                    <Textarea
                                      value={inlineEditText}
                                      onChange={e => setInlineEditText(e.target.value)}
                                      className="max-w-md h-12 text-xs"
                                      autoFocus
                                    />
                                    <Button onClick={handleInlineEditSave} size="sm" className="h-9 px-3 bg-[#0F4D36] text-white">Save</Button>
                                  </div>
                                ) : (
                                  <p
                                    onDoubleClick={() => handleInlineEditStart("hero", "heroSubtitle", activePage.heroSubtitle || "")}
                                    className="text-muted-foreground text-xs max-w-lg mx-auto leading-relaxed cursor-text hover:bg-yellow-50/50 p-1 rounded border border-dashed border-transparent hover:border-amber-400"
                                  >
                                    {activePage.heroSubtitle}
                                  </p>
                                )}

                                <div className="flex gap-2 justify-center items-center pt-2">
                                  <Button className="bg-[#0F4D36] text-white hover:bg-[#0F4D36]/95 text-xs h-9 rounded-lg font-semibold pointer-events-none" style={{ backgroundColor: activePage.theme?.accentColor, color: activePage.theme?.primaryColor }}>
                                    {activePage.primaryCTA || "Explore Courses"}
                                  </Button>
                                </div>
                              </div>
                            </div>
                          )}

                          {sec.id === "overview" && (
                            <div className="p-6 bg-white">
                              <div className="max-w-xl mx-auto flex gap-3 p-4 bg-muted/20 border border-[#0F4D36]/10 rounded-xl">
                                <Palette className="w-5 h-5 text-[#ECC565] shrink-0" />
                                <div className="space-y-1">
                                  <span className="text-[9px] font-bold text-[#ECC565] uppercase">Page Overview</span>
                                  {inlineEditingField?.sectionId === "overview" && inlineEditingField.field === "aiAnswerBlock" ? (
                                    <div className="flex gap-2 items-start py-1" onClick={e => e.stopPropagation()}>
                                      <Textarea
                                        value={inlineEditText}
                                        onChange={e => setInlineEditText(e.target.value)}
                                        className="min-h-[60px] text-xs"
                                      />
                                      <Button onClick={handleInlineEditSave} size="sm" className="bg-[#0F4D36] text-white">Save</Button>
                                    </div>
                                  ) : (
                                    <p
                                      onDoubleClick={() => handleInlineEditStart("overview", "aiAnswerBlock", activePage.aiAnswerBlock || "")}
                                      className="text-xs text-foreground/80 leading-relaxed cursor-text hover:bg-yellow-50/50 rounded border border-dashed border-transparent hover:border-amber-400"
                                    >
                                      {activePage.aiAnswerBlock || "Discover our live interactive online batches."}
                                    </p>
                                  )}
                                </div>
                              </div>
                            </div>
                          )}

                          {sec.id === "benefits" && (
                            <div className="py-8 px-6 bg-white text-center">
                              <h2 className="font-serif font-bold text-sm text-[#0F4D36] mb-4">{activePage.benefitsTitle || "Benefits of Academy"}</h2>
                              <div className="grid sm:grid-cols-2 gap-3 max-w-xl mx-auto">
                                {(activePage.benefits || [
                                  { title: "Female Instructors Only", description: "Learn comfortably with certified sisters." },
                                  { title: "Flexible Timeslots", description: "Convenient batch schedules." }
                                ]).map((b: any, idx: number) => (
                                  <div key={idx} className="p-3 bg-[#FAF7F0] border border-[#0F4D36]/5 rounded-lg text-left">
                                    <h4 className="text-[11px] font-bold text-[#0F4D36]">{b.title}</h4>
                                    <p className="text-[10px] text-muted-foreground mt-1 leading-snug">{b.description}</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {sec.id === "moat" && (
                            <div className="py-8 px-6 bg-[#FAF7F0]">
                              <div className="max-w-xl mx-auto space-y-3 text-left">
                                <h3 className="font-serif font-bold text-sm text-[#0F4D36]">Our Privacy Guarantee</h3>
                                <p className="text-[11px] text-muted-foreground leading-relaxed">
                                  Camera-on participation is optional. Batches are password-secured.
                                </p>
                              </div>
                            </div>
                          )}

                          {sec.id === "curriculum" && (
                            <div className="py-8 px-6 bg-white text-left">
                              <div className="max-w-xl mx-auto space-y-4">
                                <h3 className="font-serif font-bold text-sm text-[#0F4D36] text-center">{activePage.curriculumTitle || "Course Curriculum"}</h3>
                                <div className="border-l border-[#0F4D36]/10 pl-4 space-y-3">
                                  {(activePage.curriculum || [
                                    { title: "Alphabet Foundations", description: "Letters and vowel marks." },
                                    { title: "Conversational Speaking", description: "Introductory grammar." }
                                  ]).map((step: any, idx: number) => (
                                    <div key={idx}>
                                      <h4 className="text-[11px] font-bold text-[#0F4D36]">{idx+1}. {step.title}</h4>
                                      <p className="text-[10px] text-muted-foreground leading-snug mt-0.5">{step.description}</p>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          )}

                          {sec.id === "faqs" && (
                            <div className="py-8 px-6 bg-white text-left max-w-xl mx-auto">
                              <h3 className="font-serif font-bold text-sm text-[#0F4D36] mb-4 text-center">Frequently Asked Questions</h3>
                              <div className="space-y-2">
                                {(activePage.faqs || [
                                  { question: "Is this for brothers too?", answer: "No, classes are sisters-only." }
                                ]).map((faq: any, idx: number) => (
                                  <div key={idx} className="p-3 bg-[#FAF7F0] rounded-lg">
                                    <h4 className="text-[11px] font-bold text-[#0F4D36]">{faq.question}</h4>
                                    <p className="text-[10px] text-muted-foreground mt-1">{faq.answer}</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {sec.id === "cta" && (
                            <div className="py-8 px-4 text-center bg-white">
                              <div className="bg-[#0F4D36] text-white p-6 rounded-xl max-w-md mx-auto">
                                <h3 className="font-serif font-bold text-base text-white mb-2">Start Learning Journey</h3>
                                <p className="text-[10px] text-white/80 mb-3">Register for a free interactive trial class today.</p>
                                <Button className="text-xs font-bold px-4 h-8 bg-[#ECC565] text-[#0F4D36] rounded hover:opacity-90">
                                  {activePage.primaryCTA || "Start Free Trial"}
                                </Button>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel: Configurations Drawer (3 columns) */}
        <div className="lg:col-span-3 space-y-4">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="bg-white border border-[#0F4D36]/10 rounded-xl p-4 shadow-sm">
            <TabsList className="bg-[#FAF7F0] w-full grid grid-cols-3 text-xs mb-4">
              <TabsTrigger value="content" className="text-[10px] font-bold uppercase cursor-pointer">Content</TabsTrigger>
              <TabsTrigger value="seo" className="text-[10px] font-bold uppercase cursor-pointer">SEO Settings</TabsTrigger>
              <TabsTrigger value="theme" className="text-[10px] font-bold uppercase cursor-pointer flex gap-1 items-center">
                <Palette className="w-3.5 h-3.5" />
                Theme
              </TabsTrigger>
            </TabsList>

            {/* TAB 1: CONTENT EDITORS */}
            <TabsContent value="content" className="space-y-4 text-xs">
              <div className="flex items-center justify-between border-b border-[#0F4D36]/5 pb-2">
                <span className="text-[10px] font-bold uppercase text-muted-foreground font-semibold">Editing Section</span>
                <span className="bg-[#ECC565]/15 border border-[#ECC565] text-[#0F4D36] px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider">{selectedSectionId}</span>
              </div>

              {activePage.slug === "privacy" || activePage.slug === "terms" || activePage.slug === "refund" ? (
                /* Edit Prose Document Properties */
                <div className="space-y-3.5">
                  <div className="space-y-1">
                    <Label className="text-[10px] uppercase font-bold text-muted-foreground">Document Title</Label>
                    <Input
                      value={activePage.proseTitle || ""}
                      onChange={e => updateActivePage({ ...activePage, proseTitle: e.target.value })}
                      className="bg-[#FAF7F0] border-[#0F4D36]/10 text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[10px] uppercase font-bold text-muted-foreground">Document Content (Markdown/Text)</Label>
                    <Textarea
                      value={activePage.proseBody || ""}
                      onChange={e => updateActivePage({ ...activePage, proseBody: e.target.value })}
                      className="bg-[#FAF7F0] border-[#0F4D36]/10 text-xs min-h-[300px] font-mono leading-relaxed"
                    />
                  </div>
                </div>
              ) : (
                /* Edit Landing Page Section Content */
                <div className="space-y-3">
                  {selectedSectionId === "hero" && (
                    <div className="space-y-3">
                      <div className="space-y-1">
                        <Label className="text-[10px] uppercase font-bold text-muted-foreground">Headline Text</Label>
                        <Input
                          value={activePage.heroTitle}
                          onChange={e => updateActivePage({ ...activePage, heroTitle: e.target.value })}
                          className="bg-[#FAF7F0] border-[#0F4D36]/10 text-xs"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-[10px] uppercase font-bold text-muted-foreground">Subheading Description</Label>
                        <Textarea
                          value={activePage.heroSubtitle}
                          onChange={e => updateActivePage({ ...activePage, heroSubtitle: e.target.value })}
                          className="bg-[#FAF7F0] border-[#0F4D36]/10 text-xs min-h-[60px]"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-[10px] uppercase font-bold text-muted-foreground">Button text (CTA)</Label>
                        <Input
                          value={activePage.primaryCTA}
                          onChange={e => updateActivePage({ ...activePage, primaryCTA: e.target.value })}
                          className="bg-[#FAF7F0] border-[#0F4D36]/10 text-xs"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-[10px] uppercase font-bold text-muted-foreground">Target Course Path</Label>
                        <Input
                          value={activePage.targetCourseSlug}
                          onChange={e => updateActivePage({ ...activePage, targetCourseSlug: e.target.value })}
                          className="bg-[#FAF7F0] border-[#0F4D36]/10 text-xs font-mono"
                        />
                      </div>
                    </div>
                  )}

                  {selectedSectionId === "overview" && (
                    <div className="space-y-1">
                      <Label className="text-[10px] uppercase font-bold text-muted-foreground">AI overview text block</Label>
                      <Textarea
                        value={activePage.aiAnswerBlock}
                        onChange={e => updateActivePage({ ...activePage, aiAnswerBlock: e.target.value })}
                        className="bg-[#FAF7F0] border-[#0F4D36]/10 text-xs min-h-[140px]"
                      />
                    </div>
                  )}

                  {selectedSectionId === "benefits" && (
                    <div className="space-y-3">
                      <div className="space-y-1">
                        <Label className="text-[10px] uppercase font-bold text-muted-foreground">Section Header Title</Label>
                        <Input
                          value={activePage.benefitsTitle}
                          onChange={e => updateActivePage({ ...activePage, benefitsTitle: e.target.value })}
                          className="bg-[#FAF7F0] border-[#0F4D36]/10 text-xs"
                        />
                      </div>
                      
                      <div className="space-y-2.5 pt-2 border-t border-[#0F4D36]/5">
                        <span className="text-[9px] uppercase font-bold text-muted-foreground">Items List</span>
                        {(activePage.benefits || []).map((b, idx) => (
                          <div key={idx} className="p-2 bg-[#FAF7F0] border border-[#0F4D36]/10 rounded-lg space-y-1.5">
                            <Input
                              value={b.title}
                              onChange={e => {
                                const nextB = [...(activePage.benefits || [])];
                                nextB[idx].title = e.target.value;
                                updateActivePage({ ...activePage, benefits: nextB });
                              }}
                              className="bg-white h-7 text-[10px]"
                            />
                            <Textarea
                              value={b.description}
                              onChange={e => {
                                const nextB = [...(activePage.benefits || [])];
                                nextB[idx].description = e.target.value;
                                updateActivePage({ ...activePage, benefits: nextB });
                              }}
                              className="bg-white p-1 text-[10px] min-h-[45px]"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedSectionId === "curriculum" && (
                    <div className="space-y-3">
                      <div className="space-y-1">
                        <Label className="text-[10px] uppercase font-bold text-muted-foreground">Section Header Title</Label>
                        <Input
                          value={activePage.curriculumTitle}
                          onChange={e => updateActivePage({ ...activePage, curriculumTitle: e.target.value })}
                          className="bg-[#FAF7F0] border-[#0F4D36]/10 text-xs"
                        />
                      </div>
                      
                      <div className="space-y-2.5 pt-2 border-t border-[#0F4D36]/5">
                        <span className="text-[9px] uppercase font-bold text-muted-foreground">Steps List</span>
                        {(activePage.curriculum || []).map((step, idx) => (
                          <div key={idx} className="p-2 bg-[#FAF7F0] border border-[#0F4D36]/10 rounded-lg space-y-1.5">
                            <Input
                              value={step.title}
                              onChange={e => {
                                const nextC = [...(activePage.curriculum || [])];
                                nextC[idx].title = e.target.value;
                                updateActivePage({ ...activePage, curriculum: nextC });
                              }}
                              className="bg-white h-7 text-[10px]"
                            />
                            <Textarea
                              value={step.description}
                              onChange={e => {
                                const nextC = [...(activePage.curriculum || [])];
                                nextC[idx].description = e.target.value;
                                updateActivePage({ ...activePage, curriculum: nextC });
                              }}
                              className="bg-white p-1 text-[10px] min-h-[45px]"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedSectionId === "faqs" && (
                    <div className="space-y-3 pt-2">
                      <span className="text-[9px] uppercase font-bold text-muted-foreground">FAQ Q&A List</span>
                      {(activePage.faqs || []).map((faq, idx) => (
                        <div key={idx} className="p-2 bg-[#FAF7F0] border border-[#0F4D36]/10 rounded-lg space-y-1.5">
                          <Input
                            value={faq.question}
                            onChange={e => {
                              const nextF = [...(activePage.faqs || [])];
                              nextF[idx].question = e.target.value;
                              updateActivePage({ ...activePage, faqs: nextF });
                            }}
                            className="bg-white h-7 text-[10px]"
                          />
                          <Textarea
                            value={faq.answer}
                            onChange={e => {
                              const nextF = [...(activePage.faqs || [])];
                              nextF[idx].answer = e.target.value;
                              updateActivePage({ ...activePage, faqs: nextF });
                            }}
                            className="bg-white p-1 text-[10px] min-h-[45px]"
                          />
                        </div>
                      ))}
                    </div>
                  )}

                  {!["hero", "overview", "benefits", "curriculum", "faqs"].includes(selectedSectionId) && (
                    <div className="py-8 text-center text-[#0F4D36]/40">
                      <Settings className="w-8 h-8 mx-auto mb-2 text-muted-foreground/30" />
                      No parameter fields for selected section card. Adjust sequence order.
                    </div>
                  )}
                </div>
              )}
            </TabsContent>

            {/* TAB 2: SEO META CONFIG */}
            <TabsContent value="seo" className="space-y-4 text-xs">
              <div className="flex items-center justify-between border-b border-[#0F4D36]/5 pb-2">
                <span className="text-[10px] font-bold uppercase text-muted-foreground">SEO optimization</span>
                <span className="text-[10px] bg-emerald-50 border border-emerald-200 text-emerald-800 px-2 py-0.5 rounded-full font-bold">{auditSEOScore()}/100 Score</span>
              </div>

              <div className="space-y-3">
                <div className="space-y-1">
                  <Label className="text-[10px] uppercase font-bold text-muted-foreground">Google Page Title Tag</Label>
                  <Input
                    value={activePage.title}
                    onChange={e => updateActivePage({ ...activePage, title: e.target.value })}
                    className="bg-[#FAF7F0] border-[#0F4D36]/10 text-xs"
                  />
                  <span className="text-[9px] text-muted-foreground block text-right">{activePage.title.length}/60 chars</span>
                </div>

                <div className="space-y-1">
                  <Label className="text-[10px] uppercase font-bold text-muted-foreground">Google Meta Description Tag</Label>
                  <Textarea
                    value={activePage.metaDescription}
                    onChange={e => updateActivePage({ ...activePage, metaDescription: e.target.value })}
                    className="bg-[#FAF7F0] border-[#0F4D36]/10 text-xs min-h-[90px]"
                  />
                  <span className="text-[9px] text-muted-foreground block text-right">{activePage.metaDescription.length}/160 chars</span>
                </div>

                {/* Google Snippet Live View */}
                <div className="pt-2 border-t border-[#0F4D36]/5 space-y-2">
                  <span className="text-[10px] font-bold uppercase text-muted-foreground">Snippet index preview</span>
                  <div className="p-3 bg-white border border-gray-200 rounded-lg text-left shadow-inner space-y-1">
                    <span className="text-blue-800 hover:underline cursor-pointer block truncate font-medium text-[11px]">
                      {activePage.title}
                    </span>
                    <span className="text-emerald-800 block text-[9.5px] truncate">
                      https://hareemacademy.com › {activePage.slug === "home" ? "" : activePage.slug}
                    </span>
                    <p className="text-gray-600 text-[10px] leading-relaxed line-clamp-2">
                      {activePage.metaDescription}
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* TAB 3: THEME EDITOR PANEL (FONTS, COLORS, SIZE) */}
            <TabsContent value="theme" className="space-y-4 text-xs">
              <div className="flex items-center justify-between border-b border-[#0F4D36]/5 pb-2">
                <span className="text-[10px] font-bold uppercase text-muted-foreground font-semibold">Theme Customizer</span>
                <span className="text-[9px] bg-purple-100 border border-purple-200 text-purple-800 px-2 py-0.5 rounded-full font-bold">Dynamic</span>
              </div>

              <div className="space-y-4">
                {/* Font Choice */}
                <div className="space-y-1">
                  <Label className="text-[10px] uppercase font-bold text-muted-foreground flex gap-1 items-center">
                    <Type className="w-3.5 h-3.5 text-[#ECC565]" />
                    Font Stack Style
                  </Label>
                  <select
                    value={activePage.theme?.fontFamily || "serif"}
                    onChange={e => {
                      const theme = { ...(activePage.theme || { fontFamily: "serif", primaryColor: "#0F4D36", accentColor: "#ECC565", backgroundColor: "#FDFCF7", baseFontSize: "base" }), fontFamily: e.target.value as any };
                      updateActivePage({ ...activePage, theme });
                    }}
                    className="w-full p-2 bg-[#FAF7F0] border border-[#0F4D36]/10 rounded-md text-xs font-semibold"
                  >
                    <option value="serif">Elegant Serif (Classic Islamic)</option>
                    <option value="sans">Modern Sans (Clean Editorial)</option>
                    <option value="mono">Technical Monospace (Structured Layout)</option>
                  </select>
                </div>

                {/* Font Size Scaling */}
                <div className="space-y-1">
                  <Label className="text-[10px] uppercase font-bold text-muted-foreground">Base Font Size</Label>
                  <select
                    value={activePage.theme?.baseFontSize || "base"}
                    onChange={e => {
                      const theme = { ...(activePage.theme || { fontFamily: "serif", primaryColor: "#0F4D36", accentColor: "#ECC565", backgroundColor: "#FDFCF7", baseFontSize: "base" }), baseFontSize: e.target.value as any };
                      updateActivePage({ ...activePage, theme });
                    }}
                    className="w-full p-2 bg-[#FAF7F0] border border-[#0F4D36]/10 rounded-md text-xs font-semibold"
                  >
                    <option value="sm">Small (Compact 14px)</option>
                    <option value="base">Normal (Classic 16px)</option>
                    <option value="lg">Large (Spacious 18px)</option>
                  </select>
                </div>

                {/* Colors presets */}
                <div className="pt-2 border-t border-[#0F4D36]/5 space-y-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex gap-1 items-center">
                    <Palette className="w-3.5 h-3.5 text-[#ECC565]" />
                    Color Palette (Hex)
                  </span>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-[10px] text-muted-foreground">Primary Headers:</Label>
                      <div className="flex items-center gap-1.5">
                        <input
                          type="color"
                          value={activePage.theme?.primaryColor || "#0F4D36"}
                          onChange={e => {
                            const theme = { ...(activePage.theme || { fontFamily: "serif", primaryColor: "#0F4D36", accentColor: "#ECC565", backgroundColor: "#FDFCF7", baseFontSize: "base" }), primaryColor: e.target.value };
                            updateActivePage({ ...activePage, theme });
                          }}
                          className="w-6 h-6 rounded border-0 cursor-pointer"
                        />
                        <span className="font-mono text-[10px] font-semibold uppercase">{activePage.theme?.primaryColor || "#0F4D36"}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <Label className="text-[10px] text-muted-foreground">Buttons / Accents:</Label>
                      <div className="flex items-center gap-1.5">
                        <input
                          type="color"
                          value={activePage.theme?.accentColor || "#ECC565"}
                          onChange={e => {
                            const theme = { ...(activePage.theme || { fontFamily: "serif", primaryColor: "#0F4D36", accentColor: "#ECC565", backgroundColor: "#FDFCF7", baseFontSize: "base" }), accentColor: e.target.value };
                            updateActivePage({ ...activePage, theme });
                          }}
                          className="w-6 h-6 rounded border-0 cursor-pointer"
                        />
                        <span className="font-mono text-[10px] font-semibold uppercase">{activePage.theme?.accentColor || "#ECC565"}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <Label className="text-[10px] text-muted-foreground">Background Slate:</Label>
                      <div className="flex items-center gap-1.5">
                        <input
                          type="color"
                          value={activePage.theme?.backgroundColor || "#FDFCF7"}
                          onChange={e => {
                            const theme = { ...(activePage.theme || { fontFamily: "serif", primaryColor: "#0F4D36", accentColor: "#ECC565", backgroundColor: "#FDFCF7", baseFontSize: "base" }), backgroundColor: e.target.value };
                            updateActivePage({ ...activePage, theme });
                          }}
                          className="w-6 h-6 rounded border-0 cursor-pointer"
                        />
                        <span className="font-mono text-[10px] font-semibold uppercase">{activePage.theme?.backgroundColor || "#FDFCF7"}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* dialogs */}
      
      {/* 1. New Custom page dialog */}
      <Dialog open={isNewPageOpen} onOpenChange={setIsNewPageOpen}>
        <DialogContent className="max-w-md bg-white border border-[#0F4D36]/20 rounded-xl p-6 text-[#0F4D36]">
          <DialogHeader>
            <DialogTitle className="font-serif text-xl font-bold flex items-center gap-2">
              <Plus className="w-5 h-5 text-[#ECC565]" />
              <span>Create New Page Layout</span>
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground mt-1">
              Add a new dynamically linked landing page. The URL slug must be completely unique.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateNewPage} className="space-y-4 my-2 text-xs">
            <div>
              <Label className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">Page Title</Label>
              <Input
                type="text"
                required
                value={newPageForm.title}
                onChange={e => setNewPageForm({ ...newPageForm, title: e.target.value })}
                placeholder="Tajweed Mastery Class for Muslim Women"
                className="bg-[#FAF7F0] border-[#0F4D36]/10 text-xs mt-1"
              />
            </div>
            <div>
              <Label className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">URL Slug</Label>
              <Input
                type="text"
                required
                value={newPageForm.slug}
                onChange={e => setNewPageForm({ ...newPageForm, slug: e.target.value })}
                placeholder="tajweed-mastery"
                className="bg-[#FAF7F0] border-[#0F4D36]/10 text-xs mt-1 font-mono"
              />
            </div>
            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setIsNewPageOpen(false)} className="text-xs h-9 cursor-pointer">Cancel</Button>
              <Button type="submit" className="bg-[#0F4D36] text-white hover:bg-[#0f4d36]/90 text-xs h-9 font-semibold cursor-pointer">
                Create Dynamic Page
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* 2. Section library selector */}
      <Dialog open={isSectionLibraryOpen} onOpenChange={setIsSectionLibraryOpen}>
        <DialogContent className="max-w-2xl bg-white border border-[#0F4D36]/20 rounded-xl p-6 text-[#0F4D36]">
          <DialogHeader className="border-b border-[#0F4D36]/5 pb-4">
            <DialogTitle className="font-serif text-xl font-bold flex items-center gap-2">
              <Plus className="w-5 h-5 text-[#ECC565]" />
              <span>Section Template Library</span>
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground mt-1">
              Select a section block template to append to this page's layout.
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-2 gap-4 my-4 max-h-[300px] overflow-y-auto pr-1">
            <div className="p-3 bg-[#FAF7F0] hover:bg-[#0F4D36]/5 border border-[#0F4D36]/10 rounded-xl space-y-2 cursor-pointer transition-all" onClick={() => {
              if (!activePage) return;
              const nextSections = [...activePage.sections, { id: "curriculum", name: "Curriculum Timeline", visible: true }];
              updateActivePage({ ...activePage, sections: nextSections });
              setIsSectionLibraryOpen(false);
              toast.success("Curriculum Timeline section added!");
            }}>
              <span className="font-bold text-xs block">Curriculum Timeline</span>
              <p className="text-[10px] text-muted-foreground leading-relaxed">
                Renders a step-by-step curriculum or program schedule pathway.
              </p>
            </div>

            <div className="p-3 bg-[#FAF7F0] hover:bg-[#0F4D36]/5 border border-[#0F4D36]/10 rounded-xl space-y-2 cursor-pointer transition-all" onClick={() => {
              if (!activePage) return;
              const nextSections = [...activePage.sections, { id: "faqs", name: "FAQs Accordion", visible: true }];
              updateActivePage({ ...activePage, sections: nextSections });
              setIsSectionLibraryOpen(false);
              toast.success("FAQs Accordion section added!");
            }}>
              <span className="font-bold text-xs block">FAQs Accordion</span>
              <p className="text-[10px] text-muted-foreground leading-relaxed">
                Toggles collapsible question cards containing details of class registrations.
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsSectionLibraryOpen(false)} className="text-xs h-9 cursor-pointer">Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
}

// Simple icons placeholders
function MapPin({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
      <circle cx="12" cy="10" r="3"/>
    </svg>
  );
}

function ArrowRight({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
    </svg>
  );
}
