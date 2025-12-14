"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useBalloonStore } from "@/lib/store/balloonStore";
import {
  GeolocationData,
  getCountryFromCoordinates,
} from "@/lib/utils/geocoding";
import { useEffect, useState } from "react";

export const BalloonDetail = () => {
  const { selectedBalloon, setSelectedBalloon } = useBalloonStore();
  const [geolocation, setGeolocation] = useState<GeolocationData | null>(null);
  const [isLoadingCountry, setIsLoadingCountry] = useState(false);

  useEffect(() => {
    if (selectedBalloon) {
      setIsLoadingCountry(true);
      getCountryFromCoordinates(selectedBalloon.lat, selectedBalloon.lon).then(
        (geo) => {
          setGeolocation(geo);
          setIsLoadingCountry(false);
        }
      );
    } else {
      setGeolocation(null);
    }
  }, [selectedBalloon]);

  if (!selectedBalloon) return null;

  const getAltitudeZone = (alt: number) => {
    if (alt > 18) return "STRATOSPHERE";
    if (alt > 10) return "UPPER_TROPO";
    return "LOWER_TROPO";
  };

  return (
    <Card className="border-border bg-card">
      <CardHeader className="border-b border-border pb-3 flex flex-row items-center justify-between">
        <CardTitle className="text-xs font-mono uppercase text-muted-foreground">
          SELECTED_{selectedBalloon.index.toString().padStart(3, "0")}
        </CardTitle>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setSelectedBalloon(null)}
          className="text-xs text-muted-foreground hover:text-foreground"
        >
          [CLOSE]
        </Button>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="grid grid-cols-4 gap-6 font-mono">
          <div>
            <div className="text-muted-foreground text-xs mb-2 uppercase">
              INDEX
            </div>
            <div className="text-4xl text-accent font-bold">
              {selectedBalloon.index.toString().padStart(3, "0")}
            </div>
          </div>
          <div>
            <div className="text-muted-foreground text-xs mb-2 uppercase">
              LATITUDE
            </div>
            <div className="text-4xl text-foreground font-bold">
              {selectedBalloon.lat.toFixed(2)}°
            </div>
            <div className="text-xs text-muted-foreground mt-2 uppercase">
              {selectedBalloon.lat > 0 ? "NORTH" : "SOUTH"}
            </div>
          </div>
          <div>
            <div className="text-muted-foreground text-xs mb-2 uppercase">
              LONGITUDE
            </div>
            <div className="text-4xl text-foreground font-bold">
              {selectedBalloon.lon.toFixed(2)}°
            </div>
            <div className="text-xs text-muted-foreground mt-2 uppercase">
              {selectedBalloon.lon > 0 ? "EAST" : "WEST"}
            </div>
          </div>
          <div>
            <div className="text-muted-foreground text-xs mb-2 uppercase">
              ALTITUDE
            </div>
            <div className="text-4xl text-foreground font-bold">
              {selectedBalloon.alt.toFixed(2)}
            </div>
            <div className="text-xs text-muted-foreground mt-2 uppercase">
              {getAltitudeZone(selectedBalloon.alt)}
            </div>
          </div>
        </div>

        {/* Location/Country row */}
        <div className="mt-6 pt-4 border-t border-border">
          <div className="text-muted-foreground text-xs mb-2 uppercase">
            LOCATION
          </div>
          <div className="text-lg text-accent font-bold">
            {isLoadingCountry
              ? "LOCATING..."
              : geolocation?.country
              ? `${geolocation.emoji} ${geolocation.country}`
              : `${geolocation?.emoji || "🌍"} UNKNOWN`}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
