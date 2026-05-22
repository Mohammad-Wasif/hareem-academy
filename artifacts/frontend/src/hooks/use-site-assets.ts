import { useQuery } from "@tanstack/react-query";

export interface SiteAsset {
  key: string;
  url: string;
  publicId: string;
  updatedAt?: string;
}

export function useSiteAssets() {
  const { data, isLoading, error, refetch } = useQuery<SiteAsset[]>({
    queryKey: ["site-assets"],
    queryFn: async () => {
      const baseUrl = import.meta.env.VITE_API_URL || "";
      const response = await fetch(`${baseUrl}/api/site-assets`);
      if (!response.ok) {
        throw new Error("Failed to fetch site assets");
      }
      return response.json();
    },
  });

  // Convert to key-value record for rapid lookup
  const assetsRecord: Record<string, string> = {};
  const assetsMetadataRecord: Record<string, SiteAsset> = {};
  if (data) {
    for (const asset of data) {
      assetsRecord[asset.key] = asset.url;
      assetsMetadataRecord[asset.key] = asset;
    }
  }

  return {
    assets: assetsRecord,
    assetsMetadata: assetsMetadataRecord,
    assetsArray: data || [],
    isLoading,
    error,
    refetch,
  };
}
