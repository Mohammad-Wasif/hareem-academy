export interface CountryItem {
  name: string;
  code: string;
  isoCode: string;
  flag: string;
}

/**
 * Priority and popular countries for Hareem Academy students.
 * Static lightweight dataset (< 5 KB) replacing the 8.75 MB country-state-city dependency.
 */
export const ALL_COUNTRIES: CountryItem[] = [
  // Priority countries explicitly requested
  { name: "India", code: "+91", isoCode: "IN", flag: "🇮🇳" },
  { name: "United Arab Emirates", code: "+971", isoCode: "AE", flag: "🇦🇪" },
  { name: "Saudi Arabia", code: "+966", isoCode: "SA", flag: "🇸🇦" },
  { name: "United Kingdom", code: "+44", isoCode: "GB", flag: "🇬🇧" },
  { name: "United States", code: "+1", isoCode: "US", flag: "🇺🇸" },
  { name: "Canada", code: "+1", isoCode: "CA", flag: "🇨🇦" },
  { name: "Qatar", code: "+974", isoCode: "QA", flag: "🇶🇦" },
  { name: "Oman", code: "+968", isoCode: "OM", flag: "🇴🇲" },
  { name: "Kuwait", code: "+965", isoCode: "KW", flag: "🇰🇼" },

  // Additional key diaspora & regional countries
  { name: "Bahrain", code: "+973", isoCode: "BH", flag: "🇧🇭" },
  { name: "Pakistan", code: "+92", isoCode: "PK", flag: "🇵🇰" },
  { name: "Bangladesh", code: "+880", isoCode: "BD", flag: "🇧🇩" },
  { name: "Malaysia", code: "+60", isoCode: "MY", flag: "🇲🇾" },
  { name: "Singapore", code: "+65", isoCode: "SG", flag: "🇸🇬" },
  { name: "Australia", code: "+61", isoCode: "AU", flag: "🇦🇺" },
  { name: "Germany", code: "+49", isoCode: "DE", flag: "🇩🇪" },
  { name: "New Zealand", code: "+64", isoCode: "NZ", flag: "🇳🇿" },
  { name: "South Africa", code: "+27", isoCode: "ZA", flag: "🇿🇦" },
  { name: "Ireland", code: "+353", isoCode: "IE", flag: "🇮🇪" },
  { name: "Turkey", code: "+90", isoCode: "TR", flag: "🇹🇷" },
  { name: "Egypt", code: "+20", isoCode: "EG", flag: "🇪🇬" },
  { name: "Jordan", code: "+962", isoCode: "JO", flag: "🇯🇴" },
  { name: "Indonesia", code: "+62", isoCode: "ID", flag: "🇮🇩" },
  { name: "France", code: "+33", isoCode: "FR", flag: "🇫🇷" },
  { name: "Italy", code: "+39", isoCode: "IT", flag: "🇮🇹" },
  { name: "Netherlands", code: "+31", isoCode: "NL", flag: "🇳🇱" },
  { name: "Sweden", code: "+46", isoCode: "SE", flag: "🇸🇪" },
  { name: "Norway", code: "+47", isoCode: "NO", flag: "🇳🇴" },
  { name: "Switzerland", code: "+41", isoCode: "CH", flag: "🇨🇭" },
  { name: "Belgium", code: "+32", isoCode: "BE", flag: "🇧🇪" },
  { name: "Kenya", code: "+254", isoCode: "KE", flag: "🇰🇪" },
  { name: "Nigeria", code: "+234", isoCode: "NG", flag: "🇳🇬" },
  { name: "Sri Lanka", code: "+94", isoCode: "LK", flag: "🇱🇰" },
  { name: "Nepal", code: "+977", isoCode: "NP", flag: "🇳🇵" },
];

export const CALLING_CODES = (() => {
  const seen = new Set<string>();
  const list: { code: string; label: string; flag: string; countryName: string; isoCode: string }[] = [];

  for (const c of ALL_COUNTRIES) {
    if (!c.code || c.code === "+") continue;
    const key = `${c.code}-${c.isoCode}`;
    if (!seen.has(key)) {
      seen.add(key);
      list.push({
        code: c.code,
        label: `${c.code} (${c.name})`,
        flag: c.flag,
        countryName: c.name,
        isoCode: c.isoCode,
      });
    }
  }
  return list;
})();

export interface StateItem {
  name: string;
  isoCode: string;
  countryCode: string;
}

const STATES_BY_COUNTRY: Record<string, string[]> = {
  IN: [
    "Andhra Pradesh", "Assam", "Bihar", "Chandigarh", "Chhattisgarh", "Delhi",
    "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jammu and Kashmir",
    "Jharkhand", "Karnataka", "Kerala", "Ladakh", "Madhya Pradesh", "Maharashtra",
    "Manipur", "Meghalaya", "Odisha", "Punjab", "Rajasthan", "Tamil Nadu",
    "Telangana", "Uttar Pradesh", "Uttarakhand", "West Bengal",
  ],
  AE: [
    "Abu Dhabi", "Ajman", "Dubai", "Fujairah", "Ras Al Khaimah", "Sharjah", "Umm Al Quwain",
  ],
  SA: [
    "Al Bahah", "Al Jawf", "Al Madinah", "Al Qasim", "Asir", "Eastern Province",
    "Ha'il", "Jazan", "Makkah", "Najran", "Northern Borders", "Riyadh", "Tabuk",
  ],
  US: [
    "California", "Texas", "Florida", "New York", "Illinois", "Pennsylvania",
    "Ohio", "Georgia", "North Carolina", "Michigan", "New Jersey", "Virginia",
    "Washington", "Massachusetts", "Indiana", "Maryland", "Missouri", "Wisconsin",
  ],
  CA: [
    "Alberta", "British Columbia", "Manitoba", "New Brunswick", "Newfoundland and Labrador",
    "Nova Scotia", "Ontario", "Prince Edward Island", "Quebec", "Saskatchewan",
  ],
  GB: [
    "England", "Scotland", "Wales", "Northern Ireland", "Greater London", "West Midlands", "Greater Manchester",
  ],
  AU: [
    "New South Wales", "Victoria", "Queensland", "Western Australia", "South Australia", "Tasmania", "Australian Capital Territory",
  ],
};

export function getStatesByCountry(countryNameOrIso: string): StateItem[] {
  if (!countryNameOrIso) return [];
  const query = countryNameOrIso.trim().toLowerCase();
  const found = ALL_COUNTRIES.find(
    (c) => c.isoCode.toLowerCase() === query || c.name.toLowerCase() === query,
  );
  if (!found) return [];

  const raw = STATES_BY_COUNTRY[found.isoCode] || [];
  return raw.map((s) => ({
    name: s,
    isoCode: s,
    countryCode: found.isoCode,
  }));
}

export interface CountryCityData {
  majorCities: string[];
  allCities: string[];
  totalCount: number;
}

export function getCountryCityData(_countryNameOrIso?: string, _stateNameOrCode?: string): CountryCityData {
  return { majorCities: [], allCities: [], totalCount: 0 };
}

export function getCitiesByCountry(_countryNameOrIso?: string, _stateNameOrCode?: string): string[] {
  return [];
}

export interface CountryPhoneRule {
  min: number;
  max: number;
  exact?: number;
  example: string;
}

/**
 * National significant phone number lengths (excluding country calling code)
 * tailored for popular countries where sisters register.
 */
export const COUNTRY_PHONE_RULES: Record<string, CountryPhoneRule> = {
  IN: { min: 10, max: 10, exact: 10, example: "98765 43210 (10 digits)" },
  US: { min: 10, max: 10, exact: 10, example: "415 555 2671 (10 digits)" },
  CA: { min: 10, max: 10, exact: 10, example: "416 555 0199 (10 digits)" },
  GB: { min: 10, max: 10, exact: 10, example: "7911 123456 (10 digits)" },
  AU: { min: 9, max: 9, exact: 9, example: "412 345 678 (9 digits)" },
  AE: { min: 9, max: 9, exact: 9, example: "50 123 4567 (9 digits)" },
  SA: { min: 9, max: 9, exact: 9, example: "50 123 4567 (9 digits)" },
  QA: { min: 8, max: 8, exact: 8, example: "3312 3456 (8 digits)" },
  KW: { min: 8, max: 8, exact: 8, example: "9876 5432 (8 digits)" },
  OM: { min: 8, max: 8, exact: 8, example: "9123 4567 (8 digits)" },
  BH: { min: 8, max: 8, exact: 8, example: "3912 3456 (8 digits)" },
  PK: { min: 10, max: 10, exact: 10, example: "300 1234567 (10 digits)" },
  BD: { min: 10, max: 10, exact: 10, example: "1712 345678 (10 digits)" },
  MY: { min: 9, max: 10, example: "12 345 6789 (9-10 digits)" },
  SG: { min: 8, max: 8, exact: 8, example: "9123 4567 (8 digits)" },
  NZ: { min: 8, max: 10, example: "21 123 4567 (8-10 digits)" },
  ZA: { min: 9, max: 9, exact: 9, example: "82 123 4567 (9 digits)" },
  DE: { min: 10, max: 11, example: "151 12345678 (10-11 digits)" },
  IE: { min: 9, max: 9, exact: 9, example: "85 123 4567 (9 digits)" },
  TR: { min: 10, max: 10, exact: 10, example: "532 123 4567 (10 digits)" },
  EG: { min: 10, max: 10, exact: 10, example: "10 1234 5678 (10 digits)" },
  FR: { min: 9, max: 9, exact: 9, example: "6 12 34 56 78 (9 digits)" },
  IT: { min: 9, max: 10, example: "330 1234567 (9-10 digits)" },
  ES: { min: 9, max: 9, exact: 9, example: "612 345 678 (9 digits)" },
  NL: { min: 9, max: 9, exact: 9, example: "6 12345678 (9 digits)" },
  SE: { min: 9, max: 9, exact: 9, example: "70 123 45 67 (9 digits)" },
  NO: { min: 8, max: 8, exact: 8, example: "412 34 567 (8 digits)" },
  DK: { min: 8, max: 8, exact: 8, example: "20 12 34 56 (8 digits)" },
  FI: { min: 9, max: 10, example: "40 123 4567 (9-10 digits)" },
  CH: { min: 9, max: 9, exact: 9, example: "79 123 45 67 (9 digits)" },
  AT: { min: 10, max: 11, example: "664 1234567 (10-11 digits)" },
  BE: { min: 9, max: 9, exact: 9, example: "470 12 34 56 (9 digits)" },
  JO: { min: 9, max: 9, exact: 9, example: "7 9123 4567 (9 digits)" },
  LB: { min: 7, max: 8, example: "70 123 456 (7-8 digits)" },
  LK: { min: 9, max: 9, exact: 9, example: "71 234 5678 (9 digits)" },
  NP: { min: 10, max: 10, exact: 10, example: "984 1234567 (10 digits)" },
  NG: { min: 10, max: 10, exact: 10, example: "802 123 4567 (10 digits)" },
  KE: { min: 9, max: 9, exact: 9, example: "712 345 678 (9 digits)" },
  ID: { min: 9, max: 12, example: "812 3456 7890 (9-12 digits)" },
  PH: { min: 10, max: 10, exact: 10, example: "917 123 4567 (10 digits)" },
};

export function getPhoneRule(isoCodeOrCountryCode?: string): CountryPhoneRule {
  if (!isoCodeOrCountryCode) {
    return { min: 7, max: 15, example: "phone number without country code" };
  }
  const clean = isoCodeOrCountryCode.trim().toUpperCase();
  if (COUNTRY_PHONE_RULES[clean]) {
    return COUNTRY_PHONE_RULES[clean];
  }
  // Try matching by calling code (e.g. "+91")
  const found = CALLING_CODES.find((c) => c.code === isoCodeOrCountryCode || c.isoCode === clean);
  if (found && COUNTRY_PHONE_RULES[found.isoCode]) {
    return COUNTRY_PHONE_RULES[found.isoCode];
  }
  return { min: 7, max: 15, example: "phone number (7-15 digits)" };
}
