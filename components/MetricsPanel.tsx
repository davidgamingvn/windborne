"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useBalloonStore } from "@/lib/store/balloonStore";
import { calculateStats } from "@/lib/utils/globe";

export const MetricsPanel = () => {
  const { balloonData } = useBalloonStore();
  const stats = calculateStats(balloonData);

  return (
    <Card className="border-border bg-card">
      <CardHeader className="border-b border-border pb-3">
        <CardTitle className="text-xs font-mono text-muted-foreground uppercase">
          METRICS
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4 space-y-2 text-xs font-mono">
        <div className="flex justify-between py-2 border-b border-border">
          <span className="text-muted-foreground uppercase">TOTAL</span>
          <span className="text-xl text-accent font-bold">
            {stats.total.toString().padStart(3, "0")}
          </span>
        </div>
        <div className="flex justify-between py-2 border-b border-border">
          <span className="text-muted-foreground uppercase">AVG_LAT</span>
          <span className="text-foreground">{stats.avgLat}°</span>
        </div>
        <div className="flex justify-between py-2 border-b border-border">
          <span className="text-muted-foreground uppercase">AVG_ALT</span>
          <span className="text-foreground">{stats.avgAlt} KM</span>
        </div>
        <div className="flex justify-between py-2 border-b border-border">
          <span className="text-muted-foreground uppercase">NORTHERN</span>
          <span className="text-foreground">{stats.northern}</span>
        </div>
        <div className="flex justify-between py-2">
          <span className="text-muted-foreground uppercase">HIGH_ALT</span>
          <span className="text-foreground">{stats.highAlt}</span>
        </div>
      </CardContent>
    </Card>
  );
};
