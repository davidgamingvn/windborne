"use client";

import { BalloonData } from "@/lib/types";
import { cleanData } from "@/lib/utils/globe";
import { create } from "zustand";

interface BalloonState {
  // Data state
  balloonData: BalloonData[];
  timeOffset: number;

  // Pagination state
  currentPage: number;
  pageSize: number;

  // Filter state
  minAltitudeFilter: number;
  maxAltitudeFilter: number;

  // UI state
  isLoading: boolean;
  hasError: boolean;
  errorMessage: string;
  selectedBalloon: BalloonData | null;
  hoveredBalloon: BalloonData | null;
  isGlobeRotating: boolean;

  // Actions
  fetchBalloonData: (offset: number) => Promise<void>;
  setTimeOffset: (offset: number) => void;
  setSelectedBalloon: (balloon: BalloonData | null) => void;
  setHoveredBalloon: (balloon: BalloonData | null) => void;
  setCurrentPage: (page: number) => void;
  setPageSize: (size: number) => void;
  setMinAltitudeFilter: (alt: number) => void;
  setMaxAltitudeFilter: (alt: number) => void;
  setIsGlobeRotating: (isRotating: boolean) => void;
  getFilteredBalloonData: () => BalloonData[];
}

export const useBalloonStore = create<BalloonState>((set, get) => ({
  balloonData: [],
  timeOffset: 0,
  currentPage: 0,
  pageSize: 25,
  minAltitudeFilter: 0,
  maxAltitudeFilter: 30,
  isLoading: true,
  hasError: false,
  errorMessage: "",
  selectedBalloon: null,
  hoveredBalloon: null,
  isGlobeRotating: true,

  fetchBalloonData: async (offset: number) => {
    set({
      isLoading: true,
      hasError: false,
      selectedBalloon: null,
    });

    // Use local API proxy to bypass CORS
    const url = `/api/balloon/${offset}`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const rawData = await response.json();
      const cleaned = cleanData(rawData);

      if (cleaned.length === 0) {
        throw new Error("NO_DATA_RETURNED");
      }

      set({
        balloonData: cleaned,
        hasError: false,
        errorMessage: "",
        isLoading: false,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      console.error(`Error fetching data for ${offset}h offset:`, error);
      set({
        hasError: true,
        errorMessage: `FAILED: ${message}`,
        balloonData: [],
        isLoading: false,
      });
    }
  },

  setTimeOffset: (offset: number) => {
    set({ timeOffset: offset });
  },

  setSelectedBalloon: (balloon: BalloonData | null) => {
    set({ selectedBalloon: balloon });
  },

  setHoveredBalloon: (balloon: BalloonData | null) => {
    set({ hoveredBalloon: balloon });
  },

  setCurrentPage: (page: number) => {
    set({ currentPage: page });
  },

  setPageSize: (size: number) => {
    set({ pageSize: size, currentPage: 0 });
  },

  setMinAltitudeFilter: (alt: number) => {
    set({ minAltitudeFilter: alt });
  },

  setMaxAltitudeFilter: (alt: number) => {
    set({ maxAltitudeFilter: alt });
  },

  setIsGlobeRotating: (isRotating: boolean) => {
    set({ isGlobeRotating: isRotating });
  },

  getFilteredBalloonData: () => {
    const state = get();
    return state.balloonData.filter(
      (balloon) =>
        balloon.alt >= state.minAltitudeFilter &&
        balloon.alt <= state.maxAltitudeFilter
    );
  },
}));
