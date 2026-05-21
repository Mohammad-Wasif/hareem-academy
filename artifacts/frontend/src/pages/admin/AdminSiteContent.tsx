import { useState, useMemo } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { 
  useGetSiteContent, 
  useUpdateSiteContent,
  getGetSiteContentQueryKey 
} from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Loader2, 
  Save, 
  Search, 
  AlertCircle, 
  Phone, 
  Palette, 
  CheckCircle, 
  Layers, 
  Sparkles,
  ChevronRight
} from "lucide-react";
import { toast } from "sonner";

import enJson from "@/locales/en.json";
import urJson from "@/locales/ur.json";

// Helper to flatten nested JSON
function flattenObject(obj: any, prefix = ""): Record<string, string> {
  let result: Record<string, string> = {};
  for (const key in obj) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (typeof obj[key] === "object" && obj[key] !== null && !Array.isArray(obj[key])) {
      Object.assign(result, flattenObject(obj[key], fullKey));
    } else if (typeof obj[key] === "string") {
      result[fullKey] = obj[key];
    }
  }
  return result;
}

export default function AdminSiteContent() {
  const qc = useQueryClient();
  const [viewMode, setViewMode] = useState<"quick" | "advanced">("quick");
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  const { data: overrides, isLoading } = useGetSiteContent({
    query: {
      queryKey: getGetSiteContentQueryKey(),
    }
  });

  const updateMut = useUpdateSiteContent({
    mutation: {
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: getGetSiteContentQueryKey() });
        setPendingChanges({});
        toast.success("Site content updated successfully!");
      },
      onError: () => {
        toast.error("Failed to update site content.");
      },
    },
  });

  // Flatten all defaults
  const defaults = useMemo(() => ({
    en: flattenObject(enJson),
    ur: flattenObject(urJson),
  }), []);

  const [pendingChanges, setPendingChanges] = useState<Record<string, { en?: string, ur?: string }>>({});

  const allKeys = useMemo(() => {
    const keys = new Set(Object.keys(defaults.en));
    overrides?.forEach(o => keys.add(o.key));
    return Array.from(keys).sort();
  }, [defaults.en, overrides]);

  const categories = useMemo(() => {
    const cats = new Set<string>();
    allKeys.forEach(k => cats.add(k.split(".")[0]));
    return Array.from(cats).sort();
  }, [allKeys]);

  const filteredKeys = useMemo(() => {
    return allKeys.filter(k => {
      const matchSearch = k.toLowerCase().includes(search.toLowerCase());
      const firstPart = k.split(".")[0];
      const matchTab = activeTab === "all" || firstPart === activeTab;
      return matchSearch && matchTab;
    });
  }, [allKeys, search, activeTab]);

  const handleUpdate = (key: string, lang: "en" | "ur", value: string) => {
    setPendingChanges(prev => ({
      ...prev,
      [key]: {
        ...prev[key],
        [lang]: value
      }
    }));
  };

  const getValue = (key: string, lang: "en" | "ur") => {
    const override = overrides?.find(o => o.key === key);
    return pendingChanges[key]?.[lang] ?? override?.[lang] ?? defaults[lang][key] ?? "";
  };

  const handleSave = () => {
    const items = Object.entries(pendingChanges).map(([key, changes]) => {
      const existing = overrides?.find(o => o.key === key);
      return {
        key,
        en: changes.en ?? existing?.en ?? defaults.en[key] ?? "",
        ur: changes.ur ?? existing?.ur ?? defaults.ur[key] ?? null,
      };
    });

    if (items.length === 0) return;
    updateMut.mutate({ data: items });
  };

  const changeCount = Object.keys(pendingChanges).length;

  const renderInputPair = (label: string, key: string, description?: string) => {
    return (
      <div className="space-y-2 border-b border-border/10 pb-4 last:border-0 last:pb-0">
        <div className="flex flex-col gap-0.5">
          <span className="text-xs font-semibold text-foreground">{label}</span>
          {description && <span className="text-[10px] text-muted-foreground">{description}</span>}
        </div>
        <div className="grid lg:grid-cols-2 gap-4">
          <div className="space-y-1">
            <span className="text-[9px] uppercase tracking-widest text-muted-foreground font-bold">English</span>
            <Input 
              value={getValue(key, "en")}
              onChange={e => handleUpdate(key, "en", e.target.value)}
              className="bg-white/50 border-border/40 focus:bg-white h-9 text-xs"
            />
          </div>
          <div className="space-y-1">
            <span className="text-[9px] uppercase tracking-widest text-muted-foreground font-bold">Urdu (اردو)</span>
            <Input 
              value={getValue(key, "ur")}
              onChange={e => handleUpdate(key, "ur", e.target.value)}
              dir="rtl"
              className="text-right bg-white/50 border-border/40 focus:bg-white font-arabic h-9 text-sm"
            />
          </div>
        </div>
      </div>
    );
  };

  const renderTextareaPair = (label: string, key: string, description?: string) => {
    return (
      <div className="space-y-2 border-b border-border/10 pb-4 last:border-0 last:pb-0">
        <div className="flex flex-col gap-0.5">
          <span className="text-xs font-semibold text-foreground">{label}</span>
          {description && <span className="text-[10px] text-muted-foreground">{description}</span>}
        </div>
        <div className="grid lg:grid-cols-2 gap-4">
          <div className="space-y-1">
            <span className="text-[9px] uppercase tracking-widest text-muted-foreground font-bold">English</span>
            <Textarea 
              value={getValue(key, "en")}
              onChange={e => handleUpdate(key, "en", e.target.value)}
              className="min-h-[60px] text-xs bg-white/50 border-border/40 focus:bg-white resize-y"
            />
          </div>
          <div className="space-y-1">
            <span className="text-[9px] uppercase tracking-widest text-muted-foreground font-bold">Urdu (اردو)</span>
            <Textarea 
              value={getValue(key, "ur")}
              onChange={e => handleUpdate(key, "ur", e.target.value)}
              dir="rtl"
              className="min-h-[60px] text-sm leading-relaxed text-right bg-white/50 border-border/40 focus:bg-white font-arabic resize-y"
            />
          </div>
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="py-16 flex justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 sticky top-0 z-10 bg-[#FAF7F0]/80 backdrop-blur-md py-4 border-b border-border/20">
        <div>
          <h1 className="font-serif text-3xl text-primary font-bold">Site Content</h1>
          <p className="text-muted-foreground text-xs mt-1">
            Control dynamic content, configurations, and localized translations across the portal.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {changeCount > 0 && (
            <Button variant="outline" onClick={() => setPendingChanges({})}>
              Discard
            </Button>
          )}
          <Button 
            onClick={handleSave} 
            disabled={changeCount === 0 || updateMut.isPending}
            className="shadow-lg shadow-primary/10"
          >
            {updateMut.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
            Save {changeCount > 0 ? changeCount : ""} Changes
          </Button>
        </div>
      </div>

      <div className="flex justify-between items-center gap-4 bg-white/40 p-1.5 rounded-xl border border-border/30 w-fit">
        <button 
          onClick={() => setViewMode("quick")} 
          className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
            viewMode === "quick" 
              ? "bg-primary text-primary-foreground shadow-sm" 
              : "text-muted-foreground hover:text-foreground hover:bg-primary/5"
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          Quick Configuration
        </button>
        <button 
          onClick={() => setViewMode("advanced")} 
          className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
            viewMode === "advanced" 
              ? "bg-primary text-primary-foreground shadow-sm" 
              : "text-muted-foreground hover:text-foreground hover:bg-primary/5"
          }`}
        >
          <Search className="w-3.5 h-3.5" />
          Advanced Keys
        </button>
      </div>

      {viewMode === "quick" ? (
        <div className="grid gap-8">
          
          {/* Section 1: Appearance & Presets */}
          <Card className="border-border/40 shadow-sm overflow-hidden bg-white/50">
            <CardHeader className="py-4 px-6 border-b border-border/10 bg-primary/[0.02] flex flex-row items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/5 text-primary">
                <Palette className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-primary uppercase tracking-wider">Appearance & Style Presets</h3>
                <p className="text-[11px] text-muted-foreground">Adjust brand colors and glow intensities in real-time.</p>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="grid sm:grid-cols-2 gap-6">
                
                {/* Theme presets select */}
                <div className="space-y-2">
                  <div>
                    <Label className="text-xs font-semibold text-foreground">Color Palette Preset</Label>
                    <p className="text-[10px] text-muted-foreground mt-0.5">Applies corresponding primary and accent brand colors.</p>
                  </div>
                  <Select 
                    value={getValue("common.theme_preset", "en")} 
                    onValueChange={val => {
                      handleUpdate("common.theme_preset", "en", val);
                      handleUpdate("common.theme_preset", "ur", val);
                    }}
                  >
                    <SelectTrigger className="bg-white/70 border-border/40 text-xs">
                      <SelectValue placeholder="Select Theme Palette" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="emerald">Emerald Green & Gold (Default)</SelectItem>
                      <SelectItem value="deep">Deep Royal Emerald & Gold</SelectItem>
                      <SelectItem value="rose">Elegant Rose & Gold</SelectItem>
                      <SelectItem value="teal">Classic Teal & Amber</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Glow intensity select */}
                <div className="space-y-2">
                  <div>
                    <Label className="text-xs font-semibold text-foreground">Hero Glow strength</Label>
                    <p className="text-[10px] text-muted-foreground mt-0.5">Controls brightness of radial blur backgrounds.</p>
                  </div>
                  <Select 
                    value={getValue("common.glow_preset", "en")} 
                    onValueChange={val => {
                      handleUpdate("common.glow_preset", "en", val);
                      handleUpdate("common.glow_preset", "ur", val);
                    }}
                  >
                    <SelectTrigger className="bg-white/70 border-border/40 text-xs">
                      <SelectValue placeholder="Select Glow Level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="subtle">Subtle (Low opacity)</SelectItem>
                      <SelectItem value="classic">Classic (Medium opacity)</SelectItem>
                      <SelectItem value="vibrant">Vibrant (High opacity)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Section 2: WhatsApp Support Details */}
          <Card className="border-border/40 shadow-sm overflow-hidden bg-white/50">
            <CardHeader className="py-4 px-6 border-b border-border/10 bg-primary/[0.02] flex flex-row items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-emerald-800 uppercase tracking-wider">WhatsApp Support Settings</h3>
                <p className="text-[11px] text-muted-foreground">Modify direct contact number and auto-fill chat messages.</p>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              {renderInputPair("WhatsApp Contact Number", "common.whatsapp_number", "Include country code and spaces, e.g. +91 9315118289")}
              {renderTextareaPair("WhatsApp Pre-filled Chat Message", "common.whatsapp_message", "Message populated when user clicks chat/enroll links")}
            </CardContent>
          </Card>

          {/* Section 3: Trust Badges / Marquee */}
          <Card className="border-border/40 shadow-sm overflow-hidden bg-white/50">
            <CardHeader className="py-4 px-6 border-b border-border/10 bg-primary/[0.02] flex flex-row items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/5 text-primary">
                <CheckCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-primary uppercase tracking-wider">Trust Ticker / Marquee Badges</h3>
                <p className="text-[11px] text-muted-foreground">Adjust text labels showing in the scrolling brand banner on the Home page.</p>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              {renderInputPair("Badge 1", "home.trust.teachers", "Default: Female Teachers Only")}
              {renderInputPair("Badge 2", "home.trust.privacy", "Default: Full Privacy")}
              {renderInputPair("Badge 3", "home.trust.live_classes", "Default: Live Online Classes")}
              {renderInputPair("Badge 4", "home.trust.flexible_timings", "Default: Flexible Timings")}
              {renderInputPair("Badge 5", "home.trust.beginner_friendly", "Default: Beginner Friendly")}
              {renderInputPair("Badge 6", "home.trust.small_batches", "Default: Small Interactive Batches")}
            </CardContent>
          </Card>

          {/* Section 4: Enrollment 4 Steps */}
          <Card className="border-border/40 shadow-sm overflow-hidden bg-white/50">
            <CardHeader className="py-4 px-6 border-b border-border/10 bg-primary/[0.02] flex flex-row items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/5 text-primary">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-primary uppercase tracking-wider">How Enrollment Works (4 Steps)</h3>
                <p className="text-[11px] text-muted-foreground">Edit details inside the institutional timeline flow on the Home page.</p>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="border-b border-border/20 pb-6 space-y-6">
                <h4 className="text-xs font-bold uppercase tracking-wide text-primary">Timeline Section Headers & CTA</h4>
                {renderInputPair("Section Pre-Title Label", "home.enrollment.label", "Default: Steps / مراحل")}
                {renderInputPair("Section Primary Title", "home.enrollment.title", "Default: How Enrollment Works / داخلے کا طریقہ کار")}
                {renderInputPair("Enrollment Call-To-Action (CTA)", "home.enrollment.cta", "Default: Explore Courses / کورسز دریافت کریں")}
              </div>

              <div className="space-y-8 pt-2">
                
                {/* Step 1 */}
                <div className="space-y-4 border-b border-border/10 pb-6 last:border-0 last:pb-0">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold font-mono">1</span>
                    <span className="text-xs font-bold text-foreground">Step 1 Details</span>
                  </div>
                  {renderInputPair("Step 1 Title", "home.enrollment.step1_title")}
                  {renderTextareaPair("Step 1 Description", "home.enrollment.step1_desc")}
                </div>

                {/* Step 2 */}
                <div className="space-y-4 border-b border-border/10 pb-6 last:border-0 last:pb-0">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold font-mono">2</span>
                    <span className="text-xs font-bold text-foreground">Step 2 Details</span>
                  </div>
                  {renderInputPair("Step 2 Title", "home.enrollment.step2_title")}
                  {renderTextareaPair("Step 2 Description", "home.enrollment.step2_desc")}
                </div>

                {/* Step 3 */}
                <div className="space-y-4 border-b border-border/10 pb-6 last:border-0 last:pb-0">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold font-mono">3</span>
                    <span className="text-xs font-bold text-foreground">Step 3 Details</span>
                  </div>
                  {renderInputPair("Step 3 Title", "home.enrollment.step3_title")}
                  {renderTextareaPair("Step 3 Description", "home.enrollment.step3_desc")}
                </div>

                {/* Step 4 */}
                <div className="space-y-4 border-b border-border/10 pb-6 last:border-0 last:pb-0">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold font-mono">4</span>
                    <span className="text-xs font-bold text-foreground">Step 4 Details</span>
                  </div>
                  {renderInputPair("Step 4 Title", "home.enrollment.step4_title")}
                  {renderTextareaPair("Step 4 Description", "home.enrollment.step4_desc")}
                </div>

              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex flex-col gap-4">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                placeholder="Search by key or text (e.g. 'hero' or 'welcome')..." 
                className="pl-10 h-12 bg-white/50 border-border/40 focus:bg-white"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <div className="overflow-x-auto pb-2">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-max">
                <TabsList className="bg-muted/30">
                  <TabsTrigger value="all">All Content</TabsTrigger>
                  {categories.map(cat => (
                    <TabsTrigger key={cat} value={cat} className="capitalize">{cat}</TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </div>
          </div>

          <div className="grid gap-6">
            {filteredKeys.slice(0, 50).map(key => {
              const override = overrides?.find(o => o.key === key);
              const currentEn = pendingChanges[key]?.en ?? override?.en ?? defaults.en[key] ?? "";
              const currentUr = pendingChanges[key]?.ur ?? override?.ur ?? defaults.ur[key] ?? "";

              const isModified = !!pendingChanges[key];
              const hasOverride = !!override;

              return (
                <Card key={key} className={`transition-all ${isModified ? "ring-2 ring-primary border-primary shadow-md" : "border-border/50"}`}>
                  <CardHeader className="py-2.5 px-6 flex flex-row items-center justify-between border-b border-border/10 bg-muted/20">
                    <div className="flex items-center gap-2">
                      <code className="text-[10px] font-mono bg-white px-2 py-0.5 rounded border border-border/30 text-primary/70">
                        {key}
                      </code>
                      {hasOverride && (
                        <span className="text-[9px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded uppercase font-bold tracking-tight">
                          Overridden
                        </span>
                      )}
                    </div>
                    {isModified && (
                      <span className="text-[9px] bg-orange-100 text-orange-700 px-1.5 py-0.5 rounded uppercase font-bold tracking-tight">
                        Unsaved Changes
                      </span>
                    )}
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="grid lg:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">English Content</Label>
                        <Textarea 
                          value={currentEn} 
                          onChange={e => handleUpdate(key, "en", e.target.value)}
                          className="min-h-[80px] text-sm resize-y bg-white/50 border-border/40 focus:bg-white"
                        />
                        {!hasOverride && defaults.en[key] && (
                          <p className="text-[10px] text-muted-foreground italic truncate">Default: {defaults.en[key]}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Urdu (اردو)</Label>
                        <Textarea 
                          value={currentUr} 
                          onChange={e => handleUpdate(key, "ur", e.target.value)}
                          dir="rtl"
                          className="min-h-[80px] text-lg font-arabic leading-relaxed text-right bg-white/50 border-border/40 focus:bg-white"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
            
            {filteredKeys.length > 50 && (
              <div className="p-10 text-center bg-white/50 rounded-2xl border border-dashed border-border/60">
                <p className="text-muted-foreground text-sm">Showing first 50 results. Use search or tabs to find specific content.</p>
              </div>
            )}

            {filteredKeys.length === 0 && (
              <div className="p-20 text-center bg-white rounded-2xl border border-border/40">
                <AlertCircle className="w-10 h-10 text-muted-foreground/30 mx-auto mb-4" />
                <p className="text-muted-foreground font-medium">No results found for "{search}"</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
