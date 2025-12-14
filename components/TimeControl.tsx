"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { useBalloonStore } from "@/lib/store/balloonStore";
import { Clock } from "lucide-react";

export const TimeControl = () => {
  const { timeOffset, setTimeOffset, fetchBalloonData } = useBalloonStore();

  const handleTimeChange = (value: number[]) => {
    const newOffset = value[0];
    setTimeOffset(newOffset);
    fetchBalloonData(newOffset);
  };

  const timeDisplay =
    timeOffset === 0
      ? "CURRENT"
      : `${timeOffset.toString().padStart(2, "0")}H AGO`;

  return (
    <Card className="border-border bg-card">
      <CardHeader className="border-b border-border pb-3">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-muted-foreground" />
          <CardTitle className="text-xs font-mono uppercase text-muted-foreground">
            TIME_CONTROL
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="flex justify-between text-xs mb-4 uppercase font-mono">
          <span className="text-muted-foreground">OFFSET:</span>
          <span className="text-lg text-accent font-bold">{timeDisplay}</span>
        </div>
        <Slider
          min={0}
          max={23}
          step={1}
          value={[timeOffset]}
          onValueChange={handleTimeChange}
          className="w-full"
        />
        <div className="flex justify-between text-xs mt-4 text-white/40 uppercase font-mono">
          <span>NOW (00H)</span>
          <span>23H AGO</span>
        </div>
      </CardContent>
    </Card>
  );
};
