"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const AltitudeKey = () => {
  return (
    <Card className="border-border bg-card">
      <CardHeader className="border-b border-border pb-3">
        <CardTitle className="text-xs font-mono text-muted-foreground uppercase">
          ALTITUDE_KEY
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4 space-y-3 text-xs font-mono">
        <div className="flex items-center gap-3 py-1">
          <div className="w-3 h-3 bg-primary rounded-full"></div>
          <span className="text-foreground uppercase">{">"}18KM</span>
        </div>
        <div className="flex items-center gap-3 py-1">
          <div className="w-3 h-3 bg-primary/70 rounded-full"></div>
          <span className="text-foreground uppercase">10-18KM</span>
        </div>
        <div className="flex items-center gap-3 py-1">
          <div className="w-3 h-3 bg-primary/40 rounded-full"></div>
          <span className="text-muted-foreground uppercase">{"<"}10KM</span>
        </div>
      </CardContent>
    </Card>
  );
};
