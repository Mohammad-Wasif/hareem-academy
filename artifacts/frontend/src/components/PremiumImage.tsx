import { useState, useEffect } from "react";
import { useSiteAssets } from "@/hooks/use-site-assets";
import { ImageOff, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface PremiumImageProps {
  assetKey: string;
  fallback: string;
  alt: string;
  className?: string;
  width?: number; // Target width for Cloudinary scaling
  aspectRatio?: string; // CSS aspect-ratio class (e.g. aspect-[16/9])
  widthClass?: string; // Width class (e.g. w-full)
  heightClass?: string; // Height class (e.g. h-auto, h-40)
  roundedClass?: string; // Rounded class (e.g. rounded-xl, rounded-full)
  bgClass?: string; // Background class for loader/skeleton container
  objectFit?: "cover" | "contain";
  fetchPriority?: "high" | "low" | "auto";
}

export default function PremiumImage({
  assetKey,
  fallback,
  alt,
  className = "",
  width,
  aspectRatio = "",
  widthClass = "w-full",
  heightClass = "h-auto",
  roundedClass = "rounded-xl",
  bgClass = "bg-[#FAF7F0]/40",
  objectFit = "cover",
  fetchPriority = "auto",
}: PremiumImageProps) {
  const { assets, assetsMetadata, isVerifyingFreshness } = useSiteAssets();
  const [currentSrc, setCurrentSrc] = useState<string | null>(null);
  const [blurSrc, setBlurSrc] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Helper to inject Cloudinary optimization and scaling
  const getOptimizedUrl = (rawUrl: string, targetWidth?: number, isBlur = false) => {
    if (!rawUrl || rawUrl.startsWith("data:") || rawUrl.startsWith("blob:")) {
      return rawUrl;
    }

    if (rawUrl.includes("res.cloudinary.com")) {
      const parts = rawUrl.split("/upload/");
      if (parts.length === 2) {
        let transformation = "";
        if (isBlur) {
          transformation = "w_40,q_20,e_blur:1500,f_auto";
        } else {
          transformation = targetWidth
            ? `f_auto,q_auto,w_${targetWidth}`
            : "f_auto,q_auto";
        }
        return `${parts[0]}/upload/${transformation}/${parts[1]}`;
      }
    }
    return rawUrl;
  };

  // Helper to apply updatedAt version parameter
  const getVersionedUrl = (url: string, updatedAt?: string) => {
    if (!url || url.startsWith("data:") || url.startsWith("blob:")) return url;
    const version = updatedAt ? new Date(updatedAt).getTime() : "";
    if (!version) return url;
    return url.includes("?") ? `${url}&v=${version}` : `${url}?v=${version}`;
  };

  useEffect(() => {
    // If the freshness check is still resolving, we stay in the loading state
    if (isVerifyingFreshness) {
      setIsLoaded(false);
      return;
    }

    const rawUrl = assets[assetKey] || fallback;
    const updatedAt = assetsMetadata[assetKey]?.updatedAt;

    const finalSrc = getVersionedUrl(getOptimizedUrl(rawUrl, width, false), updatedAt);
    const lowResSrc = getVersionedUrl(getOptimizedUrl(rawUrl, 40, true), updatedAt);

    setBlurSrc(lowResSrc);
    setHasError(false);

    // Preload high-res image
    const img = new Image();
    img.src = finalSrc;
    img.onload = () => {
      setCurrentSrc(finalSrc);
      setIsLoaded(true);
    };
    img.onerror = () => {
      // Fallback directly
      setCurrentSrc(finalSrc);
      setIsLoaded(true);
      setHasError(true);
    };
  }, [assetKey, assets, assetsMetadata, isVerifyingFreshness, fallback, width]);

  // Combined styling for dimension stability
  const containerClasses = `relative overflow-hidden select-none ${bgClass} ${roundedClass} ${widthClass} ${heightClass} ${aspectRatio}`;

  // 1. Shimmer Skeleton State (Initial fresh-asset verification or Loading)
  if (isVerifyingFreshness || (!currentSrc && !hasError)) {
    return (
      <div className={containerClasses} aria-hidden="true">
        {/* Shimmer background animation */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/[0.04] to-transparent animate-pulse" />
        <div className="absolute inset-0 flex items-center justify-center text-primary/10">
          <Sparkles className="w-5 h-5 animate-pulse" />
        </div>
      </div>
    );
  }

  // 2. Error Fallback State
  if (hasError) {
    return (
      <div className={`${containerClasses} flex flex-col items-center justify-center border border-border border-dashed p-4`}>
        <ImageOff className="w-6 h-6 text-muted-foreground/50 mb-1" />
        <span className="text-[10px] font-sans font-medium text-muted-foreground/60 text-center uppercase tracking-wider">
          Failed to load asset
        </span>
      </div>
    );
  }

  return (
    <div className={containerClasses}>
      {/* 3. Blur-up Low-res Placeholder (renders immediately under full image) */}
      {blurSrc && !isLoaded && (
        <img
          src={blurSrc}
          alt=""
          className={`absolute inset-0 w-full h-full filter blur-[10px] scale-110 opacity-70 transition-opacity duration-300 ${
            objectFit === "contain" ? "object-contain" : "object-cover"
          } ${className}`}
        />
      )}

      {/* 4. Final High-res Image */}
      {currentSrc && (
        <img
          src={currentSrc}
          alt={alt}
          fetchpriority={fetchPriority}
          className={`absolute inset-0 w-full h-full transition-opacity duration-500 ease-out ${
            isLoaded ? "opacity-100" : "opacity-0"
          } ${
            objectFit === "contain" ? "object-contain" : "object-cover"
          } ${className}`}
        />
      )}
    </div>
  );
}
