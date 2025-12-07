"use client";

import { useState, useEffect } from "react";
import { Calendar, Star, ChevronLeft, ChevronRight, X, Edit2, Trash2 } from "lucide-react";

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
  const [editingDate, setEditingDate] = useState<string | null>(null);
  const [editText, setEditText] = useState<string>("");

  const pad = (n: number) => n.toString().padStart(2, "0");

  const getTodayKey = () => {
    const d = new Date();
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
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
    // Use local date components to avoid timezone shifts from toISOString
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
  };

  const formatDateDisplay = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const parseDateKey = (dateKey: string): Date => {
    // dateKey is in format "YYYY-MM-DD"
    const [year, month, day] = dateKey.split("-").map(Number);
    return new Date(year, month - 1, day);
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

  const startEditing = (dateKey: string) => {
    // Ensure we have the latest data from localStorage
    const saved = localStorage.getItem("dailyAccomplishments");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setAccomplishments(parsed);
        setEditingDate(dateKey);
        setEditText(parsed[dateKey] || "");
      } catch (e) {
        console.error("Failed to load accomplishment:", e);
        setEditingDate(dateKey);
        setEditText(accomplishments[dateKey] || "");
      }
    } else {
      setEditingDate(dateKey);
      setEditText(accomplishments[dateKey] || "");
    }
  };

  const saveEdit = () => {
    if (editingDate) {
      const updated = { ...accomplishments };
      if (editText.trim()) {
        updated[editingDate] = editText.trim();
      } else {
        delete updated[editingDate];
      }
      setAccomplishments(updated);
      localStorage.setItem("dailyAccomplishments", JSON.stringify(updated));
      setEditingDate(null);
      setEditText("");
    }
  };

  const cancelEdit = () => {
    setEditingDate(null);
    setEditText("");
  };

  const deleteAccomplishment = (dateKey: string) => {
    const updated = { ...accomplishments };
    delete updated[dateKey];
    setAccomplishments(updated);
    localStorage.setItem("dailyAccomplishments", JSON.stringify(updated));
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
                  onClick={() => startEditing(dateKey)}
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
                  const date = parseDateKey(dateKey);
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
                      <div className="mb-1 flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
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
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => startEditing(dateKey)}
                            className="rounded p-1 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600 dark:hover:bg-neutral-800 dark:hover:text-neutral-300"
                            title="Edit"
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => deleteAccomplishment(dateKey)}
                            className="rounded p-1 text-neutral-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20 dark:hover:text-red-400"
                            title="Delete"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
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

        {/* Edit Modal */}
        {editingDate && (
          <div className="absolute inset-0 z-10 flex items-center justify-center rounded-3xl bg-black/50 backdrop-blur-sm">
            <div className="w-full max-w-md rounded-2xl border border-neutral-200 bg-white p-6 shadow-2xl dark:border-neutral-800 dark:bg-neutral-900">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                    {formatDateDisplay(parseDateKey(editingDate))}
                  </h3>
                  <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                    Most proud of accomplishment
                  </p>
                </div>
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="rounded-full p-1 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 dark:hover:bg-neutral-800 dark:hover:text-neutral-200"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <textarea
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                placeholder="What were you most proud of on this day?"
                rows={4}
                autoFocus
                className="mb-4 w-full resize-none rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-800 placeholder:text-neutral-400 focus:border-neutral-400 focus:outline-none focus:ring-0 dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-200"
              />
              <div className="flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => {
                    if (editingDate) {
                      deleteAccomplishment(editingDate);
                      cancelEdit();
                    }
                  }}
                  className="rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-100 dark:border-red-900/50 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/30"
                >
                  <Trash2 className="mr-2 inline h-4 w-4" />
                  Delete
                </button>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={cancelEdit}
                    className="rounded-lg border border-neutral-200 bg-white px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-300 dark:hover:bg-neutral-900"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={saveEdit}
                    className="rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-200"
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}



