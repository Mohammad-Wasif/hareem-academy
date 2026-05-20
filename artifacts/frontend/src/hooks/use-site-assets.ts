import { useQuery } from "@tanstack/react-query";

export interface SiteAsset {
  key: string;
  url: string;
  publicId: string;
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
  if (data) {
    for (const asset of data) {
      assetsRecord[asset.key] = asset.url;
    }
  }

  return {
    assets: assetsRecord,
    assetsArray: data || [],
    isLoading,
    error,
    refetch,
  };
}
