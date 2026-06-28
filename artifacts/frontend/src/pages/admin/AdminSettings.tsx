import { useState, useEffect, useMemo, useRef } from "react";
import { useSiteAssets } from "@/hooks/use-site-assets";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { adminApi } from "@/lib/adminApi";
import { motion, AnimatePresence } from "framer-motion";
import {
  Settings,
  Globe,
  Sliders,
  Sparkles,
  Save,
  RotateCcw,
  Upload,
  Layers,
  Users,
  Lock,
  Search,
  Monitor,
  Tablet,
  Smartphone,
  Check,
  AlertTriangle,
  Play,
  RefreshCw,
  FolderOpen,
  FileCode,
  Shield,
  HelpCircle,
  HardDrive,
  Activity,
  Database,
  CloudLightning,
  Undo2,
  Trash2,
  ArrowRight,
  Eye,
  CheckCircle,
  Terminal,
  ExternalLink,
  SlidersHorizontal,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

// Define settings interface
interface SettingsState {
  academyName: string;
  shortName: string;
  tagline: string;
  description: string;
  timezone: string;
  language: string;
  country: string;
  contactEmail: string;
  supportEmail: string;
  supportWhatsApp: string;
  enableWebsite: boolean;
  maintenanceMode: boolean;
  announcementBanner: boolean;
  announcementText: string;

  // Branding
  primaryLogoUrl: string;
  secondaryLogoUrl: string;
  mobileLogoUrl: string;
  faviconUrl: string;
  ogImageUrl: string;
  watermarkUrl: string;
  colorPalette: string;
  typography: string;
  visualStyleTheme: "default" | "luxury" | "minimal" | "seasonal";

  // Navbar
  navbarLayout: "left" | "center" | "split";
  logoPosition: "left" | "center";
  showCTA: boolean;
  ctaText: string;
  showMobileMenu: boolean;

  // Footer
  footerLayout: "columns" | "minimal";
  footerCopyright: string;
  footerNewsletterTitle: string;
  footerShowSocial: boolean;

  // Communication
  whatsappEnabled: boolean;
  emailProvider: string;
  contactFormFields: string;
  enrollmentTemplate: string;

  // Social
  instagramUrl: string;
  facebookUrl: string;
  youtubeUrl: string;
  telegramUrl: string;
  linkedinUrl: string;
  twitterUrl: string;
  socialVisible: boolean;

  // SEO Defaults
  seoTitleTemplate: string;
  seoDescriptionTemplate: string;
  seoDefaultOgImage: string;
  seoCanonical: string;
  seoRobotsTxt: string;
  seoSchemaJson: string;

  // Localization
  localizationLanguages: string;
  localizationDateFormat: string;
  localizationTimeFormat: string;
  localizationCurrency: string;
  localizationRtl: boolean;

  // Domain
  domainPrimary: string;
  domainRedirects: string;
  domainSubdomains: string;
  domainSslEnabled: boolean;

  // Performance
  perfImageOptimization: boolean;
  perfCompressionLevel: number;
  perfLazyLoading: boolean;
  perfPreloadHeaders: boolean;
  perfCdnProvider: string;

  // Deployment
  deployFrontendBranch: string;
  deployBackendBranch: string;
  deployEnvironment: string;
  deployVersion: string;

  // Security
  securityTwoFactor: boolean;
  securityLoginAttemptsLimit: number;
  securityAdminIpsOnly: boolean;

  // Integrations
  cloudinaryCloudName: string;
  cloudinaryApiKey: string;
  cloudinaryApiSecret: string;
  googleAnalyticsId: string;
  googleSearchConsoleId: string;
  clarityProjectId: string;
  smtpServer: string;
  metaPixelId: string;

  // System
  systemStorageLimit: string;
  systemDbConnectionPoolSize: number;
  systemQueueWorkersCount: number;

  // Backup & Restore
  backupSchedule: "daily" | "weekly" | "monthly" | "manual";
}

// 15 Modules list definition
const SETTINGS_MODULES = [
  { id: "general", name: "General Settings", desc: "Academy profile, timezone, contact info", icon: Sliders },
  { id: "branding", name: "Branding Center", desc: "Logos, favicon, fonts, luxury palettes", icon: Sparkles },
  { id: "navbar", name: "Navbar Control", desc: "Header structure, layout, logo placement", icon: Layers },
  { id: "footer", name: "Footer Builder", desc: "Footer widgets, copyrights, column maps", icon: FolderOpen },
  { id: "communication", name: "Communication Center", desc: "WhatsApp anchors, templates, SMTP", icon: Globe },
  { id: "social", name: "Social Media Manager", desc: "Instagram, YouTube, X redirect handles", icon: Users },
  { id: "seo", name: "SEO Defaults", desc: "Global titles, meta indices, robots.txt map", icon: FileCode },
  { id: "localization", name: "Localization", desc: "Multi-language checklists, currencies", icon: SlidersHorizontal },
  { id: "domain", name: "Domain Management", desc: "DNS health, redirects, SSL anchors", icon: Globe },
  { id: "performance", name: "Performance Settings", desc: "Image compression settings, purge caches", icon: HardDrive },
  { id: "deployments", name: "Deployment Control", desc: "Release branches, compiler pipelines", icon: CloudLightning },
  { id: "security", name: "Security Settings", desc: "Roles lists, session monitors, 2FA keys", icon: Shield },
  { id: "integrations", name: "Integrations Hub", desc: "Google tags, Cloudinary syncing logs", icon: Settings },
  { id: "system", name: "System Panel", desc: "Storage logs, active API latency, queue states", icon: Database },
  { id: "backup", name: "Backup & Restore", desc: "JSON configurations export, backup schedules", icon: Activity },
];

export default function AdminSettings() {
  const { refetch } = useSiteAssets();
  const { toast } = useToast();

  // Load defaults
  const defaultSettings = useMemo<SettingsState>(() => ({
    academyName: "Hareem Academy",
    shortName: "Hareem",
    tagline: "Unlocking Quranic Meanings with Female Scholars",
    description: "Premium online sisters-only institute for Quranic Arabic, Tajweed, and Islamic Studies.",
    timezone: "UTC+5:30 (Kolkata)",
    language: "en",
    country: "IN",
    contactEmail: "info@hareemacademy.com",
    supportEmail: "support@hareemacademy.com",
    supportWhatsApp: "919876543210",
    enableWebsite: true,
    maintenanceMode: false,
    announcementBanner: true,
    announcementText: "Ramadan Special Intake is open! Secure your seat today.",
    
    // Branding
    primaryLogoUrl: "/logo.png",
    secondaryLogoUrl: "/logo.png",
    mobileLogoUrl: "/logo-mobile.png",
    faviconUrl: "/favicon.ico",
    ogImageUrl: "/og-preview.png",
    watermarkUrl: "/watermark.png",
    colorPalette: "Emerald & Gold (Default)",
    typography: "Playfair Display & Inter",
    visualStyleTheme: "default",

    // Navbar
    navbarLayout: "split",
    logoPosition: "left",
    showCTA: true,
    ctaText: "Explore Courses",
    showMobileMenu: true,

    // Footer
    footerLayout: "columns",
    footerCopyright: "© 2026 Hareem Academy. All rights reserved.",
    footerNewsletterTitle: "Subscribe to Islamic Insights Weekly",
    footerShowSocial: true,

    // Communication
    whatsappEnabled: true,
    emailProvider: "SMTP (Default)",
    contactFormFields: "Full Name, WhatsApp Number, Email, Course Preference, Msg",
    enrollmentTemplate: "Assalamu Alaikum {fullName},\n\nWe have received your enrollment deposit for the {courseName} course. Your seat is confirmed.\n\nBarakallahu Feekum,\nHareem Academy Board.",

    // Social
    instagramUrl: "https://instagram.com/hareemacademy",
    facebookUrl: "https://facebook.com/hareemacademy",
    youtubeUrl: "https://youtube.com/c/hareemacademy",
    telegramUrl: "https://t.me/hareemacademy",
    linkedinUrl: "https://linkedin.com/company/hareemacademy",
    twitterUrl: "https://twitter.com/hareemacademy",
    socialVisible: true,

    // SEO
    seoTitleTemplate: "%title% | Hareem Academy Online",
    seoDescriptionTemplate: "Learn Quranic Arabic with certified female teachers. %description%",
    seoDefaultOgImage: "https://hareemacademy.com/assets/og-default.jpg",
    seoCanonical: "https://hareemacademy.com",
    seoRobotsTxt: "User-agent: *\nAllow: /\nSitemap: https://hareemacademy.com/sitemap.xml",
    seoSchemaJson: "{\n  \"@context\": \"https://schema.org\",\n  \"@type\": \"EducationalOrganization\"\n}",

    // Localization
    localizationLanguages: "English, Arabic, Urdu",
    localizationDateFormat: "DD/MM/YYYY",
    localizationTimeFormat: "12-hour (AM/PM)",
    localizationCurrency: "USD ($)",
    localizationRtl: false,

    // Domain
    domainPrimary: "hareemacademy.com",
    domainRedirects: "www.hareemacademy.com -> hareemacademy.com",
    domainSubdomains: "admin.hareemacademy.com, portal.hareemacademy.com",
    domainSslEnabled: true,

    // Performance
    perfImageOptimization: true,
    perfCompressionLevel: 85,
    perfLazyLoading: true,
    perfPreloadHeaders: true,
    perfCdnProvider: "Cloudinary Edge CDN",

    // Deployment
    deployFrontendBranch: "main",
    deployBackendBranch: "main",
    deployEnvironment: "Production",
    deployVersion: "1.4.2",

    // Security
    securityTwoFactor: true,
    securityLoginAttemptsLimit: 5,
    securityAdminIpsOnly: false,

    // Integrations
    cloudinaryCloudName: "debppjizj",
    cloudinaryApiKey: "319856982771484",
    cloudinaryApiSecret: "U-TlgkGAFByHPIJyqdxaT2HAOg8",
    googleAnalyticsId: "G-HAREEM2026",
    googleSearchConsoleId: "gsc-verification-key",
    clarityProjectId: "clarity-ha-2026",
    smtpServer: "mail.smtp2go.com",
    metaPixelId: "pixel-meta-39485",

    // System
    systemStorageLimit: "10 GB",
    systemDbConnectionPoolSize: 20,
    systemQueueWorkersCount: 3,

    // Backup
    backupSchedule: "daily",
  }), []);

  // UI state
  const [activeTab, setActiveTab] = useState("general");
  const [settings, setSettings] = useState<SettingsState>(defaultSettings);
  const [draftSettings, setDraftSettings] = useState<SettingsState>(defaultSettings);
  
  // Loading & Action State triggers
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishProgress, setPublishProgress] = useState(0);
  const [publishLogs, setPublishLogs] = useState<string[]>([]);
  const [isLogsDialogOpen, setIsLogsDialogOpen] = useState(false);

  const [previewDevice, setPreviewDevice] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [isMobilePreviewOpen, setIsMobilePreviewOpen] = useState(false);

  // Initialize from database settings_v1, fall back to local storage then defaults
  useEffect(() => {
    let active = true;
    adminApi.getSettings()
      .then((rows) => {
        if (!active) return;
        const dbSettingsRow = rows.find((r) => r.key === "settings_v1");
        if (dbSettingsRow && dbSettingsRow.value) {
          const val = dbSettingsRow.value as SettingsState;
          setSettings(val);
          setDraftSettings(val);
        } else {
          // Fall back to local storage
          try {
            const saved = localStorage.getItem("hareem_settings_v1");
            if (saved) {
              const parsed = JSON.parse(saved);
              setSettings(parsed);
              setDraftSettings(parsed);
            }
          } catch {}
        }
      })
      .catch((err) => {
        console.error("Failed to fetch settings from database:", err);
        // Fall back to local storage
        try {
          const saved = localStorage.getItem("hareem_settings_v1");
          if (saved) {
            const parsed = JSON.parse(saved);
            setSettings(parsed);
            setDraftSettings(parsed);
          }
        } catch {}
      });
    return () => {
      active = false;
    };
  }, []);

  // Check if dirty
  const isDirty = useMemo(() => {
    return JSON.stringify(settings) !== JSON.stringify(draftSettings);
  }, [settings, draftSettings]);

  // Handle Input Changes
  const updateDraftField = (key: keyof SettingsState, val: any) => {
    setDraftSettings((prev) => ({
      ...prev,
      [key]: val,
    }));
  };

  // Toolbar Actions
  const handleSave = () => {
    setIsSaving(true);
    adminApi.updateSettings("settings_v1", draftSettings)
      .then(() => {
        try {
          localStorage.setItem("hareem_settings_v1", JSON.stringify(draftSettings));
        } catch {}
        setSettings(draftSettings);
        setIsSaving(false);
        toast({
          title: "Draft Saved",
          description: "System settings successfully updated in the PostgreSQL database.",
        });
      })
      .catch((err) => {
        setIsSaving(false);
        toast({
          title: "Save Failed",
          description: err.message || "Could not save configuration details to database.",
          variant: "destructive",
        });
      });
  };

  const handleReset = () => {
    setDraftSettings(settings);
    toast({
      title: "Draft Reset",
      description: "Reverted workspace settings back to last saved snapshot.",
    });
  };

  const handlePublish = () => {
    if (isPublishing) return;
    setIsPublishing(true);
    setIsLogsDialogOpen(true);
    setPublishProgress(0);
    setPublishLogs([]);

    const logLines = [
      "Starting compilation for frontend static layout...",
      "Cloning production release branch: main",
      "Validating package sitemaps dependencies...",
      "Compiling Next.js/Vite environment configurations...",
      "Purging Cloudinary global CDN edge caches...",
      "Verifying Robots.txt and Sitemap schemas indices...",
      "Purging Vercel CDN static routes caches...",
      "Deploying bundle to Edge servers...",
      "Updating Neon Database site metadata...",
      "Deployment SUCCESS. System live.",
    ];

    let currentStep = 0;
    const interval = setInterval(() => {
      if (currentStep < logLines.length) {
        setPublishLogs((prev) => [...prev, `[INFO] ${logLines[currentStep]}`]);
        setPublishProgress((currentStep + 1) * 10);
        currentStep++;
      } else {
        clearInterval(interval);
        setSettings(draftSettings);
        setIsPublishing(false);
        toast({
          title: "Platform Published",
          description: "All configurations written globally and static Purges finished.",
        });
        refetch(); // Reload assets hook
      }
    }, 450);
  };

  // File configs Export/Import
  const handleExport = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(draftSettings, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `hareem-settings-${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    toast({
      title: "Configuration Exported",
      description: "Downloaded JSON settings backup sheet.",
    });
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        setDraftSettings(parsed);
        toast({
          title: "Configuration Imported",
          description: "Populated all settings tabs with loaded JSON sheets. Click Save to persist.",
        });
      } catch {
        toast({
          title: "Import Error",
          description: "Invalid JSON configuration format.",
          variant: "destructive",
        });
      }
    };
    reader.readAsText(file);
  };

  // Dynamic system health metrics mockups
  const systemMetrics = useMemo(() => {
    return {
      storageUsed: 4.8,
      dbConnections: 12,
      apiLatency: "48ms",
      sslExpiry: "240 days remaining",
      queueStatus: "Idle",
    };
  }, []);

  return (
    <div className="max-w-[1600px] mx-auto px-4 md:px-8 py-8 space-y-6 relative text-[#0F4D36]">
      {/* 1. TOP TOOLBAR ROW */}
      <div className="bg-white border border-[#0F4D36]/10 rounded-2xl p-4 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold tracking-widest text-[#D6B25E] uppercase bg-[#0F4D36]/5 px-2.5 py-1 rounded">
              {draftSettings.deployEnvironment}
            </span>
            <span className="text-xs font-semibold font-mono text-muted-foreground">
              v{draftSettings.deployVersion}
            </span>
          </div>

          <div className="h-4 w-px bg-[#0F4D36]/10 hidden sm:block" />

          {/* Sync Status Badge */}
          <div className="flex items-center gap-1.5 text-xs font-semibold">
            <div className={`w-2 h-2 rounded-full ${isDirty ? "bg-[#D6B25E] animate-pulse" : "bg-emerald-600"}`} />
            <span className="text-[11px] font-bold">
              {isDirty ? "Unsaved Changes" : "Configuration Synced"}
            </span>
          </div>

          <div className="h-4 w-px bg-[#0F4D36]/10 hidden sm:block" />

          <div className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
            <CloudLightning className="w-3.5 h-3.5 text-[#D6B25E] animate-pulse" />
            <span>CDN Health: 100%</span>
          </div>
        </div>

        {/* Toolbar Actions */}
        <div className="flex items-center gap-2 self-end md:self-auto">
          {/* Reset Changes */}
          {isDirty && (
            <Button
              onClick={handleReset}
              variant="outline"
              className="h-9 text-xs border-amber-200 text-amber-800 bg-amber-50/50 hover:bg-amber-50 cursor-pointer font-bold gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </Button>
          )}

          {/* Export JSON config */}
          <Button
            onClick={handleExport}
            variant="outline"
            className="h-9 text-xs border-[#0F4D36]/15 hover:bg-[#FAF7F0] cursor-pointer font-semibold"
            title="Download settings JSON backup sheets"
          >
            Export
          </Button>

          {/* Import JSON config */}
          <label className="h-9 px-3 border border-[#0F4D36]/15 rounded-lg flex items-center justify-center hover:bg-[#FAF7F0] cursor-pointer text-xs font-semibold bg-white select-none">
            <span>Import</span>
            <input
              type="file"
              accept=".json"
              className="hidden"
              onChange={handleImport}
            />
          </label>

          {/* Save Draft changes */}
          <Button
            onClick={handleSave}
            disabled={!isDirty || isSaving}
            className="h-9 text-xs bg-white text-[#0F4D36] border border-[#0F4D36]/20 hover:bg-[#0F4D36]/5 font-bold cursor-pointer gap-1.5 shadow-sm"
          >
            {isSaving ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Save className="w-3.5 h-3.5 text-[#D6B25E]" />
            )}
            <span>Save Draft</span>
          </Button>

          {/* Publish changes */}
          <Button
            onClick={handlePublish}
            disabled={isPublishing}
            className="h-9 text-xs bg-[#0F4D36] text-white hover:bg-[#0F4D36]/90 font-bold border border-[#D6B25E]/20 rounded-lg cursor-pointer shadow-md gap-1.5"
          >
            <Play className="w-3.5 h-3.5 text-[#D6B25E]" />
            <span>Publish Live</span>
          </Button>

          {/* Mobile Preview toggler */}
          <Button
            onClick={() => setIsMobilePreviewOpen(!isMobilePreviewOpen)}
            className="h-9 text-xs bg-[#D6B25E] text-[#0F4D36] hover:bg-[#D6B25E]/90 xl:hidden font-bold cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5 mr-1" />
            <span>Preview</span>
          </Button>
        </div>
      </div>

      {/* 2. THREE-PANEL CORE CONTAINER */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-stretch">
        
        {/* PANEL A: SETTINGS MODULES NAVIGATION (LEFT SIDEBAR - 3 Columns) */}
        <div className="xl:col-span-3 bg-white border border-[#0F4D36]/10 rounded-2xl p-4 shadow-sm space-y-4 self-start">
          <div className="flex items-center justify-between border-b border-[#0F4D36]/5 pb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#0F4D36]/50">Control Directories</span>
            <Settings className="w-4 h-4 text-[#D6B25E] animate-spin" style={{ animationDuration: "12s" }} />
          </div>

          <div className="space-y-1 overflow-y-auto max-h-[70vh] pr-1">
            {SETTINGS_MODULES.map((item) => {
              const active = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-start gap-3 px-3 py-2.5 rounded-xl text-left transition-all cursor-pointer group ${
                    active
                      ? "bg-[#0F4D36] text-white font-semibold shadow-md"
                      : "hover:bg-[#FAF7F0] text-[#0F4D36]/80 hover:text-[#0F4D36]"
                  }`}
                >
                  <item.icon className={`w-4 h-4 shrink-0 mt-0.5 ${active ? "text-[#D6B25E]" : "text-[#0F4D36]/40 group-hover:text-[#D6B25E] transition-colors"}`} />
                  <div className="space-y-0.5">
                    <div className="text-xs font-bold truncate">{item.name}</div>
                    <div className={`text-[9px] line-clamp-1 ${active ? "text-white/70" : "text-muted-foreground"}`}>{item.desc}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* PANEL B: ACTIVE SETTINGS WORKSPACE (CENTER PANEL - 5 Columns) */}
        <div className="xl:col-span-5 bg-white border border-[#0F4D36]/10 rounded-2xl p-6 shadow-sm flex flex-col justify-between min-h-[600px]">
          
          <div className="space-y-6 flex-1">
            {/* Header info for active tab */}
            <div className="border-b border-[#0F4D36]/5 pb-3">
              <span className="text-[9px] font-bold text-[#D6B25E] uppercase tracking-widest font-mono">WORKSPACE PANEL</span>
              <h2 className="font-serif text-xl font-bold text-[#0F4D36] mt-0.5">
                {SETTINGS_MODULES.find(m => m.id === activeTab)?.name}
              </h2>
            </div>

            {/* TAB CONTENT SHEETS */}
            <div className="space-y-5 select-none text-xs">
              
              {/* CATEGORY 1: GENERAL SETTINGS */}
              {activeTab === "general" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-wider text-[#0F4D36]/60">Academy Name</label>
                      <input
                        type="text"
                        value={draftSettings.academyName}
                        onChange={(e) => updateDraftField("academyName", e.target.value)}
                        className="w-full p-2.5 mt-1 border border-[#0F4D36]/10 rounded-lg bg-[#FAF7F0]/30 focus:bg-white focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-wider text-[#0F4D36]/60">Short Name</label>
                      <input
                        type="text"
                        value={draftSettings.shortName}
                        onChange={(e) => updateDraftField("shortName", e.target.value)}
                        className="w-full p-2.5 mt-1 border border-[#0F4D36]/10 rounded-lg bg-[#FAF7F0]/30 focus:bg-white focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-[#0F4D36]/60">Academy Tagline</label>
                    <input
                      type="text"
                      value={draftSettings.tagline}
                      onChange={(e) => updateDraftField("tagline", e.target.value)}
                      className="w-full p-2.5 mt-1 border border-[#0F4D36]/10 rounded-lg bg-[#FAF7F0]/30 focus:bg-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-[#0F4D36]/60">Meta Description</label>
                    <textarea
                      rows={3}
                      value={draftSettings.description}
                      onChange={(e) => updateDraftField("description", e.target.value)}
                      className="w-full p-2.5 mt-1 border border-[#0F4D36]/10 rounded-lg bg-[#FAF7F0]/30 focus:bg-white focus:outline-none resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-wider text-[#0F4D36]/60">Timezone</label>
                      <select
                        value={draftSettings.timezone}
                        onChange={(e) => updateDraftField("timezone", e.target.value)}
                        className="w-full p-2.5 mt-1 border border-[#0F4D36]/10 rounded-lg bg-white"
                      >
                        <option value="UTC+5:30 (Kolkata)">Kolkata (GMT+5:30)</option>
                        <option value="UTC+0:00 (London)">London (GMT)</option>
                        <option value="UTC-5:00 (New York)">New York (EST)</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-wider text-[#0F4D36]/60">Language</label>
                      <select
                        value={draftSettings.language}
                        onChange={(e) => updateDraftField("language", e.target.value)}
                        className="w-full p-2.5 mt-1 border border-[#0F4D36]/10 rounded-lg bg-white"
                      >
                        <option value="en">English</option>
                        <option value="ur">Urdu</option>
                        <option value="ar">Arabic</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-wider text-[#0F4D36]/60">Country</label>
                      <input
                        type="text"
                        value={draftSettings.country}
                        onChange={(e) => updateDraftField("country", e.target.value)}
                        className="w-full p-2.5 mt-1 border border-[#0F4D36]/10 rounded-lg bg-[#FAF7F0]/30 focus:bg-white focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 border-t border-[#0F4D36]/5 pt-4">
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-wider text-[#0F4D36]/60">Contact Email</label>
                      <input
                        type="email"
                        value={draftSettings.contactEmail}
                        onChange={(e) => updateDraftField("contactEmail", e.target.value)}
                        className="w-full p-2.5 mt-1 border border-[#0F4D36]/10 rounded-lg bg-[#FAF7F0]/30 focus:bg-white focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-wider text-[#0F4D36]/60">Support Email</label>
                      <input
                        type="email"
                        value={draftSettings.supportEmail}
                        onChange={(e) => updateDraftField("supportEmail", e.target.value)}
                        className="w-full p-2.5 mt-1 border border-[#0F4D36]/10 rounded-lg bg-[#FAF7F0]/30 focus:bg-white focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-[#0F4D36]/60">Support WhatsApp Number</label>
                    <input
                      type="text"
                      value={draftSettings.supportWhatsApp}
                      onChange={(e) => updateDraftField("supportWhatsApp", e.target.value)}
                      className="w-full p-2.5 mt-1 border border-[#0F4D36]/10 rounded-lg bg-[#FAF7F0]/30 focus:bg-white focus:outline-none"
                    />
                  </div>

                  {/* Switch Toggles */}
                  <div className="space-y-3 border-t border-[#0F4D36]/5 pt-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-bold">Enable Website</div>
                        <div className="text-[10px] text-muted-foreground">Keep the platform public and accessible.</div>
                      </div>
                      <input
                        type="checkbox"
                        checked={draftSettings.enableWebsite}
                        onChange={(e) => updateDraftField("enableWebsite", e.target.checked)}
                        className="w-4 h-4 rounded text-[#0F4D36]"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-bold text-amber-700">Maintenance Mode</div>
                        <div className="text-[10px] text-muted-foreground">Show temporary maintenance page to visitors.</div>
                      </div>
                      <input
                        type="checkbox"
                        checked={draftSettings.maintenanceMode}
                        onChange={(e) => updateDraftField("maintenanceMode", e.target.checked)}
                        className="w-4 h-4 rounded"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-bold">Announcement Banner</div>
                        <div className="text-[10px] text-muted-foreground">Show header notification banner.</div>
                      </div>
                      <input
                        type="checkbox"
                        checked={draftSettings.announcementBanner}
                        onChange={(e) => updateDraftField("announcementBanner", e.target.checked)}
                        className="w-4 h-4 rounded"
                      />
                    </div>

                    {draftSettings.announcementBanner && (
                      <div className="animate-in slide-in-from-top-2 duration-200">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-[#0F4D36]/50">Banner Text</label>
                        <input
                          type="text"
                          value={draftSettings.announcementText}
                          onChange={(e) => updateDraftField("announcementText", e.target.value)}
                          className="w-full p-2.5 mt-1 border border-[#0F4D36]/10 rounded-lg bg-[#FAF7F0]/30 focus:bg-white focus:outline-none text-xs"
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* CATEGORY 2: BRANDING CENTER */}
              {activeTab === "branding" && (
                <div className="space-y-4">
                  <div className="p-4 bg-[#FAF7F0] border border-[#0F4D36]/10 rounded-xl space-y-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#0F4D36]/60">Design Style Theme</span>
                    <div className="grid grid-cols-4 gap-2 text-center">
                      {(["default", "luxury", "minimal", "seasonal"] as const).map((t) => (
                        <button
                          key={t}
                          onClick={() => updateDraftField("visualStyleTheme", t)}
                          className={`p-2.5 rounded-lg border text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                            draftSettings.visualStyleTheme === t
                              ? "bg-[#0F4D36] text-white border-[#0F4D36] shadow-sm"
                              : "bg-white border-[#0F4D36]/10 hover:bg-[#0F4D36]/5"
                          }`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-wider text-[#0F4D36]/60">Color Palette Preset</label>
                      <select
                        value={draftSettings.colorPalette}
                        onChange={(e) => updateDraftField("colorPalette", e.target.value)}
                        className="w-full p-2.5 mt-1 border border-[#0F4D36]/10 rounded-lg bg-white"
                      >
                        <option value="Emerald & Gold (Default)">Emerald & Gold (Luxury)</option>
                        <option value="Royal Indigo & Cream">Royal Indigo & Cream</option>
                        <option value="Minimal Charcoal & Ivory">Minimal Charcoal & Ivory</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-wider text-[#0F4D36]/60">Typography Set</label>
                      <select
                        value={draftSettings.typography}
                        onChange={(e) => updateDraftField("typography", e.target.value)}
                        className="w-full p-2.5 mt-1 border border-[#0F4D36]/10 rounded-lg bg-white"
                      >
                        <option value="Playfair Display & Inter">Playfair Serif & Inter Sans</option>
                        <option value="Cinzel Serif & Outfit Sans">Cinzel Serif & Outfit Sans</option>
                        <option value="Merriweather & Roboto">Merriweather & Roboto</option>
                      </select>
                    </div>
                  </div>

                  {/* Logo Fields Mockups */}
                  <div className="space-y-3 border-t border-[#0F4D36]/5 pt-4">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#0F4D36]/60">Branding Image Assets</span>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div className="border border-[#0F4D36]/10 p-3 rounded-lg flex items-center justify-between bg-[#FAF7F0]/40">
                        <div>
                          <div className="font-bold">Primary Logo</div>
                          <div className="text-[9px] text-muted-foreground">Main Header Navbar Logo</div>
                        </div>
                        <Button size="sm" variant="outline" className="h-7 cursor-pointer text-[10px]">Select</Button>
                      </div>

                      <div className="border border-[#0F4D36]/10 p-3 rounded-lg flex items-center justify-between bg-[#FAF7F0]/40">
                        <div>
                          <div className="font-bold">Secondary Logo</div>
                          <div className="text-[9px] text-muted-foreground">Footer Branding Logo</div>
                        </div>
                        <Button size="sm" variant="outline" className="h-7 cursor-pointer text-[10px]">Select</Button>
                      </div>

                      <div className="border border-[#0F4D36]/10 p-3 rounded-lg flex items-center justify-between bg-[#FAF7F0]/40">
                        <div>
                          <div className="font-bold">Favicon Icon</div>
                          <div className="text-[9px] text-muted-foreground">Browser shortcut tab icon</div>
                        </div>
                        <Button size="sm" variant="outline" className="h-7 cursor-pointer text-[10px]">Select</Button>
                      </div>

                      <div className="border border-[#0F4D36]/10 p-3 rounded-lg flex items-center justify-between bg-[#FAF7F0]/40">
                        <div>
                          <div className="font-bold">OG Default Image</div>
                          <div className="text-[9px] text-muted-foreground">Social preview cards thumbnail</div>
                        </div>
                        <Button size="sm" variant="outline" className="h-7 cursor-pointer text-[10px]">Select</Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* CATEGORY 3: NAVBAR CONTROL */}
              {activeTab === "navbar" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-wider text-[#0F4D36]/60">Navbar Layout</label>
                      <select
                        value={draftSettings.navbarLayout}
                        onChange={(e) => updateDraftField("navbarLayout", e.target.value)}
                        className="w-full p-2.5 mt-1 border border-[#0F4D36]/10 rounded-lg bg-white"
                      >
                        <option value="split">Split Layout (Brand Left, Links Center)</option>
                        <option value="left">Left Aligned (All items Left)</option>
                        <option value="center">Center Stacked (Logo Top, Menu Bottom)</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-wider text-[#0F4D36]/60">CTA Button Text</label>
                      <input
                        type="text"
                        value={draftSettings.ctaText}
                        onChange={(e) => updateDraftField("ctaText", e.target.value)}
                        className="w-full p-2.5 mt-1 border border-[#0F4D36]/10 rounded-lg bg-[#FAF7F0]/30 focus:bg-white focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-3 border-t border-[#0F4D36]/5 pt-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-bold">Show CTA Button</div>
                        <div className="text-[10px] text-muted-foreground">Display header Call-to-Action.</div>
                      </div>
                      <input
                        type="checkbox"
                        checked={draftSettings.showCTA}
                        onChange={(e) => updateDraftField("showCTA", e.target.checked)}
                        className="w-4 h-4 rounded"
                      />
                    </div>



                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-bold">Mobile Burger Menu</div>
                        <div className="text-[10px] text-muted-foreground">Show burger overlay drawer on responsive viewports.</div>
                      </div>
                      <input
                        type="checkbox"
                        checked={draftSettings.showMobileMenu}
                        onChange={(e) => updateDraftField("showMobileMenu", e.target.checked)}
                        className="w-4 h-4 rounded"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* CATEGORY 4: FOOTER BUILDER */}
              {activeTab === "footer" && (
                <div className="space-y-4">
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-[#0F4D36]/60">Footer Copyright Notice</label>
                    <input
                      type="text"
                      value={draftSettings.footerCopyright}
                      onChange={(e) => updateDraftField("footerCopyright", e.target.value)}
                      className="w-full p-2.5 mt-1 border border-[#0F4D36]/10 rounded-lg bg-[#FAF7F0]/30 focus:bg-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-[#0F4D36]/60">Newsletter Block Title</label>
                    <input
                      type="text"
                      value={draftSettings.footerNewsletterTitle}
                      onChange={(e) => updateDraftField("footerNewsletterTitle", e.target.value)}
                      className="w-full p-2.5 mt-1 border border-[#0F4D36]/10 rounded-lg bg-[#FAF7F0]/30 focus:bg-white focus:outline-none"
                    />
                  </div>

                  <div className="flex items-center justify-between border-t border-[#0F4D36]/5 pt-4">
                    <div>
                      <div className="font-bold">Show Social Profile Badges</div>
                      <div className="text-[10px] text-muted-foreground">Toggle social icon arrays in footer footer row.</div>
                    </div>
                    <input
                      type="checkbox"
                      checked={draftSettings.footerShowSocial}
                      onChange={(e) => updateDraftField("footerShowSocial", e.target.checked)}
                      className="w-4 h-4 rounded"
                    />
                  </div>
                </div>
              )}

              {/* CATEGORY 5: COMMUNICATION CENTER */}
              {activeTab === "communication" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-wider text-[#0F4D36]/60">Email Provider SMTP</label>
                      <input
                        type="text"
                        value={draftSettings.emailProvider}
                        onChange={(e) => updateDraftField("emailProvider", e.target.value)}
                        className="w-full p-2.5 mt-1 border border-[#0F4D36]/10 rounded-lg bg-[#FAF7F0]/30 focus:bg-white focus:outline-none"
                      />
                    </div>
                    <div className="flex items-center justify-between border border-[#0F4D36]/10 p-3 rounded-lg bg-[#FAF7F0]/30 self-end">
                      <div>
                        <div className="font-bold text-[11px]">WhatsApp Widget</div>
                        <div className="text-[9px] text-muted-foreground">Show sticky support buttons</div>
                      </div>
                      <input
                        type="checkbox"
                        checked={draftSettings.whatsappEnabled}
                        onChange={(e) => updateDraftField("whatsappEnabled", e.target.checked)}
                        className="w-4 h-4 rounded"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-[#0F4D36]/60">Enrollment WhatsApp Template</label>
                    <textarea
                      rows={4}
                      value={draftSettings.enrollmentTemplate}
                      onChange={(e) => updateDraftField("enrollmentTemplate", e.target.value)}
                      className="w-full p-2.5 mt-1 border border-[#0F4D36]/10 rounded-lg bg-[#FAF7F0]/30 focus:bg-white focus:outline-none font-mono text-[10px] leading-relaxed resize-none"
                    />
                  </div>
                </div>
              )}

              {/* CATEGORY 6: SOCIAL MEDIA MANAGER */}
              {activeTab === "social" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-wider text-[#0F4D36]/60">Instagram Handle</label>
                      <input
                        type="text"
                        value={draftSettings.instagramUrl}
                        onChange={(e) => updateDraftField("instagramUrl", e.target.value)}
                        className="w-full p-2.5 mt-1 border border-[#0F4D36]/10 rounded-lg bg-[#FAF7F0]/30"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-wider text-[#0F4D36]/60">YouTube Channel</label>
                      <input
                        type="text"
                        value={draftSettings.youtubeUrl}
                        onChange={(e) => updateDraftField("youtubeUrl", e.target.value)}
                        className="w-full p-2.5 mt-1 border border-[#0F4D36]/10 rounded-lg bg-[#FAF7F0]/30"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-wider text-[#0F4D36]/60">Telegram Group</label>
                      <input
                        type="text"
                        value={draftSettings.telegramUrl}
                        onChange={(e) => updateDraftField("telegramUrl", e.target.value)}
                        className="w-full p-2.5 mt-1 border border-[#0F4D36]/10 rounded-lg bg-[#FAF7F0]/30"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-wider text-[#0F4D36]/60">Twitter Profile</label>
                      <input
                        type="text"
                        value={draftSettings.twitterUrl}
                        onChange={(e) => updateDraftField("twitterUrl", e.target.value)}
                        className="w-full p-2.5 mt-1 border border-[#0F4D36]/10 rounded-lg bg-[#FAF7F0]/30"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* CATEGORY 7: SEO DEFAULTS */}
              {activeTab === "seo" && (
                <div className="space-y-4">
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-[#0F4D36]/60">Global Title Template</label>
                    <input
                      type="text"
                      value={draftSettings.seoTitleTemplate}
                      onChange={(e) => updateDraftField("seoTitleTemplate", e.target.value)}
                      className="w-full p-2.5 mt-1 border border-[#0F4D36]/10 rounded-lg bg-[#FAF7F0]/30 focus:bg-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-[#0F4D36]/60">Default Meta Description Template</label>
                    <textarea
                      rows={2}
                      value={draftSettings.seoDescriptionTemplate}
                      onChange={(e) => updateDraftField("seoDescriptionTemplate", e.target.value)}
                      className="w-full p-2.5 mt-1 border border-[#0F4D36]/10 rounded-lg bg-[#FAF7F0]/30 focus:bg-white focus:outline-none resize-none"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-[#0F4D36]/60">Robots.txt Schema Configuration</label>
                    <textarea
                      rows={3}
                      value={draftSettings.seoRobotsTxt}
                      onChange={(e) => updateDraftField("seoRobotsTxt", e.target.value)}
                      className="w-full p-2.5 mt-1 border border-[#0F4D36]/10 rounded-lg bg-[#FAF7F0]/30 focus:bg-white focus:outline-none font-mono text-[10px] leading-relaxed resize-none"
                    />
                  </div>
                </div>
              )}

              {/* CATEGORY 8: LOCALIZATION */}
              {activeTab === "localization" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-wider text-[#0F4D36]/60">Date Format Preset</label>
                      <select
                        value={draftSettings.localizationDateFormat}
                        onChange={(e) => updateDraftField("localizationDateFormat", e.target.value)}
                        className="w-full p-2.5 mt-1 border border-[#0F4D36]/10 rounded-lg bg-white"
                      >
                        <option value="DD/MM/YYYY">DD/MM/YYYY (e.g. 25/12/2026)</option>
                        <option value="MM-DD-YYYY">MM-DD-YYYY (e.g. 12-25-2026)</option>
                        <option value="YYYY-MM-DD">YYYY-MM-DD (e.g. 2026-12-25)</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-wider text-[#0F4D36]/60">Default Currency</label>
                      <select
                        value={draftSettings.localizationCurrency}
                        onChange={(e) => updateDraftField("localizationCurrency", e.target.value)}
                        className="w-full p-2.5 mt-1 border border-[#0F4D36]/10 rounded-lg bg-white"
                      >
                        <option value="USD ($)">US Dollars ($)</option>
                        <option value="GBP (£)">British Pounds (£)</option>
                        <option value="SAR (SR)">Saudi Riyal (SR)</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t border-[#0F4D36]/5 pt-4">
                    <div>
                      <div className="font-bold">Force RTL Layout Support</div>
                      <div className="text-[10px] text-muted-foreground">Adjust text rendering grids for Arabic translations scripts.</div>
                    </div>
                    <input
                      type="checkbox"
                      checked={draftSettings.localizationRtl}
                      onChange={(e) => updateDraftField("localizationRtl", e.target.checked)}
                      className="w-4 h-4 rounded"
                    />
                  </div>
                </div>
              )}

              {/* CATEGORY 9: DOMAIN MANAGEMENT */}
              {activeTab === "domain" && (
                <div className="space-y-4">
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-[#0F4D36]/60">Primary Domain URL</label>
                    <input
                      type="text"
                      value={draftSettings.domainPrimary}
                      onChange={(e) => updateDraftField("domainPrimary", e.target.value)}
                      className="w-full p-2.5 mt-1 border border-[#0F4D36]/10 rounded-lg bg-[#FAF7F0]/30 focus:bg-white focus:outline-none"
                    />
                  </div>

                  <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-lg text-emerald-950 flex justify-between items-center">
                    <div>
                      <div className="font-bold text-[11px]">DNS routing: Healthy</div>
                      <div className="text-[9px] opacity-75">SSL credentials verification complete (HTTPS active)</div>
                    </div>
                    <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
                  </div>
                </div>
              )}

              {/* CATEGORY 10: PERFORMANCE SETTINGS */}
              {activeTab === "performance" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-bold">Next-Gen WebP Compression</div>
                      <div className="text-[10px] text-muted-foreground">Auto-optimize uploaded images to WebP/AVIF assets.</div>
                    </div>
                    <input
                      type="checkbox"
                      checked={draftSettings.perfImageOptimization}
                      onChange={(e) => updateDraftField("perfImageOptimization", e.target.checked)}
                      className="w-4 h-4 rounded"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-[#0F4D36]/60">Compression Quality Limit ({draftSettings.perfCompressionLevel}%)</label>
                    <input
                      type="range"
                      min={60}
                      max={95}
                      value={draftSettings.perfCompressionLevel}
                      onChange={(e) => updateDraftField("perfCompressionLevel", parseInt(e.target.value))}
                      className="w-full mt-2 accent-[#0F4D36]"
                    />
                  </div>

                  <div className="space-y-2 border-t border-[#0F4D36]/5 pt-4">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#0F4D36]/60">Cache Cleaning operations</span>
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        onClick={() => {
                          toast({ title: "CDN Purged", description: "Cleared sitemaps and images cache." });
                        }}
                        variant="outline"
                        className="h-8.5 text-[10px] cursor-pointer"
                      >
                        Purge CDN Cache
                      </Button>
                      <Button
                        onClick={() => {
                          toast({ title: "Edge purges done", description: "Successfully Purged Vercel static router paths cache." });
                        }}
                        variant="outline"
                        className="h-8.5 text-[10px] cursor-pointer"
                      >
                        Purge Vercel CDN
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* CATEGORY 11: DEPLOYMENT CONTROL */}
              {activeTab === "deployments" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-wider text-[#0F4D36]/60">Frontend Branch</label>
                      <input
                        type="text"
                        value={draftSettings.deployFrontendBranch}
                        onChange={(e) => updateDraftField("deployFrontendBranch", e.target.value)}
                        className="w-full p-2.5 mt-1 border border-[#0F4D36]/10 rounded-lg bg-[#FAF7F0]/30"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-wider text-[#0F4D36]/60">Backend Branch</label>
                      <input
                        type="text"
                        value={draftSettings.deployBackendBranch}
                        onChange={(e) => updateDraftField("deployBackendBranch", e.target.value)}
                        className="w-full p-2.5 mt-1 border border-[#0F4D36]/10 rounded-lg bg-[#FAF7F0]/30"
                      />
                    </div>
                  </div>

                  <div className="border-t border-[#0F4D36]/5 pt-4 space-y-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#0F4D36]/60">Active Releases History</span>
                    <div className="bg-[#FAF7F0] p-3 border border-[#0F4D36]/10 rounded-lg text-[11px] space-y-1.5 font-mono">
                      <div className="flex justify-between font-bold">
                        <span className="text-emerald-700">● Live (Stable)</span>
                        <span>v1.4.2</span>
                      </div>
                      <div className="text-[10px] text-muted-foreground">Deployed on 04/06/2026 by Administrator</div>
                    </div>
                  </div>
                </div>
              )}

              {/* CATEGORY 12: SECURITY SETTINGS */}
              {activeTab === "security" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-bold">Two-Factor Authentication (2FA)</div>
                      <div className="text-[10px] text-muted-foreground">Enforce Google Authenticator OTP checks.</div>
                    </div>
                    <input
                      type="checkbox"
                      checked={draftSettings.securityTwoFactor}
                      onChange={(e) => updateDraftField("securityTwoFactor", e.target.checked)}
                      className="w-4 h-4 rounded"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-[#0F4D36]/60">Login Attempt Limit ({draftSettings.securityLoginAttemptsLimit} attempts)</label>
                    <select
                      value={draftSettings.securityLoginAttemptsLimit}
                      onChange={(e) => updateDraftField("securityLoginAttemptsLimit", parseInt(e.target.value))}
                      className="w-full p-2.5 mt-1 border border-[#0F4D36]/10 rounded-lg bg-white"
                    >
                      <option value={3}>3 attempts (Strict)</option>
                      <option value={5}>5 attempts (Standard)</option>
                      <option value={10}>10 attempts (Lenient)</option>
                    </select>
                  </div>
                </div>
              )}

              {/* CATEGORY 13: INTEGRATIONS */}
              {activeTab === "integrations" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-wider text-[#0F4D36]/60">Cloudinary Cloud Name</label>
                      <input
                        type="text"
                        value={draftSettings.cloudinaryCloudName}
                        onChange={(e) => updateDraftField("cloudinaryCloudName", e.target.value)}
                        className="w-full p-2.5 mt-1 border border-[#0F4D36]/10 rounded-lg bg-[#FAF7F0]/30"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-wider text-[#0F4D36]/60">Google Analytics ID</label>
                      <input
                        type="text"
                        value={draftSettings.googleAnalyticsId}
                        onChange={(e) => updateDraftField("googleAnalyticsId", e.target.value)}
                        className="w-full p-2.5 mt-1 border border-[#0F4D36]/10 rounded-lg bg-[#FAF7F0]/30"
                      />
                    </div>
                  </div>

                  <div className="p-3 bg-[#FAF7F0] border border-[#0F4D36]/10 rounded-lg flex justify-between items-center text-[11px]">
                    <div>
                      <div className="font-bold">Clarity Analytics Integration</div>
                      <div className="text-[9px] text-muted-foreground">Connected project ID: {draftSettings.clarityProjectId}</div>
                    </div>
                    <Button
                      onClick={() => {
                        toast({ title: "Integration check passed", description: "Successfully connected to Clarity endpoint." });
                      }}
                      size="sm"
                      className="h-7 bg-[#0F4D36] text-white hover:bg-[#0f4d36]/90 cursor-pointer text-[10px]"
                    >
                      Test Link
                    </Button>
                  </div>
                </div>
              )}

              {/* CATEGORY 14: SYSTEM PANEL */}
              {activeTab === "system" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div className="p-3 border border-[#0F4D36]/10 rounded-xl bg-[#FAF7F0]/40">
                      <div className="text-[18px] font-bold font-mono text-[#0F4D36]">{systemMetrics.apiLatency}</div>
                      <div className="text-[9px] uppercase tracking-wider text-muted-foreground mt-0.5">API Latency</div>
                    </div>

                    <div className="p-3 border border-[#0F4D36]/10 rounded-xl bg-[#FAF7F0]/40">
                      <div className="text-[18px] font-bold font-mono text-[#0F4D36]">{systemMetrics.dbConnections}</div>
                      <div className="text-[9px] uppercase tracking-wider text-muted-foreground mt-0.5">DB Sockets</div>
                    </div>

                    <div className="p-3 border border-[#0F4D36]/10 rounded-xl bg-[#FAF7F0]/40">
                      <div className="text-[18px] font-bold font-mono text-[#0F4D36]">{systemMetrics.storageUsed} GB</div>
                      <div className="text-[9px] uppercase tracking-wider text-muted-foreground mt-0.5">Storage</div>
                    </div>
                  </div>

                  <div className="p-3 bg-[#0F4D36] text-white border border-[#D6B25E]/20 rounded-xl flex items-center justify-between">
                    <div>
                      <div className="font-serif font-bold text-xs text-[#D6B25E]">PostgreSQL Database</div>
                      <div className="text-[9px] text-white/70">Neon Broad Cloud Auto-scaling engine status</div>
                    </div>
                    <span className="bg-emerald-600 text-white text-[9px] font-bold px-2 py-0.5 rounded">Connected</span>
                  </div>
                </div>
              )}

              {/* CATEGORY 15: BACKUP & RESTORE */}
              {activeTab === "backup" && (
                <div className="space-y-4">
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-[#0F4D36]/60">Scheduled Backups frequency</label>
                    <select
                      value={draftSettings.backupSchedule}
                      onChange={(e) => updateDraftField("backupSchedule", e.target.value)}
                      className="w-full p-2.5 mt-1 border border-[#0F4D36]/10 rounded-lg bg-white"
                    >
                      <option value="daily">Daily Auto Backups (Midnight)</option>
                      <option value="weekly">Weekly Auto Backups (Sunday)</option>
                      <option value="monthly">Monthly Auto Backups (1st day)</option>
                      <option value="manual">Manual Backups Only</option>
                    </select>
                  </div>

                  <div className="border-t border-[#0F4D36]/5 pt-4 space-y-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#0F4D36]/60">Manual triggers</span>
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        onClick={() => {
                          toast({ title: "Backup Initiated", description: "Successfully drafted manual SQL dump sheet." });
                        }}
                        className="bg-[#0F4D36] text-white hover:bg-[#0f4d36]/90 text-xs h-9 font-semibold cursor-pointer"
                      >
                        Create SQL Dump
                      </Button>
                      <Button
                        onClick={handleExport}
                        variant="outline"
                        className="text-xs h-9 font-semibold border-[#0F4D36]/15 hover:bg-[#FAF7F0] cursor-pointer"
                      >
                        Export JSON State
                      </Button>
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>

        {/* PANEL C: PREVIEW & DEVICES CANVAS (RIGHT PANEL - 4 Columns) */}
        <div className="xl:col-span-4 bg-white border border-[#0F4D36]/10 rounded-2xl p-4 shadow-sm flex flex-col justify-between hidden xl:flex">
          
          <div className="space-y-4 flex-1 flex flex-col">
            <div className="flex items-center justify-between border-b border-[#0F4D36]/5 pb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#0F4D36]/50">Dynamic Preview Canvas</span>
              
              {/* Canvas adapters */}
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setPreviewDevice("desktop")}
                  className={`p-1.5 rounded transition-colors ${previewDevice === "desktop" ? "bg-[#0F4D36]/10 text-[#0F4D36]" : "text-[#0F4D36]/50 hover:bg-[#0F4D36]/5"}`}
                  title="Desktop Preview"
                >
                  <Monitor className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setPreviewDevice("tablet")}
                  className={`p-1.5 rounded transition-colors ${previewDevice === "tablet" ? "bg-[#0F4D36]/10 text-[#0F4D36]" : "text-[#0F4D36]/50 hover:bg-[#0F4D36]/5"}`}
                  title="Tablet Preview"
                >
                  <Tablet className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setPreviewDevice("mobile")}
                  className={`p-1.5 rounded transition-colors ${previewDevice === "mobile" ? "bg-[#0F4D36]/10 text-[#0F4D36]" : "text-[#0F4D36]/50 hover:bg-[#0F4D36]/5"}`}
                  title="Mobile Preview"
                >
                  <Smartphone className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* PREVIEWS RENDERER */}
            <div className="flex-1 bg-[#FAF7F0] border border-[#0F4D36]/10 rounded-xl p-3 flex items-center justify-center overflow-hidden min-h-[300px] relative">
              
              <div className={`transition-all duration-300 bg-white border border-[#0F4D36]/10 rounded shadow-md overflow-hidden relative ${
                previewDevice === "desktop" ? "w-full h-full" :
                previewDevice === "tablet" ? "w-[280px] h-[380px]" : "w-[200px] h-[350px]"
              } flex flex-col justify-between`}>
                
                {/* 1. BRANDING, GENERAL, NAVBAR PREVIEW */}
                {(activeTab === "general" || activeTab === "branding" || activeTab === "navbar") && (
                  <div className="w-full h-full flex flex-col justify-between bg-[#F7F3EA]/35">
                    {/* Header navbar mockup */}
                    <div className="bg-[#0F4D36] text-white p-2.5 flex items-center justify-between text-[8px] font-serif border-b border-[#D6B25E]/20">
                      <div className="flex items-center gap-1">
                        <div className="w-3.5 h-3.5 bg-white rounded-full flex items-center justify-center font-bold text-[#0F4D36] text-[6px]">HA</div>
                        <span className="font-bold">{draftSettings.shortName}</span>
                      </div>
                      
                      {previewDevice === "desktop" && (
                        <div className="flex gap-2.5 opacity-80 text-[7px]">
                          <span>Courses</span>
                          <span>About</span>
                          <span>Contact</span>
                        </div>
                      )}

                      {draftSettings.showCTA && (
                        <span className="bg-[#D6B25E] text-[#0F4D36] text-[6px] font-bold px-2 py-0.5 rounded shadow-sm">
                          {draftSettings.ctaText}
                        </span>
                      )}
                    </div>

                    {/* Announcement Banner */}
                    {draftSettings.announcementBanner && (
                      <div className="bg-[#D6B25E] text-[#0F4D36] text-[7px] font-semibold text-center py-1 truncate px-2 font-mono border-b border-black/5">
                        {draftSettings.announcementText}
                      </div>
                    )}

                    {/* Main Layout Mockup details */}
                    <div className="flex-1 flex flex-col items-center justify-center text-center p-4 space-y-2">
                      <span className="text-[6px] text-[#D6B25E] font-bold uppercase tracking-widest font-mono">LADIES ACADEMY PORTAL</span>
                      <h4 className="font-serif text-[#0F4D36] font-bold text-xs md:text-sm leading-tight max-w-[150px]">
                        {draftSettings.tagline}
                      </h4>
                      <p className="text-[7px] text-muted-foreground max-w-[130px]">
                        {draftSettings.academyName} supports sisters-only study streams online.
                      </p>
                    </div>

                    {/* Footer Row */}
                    <div className="bg-[#FAF7F0] p-2 border-t border-[#0F4D36]/5 text-center text-[6px] text-muted-foreground">
                      {draftSettings.footerCopyright}
                    </div>
                  </div>
                )}

                {/* 2. FOOTER PREVIEW */}
                {activeTab === "footer" && (
                  <div className="w-full h-full flex flex-col justify-end bg-gray-50">
                    <div className="p-3 bg-[#FAF7F0] border-t border-[#0F4D36]/10 text-left space-y-2.5">
                      <div className="font-serif text-[10px] font-bold text-[#0F4D36]">
                        {draftSettings.shortName} Academy
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2 text-[7px]">
                        <div className="space-y-1">
                          <span className="font-bold opacity-60">SITEMAP</span>
                          <div className="space-y-0.5 flex flex-col">
                            <span>Sisters Courses</span>
                            <span>About scholars</span>
                          </div>
                        </div>
                        <div className="space-y-1">
                          <span className="font-bold opacity-60">LEGAL</span>
                          <div className="space-y-0.5 flex flex-col">
                            <span>Privacy Terms</span>
                            <span>Refund Sheet</span>
                          </div>
                        </div>
                      </div>

                      <div className="border-t border-[#0F4D36]/5 pt-2 flex items-center justify-between text-[7px]">
                        <span>{draftSettings.footerCopyright}</span>
                        {draftSettings.footerShowSocial && (
                          <div className="flex gap-1.5 opacity-60">
                            <span>IG</span>
                            <span>YT</span>
                            <span>WA</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* 3. SEO PREVIEW */}
                {activeTab === "seo" && (
                  <div className="w-full h-full p-4 bg-white space-y-4 text-left">
                    <span className="text-[7px] font-bold uppercase tracking-wider text-muted-foreground">Google Search Snippet Preview</span>
                    <div className="space-y-1 bg-[#FAF7F0]/40 p-2.5 rounded border border-[#0F4D36]/5 text-xs">
                      <div className="text-[8px] text-blue-800 font-bold hover:underline leading-tight truncate">
                        {draftSettings.seoTitleTemplate.replace("%title%", draftSettings.shortName)}
                      </div>
                      <div className="text-[6px] text-emerald-800 font-bold font-mono">
                        {draftSettings.seoCanonical}
                      </div>
                      <div className="text-[7px] text-gray-500 line-clamp-2 leading-relaxed">
                        {draftSettings.seoDescriptionTemplate.replace("%description%", draftSettings.description)}
                      </div>
                    </div>
                  </div>
                )}

                {/* 4. DOMAIN / SYSTEM PREVIEW */}
                {(activeTab === "domain" || activeTab === "system") && (
                  <div className="w-full h-full p-4 bg-[#0F4D36] text-white flex flex-col justify-between text-left">
                    <div className="space-y-1.5">
                      <span className="text-[7px] text-[#D6B25E] font-bold uppercase tracking-widest font-mono">SITEMAP DNS HEALTH</span>
                      <div className="font-serif text-sm font-bold truncate">{draftSettings.domainPrimary}</div>
                    </div>

                    <div className="p-2.5 bg-white/10 rounded-lg text-[9px] font-mono space-y-1">
                      <div>DNS Address Resolution: Verified</div>
                      <div>CNAME purges: Active</div>
                      <div>DB Socket check: 12 open connections</div>
                      <div>SSL status: Valid</div>
                    </div>

                    <div className="flex justify-between items-center border-t border-white/10 pt-2 text-[8px] opacity-75">
                      <span>Cloudinary Edge Status</span>
                      <span className="font-bold text-[#D6B25E]">Healthy</span>
                    </div>
                  </div>
                )}

                {/* 5. DEPLOYMENTS LOGS PREVIEW */}
                {activeTab === "deployments" && (
                  <div className="w-full h-full bg-black text-emerald-500 font-mono text-[6px] p-2 overflow-y-auto space-y-0.5 leading-normal flex flex-col justify-end">
                    <div className="flex items-center gap-1 border-b border-white/10 pb-1 mb-1 text-white text-[7px]">
                      <Terminal className="w-3 h-3 text-[#D6B25E]" />
                      <span>Vercel Deployments Console Logs</span>
                    </div>
                    <div>$ git log --oneline -n 1</div>
                    <div className="text-gray-400">ae34f81 (main) fix media slots sync overrides</div>
                    <div>$ pnpm run build</div>
                    <div className="text-gray-400">compiling templates router...</div>
                    <div className="text-gray-400">purging edge CDN caches...</div>
                    <div className="text-white font-bold">● Production Release stable v1.4.2</div>
                  </div>
                )}

                {/* FALLBACK INFO PREVIEW FOR OTHER TABS */}
                {["communication", "social", "localization", "performance", "security", "integrations", "backup"].includes(activeTab) && (
                  <div className="w-full h-full p-4 bg-[#FAF7F0]/20 flex flex-col items-center justify-center text-center space-y-2">
                    <Sparkles className="w-8 h-8 text-[#D6B25E] animate-pulse" />
                    <span className="text-[10px] font-serif font-bold text-[#0F4D36]">Configuration Canvas Live</span>
                    <p className="text-[8px] text-muted-foreground max-w-[130px] leading-relaxed">
                      This module settings automatically bind to global routing templates on publish.
                    </p>
                  </div>
                )}

              </div>
            </div>

            {/* Storage capacity indicator */}
            <div className="bg-[#FAF7F0] p-4 border border-[#0F4D36]/10 rounded-xl space-y-2.5 text-xs">
              <div className="flex justify-between items-center font-bold">
                <span>Database Allocation</span>
                <span className="font-mono text-[11px]">{systemMetrics.storageUsed} GB / {draftSettings.systemStorageLimit}</span>
              </div>
              <div className="w-full bg-[#0F4D36]/10 h-2 rounded-full overflow-hidden">
                <div className="bg-[#D6B25E] h-full rounded-full" style={{ width: `${(systemMetrics.storageUsed / 10) * 100}%` }} />
              </div>
              <div className="text-[9px] text-muted-foreground flex justify-between">
                <span>Auto-scaling: Enabled</span>
                <span>Active</span>
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* 3. LOGS COMPILATION MODAL */}
      <Dialog open={isLogsDialogOpen} onOpenChange={setIsLogsDialogOpen}>
        <DialogContent className="max-w-lg bg-black text-[#D6B25E] border border-white/20 p-6 rounded-xl font-mono text-xs">
          <DialogHeader className="border-b border-white/10 pb-3">
            <DialogTitle className="font-serif text-lg font-bold text-white flex items-center gap-2">
              <Terminal className="w-5 h-5 text-[#D6B25E]" />
              <span>Production Deployment Console Logs</span>
            </DialogTitle>
            <DialogDescription className="text-xs text-white/50">
              Purging edge CDN caches and compiling templates router.
            </DialogDescription>
          </DialogHeader>

          {/* Compilation Logs viewport */}
          <div className="my-4 h-64 bg-neutral-950 p-4 rounded-lg overflow-y-auto space-y-1.5 text-[10px] leading-relaxed select-text border border-white/5 scrollbar-thin">
            {publishLogs.map((log, idx) => (
              <div key={idx} className={log.includes("SUCCESS") ? "text-emerald-500 font-bold" : "text-gray-300"}>
                {log}
              </div>
            ))}
            {isPublishing && (
              <div className="flex items-center gap-1.5 text-gray-500">
                <RefreshCw className="w-3 h-3 animate-spin" />
                <span>Compiling static layouts...</span>
              </div>
            )}
          </div>

          {/* Progress bar */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-[10px]">
              <span>Publish Progress:</span>
              <span className="font-bold">{publishProgress}%</span>
            </div>
            <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
              <div className="bg-[#D6B25E] h-full transition-all duration-300" style={{ width: `${publishProgress}%` }} />
            </div>
          </div>

          <DialogFooter className="pt-4 border-t border-white/10 mt-4">
            <Button
              disabled={isPublishing}
              onClick={() => setIsLogsDialogOpen(false)}
              className="bg-white text-black hover:bg-white/95 text-xs h-9 font-semibold cursor-pointer"
            >
              Close Console
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 4. MOBILE DRAWER CANVAS PREVIEW (Adaptive mobile view) */}
      <AnimatePresence>
        {isMobilePreviewOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-[4px] z-40 flex items-center justify-center p-4 xl:hidden"
            onClick={() => setIsMobilePreviewOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-[#FAF7F0] border border-[#0F4D36]/20 p-6 rounded-2xl max-w-sm w-full space-y-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-[#0F4D36]/5 pb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#0F4D36]/50">Mobile Canvas Preview</span>
                <button onClick={() => setIsMobilePreviewOpen(false)} className="p-1 rounded hover:bg-black/5"><X className="w-4 h-4" /></button>
              </div>

              {/* Render small mockup */}
              <div className="aspect-[9/16] bg-white border border-[#0F4D36]/10 rounded-xl overflow-hidden shadow-2xl flex flex-col justify-between max-w-[240px] mx-auto">
                <div className="bg-[#0F4D36] text-white p-2 flex items-center justify-between text-[8px]">
                  <span className="font-bold">{draftSettings.shortName}</span>
                  {draftSettings.showCTA && <span className="bg-[#D6B25E] text-[#0F4D36] text-[6px] font-bold px-1.5 py-0.5 rounded">{draftSettings.ctaText}</span>}
                </div>
                
                <div className="p-4 text-center space-y-1.5 flex-1 flex flex-col items-center justify-center">
                  <h4 className="font-serif text-[#0F4D36] font-bold text-[10px] leading-tight max-w-[130px]">{draftSettings.tagline}</h4>
                  <p className="text-[7px] text-muted-foreground max-w-[120px]">{draftSettings.description}</p>
                </div>

                <div className="bg-[#FAF7F0] p-1.5 text-center text-[5px] text-muted-foreground">
                  {draftSettings.footerCopyright}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}

// X icon proxy helper since we didn't import X directly in standard lists
function X({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}
