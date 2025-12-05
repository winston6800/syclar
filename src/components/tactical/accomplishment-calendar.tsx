"use client";

import { useState, useEffect } from "react";
import { Calendar, Star, ChevronLeft, ChevronRight, X } from "lucide-react";

type AccomplishmentCalendarProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function AccomplishmentCalendar({
  isOpen,
  onClose,
}: AccomplishmentCalendarProps) {
  const [accomplishments, setAccomplishments] = useState<Record<string, string>>({});
  const [calendarMonth, setCalendarMonth] = useState(new Date());

  const getTodayKey = () => {
    return new Date().toISOString().split("T")[0];
  };

  useEffect(() => {
    const saved = localStorage.getItem("dailyAccomplishments");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setAccomplishments(parsed);
      } catch (e) {
        console.error("Failed to load accomplishments:", e);
      }
    }

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "dailyAccomplishments" && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          setAccomplishments(parsed);
        } catch (e) {
          console.error("Failed to sync accomplishments:", e);
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    // Add empty cells for days before month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    // Add days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    return days;
  };

  const formatDateKey = (date: Date) => {
    return date.toISOString().split("T")[0];
  };

  const formatDateDisplay = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const navigateMonth = (direction: "prev" | "next") => {
    setCalendarMonth((prev) => {
      const newDate = new Date(prev);
      if (direction === "prev") {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl rounded-3xl border border-neutral-200 bg-white/95 p-6 shadow-2xl dark:border-neutral-800 dark:bg-neutral-900/95">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Calendar className="h-5 w-5 text-neutral-600 dark:text-neutral-400" />
            <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
              Accomplishment Calendar
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 dark:hover:bg-neutral-800 dark:hover:text-neutral-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Month Navigation */}
        <div className="mb-4 flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigateMonth("prev")}
            className="rounded-lg p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
            {calendarMonth.toLocaleDateString("en-US", {
              month: "long",
              year: "numeric",
            })}
          </h3>
          <button
            type="button"
            onClick={() => navigateMonth("next")}
            className="rounded-lg p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        {/* Calendar Grid */}
        <div className="mb-6">
          {/* Day headers */}
          <div className="mb-2 grid grid-cols-7 gap-1">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div
                key={day}
                className="p-2 text-center text-xs font-semibold text-neutral-500 dark:text-neutral-400"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar days */}
          <div className="grid grid-cols-7 gap-1">
            {getDaysInMonth(calendarMonth).map((date, index) => {
              if (!date) {
                return <div key={`empty-${index}`} className="p-2" />;
              }

              const dateKey = formatDateKey(date);
              const hasAccomplishment = !!accomplishments[dateKey];
              const isToday = dateKey === getTodayKey();

              return (
                <button
                  key={dateKey}
                  type="button"
                  onClick={() => {
                    // Could show accomplishment for this date
                    const acc = accomplishments[dateKey];
                    if (acc) {
                      alert(`${formatDateDisplay(date)}\n\n${acc}`);
                    }
                  }}
                  className={`relative rounded-lg p-2 text-sm transition-colors ${
                    isToday
                      ? "bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900"
                      : hasAccomplishment
                        ? "bg-yellow-50 text-neutral-900 hover:bg-yellow-100 dark:bg-yellow-900/20 dark:text-neutral-100 dark:hover:bg-yellow-900/30"
                        : "text-neutral-600 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800"
                  }`}
                >
                  <div>{date.getDate()}</div>
                  {hasAccomplishment && (
                    <Star className="absolute right-1 top-1 h-2.5 w-2.5 text-yellow-600 dark:text-yellow-400" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Previous Wins List */}
        <div className="max-h-64 space-y-2 overflow-y-auto rounded-xl border border-neutral-200 bg-neutral-50/50 p-4 dark:border-neutral-800 dark:bg-neutral-950/50">
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
            Previous Wins
          </h3>
          {Object.keys(accomplishments).length === 0 ? (
            <p className="text-sm text-neutral-400">
              No accomplishments yet. Start logging your wins!
            </p>
          ) : (
            <div className="space-y-3">
              {Object.entries(accomplishments)
                .sort((a, b) => b[0].localeCompare(a[0])) // Sort by date, newest first
                .map(([dateKey, accomplishment]) => {
                  const date = new Date(dateKey);
                  const isToday = dateKey === getTodayKey();
                  return (
                    <div
                      key={dateKey}
                      className={`rounded-lg border p-3 ${
                        isToday
                          ? "border-yellow-500 bg-yellow-50 dark:border-yellow-500/50 dark:bg-yellow-900/10"
                          : "border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900/80"
                      }`}
                    >
                      <div className="mb-1 flex items-center gap-2">
                        <Calendar className="h-3.5 w-3.5 text-neutral-500 dark:text-neutral-400" />
                        <span className="text-xs font-medium text-neutral-600 dark:text-neutral-400">
                          {formatDateDisplay(date)}
                          {isToday && (
                            <span className="ml-2 rounded-full bg-yellow-500 px-2 py-0.5 text-[10px] text-white">
                              Today
                            </span>
                          )}
                        </span>
                      </div>
                      <p className="text-sm text-neutral-800 dark:text-neutral-200">
                        {accomplishment}
                      </p>
                    </div>
                  );
                })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


