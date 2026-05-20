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
import { Loader2, Save, Search, AlertCircle } from "lucide-react";
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

  if (isLoading) {
    return (
      <div className="py-16 flex justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  const changeCount = Object.keys(pendingChanges).length;

  return (
    <div className="space-y-6 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 sticky top-0 z-10 bg-[#FAF7F0]/80 backdrop-blur-md py-4 border-b border-border/20">
        <div>
          <h1 className="font-serif text-3xl text-primary font-bold">Site Content</h1>
          <p className="text-muted-foreground mt-1">
            Edit text across the homepage and main pages.
          </p>
        </div>
        <div className="flex gap-3">
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
                      className="min-h-[80px] text-sm resize-y"
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
                      className="min-h-[80px] text-lg font-arabic leading-relaxed text-right"
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
  );
}
