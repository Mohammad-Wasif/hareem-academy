import React, { createContext, useContext, useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";

export interface SiteAsset {
  key: string;
  url: string;
  publicId: string;
  title?: string | null;
  description?: string | null;
  altText?: string | null;
  tags?: string | null;
  updatedAt?: string;
}

interface MediaContextType {
  assets: Record<string, string>;
  assetsMetadata: Record<string, SiteAsset>;
  assetsArray: SiteAsset[];
  isLoading: boolean;
  isVerifyingFreshness: boolean;
  error: Error | null;
  refetch: () => void;
}

const MediaContext = createContext<MediaContextType | null>(null);

export function MediaProvider({ children }: { children: React.ReactNode }) {
  const [cachedData] = useState<SiteAsset[] | undefined>(() => {
    try {
      const saved = localStorage.getItem("hareem_site_assets");
      return saved ? JSON.parse(saved) : undefined;
    } catch {
      return undefined;
    }
  });

  const { data, isLoading, isFetching, error, refetch } = useQuery<SiteAsset[]>({
    queryKey: ["site-assets"],
    queryFn: async () => {
      const baseUrl = import.meta.env.VITE_API_URL || "";
      const response = await fetch(`${baseUrl}/api/site-assets`);
      if (!response.ok) {
        throw new Error("Failed to fetch site assets");
      }
      const json = await response.json();
      try {
        localStorage.setItem("hareem_site_assets", JSON.stringify(json));
      } catch (e) {
        console.error("Failed to write assets to localStorage", e);
      }
      return json;
    },
    initialData: cachedData,
    staleTime: 1000 * 60 * 10, // 10 minutes cache
    refetchOnWindowFocus: false,
  });

  const [isVerifyingFreshness, setIsVerifyingFreshness] = useState(() => !cachedData);

  useEffect(() => {
    // When the initial or background query completes fetching, we confirm freshness validation
    if (!isFetching) {
      setIsVerifyingFreshness(false);
    }
  }, [isFetching]);

  // Convert to key-value record for rapid lookup
  const assetsRecord: Record<string, string> = {};
  const assetsMetadataRecord: Record<string, SiteAsset> = {};
  if (data) {
    for (const asset of data) {
      assetsRecord[asset.key] = asset.url;
      assetsMetadataRecord[asset.key] = asset;
    }
  }

  return (
    <MediaContext.Provider
      value={{
        assets: assetsRecord,
        assetsMetadata: assetsMetadataRecord,
        assetsArray: data || [],
        isLoading,
        isVerifyingFreshness,
        error: error as Error | null,
        refetch,
      }}
    >
      {children}
    </MediaContext.Provider>
  );
}

export function useSiteAssets() {
  const context = useContext(MediaContext);
  if (!context) {
    throw new Error("useSiteAssets must be used within a MediaProvider");
  }
  return context;
}
