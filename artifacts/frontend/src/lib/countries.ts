import { Country, State, City, type ICountry } from "country-state-city";

export interface CountryItem {
  name: string;
  code: string;
  isoCode: string;
  flag: string;
}

const PRIORITY_ISO_CODES = [
  "IN", // India
  "AE", // United Arab Emirates
  "SA", // Saudi Arabia
  "GB", // United Kingdom
  "US", // United States
  "CA", // Canada
  "QA", // Qatar
  "KW", // Kuwait
  "OM", // Oman
  "BH", // Bahrain
  "PK", // Pakistan
  "BD", // Bangladesh
  "MY", // Malaysia
  "SG", // Singapore
  "AU", // Australia
  "DE", // Germany
  "ZA", // South Africa
  "NZ", // New Zealand
  "TR", // Turkey
  "IE", // Ireland
];

export const MAJOR_CITIES_BY_COUNTRY: Record<string, string[]> = {
  India: [
    "Delhi",
    "New Delhi",
    "Mumbai",
    "Bengaluru",
    "Hyderabad",
    "Chennai",
    "Kolkata",
    "Lucknow",
    "Pune",
    "Ahmedabad",
    "Srinagar",
    "Jaipur",
    "Patna",
    "Bhopal",
    "Chandigarh",
    "Aligarh",
    "Calicut",
    "Kochi",
    "Kanpur",
    "Nagpur",
    "Indore",
    "Varanasi",
    "Agra",
    "Surat",
    "Meerut",
    "Bareilly",
    "Ranchi",
    "Guwahati",
    "Amritsar",
    "Ludhiana",
    "Coimbatore",
    "Madurai",
    "Mysuru",
    "Mangalore",
    "Thiruvananthapuram",
  ],
  "United Arab Emirates": [
    "Dubai",
    "Abu Dhabi",
    "Sharjah",
    "Ajman",
    "Ras Al Khaimah",
    "Fujairah",
    "Al Ain",
    "Umm Al Quwain",
  ],
  "Saudi Arabia": [
    "Riyadh",
    "Jeddah",
    "Mecca",
    "Medina",
    "Dammam",
    "Khobar",
    "Dhahran",
    "Tabuk",
    "Taif",
    "Jubail",
    "Abha",
    "Yanbu",
  ],
  "United Kingdom": [
    "London",
    "Birmingham",
    "Manchester",
    "Leeds",
    "Glasgow",
    "Bradford",
    "Leicester",
    "Luton",
    "Cardiff",
    "Sheffield",
    "Bristol",
    "Coventry",
    "Slough",
    "Blackburn",
  ],
  "United States": [
    "New York",
    "Chicago",
    "Houston",
    "Dallas",
    "Los Angeles",
    "Atlanta",
    "Detroit",
    "Washington D.C.",
    "Philadelphia",
    "San Francisco",
    "Boston",
    "Seattle",
    "Austin",
    "Minneapolis",
  ],
  Canada: [
    "Toronto",
    "Mississauga",
    "Calgary",
    "Vancouver",
    "Ottawa",
    "Montreal",
    "Edmonton",
    "Brampton",
    "Hamilton",
    "Winnipeg",
  ],
  Qatar: ["Doha", "Al Rayyan", "Al Wakrah", "Al Khor", "Lusail"],
  Kuwait: [
    "Kuwait City",
    "Hawalli",
    "Salmiya",
    "Al Ahmadi",
    "Farwaniya",
    "Jahra",
    "Fahaheel",
  ],
  Oman: ["Muscat", "Salalah", "Seeb", "Sohar", "Nizwa", "Barka"],
  Bahrain: ["Manama", "Riffa", "Muharraq", "Hamad Town", "Isa Town"],
  Pakistan: [
    "Karachi",
    "Lahore",
    "Islamabad",
    "Rawalpindi",
    "Faisalabad",
    "Peshawar",
    "Multan",
    "Gujranwala",
    "Quetta",
    "Sialkot",
  ],
  Bangladesh: [
    "Dhaka",
    "Chittagong",
    "Sylhet",
    "Rajshahi",
    "Khulna",
    "Comilla",
  ],
  Malaysia: [
    "Kuala Lumpur",
    "Penang",
    "Johor Bahru",
    "Shah Alam",
    "Malacca",
    "Petaling Jaya",
  ],
  Singapore: ["Singapore"],
  Australia: [
    "Sydney",
    "Melbourne",
    "Brisbane",
    "Perth",
    "Adelaide",
    "Canberra",
  ],
  Germany: [
    "Berlin",
    "Munich",
    "Frankfurt",
    "Hamburg",
    "Cologne",
    "Düsseldorf",
  ],
  Turkey: ["Istanbul", "Ankara", "Izmir", "Bursa", "Antalya", "Adana", "Konya"],
  Egypt: ["Cairo", "Alexandria", "Giza", "Port Said", "Suez", "Luxor", "Aswan"],
  "South Africa": [
    "Johannesburg",
    "Cape Town",
    "Durban",
    "Pretoria",
    "Port Elizabeth",
  ],
  "New Zealand": ["Auckland", "Wellington", "Christchurch", "Hamilton", "Tauranga"],
  Ireland: ["Dublin", "Cork", "Galway", "Limerick", "Waterford"],
  Jordan: ["Amman", "Zarqa", "Irbid", "Aqaba"],
};

export const ALL_COUNTRIES: CountryItem[] = (() => {
  const raw = Country.getAllCountries();
  const map = new Map<string, ICountry>(raw.map((c) => [c.isoCode, c]));

  const priorityList: CountryItem[] = [];
  for (const iso of PRIORITY_ISO_CODES) {
    const c = map.get(iso);
    if (c) {
      priorityList.push({
        name: c.name,
        code: `+${c.phonecode.replace(/^\+/, "")}`,
        isoCode: c.isoCode,
        flag: c.flag,
      });
      map.delete(iso);
    }
  }

  const remaining: CountryItem[] = Array.from(map.values())
    .map((c) => ({
      name: c.name,
      code: `+${c.phonecode.replace(/^\+/, "")}`,
      isoCode: c.isoCode,
      flag: c.flag,
    }))
    .sort((a, b) => a.name.localeCompare(b.name));

  return [...priorityList, ...remaining];
})();

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

export function getStatesByCountry(countryNameOrIso: string): StateItem[] {
  if (!countryNameOrIso) return [];
  const query = countryNameOrIso.trim().toLowerCase();
  const found = ALL_COUNTRIES.find(
    (c) => c.isoCode.toLowerCase() === query || c.name.toLowerCase() === query,
  );
  if (!found) return [];

  const rawStates = State.getStatesOfCountry(found.isoCode) || [];
  return rawStates
    .map((s) => ({
      name: s.name,
      isoCode: s.isoCode,
      countryCode: s.countryCode,
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

export interface CountryCityData {
  majorCities: string[];
  allCities: string[];
  totalCount: number;
}

export function getCountryCityData(
  countryNameOrIso: string,
  stateNameOrCode?: string,
): CountryCityData {
  if (!countryNameOrIso) return { majorCities: [], allCities: [], totalCount: 0 };
  const query = countryNameOrIso.trim().toLowerCase();
  const found = ALL_COUNTRIES.find(
    (c) => c.isoCode.toLowerCase() === query || c.name.toLowerCase() === query,
  );
  if (!found) return { majorCities: [], allCities: [], totalCount: 0 };

  // If a specific state is selected, fetch cities of that state
  if (stateNameOrCode && stateNameOrCode.trim()) {
    const sQuery = stateNameOrCode.trim().toLowerCase();
    const states = State.getStatesOfCountry(found.isoCode) || [];
    const matchedState = states.find(
      (s) => s.isoCode.toLowerCase() === sQuery || s.name.toLowerCase() === sQuery,
    );
    if (matchedState) {
      const stateCities = City.getCitiesOfState(found.isoCode, matchedState.isoCode) || [];
      const uniqueNames = Array.from(new Set(stateCities.map((c) => c.name))).filter(Boolean);
      uniqueNames.sort((a, b) => a.localeCompare(b));

      const countryMajor = MAJOR_CITIES_BY_COUNTRY[found.name] || [];
      const stateMajor = countryMajor.filter((m) =>
        uniqueNames.some((c) => c.toLowerCase() === m.toLowerCase()),
      );

      return {
        majorCities: stateMajor,
        allCities: uniqueNames,
        totalCount: uniqueNames.length,
      };
    }
  }

  // Fallback: all cities of the country
  const rawCities = City.getCitiesOfCountry(found.isoCode) || [];
  const uniqueNames = Array.from(new Set(rawCities.map((c) => c.name))).filter(Boolean);
  uniqueNames.sort((a, b) => a.localeCompare(b));

  const major = MAJOR_CITIES_BY_COUNTRY[found.name] || [];
  return {
    majorCities: major,
    allCities: uniqueNames,
    totalCount: uniqueNames.length,
  };
}

export function getCitiesByCountry(countryNameOrIso: string, stateNameOrCode?: string): string[] {
  const data = getCountryCityData(countryNameOrIso, stateNameOrCode);
  if (data.majorCities.length > 0) {
    const majorSet = new Set(data.majorCities.map((m) => m.toLowerCase()));
    const otherCities = data.allCities.filter((c) => !majorSet.has(c.toLowerCase()));
    return [...data.majorCities, ...otherCities];
  }
  return data.allCities;
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
