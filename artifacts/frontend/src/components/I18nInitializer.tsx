import { useEffect } from "react";
import { useGetSiteContent, getGetSiteContentQueryKey } from "@workspace/api-client-react";
import i18n from "@/lib/i18n";

function setNestedKey(obj: any, path: string, value: any) {
  const keys = path.split(".");
  let current = obj;
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    if (!(key in current)) current[key] = {};
    current = current[key];
  }
  current[keys[keys.length - 1]] = value;
}

export function I18nInitializer({ children }: { children: React.ReactNode }) {
  const { data: siteContent } = useGetSiteContent({
    query: {
      queryKey: getGetSiteContentQueryKey(),
      staleTime: Infinity,
    },
  });

  useEffect(() => {
    if (siteContent && siteContent.length > 0) {
      const bundles: Record<string, any> = { en: {}, ur: {}, ar: {} };

      siteContent.forEach((item) => {
        if (item.en) setNestedKey(bundles.en, item.key, item.en);
        if (item.ur) setNestedKey(bundles.ur, item.key, item.ur);
        if (item.ar) setNestedKey(bundles.ar, item.key, item.ar);
      });

      Object.entries(bundles).forEach(([lng, bundle]) => {
        if (Object.keys(bundle).length > 0) {
          // deep=true, overwrite=true
          i18n.addResourceBundle(lng, "translation", bundle, true, true);
        }
      });

      // Force a re-render/refresh of the current language if needed
      // i18n.changeLanguage(i18n.language); 
      // But addResourceBundle usually triggers an update in react-i18next
    }
  }, [siteContent]);

  return <>{children}</>;
}
