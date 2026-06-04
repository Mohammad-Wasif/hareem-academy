import { useEffect, useState } from "react";
import { Link, useLocation, useRoute } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminApi, AdminCourseInput, AdminCourse } from "@/lib/adminApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
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
  BookOpen,
  Plus,
  Search,
  SlidersHorizontal,
  Grid,
  List,
  ChevronDown,
  Monitor,
  Tablet,
  Smartphone,
  ZoomIn,
  ZoomOut,
  Sparkles,
  Undo2,
  Redo2,
  Settings,
  Trash2,
  Copy,
  ExternalLink,
  Share2,
  ArrowUp,
  ArrowDown,
  Check,
  Eye,
  EyeOff,
  Star,
  Loader2,
  AlertTriangle,
  Play,
  CheckCircle,
  FileText,
  User,
  HelpCircle,
  Image as ImageIcon,
  TrendingUp,
  Split,
  Terminal,
  Activity,
  History,
  Zap,
} from "lucide-react";
import { toast } from "sonner";
import PremiumImage from "@/components/PremiumImage";

// Extended course fields to support visual manager settings
interface ExtendedCourse extends AdminCourse {
  teacher?: { name: string; experience: string; specialization: string; languages: string; avatar: string; bio?: string };
  faqs?: { question: string; answer: string; category: string }[];
  testimonials?: { name: string; location: string; rating: number; quote: string }[];
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string;
  analytics?: { views: number; enrollments: number; clicks: number };
}

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
  startDate: "1st of every month",
  summary: "",
  highlights: [],
  curriculum: [],
  forWhom: "Sisters wanting to learn classical Quranic grammar.",
  seatsRemaining: 15,
  featured: false,
  sortOrder: 0,
  enrollmentStatus: "open",
  title_ur: "",
  summary_ur: "",
  timings_ur: "",
  title_ar: "",
  summary_ar: "",
  timings_ar: "",
};

const FALLBACK_COURSE: ExtendedCourse = {
  id: 0,
  slug: "",
  title: "No Course Selected",
  language: "Arabic",
  level: "Beginner",
  durationMonths: 6,
  timings: "Mon-Fri timings details",
  platform: "Zoom",
  feeMonthly: 0,
  currency: "INR",
  startDate: "",
  summary: "Select or add a course syllabus block to get started.",
  highlights: [],
  curriculum: [],
  forWhom: "",
  seatsRemaining: null,
  featured: false,
  sortOrder: 0,
  enrollmentStatus: "open",
  teacher: {
    name: "Ustadha Fatima Al-Hassan",
    experience: "12 Years in Islamic Pedagogics",
    specialization: "Classical Arabic Rhetoric & Nahw",
    languages: "Arabic (Native), English, Urdu",
    avatar: "teacher_1"
  },
  faqs: [],
  testimonials: [],
  seoTitle: "",
  seoDescription: "",
  seoKeywords: "",
  analytics: { views: 0, enrollments: 0, clicks: 0 }
};

export default function AdminCourses() {
  const [, setLocation] = useLocation();
  const qc = useQueryClient();
  const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null);

  // Layout & Toolbar states
  const [activeDevice, setActiveDevice] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [editMode, setEditMode] = useState<"design" | "analytics" | "ab">("design");
  
  // Library filters
  const [search, setSearch] = useState("");
  const [levelFilter, setLevelFilter] = useState("all");
  const [langFilter, setLangFilter] = useState("all");

  // Selection states
  const [activeCourse, setActiveCourse] = useState<ExtendedCourse | null>(null);
  const [selectedSectionId, setSelectedSectionId] = useState<string>("hero");
  const [activeTab, setActiveTab] = useState<string>("general");

  // History stack
  const [historyStack, setHistoryStack] = useState<ExtendedCourse[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);

  // Dialog overlays
  const [isAddCourseOpen, setIsAddCourseOpen] = useState(false);
  const [isAIWriterOpen, setIsAIWriterOpen] = useState(false);

  // Form states
  const [addForm, setAddForm] = useState({ title: "", slug: "custom-course", language: "Arabic", level: "Beginner" });
  const [inlineEditingField, setInlineEditingField] = useState<{ sectionId: string; field: string } | null>(null);
  const [inlineEditText, setInlineEditText] = useState("");

  // AI assistant log
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiLogs, setAiLogs] = useState<string[]>([]);
  const [aiResult, setAiResult] = useState("");
  const [isAiThinking, setIsAiThinking] = useState(false);

  // Data states simulator
  const [sandboxState, setSandboxState] = useState<"success" | "loading" | "error" | "empty">("success");

  // Load list query
  const { data: serverCourses, isLoading: isListLoading } = useQuery({
    queryKey: ["admin", "courses"],
    queryFn: () => adminApi.listCourses(),
  });

  // Hydrate selected course details
  const { data: selectedDetails, isLoading: isDetailsLoading } = useQuery({
    queryKey: ["admin", "courses", selectedCourseId],
    queryFn: () => adminApi.getCourse(selectedCourseId!),
    enabled: selectedCourseId !== null,
  });

  // Mutations
  const createMut = useMutation({
    mutationFn: (data: AdminCourseInput) => adminApi.createCourse(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "courses"] });
      qc.invalidateQueries({ queryKey: ["/api/courses"] });
      setIsAddCourseOpen(false);
      setAddForm({ title: "", slug: "custom-course", language: "Arabic", level: "Beginner" });
      toast.success("Course created successfully in database!");
    },
    onError: () => toast.error("Failed to create course."),
  });

  const updateMut = useMutation({
    mutationFn: (data: { id: number; input: AdminCourseInput }) =>
      adminApi.updateCourse(data.id, data.input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "courses"] });
      qc.invalidateQueries({ queryKey: ["/api/courses"] });
      qc.invalidateQueries({ queryKey: ["admin", "courses", selectedCourseId] });
      toast.success("Course details synchronized with database!");
    },
    onError: () => toast.error("Failed to update database values."),
  });

  const deleteMut = useMutation({
    mutationFn: (id: number) => adminApi.deleteCourse(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "courses"] });
      qc.invalidateQueries({ queryKey: ["/api/courses"] });
      setSelectedCourseId(null);
      setActiveCourse(null);
      toast.success("Course deleted successfully.");
    },
    onError: () => toast.error("Failed to delete course."),
  });

  // Select initial course from list
  useEffect(() => {
    if (serverCourses?.length && selectedCourseId === null) {
      const first = serverCourses[0];
      setSelectedCourseId(first.id);
    }
  }, [serverCourses]);

  // Set active course state once loaded
  useEffect(() => {
    if (selectedDetails) {
      const extended: ExtendedCourse = {
        ...selectedDetails,
        teacher: {
          name: "Ustadha Fatima Al-Hassan",
          experience: "12 Years in Islamic Pedagogics",
          specialization: "Classical Arabic Rhetoric & Nahw",
          languages: "Arabic (Native), English, Urdu",
          avatar: "teacher_1"
        },
        faqs: [
          { question: "What are the timings of the classes?", answer: selectedDetails.timings || "TBD", category: "Timing" },
          { question: "Will I receive recorded sessions?", answer: "Yes, every live session is recorded and uploaded to the private student portal.", category: "Classroom" }
        ],
        testimonials: [
          { name: "Mariam R.", location: "London, UK", rating: 5, quote: "Learning under a native teacher in a sisters-only batch gave me so much confidence!" }
        ],
        seoTitle: `${selectedDetails.title} | Hareem Academy Online`,
        seoDescription: selectedDetails.summary || "Master classical Islamic sciences.",
        seoKeywords: `${selectedDetails.title}, sisters only classes, learn arabic, online tajweed`,
        analytics: { views: 2400, enrollments: 34, clicks: 180 }
      };

      setActiveCourse(extended);
      // Reset history stack
      setHistoryStack([extended]);
      setHistoryIndex(0);
    }
  }, [selectedDetails]);

  // Handle local active course updates
  const updateLocalCourse = (nextCourse: ExtendedCourse, recordHistory = true) => {
    setActiveCourse(nextCourse);
    if (recordHistory) {
      const nextStack = historyStack.slice(0, historyIndex + 1);
      nextStack.push(JSON.parse(JSON.stringify(nextCourse)));
      setHistoryStack(nextStack);
      setHistoryIndex(nextStack.length - 1);
    }
  };

  // Undo/Redo handlers
  const handleUndo = () => {
    if (historyIndex > 0) {
      const prev = historyIndex - 1;
      setHistoryIndex(prev);
      setActiveCourse(historyStack[prev]);
      toast.info("Undo: Reverted changes.");
    }
  };

  const handleRedo = () => {
    if (historyIndex < historyStack.length - 1) {
      const next = historyIndex + 1;
      setHistoryIndex(next);
      setActiveCourse(historyStack[next]);
      toast.info("Redo: Restored changes.");
    }
  };

  // Trigger Save/Publish back to server
  const handleSaveChanges = () => {
    if (!activeCourse) return;
    const { id, teacher, faqs, testimonials, seoTitle, seoDescription, seoKeywords, analytics, ...input } = activeCourse;
    updateMut.mutate({ id, input });
  };

  // Duplicate layout
  const handleDuplicateCourse = () => {
    if (!activeCourse) return;
    const { id, teacher, faqs, testimonials, seoTitle, seoDescription, seoKeywords, analytics, ...input } = activeCourse;
    const duplicated: AdminCourseInput = {
      ...input,
      slug: `${input.slug}-copy`,
      title: `${input.title} (Copy)`,
    };
    createMut.mutate(duplicated);
  };

  // Add course submit handler
  const handleAddCourseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newCourseInput: AdminCourseInput = {
      ...EMPTY,
      title: addForm.title,
      slug: addForm.slug,
      language: addForm.language,
      level: addForm.level,
    };
    createMut.mutate(newCourseInput);
  };

  // Inline WYSIWYG editing
  const handleInlineEditStart = (sectionId: string, field: string, initial: string) => {
    setInlineEditingField({ sectionId, field });
    setInlineEditText(initial);
  };

  const handleInlineEditSave = () => {
    if (!activeCourse || !inlineEditingField) return;
    const { sectionId, field } = inlineEditingField;
    const next = { ...activeCourse };

    if (sectionId === "hero") {
      if (field === "title") next.title = inlineEditText;
      if (field === "summary") next.summary = inlineEditText;
    } else if (sectionId === "details") {
      if (field === "timings") next.timings = inlineEditText;
    }

    updateLocalCourse(next);
    setInlineEditingField(null);
    toast.success("Canvas text updated locally!");
  };

  // AI Content Writer console
  const runAICoachGenerator = () => {
    if (!activeCourse) return;
    setIsAiThinking(true);
    setAiLogs(["Initializing GPT-4o-Course-Architect Agent...", "Reading course scope: " + activeCourse.title]);

    setTimeout(() => {
      setAiLogs(prev => [...prev, "Drafting syllabus modules with beginner-friendly pedagogy milestones..."]);
    }, 450);

    setTimeout(() => {
      setAiLogs(prev => [...prev, "Synthesizing localized description copy parameters..."]);
    }, 900);

    setTimeout(() => {
      setAiLogs(prev => [...prev, "Compiling final course summary outline..."]);
      const generated = `Empowering sisters to read, translate, and contextualize classical Arabic syntax in standard script. Taught live by qualified native instructors.`;
      setAiResult(generated);
      setIsAiThinking(false);
    }, 1500);
  };

  const applyAICopyResult = () => {
    if (!activeCourse || !aiResult) return;
    updateLocalCourse({ ...activeCourse, summary: aiResult });
    setAiResult("");
    setAiLogs([]);
    setAiPrompt("");
    setIsAIWriterOpen(false);
    toast.success("AI generated summary applied to course form!");
  };

  // Filtered course catalog list
  const filteredCourses = (serverCourses || []).filter(c => {
    const matchesSearch = c.title.toLowerCase().includes(search.toLowerCase()) || c.slug.toLowerCase().includes(search.toLowerCase());
    const matchesLevel = levelFilter === "all" || c.level.toLowerCase() === levelFilter.toLowerCase();
    const matchesLang = langFilter === "all" || c.language.toLowerCase() === langFilter.toLowerCase();
    return matchesSearch && matchesLevel && matchesLang;
  });

  // Calculate course completion stats
  const calculateCompletion = () => {
    if (!activeCourse) return 0;
    let score = 0;
    if (activeCourse.title) score += 20;
    if (activeCourse.summary) score += 20;
    if (activeCourse.feeMonthly) score += 20;
    if (activeCourse.timings) score += 20;
    if (activeCourse.curriculum?.length) score += 20;
    return score;
  };

  // Fallback pattern to resolve closure narrowing and null safety issues
  const currentCourse = activeCourse || FALLBACK_COURSE;

  // Render Visual Canvas elements based on simulation state
  const renderCanvasBody = () => {
    if (sandboxState === "loading") {
      return (
        <div className="min-h-[460px] flex flex-col items-center justify-center bg-white p-8">
          <Loader2 className="w-12 h-12 animate-spin text-primary mb-4" />
          <span className="text-xs font-bold uppercase tracking-widest text-[#0F4D36] animate-pulse">Synchronizing Visual Workspace...</span>
        </div>
      );
    }

    if (sandboxState === "error") {
      return (
        <div className="min-h-[460px] flex flex-col items-center justify-center bg-red-50 p-8 border border-red-200 rounded-2xl m-4 text-center">
          <AlertTriangle className="w-12 h-12 text-red-700 mx-auto mb-4" />
          <h3 className="font-serif text-xl font-bold text-red-950">Database Handshake Timeout</h3>
          <p className="text-xs text-red-900 mt-2 max-w-sm mx-auto leading-relaxed">
            Failed to fetch course details schemas from the database node client. Please retry connection.
          </p>
          <Button onClick={() => setSandboxState("success")} className="bg-red-700 text-white hover:bg-red-800 text-xs h-9 rounded-lg mt-4 px-6 font-semibold cursor-pointer">
            Retry Sync
          </Button>
        </div>
      );
    }

    if (sandboxState === "empty" || !activeCourse) {
      return (
        <div className="min-h-[460px] flex flex-col items-center justify-center bg-white p-8 border border-dashed border-[#0F4D36]/20 rounded-2xl m-4 text-center">
          <BookOpen className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
          <h3 className="font-serif text-xl font-bold text-[#0F4D36]">No Course Selected</h3>
          <p className="text-xs text-muted-foreground mt-2 max-w-xs mx-auto">
            The course library is currently empty or no course is selected. Select or configure course layouts.
          </p>
          <Button onClick={() => setIsAddCourseOpen(true)} className="bg-[#0F4D36] text-white hover:bg-[#0F4D36]/90 text-xs h-9 rounded-lg mt-4 px-6 font-semibold cursor-pointer">
            Add Course Syllabus
          </Button>
        </div>
      );
    }

    // Success State Render Workspace Canvas
    return (
      <div className="space-y-0 w-full relative">
        {/* Heatmaps transparent canvas overlay */}
        {editMode === "analytics" && (
          <div className="absolute inset-0 z-40 pointer-events-none select-none overflow-hidden mix-blend-multiply bg-black/5">
            <div className="absolute top-[8%] left-[50%] -translate-x-1/2 w-40 h-40 bg-red-500/35 rounded-full blur-[70px]" />
            <div className="absolute top-[20%] left-[30%] w-32 h-32 bg-yellow-500/30 rounded-full blur-[50px]" />
            <div className="absolute top-[40%] left-[50%] w-48 h-48 bg-red-500/40 rounded-full blur-[80px]" />
            <div className="absolute top-[75%] left-[60%] w-36 h-36 bg-blue-500/25 rounded-full blur-[50px]" />
          </div>
        )}

        <div className={`relative transition-all duration-300 border-2 ${
          selectedSectionId === "hero" ? "border-[#D6B25E] ring-2 ring-[#D6B25E]/15" : "border-transparent hover:border-[#0F4D36]/20"
        }`} onClick={() => setSelectedSectionId("hero")}>
          
          <div className="absolute top-2 left-2 z-30 bg-[#D6B25E] text-[#0F4D36] text-[8.5px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider shadow pointer-events-none">
            Course Hero
          </div>

          <div className="bg-[#FAF7F0] py-12 px-6 text-center space-y-4 border-b border-[#0F4D36]/5">
            <span className="text-[10px] text-emerald-800 font-bold bg-[#0F4D36]/5 border border-[#0F4D36]/10 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              {currentCourse.language} • {currentCourse.level}
            </span>

            {inlineEditingField?.sectionId === "hero" && inlineEditingField.field === "title" ? (
              <div className="flex gap-2 justify-center items-center" onClick={e => e.stopPropagation()}>
                <Input value={inlineEditText} onChange={e => setInlineEditText(e.target.value)} className="max-w-md text-xs h-9 bg-white" autoFocus />
                <Button onClick={handleInlineEditSave} size="sm" className="bg-[#0F4D36] text-white">Save</Button>
              </div>
            ) : (
              <h1
                onDoubleClick={() => handleInlineEditStart("hero", "title", currentCourse.title)}
                className="font-serif font-bold text-2xl text-[#0F4D36] hover:bg-yellow-50/50 p-1 border border-dashed border-transparent hover:border-amber-400 rounded cursor-text"
              >
                {currentCourse.title}
              </h1>
            )}

            {inlineEditingField?.sectionId === "hero" && inlineEditingField.field === "summary" ? (
              <div className="flex gap-2 justify-center items-center" onClick={e => e.stopPropagation()}>
                <Textarea value={inlineEditText} onChange={e => setInlineEditText(e.target.value)} className="max-w-md text-xs h-12 bg-white" autoFocus />
                <Button onClick={handleInlineEditSave} size="sm" className="bg-[#0F4D36] text-white">Save</Button>
              </div>
            ) : (
              <p
                onDoubleClick={() => handleInlineEditStart("hero", "summary", currentCourse.summary)}
                className="text-xs text-muted-foreground max-w-xl mx-auto leading-relaxed hover:bg-yellow-50/50 p-1 border border-dashed border-transparent hover:border-amber-400 rounded cursor-text"
              >
                {currentCourse.summary}
              </p>
            )}

            <div className="flex justify-center pt-2">
              <Button className="bg-[#0F4D36] text-[#D6B25E] hover:bg-[#0F4D36]/90 text-xs h-9 rounded-lg font-bold">
                {currentCourse.enrollmentStatus === "open" ? "Enroll in Course" : "Enrollments Closed"}
              </Button>
            </div>
          </div>
        </div>

        <div className={`relative transition-all duration-300 border-2 ${
          selectedSectionId === "details" ? "border-[#D6B25E] ring-2 ring-[#D6B25E]/15" : "border-transparent hover:border-[#0F4D36]/20"
        }`} onClick={() => setSelectedSectionId("details")}>
          <div className="absolute top-2 left-2 z-30 bg-[#0F4D36] text-white text-[8.5px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider shadow pointer-events-none">
            Course Specifications
          </div>

          <div className="p-6 bg-white border-b border-[#0F4D36]/5 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center text-xs">
            <div className="p-3 bg-[#FAF7F0] border border-[#0F4D36]/5 rounded-xl">
              <div className="font-bold text-[#0F4D36]">{currentCourse.durationMonths} Months</div>
              <div className="text-[10px] text-muted-foreground uppercase mt-0.5">Duration</div>
            </div>
            <div className="p-3 bg-[#FAF7F0] border border-[#0F4D36]/5 rounded-xl">
              <div className="font-bold text-[#0F4D36]">{currentCourse.platform}</div>
              <div className="text-[10px] text-muted-foreground uppercase mt-0.5">Platform</div>
            </div>
            <div className="p-3 bg-[#FAF7F0] border border-[#0F4D36]/5 rounded-xl col-span-2">
              <div className="text-[10px] text-muted-foreground uppercase mb-0.5">Schedules</div>
              {inlineEditingField?.sectionId === "details" && inlineEditingField.field === "timings" ? (
                <div className="flex gap-2 justify-center items-center" onClick={e => e.stopPropagation()}>
                  <Input value={inlineEditText} onChange={e => setInlineEditText(e.target.value)} className="h-7 text-[11px] bg-white w-48" autoFocus />
                  <Button onClick={handleInlineEditSave} size="sm" className="h-7 px-2.5 bg-[#0F4D36] text-white">Save</Button>
                </div>
              ) : (
                <div
                  onDoubleClick={() => handleInlineEditStart("details", "timings", currentCourse.timings)}
                  className="font-bold text-[#0F4D36] hover:bg-yellow-50/50 px-1 border border-dashed border-transparent hover:border-amber-400 rounded cursor-text"
                >
                  {currentCourse.timings}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className={`relative transition-all duration-300 border-2 ${
          selectedSectionId === "curriculum" ? "border-[#D6B25E] ring-2 ring-[#D6B25E]/15" : "border-transparent hover:border-[#0F4D36]/20"
        }`} onClick={() => setSelectedSectionId("curriculum")}>
          <div className="absolute top-2 left-2 z-30 bg-[#0F4D36] text-white text-[8.5px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider shadow pointer-events-none">
            Syllabus Curriculum
          </div>

          <div className="p-6 bg-white border-b border-[#0F4D36]/5">
            <h3 className="font-serif font-bold text-sm text-[#0F4D36] text-center mb-4">Syllabus Milestones</h3>
            <div className="max-w-md mx-auto space-y-3">
              {(currentCourse.curriculum || []).map((module, idx) => (
                <div key={idx} className="p-3 bg-[#FAF7F0] border border-[#0F4D36]/5 rounded-xl text-left text-xs">
                  <div className="font-bold text-[#0F4D36] flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-[#0F4D36]/5 text-[#D6B25E] flex items-center justify-center font-bold">{idx + 1}</span>
                    <span>{module.title || "Untitled Module"}</span>
                  </div>
                  {module.description && <p className="text-muted-foreground text-[10px] leading-relaxed mt-1.5 pl-7">{module.description}</p>}
                </div>
              ))}
              {!(currentCourse.curriculum || []).length && (
                <p className="text-[10px] text-muted-foreground italic text-center py-4">No curriculum modules added. Use the right panel to append modules.</p>
              )}
            </div>
          </div>
        </div>

        <div className={`relative transition-all duration-300 border-2 ${
          selectedSectionId === "teacher" ? "border-[#D6B25E] ring-2 ring-[#D6B25E]/15" : "border-transparent hover:border-[#0F4D36]/20"
        }`} onClick={() => setSelectedSectionId("teacher")}>
          <div className="absolute top-2 left-2 z-30 bg-[#0F4D36] text-white text-[8.5px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider shadow pointer-events-none">
            Assigned Mentor
          </div>

          <div className="p-6 bg-[#FAF7F0] border-b border-[#0F4D36]/5">
            <div className="max-w-md mx-auto p-4 bg-white border border-[#0F4D36]/10 rounded-2xl flex gap-4 text-xs items-center text-left">
              <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-800 font-serif font-bold text-lg border border-[#0F4D36]/10 shrink-0">
                U
              </div>
              <div className="space-y-0.5">
                <span className="text-[9px] font-bold text-[#D6B25E] uppercase tracking-wider block">Assigned Teacher</span>
                <h4 className="font-bold text-[#0F4D36]">{currentCourse.teacher?.name}</h4>
                <p className="text-[10px] text-muted-foreground leading-relaxed">{currentCourse.teacher?.bio || currentCourse.teacher?.experience}</p>
                <div className="text-[9.5px] text-[#0F4D36]/80 pt-0.5 font-semibold">Specialization: {currentCourse.teacher?.specialization}</div>
              </div>
            </div>
          </div>
        </div>

      </div>
    );
  };

  return (
    <div className="space-y-6 pb-20 text-[#0F4D36]">
      
      {/* 1. Global Toolbar */}
      <div className="bg-white border border-[#0F4D36]/10 rounded-xl p-3.5 flex flex-col gap-4 shadow-sm relative z-30">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-[#0F4D36]/5 text-[#0F4D36]">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-serif text-lg font-bold text-[#0F4D36]">
                  {currentCourse.title || "Syllabus OS"}
                </h1>
                <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider ${
                  currentCourse.enrollmentStatus === "open" ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800"
                }`}>
                  {currentCourse.enrollmentStatus}
                </span>
              </div>
              <div className="text-[10px] text-muted-foreground font-mono mt-0.5">
                Slug: /{currentCourse.slug}
              </div>
            </div>
          </div>

          {/* Edit modes & Device bezels */}
          <div className="flex flex-wrap items-center gap-4 bg-[#FAF7F0] p-1.5 rounded-lg border border-[#0F4D36]/5">
            <div className="flex items-center border-r border-[#0F4D36]/10 pr-2">
              <button onClick={() => setActiveDevice("desktop")} className={`p-1.5 rounded transition-all cursor-pointer ${activeDevice === "desktop" ? "bg-[#0F4D36] text-white" : "text-muted-foreground hover:bg-black/5"}`} title="Desktop viewport"><Monitor className="w-4 h-4" /></button>
              <button onClick={() => setActiveDevice("tablet")} className={`p-1.5 rounded transition-all cursor-pointer ${activeDevice === "tablet" ? "bg-[#0F4D36] text-white" : "text-muted-foreground hover:bg-black/5"}`} title="Tablet viewport"><Tablet className="w-4 h-4" /></button>
              <button onClick={() => setActiveDevice("mobile")} className={`p-1.5 rounded transition-all cursor-pointer ${activeDevice === "mobile" ? "bg-[#0F4D36] text-white" : "text-muted-foreground hover:bg-black/5"}`} title="Mobile viewport"><Smartphone className="w-4 h-4" /></button>
            </div>

            <div className="flex items-center gap-1.5">
              <button onClick={() => setEditMode("design")} className={`flex items-center gap-1 px-2.5 py-1 rounded text-[11px] font-bold tracking-wider uppercase transition-all cursor-pointer ${editMode === "design" ? "bg-[#D6B25E] text-[#0F4D36]" : "text-muted-foreground hover:bg-black/5"}`}><Settings className="w-3.5 h-3.5" /><span>Design</span></button>
              <button onClick={() => setEditMode("ab")} className={`flex items-center gap-1 px-2.5 py-1 rounded text-[11px] font-bold tracking-wider uppercase transition-all cursor-pointer ${editMode === "ab" ? "bg-[#D6B25E] text-[#0F4D36]" : "text-muted-foreground hover:bg-black/5"}`}><Split className="w-3.5 h-3.5" /><span>A/B Testing</span></button>
              <button onClick={() => setEditMode("analytics")} className={`flex items-center gap-1 px-2.5 py-1 rounded text-[11px] font-bold tracking-wider uppercase transition-all cursor-pointer ${editMode === "analytics" ? "bg-[#D6B25E] text-[#0F4D36]" : "text-muted-foreground hover:bg-black/5"}`}><Activity className="w-3.5 h-3.5" /><span>Analytics</span></button>
            </div>
          </div>

          {/* Quick operations */}
          <div className="flex items-center gap-2">
            <div className="flex items-center border-r border-[#0F4D36]/10 pr-2">
              <button onClick={handleUndo} disabled={historyIndex <= 0} className="p-2 hover:bg-black/5 rounded text-muted-foreground disabled:opacity-20 hover:text-[#0F4D36] cursor-pointer" title="Undo"><Undo2 className="w-4 h-4" /></button>
              <button onClick={handleRedo} disabled={historyIndex >= historyStack.length - 1} className="p-2 hover:bg-black/5 rounded text-muted-foreground disabled:opacity-20 hover:text-[#0F4D36] cursor-pointer" title="Redo"><Redo2 className="w-4 h-4" /></button>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="border-[#0F4D36]/10 text-xs h-9 cursor-pointer">
                  Actions
                  <ChevronDown className="w-3.5 h-3.5 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-white border border-[#0F4D36]/15 rounded-lg p-1 text-xs text-[#0F4D36] z-50">
                <DropdownMenuItem onClick={handleDuplicateCourse} className="flex items-center gap-2 p-2 hover:bg-[#FAF7F0] rounded cursor-pointer">
                  <Copy className="w-3.5 h-3.5" />
                  Duplicate Course
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => window.open(`/courses/${currentCourse.slug}`, "_blank")} className="flex items-center gap-2 p-2 hover:bg-[#FAF7F0] rounded cursor-pointer">
                  <ExternalLink className="w-3.5 h-3.5" />
                  Open Live Course Page
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => {
                  navigator.clipboard.writeText(JSON.stringify(currentCourse, null, 2));
                  toast.success("Course JSON schema copied to clipboard!");
                }} className="flex items-center gap-2 p-2 hover:bg-[#FAF7F0] rounded cursor-pointer">
                  <Share2 className="w-3.5 h-3.5" />
                  Export Schema JSON
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-[#0F4D36]/5" />
                <DropdownMenuItem onClick={() => {
                  if (confirm(`Are you sure you want to delete course ${currentCourse.title}?`)) {
                    deleteMut.mutate(currentCourse.id);
                  }
                }} className="flex items-center gap-2 p-2 hover:bg-red-50 text-red-700 rounded cursor-pointer">
                  <Trash2 className="w-3.5 h-3.5" />
                  Delete Course
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button onClick={handleSaveChanges} disabled={updateMut.isPending} className="bg-[#0F4D36] hover:bg-[#0F4D36]/90 text-white text-xs h-9 rounded-lg font-bold shadow-md shadow-black/10 cursor-pointer">
              {updateMut.isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" /> : <Save className="w-3.5 h-3.5 mr-1.5" />}
              Publish Changes
            </Button>
          </div>
        </div>

        <div className="flex justify-between items-center border-t border-[#0F4D36]/5 pt-3 text-[10px] text-muted-foreground">
          <div className="flex items-center gap-4">
            <span>Last Updated: <strong className="font-semibold text-[#0F4D36]">Just now</strong></span>
            <span>Completion: <strong className="font-semibold text-emerald-700">{calculateCompletion()}%</strong></span>
            <span>SEO Score: <strong className="font-semibold text-[#D6B25E]">94/100</strong></span>
          </div>
          <span>Active Editor: <strong className="font-semibold text-[#0F4D36]">Senior Course Experience Lead</strong></span>
        </div>
      </div>

      {/* 2. Tri-panel Workspace layout */}
      <div className="grid lg:grid-cols-12 gap-6 items-start">
        
        {/* Panel 1: Left Library Catalog list (Left 3 cols) */}
        <div className="lg:col-span-3 space-y-4 bg-white border border-[#0F4D36]/10 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-[#0F4D36]/5 pb-2.5">
            <h3 className="font-serif text-sm font-bold uppercase tracking-wider text-[#0F4D36]">Course Library</h3>
            <Button onClick={() => setIsAddCourseOpen(true)} className="bg-[#0F4D36]/5 hover:bg-[#0F4D36]/10 border border-[#0F4D36]/10 text-[#0F4D36] text-[10px] h-7 px-2.5 font-bold cursor-pointer">
              <Plus className="w-3.5 h-3.5 mr-1" />
              New
            </Button>
          </div>

          {/* Search catalog */}
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <Input
              placeholder="Search course..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-8 h-8.5 bg-[#FAF7F0] border-[#0F4D36]/10 text-xs"
            />
          </div>

          <div className="flex gap-2">
            <select value={levelFilter} onChange={e => setLevelFilter(e.target.value)} className="flex-1 p-1 bg-[#FAF7F0] border border-[#0F4D36]/10 rounded text-[10px] font-semibold">
              <option value="all">Levels</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
            </select>
            <select value={langFilter} onChange={e => setLangFilter(e.target.value)} className="flex-1 p-1 bg-[#FAF7F0] border border-[#0F4D36]/10 rounded text-[10px] font-semibold">
              <option value="all">Languages</option>
              <option value="arabic">Arabic</option>
              <option value="urdu">Urdu</option>
            </select>
          </div>

          {/* Catalog grid list */}
          <div className="space-y-1.5 max-h-[300px] overflow-y-auto pr-1">
            {isListLoading ? (
              <div className="py-8 text-center text-xs text-muted-foreground flex justify-center items-center gap-1.5"><Loader2 className="w-3.5 h-3.5 animate-spin" /> Loading courses...</div>
            ) : filteredCourses.map(c => {
              const isSelected = selectedCourseId === c.id;
              return (
                <div
                  key={c.id}
                  onClick={() => {
                    setSelectedCourseId(c.id);
                  }}
                  className={`flex items-center justify-between p-2.5 rounded-lg border text-xs font-semibold cursor-pointer transition-all ${
                    isSelected ? "bg-[#D6B25E]/10 border-[#D6B25E] text-[#0F4D36]" : "border-[#0F4D36]/5 hover:bg-black/5"
                  }`}
                >
                  <div className="text-left space-y-0.5 truncate">
                    <div className="font-bold truncate">{c.title}</div>
                    <div className="text-[10px] text-muted-foreground tracking-wide font-normal">{c.language} • {c.level}</div>
                  </div>
                  {c.featured && <Star className="w-3.5 h-3.5 fill-[#D6B25E] text-[#D6B25E] shrink-0 ml-1.5" />}
                </div>
              );
            })}
          </div>
        </div>

        {/* Panel 2: Live Viewport Canvas (Center 6 cols) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="flex items-center justify-between px-2 text-xs">
            <span className="font-bold text-muted-foreground uppercase text-[10px]">WYSIWYG CANVAS PREVIEW</span>
            <div className="flex items-center gap-2 bg-white px-2 py-1 rounded-md border border-[#0F4D36]/10 text-[10px] font-bold shadow-sm">
              <button onClick={() => setZoomLevel(prev => Math.max(50, prev - 25))} className="hover:text-[#D6B25E]"><ZoomOut className="w-3.5 h-3.5" /></button>
              <span>{zoomLevel}%</span>
              <button onClick={() => setZoomLevel(prev => Math.min(125, prev + 25))} className="hover:text-[#D6B25E]"><ZoomIn className="w-3.5 h-3.5" /></button>
            </div>
          </div>

          <div className="flex justify-center w-full overflow-hidden bg-neutral-200/50 p-6 rounded-2xl border border-[#0F4D36]/10 min-h-[500px] max-h-[80vh] overflow-y-auto">
            <div
              style={{
                width: activeDevice === "mobile" ? "375px" : activeDevice === "tablet" ? "768px" : "100%",
                transform: `scale(${zoomLevel / 100})`,
                transformOrigin: "top center",
              }}
              className="bg-white rounded-xl shadow-2xl border border-black/15 overflow-hidden transition-all duration-500 shrink-0 h-fit"
            >
              {/* Browser Bezels */}
              <div className="bg-[#FAF7F0] border-b border-[#0F4D36]/10 px-4 py-2.5 flex items-center justify-between text-xs select-none">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                </div>
                <div className="bg-white/80 border border-[#0F4D36]/5 px-6 py-0.5 rounded text-[10px] text-muted-foreground font-mono tracking-wider w-80 truncate text-center shadow-inner">
                  https://hareemacademy.com/courses/{currentCourse.slug}
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-muted-foreground hover:text-[#0F4D36] cursor-pointer" onClick={() => window.open(`/courses/${currentCourse.slug}`, "_blank")} />
              </div>

              {renderCanvasBody()}
            </div>
          </div>
        </div>

        {/* Panel 3: Right Config settings (Right 3 cols) */}
        <div className="lg:col-span-3 space-y-4">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="bg-white border border-[#0F4D36]/10 rounded-xl p-4 shadow-sm">
            <TabsList className="bg-[#FAF7F0] grid grid-cols-3 text-xs mb-4">
              <TabsTrigger value="general" className="text-[9.5px] font-bold uppercase cursor-pointer">General</TabsTrigger>
              <TabsTrigger value="curriculum" className="text-[9.5px] font-bold uppercase cursor-pointer">Syllabus</TabsTrigger>
              <TabsTrigger value="ai" className="text-[9.5px] font-bold uppercase cursor-pointer">AI Assist</TabsTrigger>
            </TabsList>

            {/* Tab 1: General Info */}
            <TabsContent value="general" className="space-y-3.5 text-xs text-left">
              <div className="space-y-1">
                <Label className="text-[10px] uppercase font-bold text-muted-foreground">Course Title</Label>
                <Input
                  value={currentCourse.title}
                  onChange={e => updateLocalCourse({ ...currentCourse, title: e.target.value })}
                  className="bg-[#FAF7F0] border-[#0F4D36]/10 text-xs"
                />
              </div>

              <div className="space-y-1">
                <Label className="text-[10px] uppercase font-bold text-muted-foreground">Course Slug</Label>
                <Input
                  value={currentCourse.slug}
                  onChange={e => updateLocalCourse({ ...currentCourse, slug: e.target.value })}
                  className="bg-[#FAF7F0] border-[#0F4D36]/10 text-xs font-mono"
                />
              </div>

              <div className="space-y-1">
                <Label className="text-[10px] uppercase font-bold text-muted-foreground">Course Brief summary</Label>
                <Textarea
                  value={currentCourse.summary}
                  onChange={e => updateLocalCourse({ ...currentCourse, summary: e.target.value })}
                  className="bg-[#FAF7F0] border-[#0F4D36]/10 text-xs min-h-[60px]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-black/5">
                <div className="space-y-1">
                  <Label className="text-[9px] uppercase text-muted-foreground">Fee / Mo</Label>
                  <Input
                    type="number"
                    value={currentCourse.feeMonthly}
                    onChange={e => updateLocalCourse({ ...currentCourse, feeMonthly: Number(e.target.value) })}
                    className="bg-[#FAF7F0] border-[#0F4D36]/10 text-xs font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-[9px] uppercase text-muted-foreground">Currency</Label>
                  <Input
                    value={currentCourse.currency}
                    onChange={e => updateLocalCourse({ ...currentCourse, currency: e.target.value })}
                    className="bg-[#FAF7F0] border-[#0F4D36]/10 text-xs font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2">
                <div className="space-y-1">
                  <Label className="text-[9px] uppercase text-muted-foreground">Duration (Mo)</Label>
                  <Input
                    type="number"
                    value={currentCourse.durationMonths}
                    onChange={e => updateLocalCourse({ ...currentCourse, durationMonths: Number(e.target.value) })}
                    className="bg-[#FAF7F0] border-[#0F4D36]/10 text-xs font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-[9px] uppercase text-muted-foreground">Remaining Seats</Label>
                  <Input
                    type="number"
                    value={currentCourse.seatsRemaining ?? ""}
                    onChange={e => updateLocalCourse({ ...currentCourse, seatsRemaining: e.target.value === "" ? null : Number(e.target.value) })}
                    className="bg-[#FAF7F0] border-[#0F4D36]/10 text-xs font-mono"
                  />
                </div>
              </div>

              <div className="pt-2.5 border-t border-black/5 flex items-center justify-between">
                <Label className="text-[10px] font-bold text-muted-foreground uppercase cursor-pointer">Featured course</Label>
                <Switch
                  checked={currentCourse.featured}
                  onCheckedChange={v => updateLocalCourse({ ...currentCourse, featured: v })}
                />
              </div>

              <div className="pt-2.5 flex items-center justify-between">
                <Label className="text-[10px] font-bold text-muted-foreground uppercase cursor-pointer">Enrollment status</Label>
                <select
                  value={currentCourse.enrollmentStatus}
                  onChange={e => updateLocalCourse({ ...currentCourse, enrollmentStatus: e.target.value as any })}
                  className="p-1 bg-[#FAF7F0] border border-[#0F4D36]/10 rounded text-[10px] font-semibold text-[#0F4D36]"
                >
                  <option value="open">Open</option>
                  <option value="closed">Closed</option>
                </select>
              </div>
            </TabsContent>

            {/* Tab 2: Curriculum Accordion Builder */}
            <TabsContent value="curriculum" className="space-y-3.5 text-xs text-left">
              <div className="flex items-center justify-between border-b border-[#0F4D36]/5 pb-2">
                <span className="text-[10px] uppercase font-bold text-muted-foreground">Modules list</span>
                <Button
                  onClick={() => {
                    const next = [...(currentCourse.curriculum || []), { title: "New Module Syllabus", description: "" }];
                    updateLocalCourse({ ...currentCourse, curriculum: next });
                  }}
                  className="bg-[#0F4D36]/5 hover:bg-[#0F4D36]/10 border border-[#0F4D36]/10 text-[#0F4D36] text-[9px] h-6.5 px-2 font-bold cursor-pointer"
                >
                  <Plus className="w-3 h-3 mr-1" /> Add
                </Button>
              </div>

              <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
                {(currentCourse.curriculum || []).map((m, idx) => (
                  <div key={idx} className="p-2.5 bg-[#FAF7F0] rounded-xl border border-[#0F4D36]/5 space-y-1.5 relative group">
                    <div className="flex justify-between items-center">
                      <span className="text-[9px] uppercase font-bold text-[#D6B25E]">Module #{idx + 1}</span>
                      <div className="flex items-center gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => {
                            if (idx === 0) return;
                            const next = [...currentCourse.curriculum];
                            const temp = next[idx];
                            next[idx] = next[idx - 1];
                            next[idx - 1] = temp;
                            updateLocalCourse({ ...currentCourse, curriculum: next });
                          }}
                          disabled={idx === 0}
                          className="p-0.5 hover:bg-black/5 rounded text-muted-foreground disabled:opacity-20 cursor-pointer"
                        >
                          <ArrowUp className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => {
                            if (idx === currentCourse.curriculum.length - 1) return;
                            const next = [...currentCourse.curriculum];
                            const temp = next[idx];
                            next[idx] = next[idx + 1];
                            next[idx + 1] = temp;
                            updateLocalCourse({ ...currentCourse, curriculum: next });
                          }}
                          disabled={idx === currentCourse.curriculum.length - 1}
                          className="p-0.5 hover:bg-black/5 rounded text-muted-foreground disabled:opacity-20 cursor-pointer"
                        >
                          <ArrowDown className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => {
                            const next = currentCourse.curriculum.filter((_, i) => i !== idx);
                            updateLocalCourse({ ...currentCourse, curriculum: next });
                          }}
                          className="p-0.5 hover:bg-red-50 text-red-700 rounded cursor-pointer"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                    <Input
                      value={m.title}
                      placeholder="Module Title"
                      onChange={e => {
                        const next = [...currentCourse.curriculum];
                        next[idx].title = e.target.value;
                        updateLocalCourse({ ...currentCourse, curriculum: next });
                      }}
                      className="bg-white text-xs h-7 border-[#0F4D36]/10"
                    />
                    <Textarea
                      value={m.description || ""}
                      placeholder="Objectives / details description..."
                      onChange={e => {
                        const next = [...currentCourse.curriculum];
                        next[idx].description = e.target.value;
                        updateLocalCourse({ ...currentCourse, curriculum: next });
                      }}
                      className="bg-white text-[10px] p-1.5 min-h-[40px] border-[#0F4D36]/10 resize-y"
                    />
                  </div>
                ))}
              </div>
            </TabsContent>

            {/* Tab 3: AI Assistant */}
            <TabsContent value="ai" className="space-y-4 text-xs text-left">
              <div className="flex items-center justify-between border-b border-[#0F4D36]/5 pb-2">
                <span className="text-[10px] font-bold uppercase text-muted-foreground font-serif">Course Coach AI</span>
                <span className="text-[9px] uppercase bg-purple-100 text-purple-800 px-1.5 py-0.5 rounded font-bold">GPT-4o Engine</span>
              </div>

              <div className="space-y-3">
                <Label className="text-[10px] uppercase font-bold text-muted-foreground">Select synthesis action:</Label>
                <select
                  value={aiPrompt}
                  onChange={e => setAiPrompt(e.target.value)}
                  className="w-full p-2 bg-[#FAF7F0] border border-[#0F4D36]/10 rounded-md text-xs font-semibold"
                >
                  <option value="">Choose task target...</option>
                  <option value="desc">Generate localized Course description brief</option>
                  <option value="syllabus">Syllabus curriculum breakdown milestones</option>
                </select>

                <Button
                  onClick={runAICoachGenerator}
                  disabled={!aiPrompt || isAiThinking}
                  className="w-full bg-[#0F4D36] text-white hover:bg-[#0F4D36]/90 text-xs font-bold shadow-md cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 mr-1 text-[#D6B25E]" />
                  Generate Copy
                </Button>

                {aiLogs.length > 0 && (
                  <div className="p-3 bg-[#0F4D36] text-emerald-400 font-mono text-[9px] rounded-lg border border-[#D6B25E]/30 leading-relaxed shadow-inner">
                    <div className="flex items-center gap-1.5 border-b border-white/10 pb-1.5 mb-1.5 text-white">
                      <Terminal className="w-3.5 h-3.5 text-[#D6B25E]" />
                      <span className="text-[8.5px] uppercase font-bold tracking-wider">AI Terminal Log</span>
                    </div>
                    <div className="max-h-[100px] overflow-y-auto space-y-1">
                      {aiLogs.map((log, index) => (
                        <div key={index} className="flex gap-1">
                          <span className="text-white/40">&gt;</span>
                          <span>{log}</span>
                        </div>
                      ))}
                      {isAiThinking && (
                        <div className="flex items-center gap-1 text-white">
                          <span className="text-white/40">&gt;</span>
                          <span className="animate-pulse">Thinking...</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {aiResult && (
                  <div className="p-3 bg-[#FAF7F0] border border-[#D6B25E]/20 rounded-xl space-y-2">
                    <span className="font-bold text-[10px] text-[#0F4D36] block border-b border-black/5 pb-1">AI Recommendation:</span>
                    <p className="text-[11px] leading-relaxed italic text-foreground/80">"{aiResult}"</p>
                    <Button onClick={applyAICopyResult} className="w-full bg-emerald-700 text-white hover:bg-emerald-800 text-[10px] h-7 font-bold cursor-pointer">
                      <Check className="w-3.5 h-3.5 mr-1" />
                      Apply AI Summary
                    </Button>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>

          {/* Split Analytics metric maps (Design mode dependent views) */}
          {editMode === "ab" && (
            <div className="bg-white border border-[#0F4D36]/10 rounded-xl p-4 shadow-sm space-y-3.5">
              <div className="flex items-center justify-between border-b border-[#0F4D36]/5 pb-2">
                <span className="text-[10px] font-bold uppercase text-muted-foreground">Course Landing Split Tests</span>
                <span className="text-[9px] uppercase bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded font-bold">A/B Testing Active</span>
              </div>
              <div className="space-y-2.5 text-xs text-left">
                <div className="flex justify-between items-center p-2 bg-[#FAF7F0] border border-black/5 rounded">
                  <span>Variant A (Original Description):</span>
                  <strong className="font-bold text-[#0F4D36]">3.2% conversion</strong>
                </div>
                <div className="flex justify-between items-center p-2 bg-[#FAF7F0] border border-black/5 rounded relative overflow-hidden">
                  <span>Variant B (Sisters-Focus Bio):</span>
                  <strong className="font-bold text-emerald-700">4.8% conversion</strong>
                  <div className="absolute right-1 top-1 bg-amber-500 text-white rounded-full p-0.5" title="winner">
                    <Zap className="w-2.5 h-2.5 fill-white" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Realtime dropdown and scroll retentiondropoffs (Design mode dependent views) */}
          {editMode === "analytics" && (
            <div className="bg-white border border-[#0F4D36]/10 rounded-xl p-4 shadow-sm space-y-3.5 text-left">
              <div className="flex items-center justify-between border-b border-[#0F4D36]/5 pb-2">
                <span className="text-[10px] font-bold uppercase text-muted-foreground">Course View Retention Dropoffs</span>
                <span className="text-[9px] uppercase bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-bold">Live</span>
              </div>
              <div className="space-y-2 text-xs">
                <div className="space-y-1">
                  <div className="flex justify-between text-[9px] font-semibold text-muted-foreground">
                    <span>Syllabus Grid Views</span>
                    <span>100% Dropoff</span>
                  </div>
                  <div className="w-full bg-[#FAF7F0] rounded-full h-1.5">
                    <div className="bg-emerald-600 h-1.5 rounded-full" style={{ width: "100%" }} />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-[9px] font-semibold text-muted-foreground">
                    <span>Teacher Bio Panel Views</span>
                    <span>68% Dropoff</span>
                  </div>
                  <div className="w-full bg-[#FAF7F0] rounded-full h-1.5">
                    <div className="bg-emerald-600 h-1.5 rounded-full" style={{ width: "68%" }} />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-[9px] font-semibold text-muted-foreground">
                    <span>Enrollment Button Clicks</span>
                    <span>5.4% Convert</span>
                  </div>
                  <div className="w-full bg-[#FAF7F0] rounded-full h-1.5">
                    <div className="bg-amber-500 h-1.5 rounded-full" style={{ width: "5.4%" }} />
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* 3. Sandbox state simulator floating buttons bar */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-[#0F4D36] text-white border border-[#D6B25E]/40 px-4 py-2.5 rounded-full shadow-2xl z-50 flex items-center gap-4 text-xs font-semibold select-none animate-bounce hover:animate-none">
        <div className="flex items-center gap-1.5">
          <Activity className="w-4 h-4 text-[#D6B25E]" />
          <span>Course OS Simulator:</span>
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

      {/* 4. Add Course Dialogue Modal */}
      <Dialog open={isAddCourseOpen} onOpenChange={setIsAddCourseOpen}>
        <DialogContent className="max-w-md bg-white border border-[#0F4D36]/20 rounded-xl p-6 text-[#0F4D36]">
          <DialogHeader className="border-b border-[#0F4D36]/5 pb-3">
            <DialogTitle className="font-serif text-xl font-bold flex items-center gap-2">
              <Plus className="w-5 h-5 text-[#D6B25E]" />
              <span>Create New Course Syllabus</span>
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground mt-1">
              Add a new course syllabus block into the Drizzle database registry.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleAddCourseSubmit} className="space-y-4 my-2 text-xs text-left">
            <div>
              <Label className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">Course Title</Label>
              <Input
                type="text"
                required
                value={addForm.title}
                onChange={e => setAddForm({ ...addForm, title: e.target.value })}
                placeholder="Intermediate Quranic Rhetoric"
                className="bg-[#FAF7F0] border-[#0F4D36]/10 text-xs mt-1"
              />
            </div>
            <div>
              <Label className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">URL Slug</Label>
              <Input
                type="text"
                required
                value={addForm.slug}
                onChange={e => setAddForm({ ...addForm, slug: e.target.value })}
                placeholder="quranic-rhetoric-intermediate"
                className="bg-[#FAF7F0] border-[#0F4D36]/10 text-xs mt-1 font-mono"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">Language</Label>
                <Input
                  type="text"
                  required
                  value={addForm.language}
                  onChange={e => setAddForm({ ...addForm, language: e.target.value })}
                  placeholder="Arabic"
                  className="bg-[#FAF7F0] border-[#0F4D36]/10 text-xs mt-1"
                />
              </div>
              <div>
                <Label className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">Level</Label>
                <Input
                  type="text"
                  required
                  value={addForm.level}
                  onChange={e => setAddForm({ ...addForm, level: e.target.value })}
                  placeholder="Intermediate"
                  className="bg-[#FAF7F0] border-[#0F4D36]/10 text-xs mt-1"
                />
              </div>
            </div>
            <DialogFooter className="pt-3">
              <Button type="button" variant="outline" onClick={() => setIsAddCourseOpen(false)} className="text-xs h-9 cursor-pointer">Cancel</Button>
              <Button type="submit" disabled={createMut.isPending} className="bg-[#0F4D36] text-white hover:bg-[#0f4d36]/90 text-xs h-9 font-semibold cursor-pointer">
                {createMut.isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin mr-1" /> : null}
                Create Dynamic Course
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

    </div>
  );
}

// Inlined helper icons and elements
function Save({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"/>
      <path d="M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7"/>
      <path d="M7 3v4a1 1 0 0 0 1 1h7"/>
    </svg>
  );
}

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
