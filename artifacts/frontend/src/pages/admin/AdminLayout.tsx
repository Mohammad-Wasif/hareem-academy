import { ReactNode, useEffect, useState, useRef } from "react";
import { Link, useLocation, useRoute } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminApi } from "@/lib/adminApi";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import {
  LayoutDashboard,
  BookOpen,
  Users,
  MessageSquare,
  Mail,
  Star,
  HelpCircle,
  LogOut,
  Loader2,
  ListChecks,
  Globe,
  Image as ImageIcon,
  Search,
  Bell,
  Plus,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  Settings,
  User,
  Calendar,
  Sparkles,
  Link as LinkIcon,
  CheckCircle,
  FileText,
  Upload,
  MessageCircle,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/courses", label: "Courses", icon: BookOpen },
  { href: "/admin/builder", label: "Page Builder", icon: FileText },

  { href: "/admin/media", label: "Media Manager", icon: ImageIcon },
  { href: "/admin/settings", label: "Settings", icon: Settings },
  { href: "/admin/enrollments", label: "Enrollments", icon: Users },
  { href: "/admin/form-fields", label: "Form Fields", icon: ListChecks },
  { href: "/admin/contacts", label: "Messages", icon: MessageSquare },
  { href: "/admin/leads", label: "Leads", icon: Mail },
  { href: "/admin/testimonials", label: "Testimonials", icon: Star },
  { href: "/admin/faqs", label: "FAQs", icon: HelpCircle },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
  const [location, setLocation] = useLocation();
  const [isLogin] = useRoute("/admin/login");
  const qc = useQueryClient();
  const { toast } = useToast();

  // Sidebar collapsible state
  const [isCollapsed, setIsCollapsed] = useState(() => {
    return localStorage.getItem("admin_sidebar_collapsed") === "true";
  });

  // Mobile drawer state
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Global search state
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  // Notifications state
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "New Enrollment Inquiry",
      description: "Ayesha Khan registered for Quranic Tajweed Beginners Course",
      time: "5 minutes ago",
      unread: true,
      category: "enrollment",
    },
    {
      id: 2,
      title: "WhatsApp Click Logged",
      description: "Organic visitor from Instagram clicked 'Chat on WhatsApp'",
      time: "24 minutes ago",
      unread: true,
      category: "click",
    },
    {
      id: 3,
      title: "SEO Health Alert",
      description: "Sitemap successfully crawled; 2 pages require meta updates",
      time: "2 hours ago",
      unread: false,
      category: "seo",
    },
    {
      id: 4,
      title: "System Performance",
      description: "Uptime remains at 99.98% over past 30 days summary metrics",
      time: "1 day ago",
      unread: false,
      category: "health",
    },
  ]);

  // Date range state
  const [dateRange, setDateRange] = useState("7d");

  // Quick Create Dialog state
  const [quickCreateType, setQuickCreateType] = useState<
    "none" | "page" | "media" | "course" | "testimonial" | "blog"
  >("none");

  // Form states for Quick Create Modal
  const [courseForm, setCourseForm] = useState({ title: "", slug: "", level: "Beginner", duration: "3" });
  const [testimonialForm, setTestimonialForm] = useState({ studentName: "", location: "", rating: "5", quote: "" });
  const [pageForm, setPageForm] = useState({ title: "", slug: "", template: "course-landing" });
  const [blogForm, setBlogForm] = useState({ title: "", author: "Admin", category: "Islamic Insights", content: "" });
  const [uploadProgress, setUploadProgress] = useState(-1);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Keyboard shortcut listener for Sidebar collapse (Ctrl + \)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === "\\") {
        e.preventDefault();
        setIsCollapsed((prev) => {
          const next = !prev;
          localStorage.setItem("admin_sidebar_collapsed", String(next));
          return next;
        });
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const { data, isLoading } = useQuery({
    queryKey: ["admin", "me"],
    queryFn: () => adminApi.me(),
    retry: false,
  });

  const logoutMut = useMutation({
    mutationFn: () => adminApi.logout(),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["admin"] });
      setLocation("/admin/login");
    },
  });

  useEffect(() => {
    if (!isLoading && (!data || !data.isAdmin) && !isLogin) {
      setLocation("/admin/login");
    }
  }, [isLoading, data, isLogin, setLocation]);

  if (isLogin) {
    return <div className="min-h-screen bg-[#F7F3EA]">{children}</div>;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F7F3EA] gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <span className="font-serif text-sm tracking-wider text-primary/80">Verifying Credentials...</span>
      </div>
    );
  }

  if (!data?.isAdmin) {
    return null;
  }

  // Get current page header details
  const getHeaderDetails = () => {
    const matched = NAV.find((n) => n.exact ? location === n.href : location.startsWith(n.href));
    if (location === "/admin") {
      return {
        title: "Dashboard",
        subtitle: "Welcome back — here’s your academy overview.",
      };
    }
    if (location.startsWith("/admin/courses")) {
      return {
        title: "Course Catalog",
        subtitle: "Manage, update, and design Hareem Academy syllabus sheets.",
      };
    }
    if (location.startsWith("/admin/builder")) {
      return {
        title: "Page Builder",
        subtitle: "Visually design, edit, and publish SEO and campaign landing pages.",
      };
    }

    if (location.startsWith("/admin/media")) {
      return {
        title: "Media Manager",
        subtitle: "Upload and compress assets, graphics, and video content.",
      };
    }
    if (location.startsWith("/admin/settings")) {
      return {
        title: "Platform Control Center",
        subtitle: "Manage academy identity, branding, configurations, domains, and deployments.",
      };
    }
    return {
      title: matched ? matched.label : "Admin Control",
      subtitle: "Academy Operating System Control Center.",
    };
  };

  const header = getHeaderDetails();

  const handleNotificationRead = (id: number) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, unread: false } : n))
    );
  };

  const handleMarkAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
    toast({
      title: "Success",
      description: "All notifications marked as read.",
    });
  };

  const handleQuickCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (quickCreateType === "course") {
      toast({
        title: "Course Created (Simulated)",
        description: `Successfully added Course: ${courseForm.title}`,
      });
      setCourseForm({ title: "", slug: "", level: "Beginner", duration: "3" });
    } else if (quickCreateType === "testimonial") {
      toast({
        title: "Testimonial Created (Simulated)",
        description: `Successfully added Testimonial from ${testimonialForm.studentName}`,
      });
      setTestimonialForm({ studentName: "", location: "", rating: "5", quote: "" });
    } else if (quickCreateType === "page") {
      toast({
        title: "Landing Page Created (Simulated)",
        description: `Successfully created ${pageForm.title} (${pageForm.slug})`,
      });
      setPageForm({ title: "", slug: "", template: "course-landing" });
    } else if (quickCreateType === "blog") {
      toast({
        title: "Article Published (Simulated)",
        description: `Article "${blogForm.title}" published under ${blogForm.category}`,
      });
      setBlogForm({ title: "", author: "Admin", category: "Islamic Insights", content: "" });
    } else if (quickCreateType === "media") {
      if (!selectedFile) return;
      setUploadProgress(0);
      const interval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setTimeout(() => {
              toast({
                title: "Upload Successful (Simulated)",
                description: `Successfully uploaded ${selectedFile.name} to Cloudinary.`,
              });
              setUploadProgress(-1);
              setSelectedFile(null);
              setQuickCreateType("none");
            }, 300);
            return 100;
          }
          return prev + 25;
        });
      }, 200);
      return;
    }
    setQuickCreateType("none");
  };

  // Simulated search database
  const searchDatabase = [
    { title: "Quranic Arabic for Sisters", category: "Course", url: "/admin/courses" },
    { title: "Urdu Language for Beginners", category: "Course", url: "/admin/courses" },
    { title: "Tajweed Rules Workbook", category: "Media", url: "/admin/media" },
    { title: "Zainab Fatima - Enrollment", category: "Lead", url: "/admin/enrollments" },
    { title: "Aisha Begum - WhatsApp Click", category: "Lead", url: "/admin/leads" },

  ];

  const filteredSearchResults = searchQuery
    ? searchDatabase.filter(
        (item) =>
          item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const unreadCount = notifications.filter((n) => n.unread).length;

  return (
    <div className="min-h-screen flex bg-[#F7F3EA] text-[#0F4D36] relative selection:bg-accent/30 overflow-x-hidden font-sans">
      {/* Background Subtle Geometric Pattern Overlay */}
      <div className="absolute inset-0 bg-arabesque-fade opacity-[0.015] pointer-events-none z-0" />

      {/* Left Sidebar - Desktop */}
      <aside
        className={`hidden md:flex flex-col bg-[#0F4D36] text-white border-r border-[#0F4D36]/10 relative z-20 transition-all duration-500 ease-in-out shadow-2xl ${
          isCollapsed ? "w-20" : "w-64"
        }`}
      >
        {/* Sidebar Header */}
        <div className={`px-6 py-6 border-b border-white/10 flex items-center justify-between overflow-hidden`}>
          {!isCollapsed ? (
            <Link href="/admin" className="block animate-in fade-in duration-300">
              <div className="font-serif text-xl tracking-wider text-[#D6B25E] font-bold flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#D6B25E] animate-pulse" />
                <span>HAREEM</span>
              </div>
              <div className="text-[10px] uppercase tracking-widest text-[#D6B25E]/60 mt-0.5 font-sans font-medium">
                Academy Admin OS
              </div>
            </Link>
          ) : (
            <Link href="/admin" className="block mx-auto">
              <Sparkles className="w-6 h-6 text-[#D6B25E] animate-pulse" />
            </Link>
          )}

          {/* Toggle Button Inside Sidebar */}
          <button
            onClick={() => {
              setIsCollapsed(!isCollapsed);
              localStorage.setItem("admin_sidebar_collapsed", String(!isCollapsed));
            }}
            className="absolute -right-3 top-7 w-6 h-6 bg-[#D6B25E] text-[#0F4D36] border border-white/20 rounded-full flex items-center justify-center hover:bg-[#ECC565] shadow-lg transition-transform hover:scale-110 z-30"
            title="Toggle Sidebar (Ctrl + \)"
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Sidebar Menu Items */}
        <nav className="flex-1 px-3 py-6 space-y-1.5 overflow-y-auto">
          {NAV.map((n) => {
            const active = n.exact ? location === n.href : location.startsWith(n.href);
            const Icon = n.icon;
            return (
              <Link
                key={n.href}
                href={n.href}
                className={`flex items-center gap-3.5 px-4 py-3 rounded-lg text-sm font-medium transition-all group relative ${
                  active
                    ? "bg-[#D6B25E] text-[#0F4D36] shadow-md shadow-black/10 font-semibold"
                    : "text-[#FAF7F0]/85 hover:bg-white/10 hover:text-white"
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 duration-300 ${active ? "text-[#0F4D36]" : "text-[#D6B25E]"}`} />
                {!isCollapsed && (
                  <span className="truncate transition-opacity duration-300">{n.label}</span>
                )}
                {isCollapsed && (
                  <div className="absolute left-full ml-3 px-2 py-1 bg-[#0F4D36] text-[#FAF7F0] text-xs rounded border border-white/10 shadow-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                    {n.label}
                  </div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Bottom Operations */}
        <div className="p-4 border-t border-white/10 space-y-2">
          {!isCollapsed && (
            <Link
              href="/"
              target="_blank"
              className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-[#FAF7F0]/80 hover:bg-white/5 hover:text-white transition-colors"
            >
              <LinkIcon className="w-4 h-4 text-[#D6B25E]" />
              <span>Visit Portal →</span>
            </Link>
          )}
          <Button
            variant="ghost"
            className="w-full justify-start gap-3.5 px-4 py-2.5 text-[#FAF7F0]/85 hover:bg-white/10 hover:text-white border-0 cursor-pointer"
            onClick={() => logoutMut.mutate()}
            disabled={logoutMut.isPending}
          >
            <LogOut className="w-4 h-4 text-[#D6B25E]" />
            {!isCollapsed && <span>Logout</span>}
          </Button>
        </div>
      </aside>

      {/* Mobile Menu Drawer Overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileOpen(false)}
              className="fixed inset-0 bg-black/60 z-30 md:hidden"
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="fixed inset-y-0 left-0 w-72 bg-[#0F4D36] text-white flex flex-col z-40 md:hidden border-r border-[#0F4D36]/20 shadow-2xl"
            >
              <div className="px-6 py-6 border-b border-white/10 flex items-center justify-between">
                <div>
                  <div className="font-serif text-xl tracking-wider text-[#D6B25E] font-bold flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-[#D6B25E] animate-pulse" />
                    <span>HAREEM</span>
                  </div>
                  <div className="text-[10px] uppercase tracking-widest text-[#D6B25E]/60 mt-0.5">
                    Academy Admin Panel
                  </div>
                </div>
                <button
                  onClick={() => setIsMobileOpen(false)}
                  className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/10 text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
                {NAV.map((n) => {
                  const active = n.exact ? location === n.href : location.startsWith(n.href);
                  const Icon = n.icon;
                  return (
                    <Link
                      key={n.href}
                      href={n.href}
                      onClick={() => setIsMobileOpen(false)}
                      className={`flex items-center gap-3.5 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                        active
                          ? "bg-[#D6B25E] text-[#0F4D36] shadow-lg font-semibold"
                          : "text-[#FAF7F0]/85 hover:bg-white/10"
                      }`}
                    >
                      <Icon className="w-4 h-4 text-[#D6B25E]" />
                      <span>{n.label}</span>
                    </Link>
                  );
                })}
              </nav>

              <div className="p-4 border-t border-white/10 space-y-2">
                <Link
                  href="/"
                  target="_blank"
                  className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-[#FAF7F0]/80 hover:bg-white/5"
                >
                  <LinkIcon className="w-4 h-4 text-[#D6B25E]" />
                  <span>Visit Portal →</span>
                </Link>
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-3.5 px-4 py-2.5 text-[#FAF7F0]/80 hover:bg-white/10"
                  onClick={() => logoutMut.mutate()}
                  disabled={logoutMut.isPending}
                >
                  <LogOut className="w-4 h-4 text-[#D6B25E]" />
                  <span>Logout</span>
                </Button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0 z-10">
        {/* Global Header (Top) */}
        <header className="sticky top-0 bg-[#F7F3EA]/90 backdrop-blur-md border-b border-[#0F4D36]/10 px-4 md:px-8 py-4 flex items-center justify-between z-10 gap-4">
          <div className="flex items-center gap-4">
            {/* Mobile Burger Menu Button */}
            <button
              onClick={() => setIsMobileOpen(true)}
              className="md:hidden p-2 rounded-lg hover:bg-[#0F4D36]/5 border border-[#0F4D36]/10 text-[#0F4D36]"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Dynamic Page Header Title & Subtitle */}
            <div className="hidden sm:block">
              <h1 className="font-serif text-2xl text-[#0F4D36] font-bold leading-tight">
                {header.title}
              </h1>
              <p className="text-xs text-[#0F4D36]/65 mt-0.5 font-medium">
                {header.subtitle}
              </p>
            </div>
          </div>

          {/* Right Header Navigation Panel */}
          <div className="flex items-center gap-3">
            {/* 1. Global Search Bar */}
            <div className="relative max-w-xs md:max-w-md w-48 md:w-64">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-[#0F4D36]/40" />
                <input
                  type="text"
                  placeholder="Global Search... (e.g. Arabic)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setTimeout(() => setIsSearchFocused(false), 250)}
                  className="w-full pl-9 pr-4 py-2 text-xs rounded-full border border-[#0F4D36]/10 bg-white/70 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#0F4D36]/30 placeholder-[#0F4D36]/40 text-[#0F4D36]"
                />
              </div>

              {/* Search Results Dropdown Overlay */}
              <AnimatePresence>
                {isSearchFocused && searchQuery && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 top-full mt-2 w-64 md:w-80 bg-white border border-[#0F4D36]/10 rounded-xl shadow-2xl z-50 overflow-hidden"
                  >
                    <div className="p-3 border-b border-[#0F4D36]/5 bg-[#FAF7F0] flex items-center justify-between">
                      <span className="text-[10px] uppercase font-bold tracking-widest text-[#0F4D36]/50">Search Results</span>
                      <span className="text-[10px] text-muted-foreground">{filteredSearchResults.length} hits</span>
                    </div>
                    <div className="max-h-60 overflow-y-auto p-1 divide-y divide-gray-50">
                      {filteredSearchResults.length > 0 ? (
                        filteredSearchResults.map((result, idx) => (
                          <Link
                            key={idx}
                            href={result.url}
                            className="flex items-center justify-between p-2.5 rounded-lg hover:bg-[#FAF7F0] transition-colors"
                          >
                            <span className="text-xs font-medium text-[#0F4D36] truncate">{result.title}</span>
                            <span className="text-[9px] px-2 py-0.5 bg-[#0F4D36]/5 rounded-full uppercase text-[#0F4D36]/60 font-bold font-mono">
                              {result.category}
                            </span>
                          </Link>
                        ))
                      ) : (
                        <div className="p-4 text-center text-xs text-muted-foreground">
                          No results found matching "{searchQuery}"
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* 2. Notifications System Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="p-2.5 rounded-full border border-[#0F4D36]/10 hover:bg-[#0F4D36]/5 relative text-[#0F4D36] transition-colors cursor-pointer">
                  <Bell className="w-4 h-4" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-4 h-4 bg-[#D6B25E] text-[#0F4D36] rounded-full text-[9px] font-bold flex items-center justify-center border-2 border-[#F7F3EA] animate-pulse">
                      {unreadCount}
                    </span>
                  )}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80 bg-white border border-[#0F4D36]/15 rounded-xl p-0 shadow-2xl z-50">
                <div className="p-4 border-b border-[#0F4D36]/10 flex items-center justify-between bg-[#FAF7F0] rounded-t-xl">
                  <span className="font-serif font-bold text-sm text-[#0F4D36]">Activity Alerts</span>
                  {unreadCount > 0 && (
                    <button
                      onClick={handleMarkAllNotificationsRead}
                      className="text-[10px] text-[#D6B25E] hover:underline font-bold"
                    >
                      Mark all read
                    </button>
                  )}
                </div>
                <div className="divide-y divide-[#0F4D36]/5 max-h-72 overflow-y-auto">
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => handleNotificationRead(n.id)}
                      className={`p-3.5 text-xs transition-colors hover:bg-[#FAF7F0] cursor-pointer flex gap-3 ${n.unread ? "bg-[#0F4D36]/[0.02] border-l-2 border-[#D6B25E]" : ""}`}
                    >
                      <div className="flex-1 space-y-1">
                        <div className="flex justify-between items-start gap-2">
                          <span className="font-bold text-[#0F4D36]">{n.title}</span>
                          <span className="text-[9px] text-[#0F4D36]/50 whitespace-nowrap">{n.time}</span>
                        </div>
                        <p className="text-[#0F4D36]/75 leading-relaxed">{n.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* 3. Date Range Selector */}
            <div className="hidden lg:block relative">
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="pl-3 pr-8 py-2 text-xs rounded-full border border-[#0F4D36]/10 bg-white/70 focus:bg-white focus:outline-none text-[#0F4D36] font-medium appearance-none cursor-pointer"
              >
                <option value="today">Today Summary</option>
                <option value="7d">Last 7 Days</option>
                <option value="30d">Last 30 Days</option>
                <option value="ytd">Year to Date (YTD)</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 absolute right-3 top-2.5 text-[#0F4D36]/50 pointer-events-none" />
            </div>

            {/* 4. Quick Create Button Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="rounded-full bg-[#0F4D36] hover:bg-[#0F4D36]/90 text-white gap-1.5 px-4 text-xs font-semibold h-9 shadow-md cursor-pointer border border-[#D6B25E]/20">
                  <Plus className="w-4 h-4" />
                  <span>Quick Create</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 bg-white border border-[#0F4D36]/15 rounded-xl shadow-xl z-50 p-1">
                <DropdownMenuItem
                  onClick={() => setQuickCreateType("page")}
                  className="rounded-lg text-xs hover:bg-[#FAF7F0] focus:bg-[#FAF7F0] text-[#0F4D36] p-2 flex items-center gap-2 cursor-pointer"
                >
                  <Globe className="w-3.5 h-3.5 text-[#D6B25E]" />
                  <span>New Landing Page</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setQuickCreateType("media")}
                  className="rounded-lg text-xs hover:bg-[#FAF7F0] focus:bg-[#FAF7F0] text-[#0F4D36] p-2 flex items-center gap-2 cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5 text-[#D6B25E]" />
                  <span>Upload Media</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setLocation("/admin/courses/new")}
                  className="rounded-lg text-xs hover:bg-[#FAF7F0] focus:bg-[#FAF7F0] text-[#0F4D36] p-2 flex items-center gap-2 cursor-pointer"
                >
                  <BookOpen className="w-3.5 h-3.5 text-[#D6B25E]" />
                  <span>Create Course</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setQuickCreateType("testimonial")}
                  className="rounded-lg text-xs hover:bg-[#FAF7F0] focus:bg-[#FAF7F0] text-[#0F4D36] p-2 flex items-center gap-2 cursor-pointer"
                >
                  <Star className="w-3.5 h-3.5 text-[#D6B25E]" />
                  <span>Add Testimonial</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setQuickCreateType("blog")}
                  className="rounded-lg text-xs hover:bg-[#FAF7F0] focus:bg-[#FAF7F0] text-[#0F4D36] p-2 flex items-center gap-2 cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5 text-[#D6B25E]" />
                  <span>Create Blog</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* 5. Profile Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="w-9 h-9 rounded-full bg-[#0F4D36] text-white border border-[#D6B25E] font-serif text-sm font-bold flex items-center justify-center hover:scale-105 transition-transform shadow-md cursor-pointer">
                  HA
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-white border border-[#0F4D36]/15 rounded-xl shadow-xl z-50 p-1">
                <DropdownMenuLabel className="font-serif text-[#0F4D36] px-3 py-2">
                  <div className="font-bold">Administrator</div>
                  <div className="text-[10px] text-muted-foreground">admin@hareemacademy.com</div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => setLocation("/admin/settings")}
                  className="rounded-lg text-xs hover:bg-[#FAF7F0] focus:bg-[#FAF7F0] text-[#0F4D36] p-2.5 flex items-center gap-2 cursor-pointer"
                >
                  <Settings className="w-4.5 h-4.5 text-[#D6B25E]" />
                  <span>System Settings</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setLocation("/admin/form-fields")}
                  className="rounded-lg text-xs hover:bg-[#FAF7F0] focus:bg-[#FAF7F0] text-[#0F4D36] p-2.5 flex items-center gap-2 cursor-pointer"
                >
                  <User className="w-4.5 h-4.5 text-[#D6B25E]" />
                  <span>Manage Access & Forms</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => logoutMut.mutate()}
                  className="rounded-lg text-xs text-red-600 hover:bg-red-50 focus:bg-red-50 p-2.5 flex items-center gap-2 cursor-pointer"
                >
                  <LogOut className="w-4.5 h-4.5" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Page Content Shell Wrapper */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>

      {/* QUICK CREATE MODALS */}
      {/* 1. New Landing Page Modal */}
      <Dialog open={quickCreateType === "page"} onOpenChange={(open) => !open && setQuickCreateType("none")}>
        <DialogContent className="max-w-md bg-white border border-[#0F4D36]/20 rounded-xl p-6 text-[#0F4D36]">
          <DialogHeader>
            <DialogTitle className="font-serif text-xl font-bold flex items-center gap-2">
              <Globe className="w-5 h-5 text-[#D6B25E]" />
              <span>Create Landing Page</span>
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground mt-1">
              Initialize a custom course landing layout for SEO and conversion analytics.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleQuickCreateSubmit} className="space-y-4 my-2">
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-[#0F4D36]/60">Page Title</label>
              <input
                type="text"
                required
                value={pageForm.title}
                onChange={(e) => setPageForm({ ...pageForm, title: e.target.value })}
                placeholder="e.g. Learn Quranic Arabic Online"
                className="w-full p-2.5 mt-1 border border-[#0F4D36]/10 rounded-lg text-xs focus:ring-1 focus:ring-primary focus:outline-none"
              />
            </div>
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-[#0F4D36]/60">Slug Path</label>
              <input
                type="text"
                required
                value={pageForm.slug}
                onChange={(e) => setPageForm({ ...pageForm, slug: e.target.value })}
                placeholder="e.g. online-quran-classes-sisters"
                className="w-full p-2.5 mt-1 border border-[#0F4D36]/10 rounded-lg text-xs focus:ring-1 focus:ring-primary focus:outline-none"
              />
            </div>
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-[#0F4D36]/60">Layout Template</label>
              <select
                value={pageForm.template}
                onChange={(e) => setPageForm({ ...pageForm, template: e.target.value })}
                className="w-full p-2.5 mt-1 border border-[#0F4D36]/10 rounded-lg text-xs focus:ring-1 focus:ring-primary focus:outline-none bg-white"
              >
                <option value="course-landing">Course Landing Page (Visual Header + Form)</option>
                <option value="info-editorial">Islamic Editorial (Dense Layout + FAQs)</option>
                <option value="lead-magnet">Lead Magnet Page (Free PDF Guide Download)</option>
              </select>
            </div>
            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setQuickCreateType("none")} className="text-xs h-9">Cancel</Button>
              <Button type="submit" className="bg-[#0F4D36] text-white hover:bg-[#0f4d36]/90 text-xs h-9 font-semibold">Create Page</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* 2. Upload Media Modal */}
      <Dialog open={quickCreateType === "media"} onOpenChange={(open) => !open && setQuickCreateType("none")}>
        <DialogContent className="max-w-md bg-white border border-[#0F4D36]/20 rounded-xl p-6 text-[#0F4D36]">
          <DialogHeader>
            <DialogTitle className="font-serif text-xl font-bold flex items-center gap-2">
              <Upload className="w-5 h-5 text-[#D6B25E]" />
              <span>Upload Media Asset</span>
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground mt-1">
              Upload images, course documents, or certificates directly to Cloudinary.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleQuickCreateSubmit} className="space-y-4 my-2">
            <div className="border-2 border-dashed border-[#0F4D36]/10 rounded-xl p-8 text-center bg-[#FAF7F0] hover:bg-[#FAF7F0]/80 transition-colors relative cursor-pointer">
              <input
                type="file"
                onChange={(e) => e.target.files && setSelectedFile(e.target.files[0])}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              <Upload className="w-8 h-8 text-[#D6B25E] mx-auto mb-2" />
              <p className="text-xs font-semibold text-[#0F4D36]">Drag & drop or click to choose file</p>
              <p className="text-[10px] text-muted-foreground mt-1">Supports PNG, JPG, PDF (Max 15MB)</p>
            </div>

            {selectedFile && (
              <div className="p-3 bg-[#0F4D36]/5 rounded-lg flex items-center justify-between text-xs font-medium">
                <span className="truncate max-w-[250px]">{selectedFile.name}</span>
                <span className="text-[10px] text-muted-foreground font-mono">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</span>
              </div>
            )}

            {uploadProgress >= 0 && (
              <div className="space-y-2">
                <div className="flex justify-between text-[10px] font-bold text-muted-foreground">
                  <span>Uploading to CDN...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <div className="w-full bg-[#0F4D36]/10 h-2 rounded-full overflow-hidden">
                  <div className="bg-[#D6B25E] h-full transition-all duration-300" style={{ width: `${uploadProgress}%` }} />
                </div>
              </div>
            )}

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setQuickCreateType("none")} className="text-xs h-9">Cancel</Button>
              <Button type="submit" disabled={!selectedFile || uploadProgress >= 0} className="bg-[#0F4D36] text-white hover:bg-[#0f4d36]/90 text-xs h-9 font-semibold">
                Upload Asset
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* 3. Add Testimonial Modal */}
      <Dialog open={quickCreateType === "testimonial"} onOpenChange={(open) => !open && setQuickCreateType("none")}>
        <DialogContent className="max-w-md bg-white border border-[#0F4D36]/20 rounded-xl p-6 text-[#0F4D36]">
          <DialogHeader>
            <DialogTitle className="font-serif text-xl font-bold flex items-center gap-2">
              <Star className="w-5 h-5 text-[#D6B25E]" />
              <span>Add Student Testimonial</span>
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground mt-1">
              Add positive feedback, ratings, and quotes from sisters to display in social proof.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleQuickCreateSubmit} className="space-y-4 my-2">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-[#0F4D36]/60">Student Name</label>
                <input
                  type="text"
                  required
                  value={testimonialForm.studentName}
                  onChange={(e) => setTestimonialForm({ ...testimonialForm, studentName: e.target.value })}
                  placeholder="e.g. Fatima Ahmed"
                  className="w-full p-2.5 mt-1 border border-[#0F4D36]/10 rounded-lg text-xs focus:ring-1 focus:ring-primary"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-[#0F4D36]/60">Location / City</label>
                <input
                  type="text"
                  required
                  value={testimonialForm.location}
                  onChange={(e) => setTestimonialForm({ ...testimonialForm, location: e.target.value })}
                  placeholder="e.g. London, UK"
                  className="w-full p-2.5 mt-1 border border-[#0F4D36]/10 rounded-lg text-xs focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-[#0F4D36]/60">Course Reference</label>
                <select
                  className="w-full p-2.5 mt-1 border border-[#0F4D36]/10 rounded-lg text-xs bg-white"
                  defaultValue="Arabic for Beginners"
                >
                  <option value="Arabic for Beginners">Quranic Arabic (Beginners)</option>
                  <option value="Urdu Reading">Urdu Language for Sisters</option>
                  <option value="Tajweed Rules">Tajweed Classes</option>
                </select>
              </div>
              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-[#0F4D36]/60">Star Rating</label>
                <select
                  value={testimonialForm.rating}
                  onChange={(e) => setTestimonialForm({ ...testimonialForm, rating: e.target.value })}
                  className="w-full p-2.5 mt-1 border border-[#0F4D36]/10 rounded-lg text-xs bg-white"
                >
                  <option value="5">5 Stars — Excellent</option>
                  <option value="4">4 Stars — Very Good</option>
                  <option value="3">3 Stars — Average</option>
                </select>
              </div>
            </div>
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-[#0F4D36]/60">Review Quote</label>
              <textarea
                required
                rows={3}
                value={testimonialForm.quote}
                onChange={(e) => setTestimonialForm({ ...testimonialForm, quote: e.target.value })}
                placeholder="The teacher is very patient. I can finally read Tajweed correctly."
                className="w-full p-2.5 mt-1 border border-[#0F4D36]/10 rounded-lg text-xs focus:ring-1 focus:ring-primary focus:outline-none"
              />
            </div>
            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setQuickCreateType("none")} className="text-xs h-9">Cancel</Button>
              <Button type="submit" className="bg-[#0F4D36] text-white hover:bg-[#0f4d36]/90 text-xs h-9 font-semibold">Save Testimonial</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* 4. Create Blog Modal */}
      <Dialog open={quickCreateType === "blog"} onOpenChange={(open) => !open && setQuickCreateType("none")}>
        <DialogContent className="max-w-md bg-white border border-[#0F4D36]/20 rounded-xl p-6 text-[#0F4D36]">
          <DialogHeader>
            <DialogTitle className="font-serif text-xl font-bold flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#D6B25E]" />
              <span>Create Blog Article</span>
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground mt-1">
              Publish educational articles on Arabic morphology, Quranic vocabulary, or Tajweed tips.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleQuickCreateSubmit} className="space-y-4 my-2">
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-[#0F4D36]/60">Blog Title</label>
              <input
                type="text"
                required
                value={blogForm.title}
                onChange={(e) => setBlogForm({ ...blogForm, title: e.target.value })}
                placeholder="e.g. 5 Common Mistakes in Tajweed Recitation"
                className="w-full p-2.5 mt-1 border border-[#0F4D36]/10 rounded-lg text-xs focus:ring-1 focus:ring-primary focus:outline-none"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-[#0F4D36]/60">Category</label>
                <select
                  value={blogForm.category}
                  onChange={(e) => setBlogForm({ ...blogForm, category: e.target.value })}
                  className="w-full p-2.5 mt-1 border border-[#0F4D36]/10 rounded-lg text-xs bg-white"
                >
                  <option value="Tajweed Rules">Tajweed & Recitation</option>
                  <option value="Arabic Vocabulary">Arabic Vocabulary</option>
                  <option value="Islamic Insights">Islamic Insights</option>
                </select>
              </div>
              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-[#0F4D36]/60">Author</label>
                <input
                  type="text"
                  required
                  value={blogForm.author}
                  onChange={(e) => setBlogForm({ ...blogForm, author: e.target.value })}
                  className="w-full p-2.5 mt-1 border border-[#0F4D36]/10 rounded-lg text-xs focus:ring-1 focus:ring-primary focus:outline-none"
                />
              </div>
            </div>
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-[#0F4D36]/60">Article Content (Markdown Supported)</label>
              <textarea
                required
                rows={5}
                value={blogForm.content}
                onChange={(e) => setBlogForm({ ...blogForm, content: e.target.value })}
                placeholder="Write the article content..."
                className="w-full p-2.5 mt-1 border border-[#0F4D36]/10 rounded-lg text-xs focus:ring-1 focus:ring-primary focus:outline-none"
              />
            </div>
            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setQuickCreateType("none")} className="text-xs h-9">Cancel</Button>
              <Button type="submit" className="bg-[#0F4D36] text-white hover:bg-[#0f4d36]/90 text-xs h-9 font-semibold">Publish Article</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

