"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const SystemInfo = () => {
  return (
    <Card className="border-border bg-card">
      <CardHeader className="border-b border-border pb-3">
        <CardTitle className="text-xs font-mono text-muted-foreground uppercase">
          SYSTEM_INFO
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4 text-xs font-mono leading-relaxed text-muted-foreground space-y-2">
        <p>TYPE: ATMOSPHERIC_BALLOON</p>
        <p>SOURCE: WINDBORNE_SYSTEMS</p>
        <p>STATUS: GLOBAL_COVERAGE</p>
      </CardContent>
    </Card>
  );
};
