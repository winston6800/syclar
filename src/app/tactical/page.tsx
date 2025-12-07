"use client";

import { useEffect, useRef, useState } from "react";
import { Sparkles } from "lucide-react";
import { useScreentimeTracker } from "@/lib/use-screentime-tracker";
import { recordFocusTime } from "@/lib/stats";
import { DailyStoryCard } from "@/components/story/daily-story-card";
import { StoryArchive } from "@/components/story/story-archive";
import type { FocusSession } from "@/components/tactical/types";
import { DailyAccomplishment } from "@/components/tactical/daily-accomplishment";
import { AccomplishmentCalendar } from "@/components/tactical/accomplishment-calendar";
import { HeroRankDisplay } from "@/components/tactical/hero-rank-display";
import { AllowanceDisplay } from "@/components/tactical/allowance-display";
import { MomentumTimer } from "@/components/tactical/momentum-timer";

export default function TacticalPage() {
  const [focusSession, setFocusSession] = useState<FocusSession>({
    taskId: null,
    startTime: null,
    elapsedSeconds: 0,
    isRunning: false,
  });
  const [allowance, setAllowance] = useState(0);
  const [goodwill, setGoodwill] = useState(0);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const [stories, setStories] = useState<any[]>([]);
  const [isLoadingStories, setIsLoadingStories] = useState(true);

  useEffect(() => {
    // Load stories from localStorage
    const savedStories = localStorage.getItem("dailyStories");
    if (savedStories) {
      try {
        setStories(JSON.parse(savedStories));
      } catch (e) {
        console.error("Failed to parse stories", e);
      }
    }
    setIsLoadingStories(false);
  }, []);

  const handleStorySubmit = (newStory: any) => {
    const updatedStories = [newStory, ...stories];
    setStories(updatedStories);
    localStorage.setItem("dailyStories", JSON.stringify(updatedStories));
  };

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Hero rank system with allowance integration
  const {
    currentRank,
    rankString,
    isUnproductive,
    timeOnUnproductiveSite,
    isProtected,
    startTracking,
    stopTracking,
    addPoints,
  } = useScreentimeTracker({
    allowance,
    onAllowanceChange: setAllowance,
  });

  // Start screentime tracking on mount
  useEffect(() => {
    startTracking();
    return () => stopTracking();
  }, [startTracking, stopTracking]);

  // Focus timer effect - increment every second and award points + goodwill
  useEffect(() => {
    if (focusSession.isRunning) {
      timerRef.current = setInterval(() => {
        setFocusSession((prev) => {
          const newSeconds = prev.elapsedSeconds + 1;
          // Award 0.01 goodwill per minute (at 60-second intervals)
          if (newSeconds % 60 === 0) {
            setGoodwill((gw) => gw + 0.01);
          }
          return {
            ...prev,
            elapsedSeconds: newSeconds,
          };
        });
        // Award 1 point per second while focus session is running
        addPoints(1);
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [focusSession.isRunning, addPoints]);

  const startFocus = () => {
    setFocusSession({
      taskId: "momentum-focus", // Simple identifier
      startTime: new Date(),
      elapsedSeconds: 0,
      isRunning: true,
    });
  };

  const stopFocus = () => {
    if (!focusSession.isRunning) return;

    const minutes = Math.floor(focusSession.elapsedSeconds / 60);
    if (minutes > 0) {
      recordFocusTime(minutes);
    }

    setFocusSession({
      taskId: null,
      startTime: null,
      elapsedSeconds: 0,
      isRunning: false,
    });
  };

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    if (h > 0) {
      return `${h}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
    }
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen w-full overflow-hidden bg-white dark:bg-black">
      <div className="fixed inset-0 -z-10 bg-gradient-to-b from-white via-white to-neutral-50/50 dark:from-black dark:via-black dark:to-neutral-950/50" />

      <div className="relative min-h-screen px-6 py-8 sm:px-8 lg:px-12">
        <div className="mx-auto w-full max-w-4xl">
          {/* Header with Allowance */}
          <div className="mb-8 flex items-start justify-between gap-6">
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 rounded-full bg-neutral-100/80 px-5 py-2 text-sm backdrop-blur-xl dark:bg-neutral-900/80">
                <Sparkles className="h-3.5 w-3.5 text-neutral-600 dark:text-neutral-400" />
                <span className="text-neutral-600 dark:text-neutral-400">
                  Momentum Station
                </span>
              </div>
              <h1 className="mt-4 text-4xl font-semibold tracking-[-0.03em] sm:text-5xl">
                Focus & Build Momentum
              </h1>
            </div>
            {/* Allowance Display - Top Right */}
            <div className="flex gap-4">
              <DailyAccomplishment onOpenCalendar={() => setIsCalendarOpen(true)} />
              <AllowanceDisplay 
                allowance={allowance} 
                goodwill={goodwill} 
                isProtected={isProtected && isUnproductive}
              />
              <HeroRankDisplay
                currentRank={currentRank}
                rankString={rankString}
                isUnproductive={isUnproductive}
                timeOnUnproductiveSite={timeOnUnproductiveSite}
                isProtected={isProtected && isUnproductive}
              />
            </div>
          </div>

          {/* Momentum Timer - The Core Feature */}
          <div className="mt-12 rounded-2xl border border-neutral-200 bg-white/80 p-12 backdrop-blur-xl dark:border-neutral-800 dark:bg-neutral-900/80">
            <MomentumTimer
              focusSession={focusSession}
              onStart={startFocus}
              onStop={stopFocus}
              formatTime={formatTime}
            />
          </div>

          {/* Stories - moved under Momentum Timer */}
          <div className="mt-12">
            <div className="mb-16">
              <DailyStoryCard onSubmit={handleStorySubmit} />
            </div>
            <div>
              {!isLoadingStories && <StoryArchive stories={stories} />}
            </div>
          </div>
        </div>
      </div>

      {/* Calendar Modal */}
      <AccomplishmentCalendar
        isOpen={isCalendarOpen}
        onClose={() => setIsCalendarOpen(false)}
      />
    </div>
  );
}
