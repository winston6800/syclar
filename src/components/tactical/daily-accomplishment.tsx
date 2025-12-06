"use client";

import { useState, useEffect } from "react";
import { Calendar, Star } from "lucide-react";

type DailyAccomplishmentProps = {
  onOpenCalendar: () => void;
};

export function DailyAccomplishment({ onOpenCalendar }: DailyAccomplishmentProps) {
  const [dailyAccomplishment, setDailyAccomplishment] = useState<string>("");
  const [accomplishments, setAccomplishments] = useState<Record<string, string>>({});
  const [isEditingAccomplishment, setIsEditingAccomplishment] = useState(false);

  const getTodayKey = () => {
    return new Date().toISOString().split("T")[0]; // YYYY-MM-DD
  };

  // Load today's accomplishment on mount and sync with localStorage
  useEffect(() => {
    const todayKey = getTodayKey();
    const saved = localStorage.getItem("dailyAccomplishments");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setAccomplishments(parsed);
        if (parsed[todayKey]) {
          setDailyAccomplishment(parsed[todayKey]);
        }
      } catch (e) {
        console.error("Failed to load accomplishments:", e);
      }
    }

    // Listen for storage changes (when edited in another tab/window)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "dailyAccomplishments" && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          setAccomplishments(parsed);
          const todayKey = getTodayKey();
          if (parsed[todayKey]) {
            setDailyAccomplishment(parsed[todayKey]);
          }
        } catch (e) {
          console.error("Failed to sync accomplishments:", e);
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // Save accomplishment
  const saveAccomplishment = () => {
    const todayKey = getTodayKey();
    const updated = { ...accomplishments, [todayKey]: dailyAccomplishment };
    setAccomplishments(updated);
    localStorage.setItem("dailyAccomplishments", JSON.stringify(updated));
  };

  return (
    <div className="w-64 rounded-2xl border border-neutral-200 bg-white/80 p-4 backdrop-blur-xl dark:border-neutral-800 dark:bg-neutral-900/80">
      <div className="mb-3 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-neutral-500 dark:text-neutral-400" />
          <div className="text-xs font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
            Today&apos;s Win
          </div>
        </div>
        <button
          type="button"
          onClick={onOpenCalendar}
          className="rounded-lg px-2 py-1 text-xs text-neutral-600 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800"
        >
          View Calendar
        </button>
      </div>
      {dailyAccomplishment && !isEditingAccomplishment ? (
        <div className="space-y-2">
          <div className="flex items-start gap-2 rounded-lg bg-yellow-50/50 p-2 dark:bg-yellow-900/10">
            <Star className="mt-0.5 h-3.5 w-3.5 shrink-0 text-yellow-600 dark:text-yellow-400" />
            <p className="text-xs font-medium text-neutral-800 dark:text-neutral-200">
              {dailyAccomplishment}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsEditingAccomplishment(true)}
            className="w-full rounded-lg border border-neutral-200 bg-white px-2 py-1 text-xs text-neutral-600 hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-400 dark:hover:bg-neutral-900"
          >
            Edit
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          <textarea
            value={dailyAccomplishment}
            onChange={(e) => setDailyAccomplishment(e.target.value)}
            onBlur={() => {
              saveAccomplishment();
              setIsEditingAccomplishment(false);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                saveAccomplishment();
                setIsEditingAccomplishment(false);
              }
              if (e.key === "Escape") {
                setIsEditingAccomplishment(false);
                // Restore from saved if editing
                if (dailyAccomplishment) {
                  const todayKey = getTodayKey();
                  const saved = accomplishments[todayKey] || "";
                  setDailyAccomplishment(saved);
                }
              }
            }}
            placeholder="What are you most proud of today?"
            rows={3}
            autoFocus={isEditingAccomplishment}
            className="w-full resize-none rounded-lg border border-neutral-200 bg-white/80 px-2 py-1.5 text-xs text-neutral-800 placeholder:text-neutral-400 focus:border-neutral-400 focus:outline-none focus:ring-0 dark:border-neutral-700 dark:bg-neutral-950/80 dark:text-neutral-200"
          />
          <div className="flex items-center justify-between">
            <p className="text-[10px] text-neutral-400">
              Cmd/Ctrl+Enter to save
            </p>
            {isEditingAccomplishment && dailyAccomplishment && (
              <button
                type="button"
                onClick={() => {
                  setDailyAccomplishment("");
                  const todayKey = getTodayKey();
                  const updated = { ...accomplishments };
                  delete updated[todayKey];
                  setAccomplishments(updated);
                  localStorage.setItem("dailyAccomplishments", JSON.stringify(updated));
                  setIsEditingAccomplishment(false);
                }}
                className="text-[10px] text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
              >
                Delete
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}



