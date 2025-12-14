"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useBalloonStore } from "@/lib/store/balloonStore";
import { getAltitudeZoneLabel } from "@/lib/utils/globe";
import { ChevronLeft, ChevronRight } from "lucide-react";

export const DataTable = () => {
  const {
    balloonData,
    setSelectedBalloon,
    currentPage,
    pageSize,
    setCurrentPage,
  } = useBalloonStore();

  const totalPages = Math.ceil(balloonData.length / pageSize);
  const startIndex = currentPage * pageSize;
  const displayData = balloonData.slice(startIndex, startIndex + pageSize);

  const handlePreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <Card className="border-border bg-card mt-6">
      <CardHeader className="border-b border-border pb-3">
        <CardTitle className="text-xs font-mono text-muted-foreground uppercase">
          DATA_STREAM
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="overflow-x-auto">
          <table className="w-full text-xs font-mono">
            <thead className="border-b border-border">
              <tr className="text-left text-muted-foreground uppercase">
                <th className="p-3">INDEX</th>
                <th className="p-3">LAT</th>
                <th className="p-3">LON</th>
                <th className="p-3">ALT_KM</th>
                <th className="p-3">ZONE</th>
              </tr>
            </thead>
            <tbody>
              {displayData.map((balloon) => (
                <tr
                  key={balloon.index}
                  onClick={() => setSelectedBalloon(balloon)}
                  className="border-b border-border hover:bg-primary/10 cursor-pointer transition-colors"
                >
                  <td className="p-3 text-muted-foreground">
                    {balloon.index.toString().padStart(3, "0")}
                  </td>
                  <td className="p-3 text-foreground">
                    {balloon.lat.toFixed(2)}°
                  </td>
                  <td className="p-3 text-foreground">
                    {balloon.lon.toFixed(2)}°
                  </td>
                  <td className="p-3 text-accent font-bold">
                    {balloon.alt.toFixed(2)}
                  </td>
                  <td className="p-3 text-muted-foreground">
                    {getAltitudeZoneLabel(balloon.alt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="border-t border-border px-0 py-4 flex items-center justify-between">
          <div className="text-xs text-muted-foreground uppercase font-mono">
            SHOWING {startIndex + 1}/{balloonData.length} RECORDS • PAGE{" "}
            {currentPage + 1}/{totalPages}
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePreviousPage}
              disabled={currentPage === 0}
              className="h-7 px-2 gap-1"
            >
              <ChevronLeft className="w-3 h-3" />
              PREV
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleNextPage}
              disabled={currentPage >= totalPages - 1}
              className="h-7 px-2 gap-1"
            >
              NEXT
              <ChevronRight className="w-3 h-3" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
