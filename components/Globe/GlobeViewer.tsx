"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { useBalloonStore } from "@/lib/store/balloonStore";
import { GeolocationData } from "@/lib/types";
import { getCountryFromCoordinates } from "@/lib/utils/geocoding";
import { AlertTriangle, Pause, Play } from "lucide-react";
import { useEffect, useState } from "react";
import { AltitudeFilter } from "./AltitudeFilter";
import { BalloonHoverCard } from "./BalloonHoverCard";

export const GlobeViewer = ({ children }: { children: React.ReactNode }) => {
  const {
    isLoading,
    hasError,
    errorMessage,
    timeOffset,
    balloonData,
    minAltitudeFilter,
    maxAltitudeFilter,
    setMinAltitudeFilter,
    setMaxAltitudeFilter,
    getFilteredBalloonData,
    isGlobeRotating,
    setIsGlobeRotating,
    hoveredBalloon,
  } = useBalloonStore();

  const [geolocation, setGeolocation] = useState<GeolocationData | null>(null);

  // Fetch geolocation when hoveredBalloon changes
  useEffect(() => {
    if (hoveredBalloon) {
      getCountryFromCoordinates(hoveredBalloon.lat, hoveredBalloon.lon).then(
        (geo) => {
          setGeolocation(geo);
        }
      );
    } else {
      setGeolocation(null);
    }
  }, [hoveredBalloon]);

  const filteredCount = getFilteredBalloonData().length;

  // Calculate max altitude from data
  const maxAltitude =
    balloonData.length > 0
      ? Math.ceil(Math.max(...balloonData.map((b) => b.alt)))
      : 30;

  return (
    <Card className="border-border bg-card">
      <CardHeader className="border-b border-border pb-3">
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground uppercase font-mono">
            3D_VIEW
          </span>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsGlobeRotating(!isGlobeRotating)}
              className="text-foreground hover:bg-primary/10"
            >
              {isGlobeRotating ? (
                <Pause className="w-4 h-4" />
              ) : (
                <Play className="w-4 h-4" />
              )}
            </Button>
            <span className="text-xs text-muted-foreground uppercase font-mono">
              TIME:{" "}
              {timeOffset === 0
                ? "CURRENT"
                : `${timeOffset.toString().padStart(2, "0")}H AGO`}
            </span>
          </div>
        </div>
      </CardHeader>

      <div className="relative" style={{ height: "600px" }}>
        {children}

        {/* Info Card on Hover */}
        <BalloonHoverCard
          hoveredBalloon={hoveredBalloon}
          geolocation={geolocation}
        />

        {isLoading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/80 z-10">
            <div className="w-8 h-8 border-2 border-primary border-t-primary/20 animate-spin rounded-full"></div>
            <div className="mt-4 text-sm text-muted-foreground uppercase font-mono">
              LOADING {timeOffset.toString().padStart(2, "0")}H DATA
            </div>
          </div>
        )}

        {hasError && !isLoading && (
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10">
            <Alert
              variant="destructive"
              className="border-red-500/50 bg-red-500/10"
            >
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>CONNECTION ERROR</AlertTitle>
              <AlertDescription className="text-xs">
                {errorMessage}
              </AlertDescription>
            </Alert>
          </div>
        )}

        {/* Altitude Filter Slider */}
        <AltitudeFilter
          minAltitudeFilter={minAltitudeFilter}
          maxAltitudeFilter={maxAltitudeFilter}
          setMinAltitudeFilter={setMinAltitudeFilter}
          setMaxAltitudeFilter={setMaxAltitudeFilter}
          filteredCount={filteredCount}
          totalCount={balloonData.length}
          maxAltitude={maxAltitude}
        />
      </div>

      <div className="border-t border-border px-4 py-3 flex items-center justify-between text-xs text-muted-foreground uppercase font-mono">
        <span>DRAG_ROTATE / SCROLL_ZOOM</span>
        <span className="text-accent">ASSETS</span>
      </div>
    </Card>
  );
};
