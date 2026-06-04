import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
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
  Save,
  Globe,
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
  Sparkles,
  AlertTriangle,
  CheckCircle,
  HelpCircle,
  Search,
  ChevronRight,
  TrendingUp,
  Split,
  Terminal,
  Activity,
  History,
  ExternalLink,
  ChevronDown,
  Settings,
  Share2,
  Check,
  Zap,
} from "lucide-react";
import { toast } from "sonner";
import { seoLandingPages, SEOPageConfig } from "@/data/seoLandingPages";
import PremiumImage from "@/components/PremiumImage";

// Extended page config interface to support page tree configuration
interface ExtendedPageConfig extends SEOPageConfig {
  sections: { id: string; name: string; visible: boolean; score: number }[];
  variants?: {
    a: { heroTitle: string; heroSubtitle: string; primaryCTA: string };
    b: { heroTitle: string; heroSubtitle: string; primaryCTA: string };
  };
  activeVariant?: "a" | "b";
  versionHistory?: { timestamp: string; title: string; editor: string }[];
}

export default function AdminBuilder() {
  const [location, setLocation] = useLocation();

  // Page DB state
  const [pages, setPages] = useState<Record<string, ExtendedPageConfig>>({});
  const [selectedSlug, setSelectedSlug] = useState<string>("learn-arabic-online-for-sisters");
  const [activePage, setActivePage] = useState<ExtendedPageConfig | null>(null);

  // Layout states
  const [activeDevice, setActiveDevice] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [editMode, setEditMode] = useState<"design" | "analytics" | "ab">("design");
  const [selectedSectionId, setSelectedSectionId] = useState<string>("hero");

  // Undo/Redo history states
  const [historyStack, setHistoryStack] = useState<ExtendedPageConfig[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);

  // Dialog states
  const [isNewPageOpen, setIsNewPageOpen] = useState(false);
  const [isSectionLibraryOpen, setIsSectionLibraryOpen] = useState(false);
  const [isAIWriterOpen, setIsAIWriterOpen] = useState(false);
  const [isVersionHistoryOpen, setIsVersionHistoryOpen] = useState(false);

  // Form states
  const [newPageForm, setNewPageForm] = useState({ title: "", slug: "custom-landing-page" });
  const [activeTab, setActiveTab] = useState<string>("content");

  // Inline edit state
  const [inlineEditingField, setInlineEditingField] = useState<{ sectionId: string; field: string } | null>(null);
  const [inlineEditText, setInlineEditText] = useState("");

  // AI Content assistant terminal state
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiTerminalLogs, setAiTerminalLogs] = useState<string[]>([]);
  const [aiGeneratedResult, setAiGeneratedResult] = useState<string>("");
  const [isAiGenerating, setIsAiGenerating] = useState(false);

  // Sandbox Simulator state
  const [sandboxState, setSandboxState] = useState<"success" | "loading" | "error" | "empty">("success");

  // Load from local storage or defaults on mount
  useEffect(() => {
    const saved = localStorage.getItem("hareem_landing_pages");
    let loadedPages: Record<string, ExtendedPageConfig> = {};
    if (saved) {
      try {
        loadedPages = JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse pages:", e);
      }
    }

    // Hydrate with static defaults if missing
    Object.entries(seoLandingPages).forEach(([slug, cfg]) => {
      if (!loadedPages[slug]) {
        loadedPages[slug] = {
          ...cfg,
          sections: [
            { id: "hero", name: "Hero Banner", visible: true, score: 98 },
            { id: "overview", name: "AI Overview", visible: true, score: 92 },
            { id: "benefits", name: "Core Benefits", visible: true, score: 95 },
            { id: "moat", name: "Privacy Moat", visible: true, score: 90 },
            { id: "curriculum", name: "Curriculum Roadmap", visible: true, score: 94 },
            { id: "testimonials", name: "Student Reviews", visible: true, score: 88 },
            { id: "faqs", name: "FAQs Accordion", visible: true, score: 91 },
            { id: "related", name: "Internal Navigation", visible: true, score: 85 },
            { id: "cta", name: "Footer Closing CTA", visible: true, score: 97 },
          ],
          variants: {
            a: {
              heroTitle: cfg.heroTitle,
              heroSubtitle: cfg.heroSubtitle,
              primaryCTA: cfg.primaryCTA,
            },
            b: {
              heroTitle: cfg.heroTitle + " — 100% Sisters-Only Online",
              heroSubtitle: cfg.heroSubtitle + " Speak directly to certified female native Arabic tutors.",
              primaryCTA: "Book Free Demo Session",
            },
          },
          activeVariant: "a",
          versionHistory: [
            { timestamp: "2026-06-04 18:30", title: "Original Hardcoded Imports", editor: "System Migration" },
            { timestamp: "2026-06-04 22:15", title: "Refined SEO Metadata description", editor: "Senior Designer" },
          ],
        };
      }
    });

    setPages(loadedPages);
    localStorage.setItem("hareem_landing_pages", JSON.stringify(loadedPages));

    if (loadedPages[selectedSlug]) {
      setActivePage(loadedPages[selectedSlug]);
      // Initialize history stack
      setHistoryStack([loadedPages[selectedSlug]]);
      setHistoryIndex(0);
    }
  }, []);

  // Update active page configuration and push to history
  const updateActivePage = (nextPage: ExtendedPageConfig, recordHistory = true) => {
    setActivePage(nextPage);
    setPages((prev) => {
      const next = { ...prev, [nextPage.slug]: nextPage };
      localStorage.setItem("hareem_landing_pages", JSON.stringify(next));
      return next;
    });

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
      setPages((prev) => {
        const next = { ...prev, [historyStack[prevIndex].slug]: historyStack[prevIndex] };
        localStorage.setItem("hareem_landing_pages", JSON.stringify(next));
        return next;
      });
      toast.info("Undo: Reverted last edit.");
    }
  };

  const handleRedo = () => {
    if (historyIndex < historyStack.length - 1) {
      const nextIndex = historyIndex + 1;
      setHistoryIndex(nextIndex);
      setActivePage(historyStack[nextIndex]);
      setPages((prev) => {
        const next = { ...prev, [historyStack[nextIndex].slug]: historyStack[nextIndex] };
        localStorage.setItem("hareem_landing_pages", JSON.stringify(next));
        return next;
      });
      toast.info("Redo: Restored edit.");
    }
  };

  // Handle visual section reordering
  const moveSection = (index: number, direction: "up" | "down") => {
    if (!activePage) return;
    const nextSections = [...activePage.sections];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= nextSections.length) return;

    // Swap elements
    const temp = nextSections[index];
    nextSections[index] = nextSections[targetIndex];
    nextSections[targetIndex] = temp;

    const nextPage = { ...activePage, sections: nextSections };
    updateActivePage(nextPage);
    toast.success(`Moved ${temp.name} ${direction}.`);
  };

  // Toggle visibility status
  const toggleVisibility = (index: number) => {
    if (!activePage) return;
    const nextSections = [...activePage.sections];
    nextSections[index].visible = !nextSections[index].visible;
    const nextPage = { ...activePage, sections: nextSections };
    updateActivePage(nextPage);
    toast.success(`${nextSections[index].name} visibility updated.`);
  };

  // Save changes to draft
  const handleSaveDraft = () => {
    if (!activePage) return;
    toast.success("Changes saved as Draft in local library!");
  };

  // Publish changes
  const handlePublishPage = () => {
    if (!activePage) return;
    const timestamp = new Date().toISOString().replace("T", " ").substring(0, 16);
    const historyItem = {
      timestamp,
      title: "Published Layout Update",
      editor: "Senior Architect",
    };
    const nextHistory = [...(activePage.versionHistory || []), historyItem];
    const nextPage = { ...activePage, versionHistory: nextHistory };
    updateActivePage(nextPage);
    toast.success(`Successfully published page "${activePage.title}" to CDN edge routers!`, {
      action: {
        label: "Open Live",
        onClick: () => window.open(`/${activePage.slug}`, "_blank"),
      },
    });
  };

  // Create custom new landing page
  const handleCreateNewPage = (e: React.FormEvent) => {
    e.preventDefault();
    if (pages[newPageForm.slug]) {
      toast.error("A page with this URL slug already exists!");
      return;
    }

    const baseTemplate = seoLandingPages["learn-arabic-online-for-sisters"];
    const newPage: ExtendedPageConfig = {
      ...baseTemplate,
      slug: newPageForm.slug,
      title: newPageForm.title,
      heroTitle: newPageForm.title,
      heroSubtitle: "Interactive Quranic Arabic learning batched exclusively for sisters.",
      sections: [
        { id: "hero", name: "Hero Banner", visible: true, score: 95 },
        { id: "overview", name: "AI Overview", visible: true, score: 85 },
        { id: "benefits", name: "Core Benefits", visible: true, score: 90 },
        { id: "moat", name: "Privacy Moat", visible: true, score: 90 },
        { id: "curriculum", name: "Curriculum Roadmap", visible: true, score: 88 },
        { id: "testimonials", name: "Student Reviews", visible: true, score: 80 },
        { id: "faqs", name: "FAQs Accordion", visible: true, score: 85 },
        { id: "cta", name: "Footer Closing CTA", visible: true, score: 95 },
      ],
      versionHistory: [
        { timestamp: "2026-06-05 00:30", title: "Initial Builder Setup", editor: "System Admin" }
      ]
    };

    setPages((prev) => {
      const next = { ...prev, [newPage.slug]: newPage };
      localStorage.setItem("hareem_landing_pages", JSON.stringify(next));
      return next;
    });

    setSelectedSlug(newPage.slug);
    setActivePage(newPage);
    setHistoryStack([newPage]);
    setHistoryIndex(0);
    setIsNewPageOpen(false);
    toast.success(`Created page ${newPage.title} successfully.`);
  };

  // Delete active page config
  const handleDeletePage = () => {
    if (!activePage) return;
    if (["learn-arabic-online-for-sisters", "arabic-classes-for-muslim-women"].includes(activePage.slug)) {
      toast.error("Cannot delete primary system SEO landing pages!");
      return;
    }
    const nextPages = { ...pages };
    delete nextPages[activePage.slug];
    localStorage.setItem("hareem_landing_pages", JSON.stringify(nextPages));
    setPages(nextPages);

    const fallbackSlug = Object.keys(nextPages)[0];
    setSelectedSlug(fallbackSlug);
    setActivePage(nextPages[fallbackSlug]);
    setHistoryStack([nextPages[fallbackSlug]]);
    setHistoryIndex(0);
    toast.success("Page deleted from custom configs.");
  };

  // Duplicate active layout configurations
  const handleDuplicatePage = () => {
    if (!activePage) return;
    const duplicatedSlug = `${activePage.slug}-copy`;
    if (pages[duplicatedSlug]) {
      toast.error("Duplicated page version already exists!");
      return;
    }
    const duplicatedPage: ExtendedPageConfig = {
      ...activePage,
      slug: duplicatedSlug,
      title: `${activePage.title} (Copy)`,
      versionHistory: [
        { timestamp: "2026-06-05 00:30", title: "Duplicated Setup", editor: "System Admin" }
      ]
    };
    setPages((prev) => {
      const next = { ...prev, [duplicatedSlug]: duplicatedPage };
      localStorage.setItem("hareem_landing_pages", JSON.stringify(next));
      return next;
    });
    setSelectedSlug(duplicatedSlug);
    setActivePage(duplicatedPage);
    setHistoryStack([duplicatedPage]);
    setHistoryIndex(0);
    toast.success(`Duplicated layout as: ${duplicatedPage.title}`);
  };

  // SEO score auditor utility
  const auditSEOScore = () => {
    if (!activePage) return 0;
    let score = 70;
    if (activePage.title?.length > 30) score += 10;
    if (activePage.metaDescription?.length > 80) score += 10;
    if (activePage.metaDescription?.toLowerCase().includes("sister")) score += 5;
    if (activePage.metaDescription?.toLowerCase().includes("arabic") || activePage.metaDescription?.toLowerCase().includes("urdu")) score += 5;
    return Math.min(100, score);
  };

  // Quick fix SEO settings
  const handleFixSEOAlerts = () => {
    if (!activePage) return;
    const nextPage = {
      ...activePage,
      title: activePage.title.includes("Live Sisters Only") ? activePage.title : activePage.title + " | Live Sisters Only Classes",
      metaDescription: activePage.metaDescription.length > 120 ? activePage.metaDescription : activePage.metaDescription + " certified female native Quran tutors with structured schedules.",
    };
    updateActivePage(nextPage);
    toast.success("Automated SEO tags fixed! Score increased to " + auditSEOScore() + "!");
  };

  // Toggle A/B testing variant
  const handleVariantToggle = (variant: "a" | "b") => {
    if (!activePage) return;
    const nextPage = {
      ...activePage,
      activeVariant: variant,
      heroTitle: activePage.variants?.[variant].heroTitle || activePage.heroTitle,
      heroSubtitle: activePage.variants?.[variant].heroSubtitle || activePage.heroSubtitle,
      primaryCTA: activePage.variants?.[variant].primaryCTA || activePage.primaryCTA,
    };
    updateActivePage(nextPage);
    toast.success(`Switched active canvas layout to Variant ${variant.toUpperCase()}`);
  };

  // Run AI content assistant generator
  const triggerAIContentGeneration = () => {
    if (!activePage) return;
    setIsAiGenerating(true);
    setAiTerminalLogs(["Initializing connection with GPT-4o-Synthesis API...", "Scraping page context: " + activePage.slug]);
    
    setTimeout(() => {
      setAiTerminalLogs(prev => [...prev, "Reading structural headings: " + activePage.heroTitle]);
    }, 400);

    setTimeout(() => {
      setAiTerminalLogs(prev => [...prev, "Applying conversion patterns: Shopify/Notion high-converting lander layouts."]);
    }, 800);

    setTimeout(() => {
      setAiTerminalLogs(prev => [...prev, "Analyzing target persona: Sisters seeking private Arabic studies."]);
    }, 1200);

    setTimeout(() => {
      setAiTerminalLogs(prev => [...prev, "Generating optimized high-impact copy proposal..."]);
      const generated = "Elite Arabic Academy for Muslim Women — Master Pronunciation & Translation in Complete Privacy";
      setAiGeneratedResult(generated);
      setIsAiGenerating(false);
    }, 1800);
  };

  // Apply generated copy to active input field
  const handleApplyAICopy = () => {
    if (!activePage || !aiGeneratedResult) return;
    const nextPage = {
      ...activePage,
      heroTitle: aiGeneratedResult,
    };
    updateActivePage(nextPage);
    setIsAIWriterOpen(false);
    setAiPrompt("");
    setAiGeneratedResult("");
    setAiTerminalLogs([]);
    toast.success("AI generated content injected into Hero Title successfully!");
  };

  // Double-click inline text editor
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
    } else if (sectionId === "benefits") {
      if (field === "benefitsTitle") nextPage.benefitsTitle = inlineEditText;
    } else if (sectionId === "curriculum") {
      if (field === "curriculumTitle") nextPage.curriculumTitle = inlineEditText;
    }

    updateActivePage(nextPage);
    setInlineEditingField(null);
    toast.success("Canvas text updated successfully!");
  };

  // Return to page selection if slugs are swapped
  const handlePageSelect = (slug: string) => {
    if (pages[slug]) {
      setSelectedSlug(slug);
      setActivePage(pages[slug]);
      setHistoryStack([pages[slug]]);
      setHistoryIndex(0);
    }
  };

  // Custom component loaders
  const renderSidebarItemNode = (sec: { id: string; name: string; visible: boolean; score: number }, index: number) => {
    const isSelected = selectedSectionId === sec.id;
    return (
      <div
        key={sec.id}
        onClick={() => setSelectedSectionId(sec.id)}
        className={`flex items-center justify-between p-2.5 rounded-lg text-xs font-semibold cursor-pointer transition-all border ${
          isSelected
            ? "bg-[#D6B25E]/10 border-[#D6B25E] text-[#0F4D36]"
            : "border-[#0F4D36]/5 hover:bg-black/5 hover:border-black/5"
        }`}
      >
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${sec.visible ? "bg-emerald-600" : "bg-muted-foreground/30"}`} />
          <span className="truncate">{sec.name}</span>
        </div>
        <div className="flex items-center gap-1.5" onClick={e => e.stopPropagation()}>
          <button
            onClick={() => toggleVisibility(index)}
            className="p-1 hover:bg-black/5 rounded text-muted-foreground hover:text-[#0F4D36]"
            title="Toggle Visibility"
          >
            {sec.visible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={() => moveSection(index, "up")}
            disabled={index === 0}
            className="p-1 hover:bg-black/5 rounded text-muted-foreground disabled:opacity-20 hover:text-[#0F4D36]"
            title="Move Section Up"
          >
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => moveSection(index, "down")}
            disabled={index === activePage!.sections.length - 1}
            className="p-1 hover:bg-black/5 rounded text-muted-foreground disabled:opacity-20 hover:text-[#0F4D36]"
            title="Move Section Down"
          >
            <ArrowDown className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    );
  };

  if (!activePage) {
    return (
      <div className="py-16 flex flex-col items-center justify-center">
        <AlertTriangle className="w-8 h-8 text-amber-500 animate-pulse" />
        <span className="text-xs font-bold text-muted-foreground uppercase mt-2">Loading Layout Database...</span>
      </div>
    );
  }

  // Renders the live editable canvas context based on simulation status
  const renderCanvasBody = () => {
    if (sandboxState === "loading") {
      return (
        <div className="min-h-[500px] flex flex-col items-center justify-center bg-white p-8">
          <div className="w-12 h-12 border-4 border-[#D6B25E]/20 border-t-[#0F4D36] rounded-full animate-spin mb-4" />
          <span className="text-xs font-bold uppercase tracking-widest text-[#0F4D36] animate-pulse">Loading visual canvas layouts...</span>
        </div>
      );
    }

    if (sandboxState === "error") {
      return (
        <div className="min-h-[500px] flex flex-col items-center justify-center bg-red-50 p-8 border border-red-200 rounded-2xl m-4 text-center">
          <AlertTriangle className="w-12 h-12 text-red-700 mx-auto mb-4" />
          <h3 className="font-serif text-xl font-bold text-red-950">Visual Connection Failed</h3>
          <p className="text-xs text-red-900 mt-2 max-w-sm mx-auto leading-relaxed">
            Database connection timeout occurred while pulling landing page overrides. Please retry connection configuration.
          </p>
          <Button onClick={() => setSandboxState("success")} className="bg-red-700 text-white hover:bg-red-800 text-xs h-9 rounded-lg mt-4 px-6 font-semibold">
            Retry Connection
          </Button>
        </div>
      );
    }

    if (sandboxState === "empty") {
      return (
        <div className="min-h-[500px] flex flex-col items-center justify-center bg-white p-8 border border-dashed border-[#0F4D36]/20 rounded-2xl m-4 text-center">
          <FileText className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
          <h3 className="font-serif text-xl font-bold text-[#0F4D36]">Empty Landing Page Builder</h3>
          <p className="text-xs text-muted-foreground mt-2 max-w-xs mx-auto">
            All template sections have been disabled or deleted. Open the section library to append active layout slots.
          </p>
          <Button onClick={() => setIsSectionLibraryOpen(true)} className="bg-[#0F4D36] text-white hover:bg-[#0F4D36]/90 text-xs h-9 rounded-lg mt-4 px-6 font-semibold">
            Add Layout Section
          </Button>
        </div>
      );
    }

    // Success operational state rendering
    return (
      <div className="space-y-0 w-full relative">
        
        {/* Heatmap overlay block */}
        {editMode === "analytics" && (
          <div className="absolute inset-0 z-40 pointer-events-none overflow-hidden select-none bg-black/5 mix-blend-multiply">
            {/* Color blots simulating hot maps */}
            <div className="absolute top-[10%] left-[50%] -translate-x-1/2 w-48 h-48 bg-red-500/35 rounded-full blur-[80px]" />
            <div className="absolute top-[12%] left-[45%] w-32 h-32 bg-orange-500/35 rounded-full blur-[60px]" />
            <div className="absolute top-[25%] left-[30%] w-40 h-40 bg-yellow-500/30 rounded-full blur-[60px]" />
            <div className="absolute top-[40%] left-[60%] w-48 h-48 bg-red-500/35 rounded-full blur-[80px]" />
            <div className="absolute top-[60%] left-[50%] w-36 h-36 bg-blue-500/30 rounded-full blur-[50px]" />
            <div className="absolute top-[85%] left-[50%] -translate-x-1/2 w-44 h-44 bg-red-500/40 rounded-full blur-[70px]" />
          </div>
        )}

        {activePage.sections.map((sec: any) => {
          if (!sec.visible) return null;
          const isSelected = selectedSectionId === sec.id;

          return (
            <div
              key={sec.id}
              onClick={() => setSelectedSectionId(sec.id)}
              className={`relative transition-all duration-300 border-2 ${
                isSelected
                  ? "border-[#D6B25E] ring-2 ring-[#D6B25E]/20"
                  : "border-transparent hover:border-[#0F4D36]/30"
              }`}
            >
              {/* Highlight helper tag */}
              <div className={`absolute top-2 left-2 z-30 px-2 py-0.5 rounded text-[9px] uppercase tracking-wider font-bold shadow-md pointer-events-none transition-opacity ${
                isSelected ? "bg-[#D6B25E] text-[#0F4D36] opacity-100" : "bg-[#0F4D36] text-white opacity-0 hover:opacity-100"
              }`}>
                {sec.name} {sec.id === "hero" && `(Active: Variant ${activePage.activeVariant?.toUpperCase() || "A"})`}
              </div>

              {/* Layout components */}
              {sec.id === "hero" && (
                <div className="relative bg-[#FAF7F0] overflow-hidden py-12 px-6 text-center border-b border-[#0F4D36]/5 min-h-[220px] flex flex-col justify-center items-center">
                  <div className="absolute inset-0 bg-[#0F4D36]/[0.01] radial-grid pointer-events-none" />
                  <div className="max-w-2xl mx-auto space-y-4">
                    <span className="inline-block text-[9px] font-bold tracking-widest text-[#D6B25E] uppercase bg-[#0F4D36]/5 border border-[#0F4D36]/10 px-2.5 py-0.5 rounded-full">
                      100% Sisters Only • Live Female Teachers
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
                        onDoubleClick={() => handleInlineEditStart("hero", "heroTitle", activePage.heroTitle)}
                        className="font-serif font-bold text-2xl sm:text-3xl text-[#0F4D36] leading-tight select-none cursor-text hover:bg-yellow-50/50 p-1 rounded border border-dashed border-transparent hover:border-amber-400"
                        title="Double click to edit text inline"
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
                        onDoubleClick={() => handleInlineEditStart("hero", "heroSubtitle", activePage.heroSubtitle)}
                        className="text-muted-foreground text-xs max-w-lg mx-auto leading-relaxed cursor-text hover:bg-yellow-50/50 p-1 rounded border border-dashed border-transparent hover:border-amber-400"
                        title="Double click to edit text inline"
                      >
                        {activePage.heroSubtitle}
                      </p>
                    )}

                    <div className="flex gap-2 justify-center items-center pt-2">
                      <Button className="bg-[#0F4D36] text-[#D6B25E] hover:bg-[#0F4D36]/95 text-xs h-9 rounded-lg font-semibold pointer-events-none">
                        {activePage.primaryCTA || "Start Learning"}
                      </Button>
                      <Button variant="outline" className="border-[#0F4D36]/10 text-[#0F4D36] text-xs h-9 rounded-lg pointer-events-none">
                        Speak With Our Team
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {sec.id === "overview" && (
                <div className="p-6 bg-white border-b border-[#0F4D36]/5">
                  <div className="max-w-2xl mx-auto flex gap-4 items-start p-4 bg-muted/20 border border-[#0F4D36]/10 rounded-xl relative">
                    <Sparkles className="w-5 h-5 text-[#D6B25E] shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <span className="text-[9px] font-bold text-[#D6B25E] uppercase tracking-wider">AI Summary</span>
                      {inlineEditingField?.sectionId === "overview" && inlineEditingField.field === "aiAnswerBlock" ? (
                        <div className="flex gap-2 items-start py-1 w-full" onClick={e => e.stopPropagation()}>
                          <Textarea
                            value={inlineEditText}
                            onChange={e => setInlineEditText(e.target.value)}
                            className="flex-1 min-h-[60px] text-xs"
                          />
                          <Button onClick={handleInlineEditSave} size="sm" className="bg-[#0F4D36] text-white">Save</Button>
                        </div>
                      ) : (
                        <p
                          onDoubleClick={() => handleInlineEditStart("overview", "aiAnswerBlock", activePage.aiAnswerBlock)}
                          className="text-xs text-foreground/80 leading-relaxed cursor-text hover:bg-yellow-50/50 rounded border border-dashed border-transparent hover:border-amber-400"
                        >
                          {activePage.aiAnswerBlock}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {sec.id === "benefits" && (
                <div className="py-10 px-6 bg-white border-b border-[#0F4D36]/5 text-center">
                  <h2 className="font-serif font-bold text-lg text-[#0F4D36] mb-6">{activePage.benefitsTitle}</h2>
                  <div className="grid sm:grid-cols-3 gap-4 max-w-4xl mx-auto">
                    {(activePage.benefits || []).map((benefit: any, idx: number) => (
                      <div key={idx} className="p-4 bg-[#FAF7F0] border border-[#0F4D36]/5 rounded-xl space-y-2 text-left">
                        <h4 className="text-xs font-bold text-[#0F4D36]">{benefit.title}</h4>
                        <p className="text-[11px] text-muted-foreground leading-relaxed">{benefit.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {sec.id === "moat" && (
                <div className="py-10 px-6 bg-[#FAF7F0] border-b border-[#0F4D36]/5">
                  <div className="max-w-4xl mx-auto grid sm:grid-cols-2 gap-6 items-center">
                    <div className="space-y-4">
                      <span className="text-[9px] font-bold text-[#D6B25E] uppercase tracking-wider">Mission & Privacy</span>
                      <h3 className="font-serif font-bold text-lg text-[#0F4D36]">Built Exclusively for Sisters</h3>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        We prioritize privacy and modest spaces. Camera-on interaction is voluntary in our private ladies-only Zoom circles.
                      </p>
                      <div className="space-y-2.5">
                        {(activePage.moatPoints || []).map((point: any, idx: number) => (
                          <div key={idx} className="flex gap-2 items-start text-xs text-[#0F4D36]/90">
                            <CheckCircle className="w-4 h-4 text-[#D6B25E] shrink-0 mt-0.5" />
                            <span><strong className="font-bold">{point.title}</strong>: {point.description}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="aspect-[4/3] bg-muted rounded-2xl border border-[#0F4D36]/10 flex items-center justify-center text-muted-foreground text-xs uppercase font-bold bg-[#0F4D36]/5 font-serif text-[#0F4D36]/40">
                      Sisters Learning Environment Showcase
                    </div>
                  </div>
                </div>
              )}

              {sec.id === "curriculum" && (
                <div className="py-10 px-6 bg-white border-b border-[#0F4D36]/5">
                  <div className="max-w-2xl mx-auto text-center mb-6">
                    <h2 className="font-serif font-bold text-lg text-[#0F4D36]">{activePage.curriculumTitle}</h2>
                    <p className="text-[11px] text-muted-foreground mt-1">Structured syllabus progression sheets</p>
                  </div>
                  <div className="max-w-xl mx-auto border-l border-[#0F4D36]/10 ml-2 pl-4 space-y-5">
                    {(activePage.curriculum || []).map((step: any, idx: number) => (
                      <div key={idx} className="relative">
                        <div className="absolute -left-[23px] top-0.5 w-4 h-4 rounded-full bg-white border border-[#D6B25E] text-[#D6B25E] text-[9px] font-bold flex items-center justify-center">
                          {idx + 1}
                        </div>
                        <h4 className="text-xs font-bold text-[#0F4D36]">{step.title}</h4>
                        <p className="text-[11px] text-muted-foreground leading-relaxed mt-0.5">{step.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {sec.id === "testimonials" && (
                <div className="py-10 px-6 bg-[#FAF7F0] border-b border-[#0F4D36]/5 text-center">
                  <span className="text-[9px] font-bold text-[#D6B25E] uppercase tracking-wider">Reviews</span>
                  <h3 className="font-serif font-bold text-lg text-[#0F4D36] mb-6">What Our Students Say</h3>
                  <div className="grid sm:grid-cols-2 gap-4 max-w-4xl mx-auto">
                    {(activePage.testimonials || []).map((t: any, idx: number) => (
                      <div key={idx} className="p-4 bg-white border border-[#0F4D36]/5 rounded-xl text-left flex flex-col justify-between">
                        <p className="text-xs italic text-foreground/80 font-serif">"{t.quote}"</p>
                        <div className="border-t border-[#0F4D36]/5 pt-2 mt-4 text-[10px] text-[#0F4D36]/70 flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-[#D6B25E]" />
                          <span><strong className="font-bold">{t.name}</strong> • {t.location}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {sec.id === "faqs" && (
                <div className="py-10 px-6 bg-white border-b border-[#0F4D36]/5 max-w-2xl mx-auto">
                  <div className="text-center mb-6">
                    <h3 className="font-serif font-bold text-lg text-[#0F4D36]">Frequently Asked Questions</h3>
                  </div>
                  <div className="space-y-2">
                    {(activePage.faqs || []).map((faq: any, idx: number) => (
                      <div key={idx} className="p-3 bg-[#FAF7F0] border border-[#0F4D36]/5 rounded-lg">
                        <h4 className="text-xs font-bold text-[#0F4D36]">{faq.question}</h4>
                        <p className="text-[11px] text-muted-foreground mt-1 leading-relaxed">{faq.answer}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {sec.id === "related" && (
                <div className="py-8 px-6 bg-[#FAF7F0] border-b border-[#0F4D36]/5 text-center">
                  <h4 className="font-serif font-bold text-xs text-[#0F4D36] mb-3">Related Programs & Paths</h4>
                  <div className="flex flex-wrap justify-center gap-2">
                    {(activePage.internalLinks || []).map((l: any, idx: number) => (
                      <div key={idx} className="text-[10px] px-3 py-1 bg-white border border-[#0F4D36]/10 rounded-full font-medium text-[#0F4D36]/80 flex items-center gap-1 cursor-pointer">
                        <span>{l.label}</span>
                        <ArrowRight className="w-3 h-3 text-[#D6B25E]" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {sec.id === "cta" && (
                <div className="p-8 bg-white text-center">
                  <div className="bg-[#0F4D36] text-white p-8 rounded-2xl max-w-2xl mx-auto border border-[#D6B25E]/20 relative overflow-hidden">
                    <div className="absolute inset-0 bg-[#D6B25E]/[0.02] pointer-events-none" />
                    <Sparkles className="w-6 h-6 text-[#D6B25E] mx-auto mb-2" />
                    <h3 className="font-serif font-bold text-xl text-white mb-2">Begin Learning With Confidence</h3>
                    <p className="text-xs text-white/80 max-w-md mx-auto mb-4 leading-relaxed">
                      Attend a free trial class with our patient teacher. Try a real session in a completely private cohort before deciding.
                    </p>
                    <Button className="bg-[#D6B25E] text-[#0F4D36] hover:bg-[#D6B25E]/90 text-xs font-bold px-6 h-9 rounded-lg pointer-events-none">
                      {activePage.primaryCTA || "Start Free Trial"}
                    </Button>
                  </div>
                </div>
              )}

            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="space-y-6 pb-20 text-[#0F4D36]">
      
      {/* A. Top Toolbar Panel */}
      <div className="bg-white border border-[#0F4D36]/10 rounded-xl p-3.5 flex flex-col gap-4 shadow-sm relative z-30">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-[#0F4D36]/5 text-[#0F4D36]">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={activePage.title}
                  onChange={e => updateActivePage({ ...activePage, title: e.target.value })}
                  className="font-serif text-lg font-bold text-[#0F4D36] bg-transparent border-b border-transparent hover:border-amber-400 focus:border-amber-500 focus:outline-none py-0.5 max-w-sm"
                  title="Page title"
                />
                <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">
                  Live
                </span>
              </div>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-[10px] text-muted-foreground uppercase font-semibold">Slug:</span>
                <span className="text-[10px] text-muted-foreground font-mono">/</span>
                <input
                  type="text"
                  value={activePage.slug}
                  onChange={e => updateActivePage({ ...activePage, slug: e.target.value })}
                  className="text-[10px] text-muted-foreground font-mono bg-transparent border-b border-transparent hover:border-amber-400 focus:border-amber-500 focus:outline-none w-48 py-0.5"
                  title="Page slug"
                />
              </div>
            </div>
          </div>

          {/* Center options: devices and editing tools */}
          <div className="flex flex-wrap items-center gap-4 bg-[#FAF7F0] p-1.5 rounded-lg border border-[#0F4D36]/5">
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

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setEditMode("design")}
                className={`flex items-center gap-1 px-2.5 py-1 rounded text-[11px] font-bold tracking-wider uppercase transition-all cursor-pointer ${
                  editMode === "design" ? "bg-[#D6B25E] text-[#0F4D36]" : "text-muted-foreground hover:bg-black/5"
                }`}
              >
                <Settings className="w-3.5 h-3.5" />
                <span>Design</span>
              </button>
              <button
                onClick={() => setEditMode("ab")}
                className={`flex items-center gap-1 px-2.5 py-1 rounded text-[11px] font-bold tracking-wider uppercase transition-all cursor-pointer ${
                  editMode === "ab" ? "bg-[#D6B25E] text-[#0F4D36]" : "text-muted-foreground hover:bg-black/5"
                }`}
              >
                <Split className="w-3.5 h-3.5" />
                <span>A/B Testing</span>
              </button>
              <button
                onClick={() => setEditMode("analytics")}
                className={`flex items-center gap-1 px-2.5 py-1 rounded text-[11px] font-bold tracking-wider uppercase transition-all cursor-pointer ${
                  editMode === "analytics" ? "bg-[#D6B25E] text-[#0F4D36]" : "text-muted-foreground hover:bg-black/5"
                }`}
              >
                <Activity className="w-3.5 h-3.5" />
                <span>Analytics</span>
              </button>
            </div>
          </div>

          {/* Right side operations */}
          <div className="flex items-center gap-2.5">
            <div className="flex items-center border-r border-[#0F4D36]/10 pr-2">
              <button
                onClick={handleUndo}
                disabled={historyIndex <= 0}
                className="p-2 hover:bg-black/5 rounded text-muted-foreground disabled:opacity-20 hover:text-[#0F4D36] cursor-pointer"
                title="Undo (Ctrl+Z)"
              >
                <Undo2 className="w-4 h-4" />
              </button>
              <button
                onClick={handleRedo}
                disabled={historyIndex >= historyStack.length - 1}
                className="p-2 hover:bg-black/5 rounded text-muted-foreground disabled:opacity-20 hover:text-[#0F4D36] cursor-pointer"
                title="Redo (Ctrl+Y)"
              >
                <Redo2 className="w-4 h-4" />
              </button>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="border-[#0F4D36]/10 text-xs h-9 cursor-pointer">
                  <History className="w-3.5 h-3.5 mr-1" />
                  History
                  <ChevronDown className="w-3 h-3 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-64 bg-white border border-[#0F4D36]/15 rounded-lg p-1.5 text-xs text-[#0F4D36] z-50">
                <DropdownMenuLabel className="font-bold text-[11px] uppercase tracking-wide text-muted-foreground">Version History Logs</DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-[#0F4D36]/5" />
                {(activePage.versionHistory || []).map((vh, i) => (
                  <DropdownMenuItem key={i} className="flex flex-col items-start gap-1 p-2 hover:bg-[#FAF7F0] rounded cursor-pointer">
                    <div className="flex justify-between w-full font-semibold">
                      <span>{vh.title}</span>
                      <span className="text-[10px] text-[#D6B25E]">{vh.timestamp.split(" ")[1]}</span>
                    </div>
                    <div className="flex justify-between w-full text-[10px] text-muted-foreground">
                      <span>Edited by {vh.editor}</span>
                      <span>{vh.timestamp.split(" ")[0]}</span>
                    </div>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="border-[#0F4D36]/10 text-xs h-9 cursor-pointer">
                  Actions
                  <ChevronDown className="w-3.5 h-3.5 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-white border border-[#0F4D36]/15 rounded-lg p-1 text-xs text-[#0F4D36] z-50">
                <DropdownMenuItem onClick={handleDuplicatePage} className="flex items-center gap-2 p-2 hover:bg-[#FAF7F0] rounded cursor-pointer">
                  <Copy className="w-3.5 h-3.5" />
                  Duplicate Layout
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => window.open(`/${activePage.slug}`, "_blank")} className="flex items-center gap-2 p-2 hover:bg-[#FAF7F0] rounded cursor-pointer">
                  <ExternalLink className="w-3.5 h-3.5" />
                  Open Live Page
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => {
                  navigator.clipboard.writeText(JSON.stringify(activePage, null, 2));
                  toast.success("Page configuration exported to clipboard!");
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

        {/* Global Page Dropdown picker */}
        <div className="flex items-center justify-between border-t border-[#0F4D36]/5 pt-3.5 mt-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-muted-foreground">Select Landing Page:</span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-1 px-3 py-1.5 bg-[#FAF7F0] hover:bg-[#0F4D36]/5 rounded-lg border border-[#0F4D36]/10 text-xs font-bold cursor-pointer">
                  <span>{activePage.title}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-[#D6B25E]" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-white border border-[#0F4D36]/15 rounded-lg p-1 text-xs text-[#0F4D36] z-50">
                {Object.values(pages).map(p => (
                  <DropdownMenuItem key={p.slug} onClick={() => handlePageSelect(p.slug)} className="p-2 hover:bg-[#FAF7F0] rounded cursor-pointer font-medium">
                    {p.title}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <Button onClick={() => setIsNewPageOpen(true)} className="bg-[#0F4D36]/5 hover:bg-[#0F4D36]/10 border border-[#0F4D36]/10 text-[#0F4D36] text-[10px] h-7 px-2.5 rounded-md font-bold cursor-pointer">
              <Plus className="w-3 h-3 mr-1" />
              New Page
            </Button>
          </div>

          <div className="flex items-center gap-4 text-[10px] text-muted-foreground">
            <span>Last Saved: <strong className="font-semibold text-[#0F4D36]">Just now</strong></span>
            <span>Status: <strong className="font-semibold text-emerald-700">Published Sync</strong></span>
            <span>Editor: <strong className="font-semibold text-[#0F4D36]">Senior Designer</strong></span>
          </div>
        </div>
      </div>

      {/* B. Core Tri-panel workspace */}
      <div className="grid lg:grid-cols-12 gap-6 items-start">
        
        {/* Panel 1: Page Structure Sidebar (Left 3 cols) */}
        <div className="lg:col-span-3 space-y-4 bg-white border border-[#0F4D36]/10 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-[#0F4D36]/5 pb-2.5">
            <h3 className="font-serif text-sm font-bold uppercase tracking-wider text-[#0F4D36]">Page Structure</h3>
            <span className="text-[10px] text-muted-foreground">{activePage.sections.length} Active Slots</span>
          </div>

          <div className="space-y-1.5 max-h-[360px] overflow-y-auto pr-1">
            {activePage.sections.map((sec, idx) => renderSidebarItemNode(sec, idx))}
          </div>

          <Button onClick={() => setIsSectionLibraryOpen(true)} className="w-full bg-[#0F4D36]/5 hover:bg-[#0F4D36]/10 border border-[#0F4D36]/15 text-[#0F4D36] text-xs h-9 rounded-lg font-bold cursor-pointer">
            <Plus className="w-4 h-4 mr-1 text-[#D6B25E]" />
            Insert Section
          </Button>

          <div className="pt-3 border-t border-[#0F4D36]/5 space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Page Overview Metrics</span>
            <div className="grid grid-cols-2 gap-2 text-center text-xs">
              <div className="p-2 bg-[#FAF7F0] rounded-lg border border-[#0F4D36]/5">
                <div className="font-bold text-lg text-emerald-700">{auditSEOScore()}%</div>
                <div className="text-[9px] text-muted-foreground uppercase mt-0.5">SEO Health</div>
              </div>
              <div className="p-2 bg-[#FAF7F0] rounded-lg border border-[#0F4D36]/5">
                <div className="font-bold text-lg text-[#0F4D36]">9/9</div>
                <div className="text-[9px] text-muted-foreground uppercase mt-0.5">Sections Sync</div>
              </div>
            </div>
          </div>
        </div>

        {/* Panel 2: Live Canvas Container (Center 6 cols) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="flex items-center justify-between px-2 text-xs">
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
              <span className="font-semibold text-muted-foreground uppercase tracking-wider text-[10px]">Active Preview Canvas</span>
            </div>
            
            {/* Zoom selector */}
            <div className="flex items-center gap-2 bg-white px-2 py-1 rounded-md border border-[#0F4D36]/10 shadow-sm text-[10px] font-bold">
              <button onClick={() => setZoomLevel(prev => Math.max(50, prev - 25))} className="hover:text-[#D6B25E]"><ZoomOut className="w-3.5 h-3.5" /></button>
              <span>{zoomLevel}%</span>
              <button onClick={() => setZoomLevel(prev => Math.min(125, prev + 25))} className="hover:text-[#D6B25E]"><ZoomIn className="w-3.5 h-3.5" /></button>
            </div>
          </div>

          {/* Boundaries device wrapper */}
          <div className="flex justify-center w-full overflow-hidden bg-neutral-200/50 p-6 rounded-2xl border border-[#0F4D36]/10 min-h-[560px] max-h-[85vh] overflow-y-auto">
            <div
              style={{
                width: activeDevice === "mobile" ? "375px" : activeDevice === "tablet" ? "768px" : "100%",
                transform: `scale(${zoomLevel / 100})`,
                transformOrigin: "top center",
              }}
              className="bg-white rounded-xl shadow-2xl border border-black/15 overflow-hidden transition-all duration-500 shrink-0 h-fit"
            >
              {/* Device browser bar */}
              <div className="bg-[#FAF7F0] border-b border-[#0F4D36]/10 px-4 py-2.5 flex items-center justify-between text-xs select-none">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                </div>
                <div className="bg-white/80 border border-[#0F4D36]/5 px-6 py-0.5 rounded text-[10px] text-muted-foreground font-mono tracking-wider w-80 truncate text-center shadow-inner">
                  https://hareemacademy.com/{activePage.slug}
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-muted-foreground hover:text-[#0F4D36] cursor-pointer" onClick={() => window.open(`/${activePage.slug}`, "_blank")} />
              </div>

              {/* Renders Canvas content */}
              {renderCanvasBody()}
            </div>
          </div>
        </div>

        {/* Panel 3: Section Properties Settings Panel (Right 3 cols) */}
        <div className="lg:col-span-3 space-y-4">
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="bg-white border border-[#0F4D36]/10 rounded-xl p-4 shadow-sm">
            <TabsList className="bg-[#FAF7F0] w-full grid grid-cols-3 text-xs mb-4">
              <TabsTrigger value="content" className="text-[10px] font-bold uppercase cursor-pointer">Content</TabsTrigger>
              <TabsTrigger value="seo" className="text-[10px] font-bold uppercase cursor-pointer">SEO</TabsTrigger>
              <TabsTrigger value="ai" className="text-[10px] font-bold uppercase cursor-pointer">AI Assist</TabsTrigger>
            </TabsList>

            {/* Tab 1: Section Specific Contents */}
            <TabsContent value="content" className="space-y-4">
              <div className="flex items-center justify-between border-b border-[#0F4D36]/5 pb-2">
                <span className="text-[10px] font-bold uppercase text-muted-foreground">Properties Panel</span>
                <span className="text-[10px] bg-[#D6B25E]/10 border border-[#D6B25E] text-[#0F4D36] px-2 py-0.5 rounded font-bold uppercase tracking-wider">{selectedSectionId}</span>
              </div>

              {/* Conditional parameters based on selection */}
              {selectedSectionId === "hero" && (
                <div className="space-y-4 text-xs">
                  <div className="space-y-1">
                    <Label className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">Hero Headline Title</Label>
                    <Input
                      value={activePage.heroTitle}
                      onChange={e => updateActivePage({ ...activePage, heroTitle: e.target.value })}
                      className="bg-[#FAF7F0] border-[#0F4D36]/10 text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">Hero Subtitle</Label>
                    <Textarea
                      value={activePage.heroSubtitle}
                      onChange={e => updateActivePage({ ...activePage, heroSubtitle: e.target.value })}
                      className="bg-[#FAF7F0] border-[#0F4D36]/10 text-xs min-h-[70px] resize-y"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">Call-To-Action (CTA)</Label>
                    <Input
                      value={activePage.primaryCTA}
                      onChange={e => updateActivePage({ ...activePage, primaryCTA: e.target.value })}
                      className="bg-[#FAF7F0] border-[#0F4D36]/10 text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">Target Course Association</Label>
                    <Input
                      value={activePage.targetCourseSlug}
                      onChange={e => updateActivePage({ ...activePage, targetCourseSlug: e.target.value })}
                      className="bg-[#FAF7F0] border-[#0F4D36]/10 text-xs font-mono"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">Geographical Context</Label>
                    <Input
                      value={activePage.geoContext}
                      onChange={e => updateActivePage({ ...activePage, geoContext: e.target.value })}
                      className="bg-[#FAF7F0] border-[#0F4D36]/10 text-xs"
                    />
                  </div>
                </div>
              )}

              {selectedSectionId === "overview" && (
                <div className="space-y-4 text-xs">
                  <div className="space-y-1">
                    <Label className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">AI Answer Block</Label>
                    <Textarea
                      value={activePage.aiAnswerBlock}
                      onChange={e => updateActivePage({ ...activePage, aiAnswerBlock: e.target.value })}
                      className="bg-[#FAF7F0] border-[#0F4D36]/10 text-xs min-h-[140px] resize-y"
                    />
                  </div>
                </div>
              )}

              {selectedSectionId === "benefits" && (
                <div className="space-y-4 text-xs">
                  <div className="space-y-1">
                    <Label className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">Benefits Title</Label>
                    <Input
                      value={activePage.benefitsTitle}
                      onChange={e => updateActivePage({ ...activePage, benefitsTitle: e.target.value })}
                      className="bg-[#FAF7F0] border-[#0F4D36]/10 text-xs"
                    />
                  </div>
                  <div className="pt-2 border-t border-[#0F4D36]/5 space-y-2">
                    <span className="text-[10px] uppercase font-bold text-muted-foreground">Benefit Item Cards</span>
                    {(activePage.benefits || []).map((b: any, idx: number) => (
                      <div key={idx} className="p-2.5 bg-[#FAF7F0] rounded-lg border border-[#0F4D36]/5 space-y-1.5">
                        <Input
                          value={b.title}
                          onChange={e => {
                            const nextBenefits = [...activePage.benefits];
                            nextBenefits[idx].title = e.target.value;
                            updateActivePage({ ...activePage, benefits: nextBenefits });
                          }}
                          className="h-7 text-[11px] bg-white border-[#0F4D36]/10"
                        />
                        <Textarea
                          value={b.description}
                          onChange={e => {
                            const nextBenefits = [...activePage.benefits];
                            nextBenefits[idx].description = e.target.value;
                            updateActivePage({ ...activePage, benefits: nextBenefits });
                          }}
                          className="text-[10px] p-2 bg-white border-[#0F4D36]/10 min-h-[50px] resize-y"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {!["hero", "overview", "benefits"].includes(selectedSectionId) && (
                <div className="py-6 text-center text-xs text-muted-foreground">
                  <Settings className="w-8 h-8 text-muted-foreground/30 mx-auto mb-2" />
                  No editable parameters for section details block. Adjust structure order or toggle visibility properties.
                </div>
              )}

              <div className="pt-4 border-t border-[#0F4D36]/5 space-y-3 text-xs">
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Section Styling</span>
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <Label className="text-[9px] uppercase text-muted-foreground">Spacing Bottom</Label>
                    <select className="w-full p-2 bg-[#FAF7F0] border border-[#0F4D36]/10 rounded-md text-xs font-semibold">
                      <option>Subtle (12px)</option>
                      <option selected>Classic (24px)</option>
                      <option>Spacious (48px)</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[9px] uppercase text-muted-foreground">Background Preset</Label>
                    <select className="w-full p-2 bg-[#FAF7F0] border border-[#0F4D36]/10 rounded-md text-xs font-semibold">
                      <option selected>Default Backdrop</option>
                      <option>Gold Glow Overlay</option>
                      <option>Emerald Containers</option>
                    </select>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Tab 2: SEO Config & Audit */}
            <TabsContent value="seo" className="space-y-4">
              <div className="flex items-center justify-between border-b border-[#0F4D36]/5 pb-2">
                <span className="text-[10px] font-bold uppercase text-muted-foreground">SEO optimization Tool</span>
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                  auditSEOScore() > 90 ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
                }`}>{auditSEOScore()}/100 Score</span>
              </div>

              <div className="space-y-3.5 text-xs">
                <div className="space-y-1">
                  <Label className="text-[10px] uppercase font-bold text-muted-foreground">Google Meta Title</Label>
                  <Input
                    value={activePage.title}
                    onChange={e => updateActivePage({ ...activePage, title: e.target.value })}
                    className="bg-[#FAF7F0] border-[#0F4D36]/10 text-xs"
                  />
                  <div className="text-[9px] text-muted-foreground text-right">{activePage.title.length}/60 chars</div>
                </div>

                <div className="space-y-1">
                  <Label className="text-[10px] uppercase font-bold text-muted-foreground">Google Meta Description</Label>
                  <Textarea
                    value={activePage.metaDescription}
                    onChange={e => updateActivePage({ ...activePage, metaDescription: e.target.value })}
                    className="bg-[#FAF7F0] border-[#0F4D36]/10 text-xs min-h-[90px]"
                  />
                  <div className="text-[9px] text-muted-foreground text-right">{activePage.metaDescription.length}/160 chars</div>
                </div>

                {auditSEOScore() < 95 && (
                  <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-950 flex flex-col gap-2">
                    <span className="font-bold text-[10px] flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5 text-[#D6B25E]" />
                      Improve Meta Tags Details
                    </span>
                    <p className="text-[9.5px] leading-relaxed text-muted-foreground">
                      Title is slightly short. Add sisters-only focus labels to improve discoverability score.
                    </p>
                    <Button onClick={handleFixSEOAlerts} size="sm" className="bg-[#D6B25E] text-[#0F4D36] hover:bg-[#D6B25E]/90 text-[10px] h-7 font-bold cursor-pointer">
                      Fix SEO Tags Instantly
                    </Button>
                  </div>
                )}

                {/* Google Snippet preview */}
                <div className="pt-2 border-t border-[#0F4D36]/5 space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Google Index Preview</span>
                  <div className="p-3 bg-white border border-gray-200 rounded-lg text-left shadow-inner">
                    <span className="text-[11px] text-blue-800 font-sans hover:underline cursor-pointer block truncate font-medium">
                      {activePage.title}
                    </span>
                    <span className="text-[9.5px] text-emerald-800 font-sans block mt-0.5 truncate">
                      https://hareemacademy.com › {activePage.slug}
                    </span>
                    <p className="text-[10px] text-gray-600 font-sans mt-1 leading-relaxed line-clamp-2">
                      {activePage.metaDescription}
                    </p>
                  </div>
                </div>

                {/* Sitemap XML Preview trigger */}
                <div className="pt-2 border-t border-[#0F4D36]/5">
                  <Button variant="outline" onClick={() => {
                    navigator.clipboard.writeText(`<url>\n  <loc>https://hareemacademy.com/${activePage.slug}</loc>\n  <lastmod>${new Date().toISOString().substring(0, 10)}</lastmod>\n  <changefreq>weekly</changefreq>\n  <priority>0.8</priority>\n</url>`);
                    toast.success("Sitemap XML node node tags copied to clipboard!");
                  }} className="w-full text-[10px] h-7 cursor-pointer">
                    <Share2 className="w-3.5 h-3.5 mr-1" />
                    Copy Sitemap XML Node
                  </Button>
                </div>
              </div>
            </TabsContent>

            {/* Tab 3: AI Copywriting Assistant */}
            <TabsContent value="ai" className="space-y-4">
              <div className="flex items-center justify-between border-b border-[#0F4D36]/5 pb-2">
                <span className="text-[10px] font-bold uppercase text-muted-foreground font-serif">AI Copywriter Assistant</span>
                <span className="text-[9px] uppercase bg-purple-100 text-purple-800 px-1.5 py-0.5 rounded font-bold">GPT-4o Engine</span>
              </div>

              <div className="space-y-3.5 text-xs">
                <div className="space-y-1">
                  <Label className="text-[10px] uppercase font-bold text-muted-foreground">What copy would you like to write?</Label>
                  <select
                    value={aiPrompt}
                    onChange={e => setAiPrompt(e.target.value)}
                    className="w-full p-2 bg-[#FAF7F0] border border-[#0F4D36]/10 rounded-md text-xs font-semibold"
                  >
                    <option value="">Select template target...</option>
                    <option value="hero">Converting Hero Title for Online Quran Classes</option>
                    <option value="faqs">Draft Accordion items detailing batch timings</option>
                    <option value="meta">Synthesize Meta SEO description targeting sisters</option>
                  </select>
                </div>

                <Button
                  onClick={triggerAIContentGeneration}
                  disabled={!aiPrompt || isAiGenerating}
                  className="w-full bg-[#0F4D36] text-white hover:bg-[#0F4D36]/90 text-xs font-bold shadow-md cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 mr-1 text-[#D6B25E]" />
                  Generate Dynamic Copy
                </Button>

                {/* AI Terminal console log */}
                {(aiTerminalLogs.length > 0 || isAiGenerating) && (
                  <div className="p-3 bg-[#0F4D36] text-emerald-400 font-mono text-[9px] rounded-lg space-y-1 border border-[#D6B25E]/30 shadow-inner leading-relaxed">
                    <div className="flex items-center gap-1.5 border-b border-white/10 pb-1.5 mb-1.5">
                      <Terminal className="w-3.5 h-3.5 text-[#D6B25E]" />
                      <span className="text-[8.5px] uppercase font-bold text-white tracking-wider">AI Synthesis Logs</span>
                    </div>
                    <div className="max-h-[100px] overflow-y-auto space-y-1">
                      {aiTerminalLogs.map((log, index) => (
                        <div key={index} className="flex gap-1">
                          <span className="text-white/40">&gt;</span>
                          <span>{log}</span>
                        </div>
                      ))}
                      {isAiGenerating && (
                        <div className="flex items-center gap-1">
                          <span className="text-white/40">&gt;</span>
                          <span className="animate-pulse">Thinking...</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Generation result overlay */}
                {aiGeneratedResult && (
                  <div className="p-3 bg-[#FAF7F0] border border-[#D6B25E]/20 rounded-xl space-y-2">
                    <span className="font-bold text-[10px] text-[#0F4D36] block border-b border-black/5 pb-1">AI Recommendation:</span>
                    <p className="text-[11px] leading-relaxed italic text-foreground/80">"{aiGeneratedResult}"</p>
                    <Button onClick={handleApplyAICopy} className="w-full bg-emerald-700 text-white hover:bg-emerald-800 text-[10px] h-7 font-bold cursor-pointer">
                      <Check className="w-3.5 h-3.5 mr-1" />
                      Apply Hero Title Copy
                    </Button>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>

          {/* Marketing Split Test Analytics Board (Design mode dependent views) */}
          {editMode === "ab" && (
            <div className="bg-white border border-[#0F4D36]/10 rounded-xl p-4 shadow-sm space-y-3.5">
              <div className="flex items-center justify-between border-b border-[#0F4D36]/5 pb-2">
                <span className="text-[10px] font-bold uppercase text-muted-foreground">A/B Testing Variants</span>
                <span className="text-[9px] uppercase bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded font-bold">Split Test Active</span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleVariantToggle("a")}
                  className={`p-2 rounded-lg border text-center cursor-pointer transition-all ${
                    activePage.activeVariant === "a"
                      ? "bg-[#0F4D36] text-white border-[#0F4D36]"
                      : "bg-[#FAF7F0] hover:bg-[#0F4D36]/5 border-[#0F4D36]/10"
                  }`}
                >
                  <div className="text-xs font-bold">Variant A</div>
                  <div className="text-[9px] opacity-75 mt-0.5">Control Group</div>
                </button>
                <button
                  onClick={() => handleVariantToggle("b")}
                  className={`p-2 rounded-lg border text-center cursor-pointer transition-all ${
                    activePage.activeVariant === "b"
                      ? "bg-[#0F4D36] text-white border-[#0F4D36]"
                      : "bg-[#FAF7F0] hover:bg-[#0F4D36]/5 border-[#0F4D36]/10"
                  }`}
                >
                  <div className="text-xs font-bold">Variant B</div>
                  <div className="text-[9px] opacity-75 mt-0.5">Sisters Focus</div>
                </button>
              </div>

              <div className="pt-2 border-t border-[#0F4D36]/5 space-y-2 text-xs">
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Split Metrics Summary</span>
                <div className="space-y-1.5">
                  <div className="flex justify-between text-[11px] p-2 bg-[#FAF7F0] rounded border border-black/5">
                    <span>Variant A Conversion:</span>
                    <strong className="font-bold text-[#0F4D36]">4.2% (120 clicks)</strong>
                  </div>
                  <div className="flex justify-between text-[11px] p-2 bg-[#FAF7F0] rounded border border-black/5 relative overflow-hidden">
                    <span>Variant B Conversion:</span>
                    <strong className="font-bold text-emerald-700">6.8% (214 clicks)</strong>
                    <div className="absolute right-1 top-1 bg-amber-500 text-white rounded-full p-0.5" title="Statistical Winner">
                      <Zap className="w-2.5 h-2.5 fill-white" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Live scrolling Dropoff views (Design mode dependent views) */}
          {editMode === "analytics" && (
            <div className="bg-white border border-[#0F4D36]/10 rounded-xl p-4 shadow-sm space-y-3.5">
              <div className="flex items-center justify-between border-b border-[#0F4D36]/5 pb-2">
                <span className="text-[10px] font-bold uppercase text-muted-foreground">Scroll Dropoff Map</span>
                <span className="text-[9px] uppercase bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-bold">Realtime</span>
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] font-semibold text-muted-foreground">
                    <span>Hero Section Views</span>
                    <span>100% Dropoff</span>
                  </div>
                  <div className="w-full bg-[#FAF7F0] rounded-full h-1.5">
                    <div className="bg-emerald-600 h-1.5 rounded-full" style={{ width: "100%" }} />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] font-semibold text-muted-foreground">
                    <span>Moat Benefits Views</span>
                    <span>72% Dropoff</span>
                  </div>
                  <div className="w-full bg-[#FAF7F0] rounded-full h-1.5">
                    <div className="bg-emerald-600 h-1.5 rounded-full" style={{ width: "72%" }} />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] font-semibold text-muted-foreground">
                    <span>Curriculum Syllabus Views</span>
                    <span>48% Dropoff</span>
                  </div>
                  <div className="w-full bg-[#FAF7F0] rounded-full h-1.5">
                    <div className="bg-emerald-600 h-1.5 rounded-full" style={{ width: "48%" }} />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] font-semibold text-muted-foreground">
                    <span>FAQ & Accordions Views</span>
                    <span>22% Dropoff</span>
                  </div>
                  <div className="w-full bg-[#FAF7F0] rounded-full h-1.5">
                    <div className="bg-amber-500 h-1.5 rounded-full" style={{ width: "22%" }} />
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* C. Floating Sandbox states toolbar */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-[#0F4D36] text-white border border-[#D6B25E]/40 px-4 py-2.5 rounded-full shadow-2xl z-50 flex items-center gap-4 text-xs font-semibold select-none animate-bounce hover:animate-none">
        <div className="flex items-center gap-1.5">
          <Activity className="w-4 h-4 text-[#D6B25E]" />
          <span>Builder UI State Simulator:</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSandboxState("success")}
            className={`px-3 py-1 rounded-full text-[10px] uppercase font-bold tracking-wider cursor-pointer transition-colors ${
              sandboxState === "success" ? "bg-[#D6B25E] text-[#0F4D36]" : "bg-white/10 hover:bg-white/20"
            }`}
          >
            Success
          </button>
          <button
            onClick={() => setSandboxState("loading")}
            className={`px-3 py-1 rounded-full text-[10px] uppercase font-bold tracking-wider cursor-pointer transition-colors ${
              sandboxState === "loading" ? "bg-[#D6B25E] text-[#0F4D36]" : "bg-white/10 hover:bg-white/20"
            }`}
          >
            Skeletons
          </button>
          <button
            onClick={() => setSandboxState("error")}
            className={`px-3 py-1 rounded-full text-[10px] uppercase font-bold tracking-wider cursor-pointer transition-colors ${
              sandboxState === "error" ? "bg-[#D6B25E] text-[#0F4D36]" : "bg-white/10 hover:bg-white/20"
            }`}
          >
            Error
          </button>
          <button
            onClick={() => setSandboxState("empty")}
            className={`px-3 py-1 rounded-full text-[10px] uppercase font-bold tracking-wider cursor-pointer transition-colors ${
              sandboxState === "empty" ? "bg-[#D6B25E] text-[#0F4D36]" : "bg-white/10 hover:bg-white/20"
            }`}
          >
            Empty
          </button>
        </div>
      </div>

      {/* D. Modals / Dialog elements */}

      {/* 1. New Page Dialogue */}
      <Dialog open={isNewPageOpen} onOpenChange={setIsNewPageOpen}>
        <DialogContent className="max-w-md bg-white border border-[#0F4D36]/20 rounded-xl p-6 text-[#0F4D36]">
          <DialogHeader>
            <DialogTitle className="font-serif text-xl font-bold flex items-center gap-2">
              <Plus className="w-5 h-5 text-[#D6B25E]" />
              <span>Create New Landing Page</span>
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground mt-1">
              Add a dynamic landing page templates into custom overrides. Slug must be unique.
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
                placeholder="Learn Quranic Tajweed Online for Sisters"
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
                placeholder="tajweed-classes-for-women"
                className="bg-[#FAF7F0] border-[#0F4D36]/10 text-xs mt-1 font-mono"
              />
            </div>
            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setIsNewPageOpen(false)} className="text-xs h-9 cursor-pointer">Cancel</Button>
              <Button type="submit" className="bg-[#0F4D36] text-white hover:bg-[#0f4d36]/90 text-xs h-9 font-semibold cursor-pointer">
                Create Page Layout
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* 2. Section library insertion dialogue */}
      <Dialog open={isSectionLibraryOpen} onOpenChange={setIsSectionLibraryOpen}>
        <DialogContent className="max-w-2xl bg-white border border-[#0F4D36]/20 rounded-xl p-6 text-[#0F4D36]">
          <DialogHeader className="border-b border-[#0F4D36]/5 pb-4">
            <DialogTitle className="font-serif text-xl font-bold flex items-center gap-2">
              <Plus className="w-5 h-5 text-[#D6B25E]" />
              <span>Section Template Library</span>
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground mt-1">
              Select a visual section block template to append into your landing page structure tree.
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-2 gap-4 my-4 max-h-[300px] overflow-y-auto pr-1">
            
            {/* Template 1 */}
            <div className="p-3 bg-[#FAF7F0] hover:bg-[#0F4D36]/5 border border-[#0F4D36]/10 rounded-xl space-y-2 cursor-pointer transition-all" onClick={() => {
              if (!activePage) return;
              const nextSections = [...activePage.sections, { id: "teachers", name: "Teachers Panel", visible: true, score: 90 }];
              updateActivePage({ ...activePage, sections: nextSections });
              setIsSectionLibraryOpen(false);
              toast.success("Teachers section template added!");
            }}>
              <div className="flex justify-between items-center">
                <span className="font-bold text-xs">Teachers & Mentor Grid</span>
                <span className="text-[9px] bg-emerald-100 text-emerald-800 px-1.5 rounded uppercase font-bold tracking-tight">92% SEO</span>
              </div>
              <p className="text-[10px] text-muted-foreground leading-relaxed">
                Renders native female scholars profile credentials, photo assets, and languages.
              </p>
            </div>

            {/* Template 2 */}
            <div className="p-3 bg-[#FAF7F0] hover:bg-[#0F4D36]/5 border border-[#0F4D36]/10 rounded-xl space-y-2 cursor-pointer transition-all" onClick={() => {
              if (!activePage) return;
              const nextSections = [...activePage.sections, { id: "statistics", name: "Institution Statistics", visible: true, score: 85 }];
              updateActivePage({ ...activePage, sections: nextSections });
              setIsSectionLibraryOpen(false);
              toast.success("Statistics section template added!");
            }}>
              <div className="flex justify-between items-center">
                <span className="font-bold text-xs">Key Growth Stats</span>
                <span className="text-[9px] bg-emerald-100 text-emerald-800 px-1.5 rounded uppercase font-bold tracking-tight">88% SEO</span>
              </div>
              <p className="text-[10px] text-muted-foreground leading-relaxed">
                Renders quantitative counters details: student counts, batch schedules, course completions.
              </p>
            </div>

            {/* Template 3 */}
            <div className="p-3 bg-[#FAF7F0] hover:bg-[#0F4D36]/5 border border-[#0F4D36]/10 rounded-xl space-y-2 cursor-pointer transition-all" onClick={() => {
              if (!activePage) return;
              const nextSections = [...activePage.sections, { id: "testimonials-carousel", name: "Review Carousel", visible: true, score: 90 }];
              updateActivePage({ ...activePage, sections: nextSections });
              setIsSectionLibraryOpen(false);
              toast.success("Review Carousel section template added!");
            }}>
              <div className="flex justify-between items-center">
                <span className="font-bold text-xs">Student Testimonial Carousel</span>
                <span className="text-[9px] bg-emerald-100 text-emerald-800 px-1.5 rounded uppercase font-bold tracking-tight">90% SEO</span>
              </div>
              <p className="text-[10px] text-muted-foreground leading-relaxed">
                Horizontal sliding student quotes with names, avatar thumbnails, and locations.
              </p>
            </div>

            {/* Template 4 */}
            <div className="p-3 bg-[#FAF7F0] hover:bg-[#0F4D36]/5 border border-[#0F4D36]/10 rounded-xl space-y-2 cursor-pointer transition-all" onClick={() => {
              if (!activePage) return;
              const nextSections = [...activePage.sections, { id: "contact-form", name: "Direct Contact Form", visible: true, score: 94 }];
              updateActivePage({ ...activePage, sections: nextSections });
              setIsSectionLibraryOpen(false);
              toast.success("Contact Form section template added!");
            }}>
              <div className="flex justify-between items-center">
                <span className="font-bold text-xs">Direct Enrollment Form</span>
                <span className="text-[9px] bg-emerald-100 text-emerald-800 px-1.5 rounded uppercase font-bold tracking-tight">94% SEO</span>
              </div>
              <p className="text-[10px] text-muted-foreground leading-relaxed">
                Full-width contact form panel syncing inputs directly to leads manager pipelines.
              </p>
            </div>

          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsSectionLibraryOpen(false)} className="text-xs h-9 cursor-pointer">Close Library</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
}

// Simple icons placeholders for compiler
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
