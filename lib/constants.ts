export const API_BASE_URL = "https://a.windbornesystems.com/treasure/";
export const GLOBE_RADIUS = 10;
export const MAP_GEO_JSON_URL =
  "https://raw.githubusercontent.com/johan/world.geo.json/master/countries.geo.json";

// Altitude zone thresholds (in km)
export const ALTITUDE_ZONES = {
  STRATOSPHERE_MIN: 18,
  UPPER_TROPO_MIN: 10,
  LOWER_TROPO_MAX: 10,
};

// Color palette for balloon visualization (Brand colors)
export const BALLOON_COLORS = {
  STRATOSPHERE: 0xcec47f, // Gold accent
  UPPER_TROPOSPHERE: 0x9a945e, // Darker gold
  LOWER_TROPOSPHERE: 0x6b6851, // Muted brown-gold
  GLOW: 0xcec47f, // Gold glow
};

// Map line styling
export const MAP_STYLE = {
  NORMAL_COLOR: 0xdae0d4, // Light beige for visibility
  ERROR_COLOR: 0xff6b6b,
  NORMAL_OPACITY: 0.3,
  ERROR_OPACITY: 0.5,
};
