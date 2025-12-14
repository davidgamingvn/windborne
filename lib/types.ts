export interface BalloonData {
  index: number;
  lat: number;
  lon: number;
  alt: number;
}

export interface BalloonStats {
  total: number;
  avgLat: string | number;
  avgAlt: string | number;
  northern: number;
  highAlt: number;
}

export interface GeolocationData {
  country: string | null;
  countryCode: string | null;
  city?: string | null;
  region?: string | null;
  emoji: string;
}
