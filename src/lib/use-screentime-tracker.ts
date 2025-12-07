"use client";

import { useEffect, useState, useCallback } from "react";
import { HeroRank, getInitialRank, deductPointsForUnproductiveSite, addPointsForWorkCompleted, formatRank } from "./hero-rank";

// Allowance spending rate: 0.05 per 5 minutes (0.01 per minute)
// (Changed to 0.01 per minute as requested)
const ALLOWANCE_COST_PER_MINUTE = 0.01;

// List of unproductive website domains (can be expanded)
const UNPRODUCTIVE_DOMAINS = [
  "youtube.com",
  "facebook.com",
  "instagram.com",
  "twitter.com",
  "x.com",
  "tiktok.com",
  "reddit.com",
  "netflix.com",
  "hulu.com",
  "disney.com",
  "amazon.com", // Shopping
  "ebay.com",
  "etsy.com",
  "pinterest.com",
  "twitch.tv",
  "discord.com", // If used for leisure
  "9gag.com",
  "buzzfeed.com",
  "imgur.com",
];

const isUnproductiveDomain = (url: string): boolean => {
  try {
    const domain = new URL(url).hostname.toLowerCase();
    return UNPRODUCTIVE_DOMAINS.some((unproductive) =>
      domain.includes(unproductive)
    );
  } catch {
    return false;
  }
};

type UseScreentimeTrackerOptions = {
  allowance?: number;
  onAllowanceChange?: (newAllowance: number) => void;
};

export const useScreentimeTracker = (options?: UseScreentimeTrackerOptions) => {
  const { allowance = 0, onAllowanceChange } = options || {};
  
  const [currentRank, setCurrentRank] = useState<HeroRank>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("heroRank");
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          return getInitialRank();
        }
      }
    }
    return getInitialRank();
  });

  const [currentUrl, setCurrentUrl] = useState<string>("");
  const [timeOnUnproductiveSite, setTimeOnUnproductiveSite] = useState(0); // in seconds
  const [isTracking, setIsTracking] = useState(false);
  const [isProtected, setIsProtected] = useState(false); // Whether currently protected by allowance

  // Save rank to localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("heroRank", JSON.stringify(currentRank));
    }
  }, [currentRank]);

  // Track current tab URL
  useEffect(() => {
    if (typeof window === "undefined") return;

    const updateUrl = () => {
      setCurrentUrl(window.location.href);
    };

    updateUrl();
    window.addEventListener("focus", updateUrl);
    window.addEventListener("visibilitychange", updateUrl);

    return () => {
      window.removeEventListener("focus", updateUrl);
      window.removeEventListener("visibilitychange", updateUrl);
    };
  }, []);

  // Track time on unproductive sites and award/deduct rank points
  useEffect(() => {
    if (typeof window === "undefined") return;

    let interval: NodeJS.Timeout | null = null;
    let lastMinuteProcessed = 0; // Track last minute we processed
    let trackedAllowance = allowance; // Track allowance state within this effect

    // Sync tracked allowance when prop changes
    if (trackedAllowance !== allowance) {
      trackedAllowance = allowance;
    }

    if (isTracking && currentUrl) {
      const isUnproductive = isUnproductiveDomain(currentUrl);

      interval = setInterval(() => {
        // If productive site, just reset unproductive counter; points are awarded only during Focus Mode
        if (!isUnproductive) {
          setTimeOnUnproductiveSite(0);
          setIsProtected(false);
          return;
        }

        // If unproductive, track seconds and handle allowance/minute processing
        setTimeOnUnproductiveSite((prev) => {
          const newSeconds = prev + 1;
          const currentMinute = Math.floor(newSeconds / 60);

          // Sync allowance from prop (in case it changed externally)
          if (trackedAllowance !== allowance) {
            trackedAllowance = allowance;
          }

          // Process every minute
          if (currentMinute > lastMinuteProcessed) {
            lastMinuteProcessed = currentMinute;

            // Check if we have enough allowance to protect for this minute
            const costForMinute = ALLOWANCE_COST_PER_MINUTE;
            const hasEnoughAllowance = trackedAllowance >= costForMinute;

            setIsProtected(hasEnoughAllowance);

            if (hasEnoughAllowance) {
              // Spend allowance for this minute
              trackedAllowance = Math.max(0, trackedAllowance - costForMinute);
              if (onAllowanceChange) {
                onAllowanceChange(trackedAllowance);
              }
            } else {
              // No allowance left, deduct rank points (1 point per minute)
              setCurrentRank((rank) =>
                deductPointsForUnproductiveSite(rank, 1)
              );
            }
          } else {
            // Update protection status based on remaining allowance
            const costForNextMinute = ALLOWANCE_COST_PER_MINUTE;
            setIsProtected(trackedAllowance >= costForNextMinute);
          }

          return newSeconds;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTracking, currentUrl, allowance, onAllowanceChange]);

  // Start/stop tracking
  const startTracking = useCallback(() => {
    setIsTracking(true);
  }, []);

  const stopTracking = useCallback(() => {
    setIsTracking(false);
    setTimeOnUnproductiveSite(0);
  }, []);

  // Manually deduct points (for testing or manual tracking)
  const deductPoints = useCallback((minutes: number = 1) => {
    setCurrentRank((rank) => deductPointsForUnproductiveSite(rank, minutes));
  }, []);

  // Add points for completing work
  const addPoints = useCallback((points: number = 10) => {
    setCurrentRank((rank) => addPointsForWorkCompleted(rank, points));
  }, []);

  return {
    currentRank,
    rankString: formatRank(currentRank),
    currentUrl,
    isUnproductive: currentUrl ? isUnproductiveDomain(currentUrl) : false,
    timeOnUnproductiveSite,
    isTracking,
    isProtected, // Whether currently protected by allowance
    startTracking,
    stopTracking,
    deductPoints,
    addPoints,
  };
};

