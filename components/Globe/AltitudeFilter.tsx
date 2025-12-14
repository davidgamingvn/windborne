import { Slider } from "@/components/ui/slider";
import React from "react";

interface AltitudeFilterProps {
  minAltitudeFilter: number;
  maxAltitudeFilter: number;
  setMinAltitudeFilter: (value: number) => void;
  setMaxAltitudeFilter: (value: number) => void;
  filteredCount: number;
  totalCount: number;
  maxAltitude: number;
}

export const AltitudeFilter: React.FC<AltitudeFilterProps> = ({
  minAltitudeFilter,
  maxAltitudeFilter,
  setMinAltitudeFilter,
  setMaxAltitudeFilter,
  filteredCount,
  totalCount,
  maxAltitude,
}) => {
  return (
    <div className="absolute bottom-4 right-4 bg-card/95 border border-border rounded px-4 py-3 z-20 w-64">
      <div className="text-xs text-muted-foreground uppercase font-mono mb-3">
        ALTITUDE_COVERAGE
      </div>

      <div className="space-y-2 mb-3">
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">
            MIN: {minAltitudeFilter.toFixed(1)}KM
          </span>
          <span className="text-xs text-muted-foreground">
            MAX: {maxAltitudeFilter.toFixed(1)}KM
          </span>
        </div>
        <div className="text-xs text-accent text-center font-mono">
          {filteredCount} / {totalCount} VISIBLE
        </div>
      </div>

      <div className="space-y-3">
        <div>
          <label className="text-xs text-muted-foreground uppercase block mb-2">
            Min Altitude
          </label>
          <Slider
            min={0}
            max={maxAltitude}
            step={0.5}
            value={[minAltitudeFilter]}
            onValueChange={(value) => {
              if (value[0] <= maxAltitudeFilter) {
                setMinAltitudeFilter(value[0]);
              }
            }}
          />
        </div>
        <div>
          <label className="text-xs text-muted-foreground uppercase block mb-2">
            Max Altitude
          </label>
          <Slider
            min={0}
            max={maxAltitude}
            step={0.5}
            value={[maxAltitudeFilter]}
            onValueChange={(value) => {
              if (value[0] >= minAltitudeFilter) {
                setMaxAltitudeFilter(value[0]);
              }
            }}
          />
        </div>
      </div>
    </div>
  );
};
