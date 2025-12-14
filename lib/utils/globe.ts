import { BalloonData, BalloonStats } from "@/lib/types";

export const cleanData = (rawData: unknown): BalloonData[] => {
  if (!Array.isArray(rawData)) return [];

  return rawData
    .map((item, index) => {
      if (Array.isArray(item) && item.length === 3) {
        const [lat, lon, alt] = item;
        if (
          typeof lat === "number" &&
          typeof lon === "number" &&
          typeof alt === "number"
        ) {
          return { index, lat, lon, alt };
        }
      }
      return null;
    })
    .filter((item): item is BalloonData => item !== null);
};

export const calculateStats = (balloonData: BalloonData[]): BalloonStats => {
  return {
    total: balloonData.length,
    avgLat:
      balloonData.length > 0
        ? (
            balloonData.reduce((sum, b) => sum + b.lat, 0) / balloonData.length
          ).toFixed(2)
        : "N/A",
    avgAlt:
      balloonData.length > 0
        ? (
            balloonData.reduce((sum, b) => sum + b.alt, 0) / balloonData.length
          ).toFixed(2)
        : "N/A",
    northern: balloonData.filter((b) => b.lat > 0).length,
    highAlt: balloonData.filter((b) => b.alt > 18).length,
  };
};

export const getAltitudeZone = (
  alt: number
): "STRATOSPHERE" | "UPPER_TROPO" | "LOWER_TROPO" => {
  if (alt > 18) return "STRATOSPHERE";
  if (alt > 10) return "UPPER_TROPO";
  return "LOWER_TROPO";
};

export const getAltitudeZoneLabel = (alt: number): string => {
  const zone = getAltitudeZone(alt);
  switch (zone) {
    case "STRATOSPHERE":
      return "STRATOSPHERE";
    case "UPPER_TROPO":
      return "UPPER_TROPO";
    case "LOWER_TROPO":
      return "LOWER_TROPO";
  }
};

export const convertLatLonToSphereCoords = (
  lat: number,
  lon: number,
  radius: number
): { x: number; y: number; z: number } => {
  const phi = ((90 - lat) * Math.PI) / 180;
  const theta = ((lon + 180) * Math.PI) / 180;

  const x = -radius * Math.sin(phi) * Math.cos(theta);
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);

  return { x, y, z };
};

export const convertLatLonToRadiusAdjusted = (
  lat: number,
  lon: number,
  alt: number,
  baseRadius: number
): { x: number; y: number; z: number } => {
  const radius = baseRadius + 0.1 + alt / 15;
  return convertLatLonToSphereCoords(lat, lon, radius);
};
