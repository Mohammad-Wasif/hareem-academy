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
