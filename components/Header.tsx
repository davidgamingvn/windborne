"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useBalloonStore } from "@/lib/store/balloonStore";
import { Moon, Sun } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

export const Header = () => {
  const { isLoading, hasError } = useBalloonStore();
  const [isDark, setIsDark] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Check if dark mode is set in localStorage or default to dark
    const darkMode = localStorage.getItem("theme") !== "light";
    setIsDark(darkMode);
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !isDark;
    setIsDark(newDarkMode);
    localStorage.setItem("theme", newDarkMode ? "dark" : "light");
    if (newDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  if (!mounted) return null;

  return (
    <div className="border-b border-border bg-background">
      <div className="max-w-7xl mx-auto px-6 py-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Image
              src="/icon.jpeg"
              alt="Windborne Systems"
              width={32}
              height={32}
              className="w-8 h-8"
            />
            <h1 className="text-2xl font-light tracking-widest uppercase text-foreground">
              WINDBORNE CONSTELLATION
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleDarkMode}
              className="text-foreground hover:bg-primary/10"
            >
              {isDark ? (
                <Sun className="w-4 h-4" />
              ) : (
                <Moon className="w-4 h-4" />
              )}
            </Button>
            {isLoading ? (
              <Badge
                variant="outline"
                className="gap-2 bg-primary/10 text-primary border-primary/30"
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
                [LOADING]
              </Badge>
            ) : hasError ? (
              <Badge
                variant="outline"
                className="gap-2 bg-red-500/10 text-red-400 border-red-500/30"
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                </span>
                [ERROR]
              </Badge>
            ) : (
              <Badge
                variant="outline"
                className="gap-2 bg-green-500/10 text-green-400 border-green-500/30"
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                [LIVE]
              </Badge>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
