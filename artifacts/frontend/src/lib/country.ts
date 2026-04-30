const FLAG_MAP: Record<string, string> = {
  india: "🇮🇳",
  pakistan: "🇵🇰",
  uk: "🇬🇧",
  "united kingdom": "🇬🇧",
  england: "🇬🇧",
  usa: "🇺🇸",
  us: "🇺🇸",
  "united states": "🇺🇸",
  america: "🇺🇸",
  canada: "🇨🇦",
  uae: "🇦🇪",
  dubai: "🇦🇪",
  "abu dhabi": "🇦🇪",
  "saudi arabia": "🇸🇦",
  ksa: "🇸🇦",
  riyadh: "🇸🇦",
  jeddah: "🇸🇦",
  qatar: "🇶🇦",
  bahrain: "🇧🇭",
  kuwait: "🇰🇼",
  oman: "🇴🇲",
  australia: "🇦🇺",
  germany: "🇩🇪",
  france: "🇫🇷",
  malaysia: "🇲🇾",
  singapore: "🇸🇬",
  indonesia: "🇮🇩",
  bangladesh: "🇧🇩",
  turkey: "🇹🇷",
  egypt: "🇪🇬",
  morocco: "🇲🇦",
  "south africa": "🇿🇦",
  nigeria: "🇳🇬",
};

export function getFlag(location: string | null | undefined): string {
  if (!location) return "🌍";
  const lower = location.toLowerCase();
  for (const [key, flag] of Object.entries(FLAG_MAP)) {
    if (lower.includes(key)) return flag;
  }
  return "🌍";
}

const AVATAR_PALETTE = [
  { bg: "bg-primary/15", text: "text-primary" },
  { bg: "bg-accent/30", text: "text-accent-foreground" },
  { bg: "bg-emerald-100", text: "text-emerald-700" },
  { bg: "bg-amber-100", text: "text-amber-800" },
  { bg: "bg-rose-100", text: "text-rose-700" },
  { bg: "bg-sky-100", text: "text-sky-700" },
];

export function getInitials(name: string): string {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0]!.slice(0, 2).toUpperCase();
  return (parts[0]![0]! + parts[parts.length - 1]![0]!).toUpperCase();
}

export function getAvatarColor(seed: string) {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) hash = (hash * 31 + seed.charCodeAt(i)) | 0;
  return AVATAR_PALETTE[Math.abs(hash) % AVATAR_PALETTE.length]!;
}
