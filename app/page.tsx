"use client";

import { AltitudeKey } from "@/components/AltitudeKey";
import { BalloonDetail } from "@/components/BalloonDetail";
import { DataTable } from "@/components/DataTable";
import { GlobeContainer } from "@/components/Globe/GlobeContainer";
import { GlobeViewer } from "@/components/Globe/GlobeViewer";
import { Header } from "@/components/Header";
import { MetricsPanel } from "@/components/MetricsPanel";
import { SystemInfo } from "@/components/SystemInfo";
import { TimeControl } from "@/components/TimeControl";
import { useBalloonStore } from "@/lib/store/balloonStore";
import { useEffect, useState } from "react";

export default function Home() {
  const { fetchBalloonData } = useBalloonStore();
  const [mounted, setMounted] = useState(false);

  // Fetch initial data on mount (client-only)
  useEffect(() => {
    setMounted(true);
    fetchBalloonData(0);
  }, [fetchBalloonData]);

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary selection:text-primary-foreground">
      {/* Header with status indicator */}
      <Header />

      {/* Main content */}
      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Globe Section */}
          <div className="lg:col-span-3 space-y-6 font-mono">
            {/* Globe Viewer */}
            <GlobeViewer>
              <GlobeContainer />
            </GlobeViewer>

            {/* Time Control */}
            <TimeControl />

            {/* Selected Balloon Details */}
            <BalloonDetail />
          </div>

          {/* Sidebar */}
          <div className="space-y-6 font-mono">
            {/* Metrics Panel */}
            <MetricsPanel />

            {/* Altitude Key */}
            <AltitudeKey />

            {/* System Info */}
            <SystemInfo />
          </div>
        </div>

        {/* Data Table */}
        <DataTable />
      </div>
    </div>
  );
}
