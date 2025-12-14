import { BalloonData, GeolocationData } from "@/lib/types";
import React from "react";

interface BalloonHoverCardProps {
  hoveredBalloon: BalloonData | null;
  geolocation: GeolocationData | null;
}

export const BalloonHoverCard: React.FC<BalloonHoverCardProps> = ({
  hoveredBalloon,
  geolocation,
}) => {
  if (!hoveredBalloon) return null;

  return (
    <div
      className="absolute bottom-4 left-4 bg-card/95 border border-border rounded px-4 py-3 z-30 w-80"
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      <div className="text-xs text-muted-foreground uppercase font-mono mb-3">
        BALLOON_{hoveredBalloon.index.toString().padStart(3, "0")}
      </div>

      {/* Geolocation info */}
      {geolocation && (
        <div className="mb-4 pb-4 border-b border-border">
          <div className="text-xs text-muted-foreground uppercase mb-2 font-mono">
            LOCATION
          </div>
          <div className="text-lg text-accent font-bold font-mono leading-tight">
            {geolocation.emoji} {geolocation.country || "UNKNOWN"}
          </div>
          {(geolocation.city || geolocation.region) && (
            <div className="text-xs text-muted-foreground mt-1 font-mono truncate">
              {[geolocation.city, geolocation.region]
                .filter(Boolean)
                .join(", ")}
            </div>
          )}
        </div>
      )}

      {/* Coordinates Grid */}
      <div className="grid grid-cols-3 gap-4 font-mono">
        <div>
          <div className="text-xs text-muted-foreground uppercase mb-1">
            LAT
          </div>
          <div className="text-sm text-foreground font-semibold">
            {hoveredBalloon.lat.toFixed(2)}
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            {hoveredBalloon.lat > 0 ? "NORTH" : "SOUTH"}
          </div>
        </div>
        <div>
          <div className="text-xs text-muted-foreground uppercase mb-1">
            LON
          </div>
          <div className="text-sm text-foreground font-semibold">
            {hoveredBalloon.lon.toFixed(2)}
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            {hoveredBalloon.lon > 0 ? "EAST" : "WEST"}
          </div>
        </div>
        <div>
          <div className="text-xs text-muted-foreground uppercase mb-1">
            ALT
          </div>
          <div className="text-sm text-foreground font-semibold">
            {hoveredBalloon.alt.toFixed(1)}
          </div>
          <div className="text-xs text-muted-foreground mt-1">KM</div>
        </div>
      </div>
    </div>
  );
};
