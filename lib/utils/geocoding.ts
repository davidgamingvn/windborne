"use client";

import * as turf from "@turf/turf";

// Convert ISO country code to flag emoji
function countryCodeToEmoji(countryCode: string): string {
  if (!countryCode || countryCode.length !== 2) return "";
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
}

// ISO country code to flag emoji mapping
const COUNTRY_FLAGS: Record<string, string> = {
  US: "🇺🇸",
  GB: "🇬🇧",
  CA: "🇨🇦",
  AU: "🇦🇺",
  JP: "🇯🇵",
  CN: "🇨🇳",
  IN: "🇮🇳",
  BR: "🇧🇷",
  MX: "🇲🇽",
  DE: "🇩🇪",
  FR: "🇫🇷",
  IT: "🇮🇹",
  ES: "🇪🇸",
  RU: "🇷🇺",
  KR: "🇰🇷",
  ZA: "🇿🇦",
  NZ: "🇳🇿",
  SG: "🇸🇬",
  SE: "🇸🇪",
  NO: "🇳🇴",
  DK: "🇩🇰",
  FI: "🇫🇮",
  NL: "🇳🇱",
  BE: "🇧🇪",
  CH: "🇨🇭",
  AT: "🇦🇹",
  PL: "🇵🇱",
  CZ: "🇨🇿",
  GR: "🇬🇷",
  PT: "🇵🇹",
  TR: "🇹🇷",
  SA: "🇸🇦",
  AE: "🇦🇪",
  IL: "🇮🇱",
  EG: "🇪🇬",
  NG: "🇳🇬",
  KE: "🇰🇪",
  TH: "🇹🇭",
  MY: "🇲🇾",
  ID: "🇮🇩",
  PH: "🇵🇭",
  VN: "🇻🇳",
  AR: "🇦🇷",
  CL: "🇨🇱",
  CO: "🇨🇴",
  PE: "🇵🇪",
  GH: "🇬🇭",
  IR: "🇮🇷",
  IQ: "🇮🇶",
  UA: "🇺🇦",
  HU: "🇭🇺",
  RO: "🇷🇴",
  BG: "🇧🇬",
  HR: "🇭🇷",
  IE: "🇮🇪",
  IS: "🇮🇸",
  LU: "🇱🇺",
  MT: "🇲🇹",
  CY: "🇨🇾",
  HK: "🇭🇰",
  TW: "🇹🇼",
  PK: "🇵🇰",
  BD: "🇧🇩",
  LK: "🇱🇰",
  MM: "🇲🇲",
  KH: "🇰🇭",
  LA: "🇱🇦",
  TZ: "🇹🇿",
  UG: "🇺🇬",
  ET: "🇪🇹",
  CM: "🇨🇲",
  CI: "🇨🇮",
  SN: "🇸🇳",
  AO: "🇦🇴",
  ZM: "🇿🇲",
  ZW: "🇿🇼",
  MZ: "🇲🇿",
  MW: "🇲🇼",
  BW: "🇧🇼",
  NA: "🇳🇦",
  LS: "🇱🇸",
  SZ: "🇸🇿",
  VE: "🇻🇪",
  EC: "🇪🇨",
  BO: "🇧🇴",
  PY: "🇵🇾",
  UY: "🇺🇾",
  CR: "🇨🇷",
  PA: "🇵🇦",
  JM: "🇯🇲",
  CU: "🇨🇺",
  DO: "🇩🇴",
  GT: "🇬🇹",
  HN: "🇭🇳",
  SV: "🇸🇻",
  NI: "🇳🇮",
  BZ: "🇧🇿",
  QA: "🇶🇦",
  OM: "🇴🇲",
  YE: "🇾🇪",
  JO: "🇯🇴",
  LB: "🇱🇧",
  SY: "🇸🇾",
  AF: "🇦🇫",
  UZ: "🇺🇿",
  TJ: "🇹🇯",
  TM: "🇹🇲",
  KG: "🇰🇬",
  KZ: "🇰🇿",
  MN: "🇲🇳",
  NP: "🇳🇵",
  BT: "🇧🇹",
  KW: "🇰🇼",
  BH: "🇧🇭",
  AZ: "🇦🇿",
  AM: "🇦🇲",
  GE: "🇬🇪",
  MD: "🇲🇩",
  BY: "🇧🇾",
};

// Country name to ISO code mapping
const COUNTRY_NAME_TO_CODE: Record<string, string> = {
  "United States": "US",
  "United States of America": "US",
  "United Kingdom": "GB",
  Canada: "CA",
  Australia: "AU",
  Japan: "JP",
  China: "CN",
  India: "IN",
  Brazil: "BR",
  Mexico: "MX",
  Germany: "DE",
  France: "FR",
  Italy: "IT",
  Spain: "ES",
  Russia: "RU",
  "South Korea": "KR",
  "South Africa": "ZA",
  "New Zealand": "NZ",
  Singapore: "SG",
  Sweden: "SE",
  Norway: "NO",
  Denmark: "DK",
  Finland: "FI",
  Netherlands: "NL",
  Belgium: "BE",
  Switzerland: "CH",
  Austria: "AT",
  Poland: "PL",
  "Czech Republic": "CZ",
  Greece: "GR",
  Portugal: "PT",
  Turkey: "TR",
  "Saudi Arabia": "SA",
  "United Arab Emirates": "AE",
  Israel: "IL",
  Egypt: "EG",
  Nigeria: "NG",
  Kenya: "KE",
  Thailand: "TH",
  Malaysia: "MY",
  Indonesia: "ID",
  Philippines: "PH",
  Vietnam: "VN",
  Argentina: "AR",
  Chile: "CL",
  Colombia: "CO",
  Peru: "PE",
  Ghana: "GH",
  Iran: "IR",
  Iraq: "IQ",
  Ukraine: "UA",
  Hungary: "HU",
  Romania: "RO",
  Bulgaria: "BG",
  Croatia: "HR",
  Ireland: "IE",
  Iceland: "IS",
  Luxembourg: "LU",
  Malta: "MT",
  Cyprus: "CY",
  "Hong Kong": "HK",
  Taiwan: "TW",
  Pakistan: "PK",
  Bangladesh: "BD",
  "Sri Lanka": "LK",
  Myanmar: "MM",
  Cambodia: "KH",
  Laos: "LA",
  Tanzania: "TZ",
  Uganda: "UG",
  Ethiopia: "ET",
  Cameroon: "CM",
  Senegal: "SN",
  Angola: "AO",
  Zambia: "ZM",
  Zimbabwe: "ZW",
  Mozambique: "MZ",
  Malawi: "MW",
  Botswana: "BW",
  Namibia: "NA",
  Lesotho: "LS",
  Eswatini: "SZ",
  Venezuela: "VE",
  Ecuador: "EC",
  Bolivia: "BO",
  Paraguay: "PY",
  Uruguay: "UY",
  "Costa Rica": "CR",
  Panama: "PA",
  Jamaica: "JM",
  Cuba: "CU",
  "Dominican Republic": "DO",
  Guatemala: "GT",
  Honduras: "HN",
  "El Salvador": "SV",
  Nicaragua: "NI",
  Belize: "BZ",
  Qatar: "QA",
  Oman: "OM",
  Yemen: "YE",
  Jordan: "JO",
  Lebanon: "LB",
  Syria: "SY",
  Afghanistan: "AF",
  Uzbekistan: "UZ",
  Tajikistan: "TJ",
  Turkmenistan: "TM",
  Kyrgyzstan: "KG",
  Kazakhstan: "KZ",
  Mongolia: "MN",
  Nepal: "NP",
  Bhutan: "BT",
  Kuwait: "KW",
  Bahrain: "BH",
  Azerbaijan: "AZ",
  Armenia: "AM",
  Georgia: "GE",
  Moldova: "MD",
  Belarus: "BY",
};

let countriesGeoJSON: GeoJSON.FeatureCollection | null = null;

export interface GeolocationData {
  country: string | null;
  countryCode: string | null;
  emoji: string;
}

async function fetchCountriesBoundaries(): Promise<GeoJSON.FeatureCollection | null> {
  if (countriesGeoJSON) {
    return countriesGeoJSON;
  }

  try {
    const response = await fetch(
      "https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson"
    );
    countriesGeoJSON = (await response.json()) as GeoJSON.FeatureCollection;
    return countriesGeoJSON;
  } catch (error) {
    console.error("Failed to fetch country boundaries:", error);
    return null;
  }
}

export async function getCountryFromCoordinates(
  lat: number,
  lon: number
): Promise<GeolocationData> {
  try {
    const countries = await fetchCountriesBoundaries();
    if (!countries) {
      return { country: null, countryCode: null, emoji: "🌍" };
    }

    const point = turf.point([lon, lat]);

    for (const feature of countries.features) {
      if (
        feature.geometry &&
        (feature.geometry.type === "Polygon" ||
          feature.geometry.type === "MultiPolygon")
      ) {
        try {
          if (
            turf.booleanPointInPolygon(
              point,
              feature as GeoJSON.Feature<GeoJSON.Polygon | GeoJSON.MultiPolygon>
            )
          ) {
            const countryName =
              feature.properties?.name ||
              feature.properties?.ADMIN ||
              feature.properties?.sovereignt ||
              "Unknown";

            const countryCode =
              feature.properties?.iso_a2 ||
              COUNTRY_NAME_TO_CODE[countryName] ||
              null;

            // Try multiple sources for emoji
            let emoji = "🌍";
            if (countryCode) {
              emoji =
                COUNTRY_FLAGS[countryCode] ||
                countryCodeToEmoji(countryCode) ||
                "🌍";
            }

            return { country: countryName, countryCode, emoji };
          }
        } catch {
          // Skip features that cause errors
          continue;
        }
      }
    }

    return { country: null, countryCode: null, emoji: "🌊" };
  } catch (error) {
    console.error("Error getting country from coordinates:", error);
    return { country: null, countryCode: null, emoji: "🌍" };
  }
}

export async function getCountriesFromCoordinates(
  coordinates: Array<[number, number]>
): Promise<GeolocationData[]> {
  try {
    const countries = await fetchCountriesBoundaries();
    if (!countries) {
      return coordinates.map(() => ({
        country: null,
        countryCode: null,
        emoji: "🌍",
      }));
    }

    return coordinates.map((coord) => {
      const [lat, lon] = coord;
      const point = turf.point([lon, lat]);

      for (const feature of countries.features) {
        if (
          feature.geometry &&
          (feature.geometry.type === "Polygon" ||
            feature.geometry.type === "MultiPolygon")
        ) {
          try {
            if (
              turf.booleanPointInPolygon(
                point,
                feature as GeoJSON.Feature<
                  GeoJSON.Polygon | GeoJSON.MultiPolygon
                >
              )
            ) {
              const countryName =
                feature.properties?.name ||
                feature.properties?.ADMIN ||
                feature.properties?.sovereignt ||
                "Unknown";

              const countryCode =
                feature.properties?.iso_a2 ||
                COUNTRY_NAME_TO_CODE[countryName] ||
                null;

              // Try multiple sources for emoji
              let emoji = "🌍";
              if (countryCode) {
                emoji =
                  COUNTRY_FLAGS[countryCode] ||
                  countryCodeToEmoji(countryCode) ||
                  "🌍";
              }

              return { country: countryName, countryCode, emoji };
            }
          } catch {
            continue;
          }
        }
      }

      return { country: null, countryCode: null, emoji: "🌊" };
    });
  } catch (error) {
    console.error("Error batch geocoding:", error);
    return coordinates.map(() => ({
      country: null,
      countryCode: null,
      emoji: "🌍",
    }));
  }
}
