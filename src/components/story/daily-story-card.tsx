"use client";

import { useState } from "react";
import { Send, CheckCircle2 } from "lucide-react";
import * as motion from "motion/react-client";

interface DailyStoryCardProps {
  onSubmit: (story: any) => void;
}

export function DailyStoryCard({ onSubmit }: DailyStoryCardProps) {
  const [story, setStory] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const maxChars = 2000;
  const charCount = story.length;
  const charPercent = (charCount / maxChars) * 100;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!story.trim()) return;

    setIsSubmitting(true);

    // Simulate submission delay
    await new Promise((resolve) => setTimeout(resolve, 600));

    const newStory = {
      id: Date.now(),
      content: story.trim(),
      date: new Date().toISOString(),
      createdAt: new Date().toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
      }),
    };

    onSubmit(newStory);
    setStory("");
    setIsSubmitting(false);
    setIsSuccess(true);

    // Reset success state after 2 seconds
    setTimeout(() => setIsSuccess(false), 2000);
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="group relative w-full"
    >
      {/* Main input container - Apple style */}
      <div className="relative space-y-3">
        {/* Textarea with gradient border on focus */}
        <div className="relative overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-50/50 transition-all duration-300 dark:border-neutral-800 dark:bg-neutral-950/50 group-focus-within:border-neutral-300 dark:group-focus-within:border-neutral-700">
          {/* Animated gradient border on focus */}
          <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-neutral-200 to-transparent opacity-0 transition-opacity duration-300 group-focus-within:opacity-100 dark:via-neutral-700" />

          <textarea
            value={story}
            onChange={(e) => {
              if (e.target.value.length <= maxChars) {
                setStory(e.target.value);
              }
            }}
            placeholder="Tell your story today. What moved you forward? What did you accomplish? How did momentum feel? Remember: you control the narrative..."
            className="relative z-10 w-full resize-none rounded-2xl bg-transparent px-6 py-5 text-lg font-light placeholder-neutral-400 outline-none dark:placeholder-neutral-600"
            rows={8}
            disabled={isSubmitting}
          />
        </div>

        {/* Character count and progress bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs text-neutral-500 dark:text-neutral-500">
              {charCount.toLocaleString()} / {maxChars.toLocaleString()} characters
            </span>
            <span
              className={`text-xs font-medium transition-colors ${
                charPercent > 90
                  ? "text-red-500 dark:text-red-400"
                  : charPercent > 75
                    ? "text-amber-500 dark:text-amber-400"
                    : "text-neutral-400 dark:text-neutral-600"
              }`}
            >
              {Math.round(charPercent)}%
            </span>
          </div>

          {/* Progress bar */}
          <div className="h-1 overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-800">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${charPercent}%` }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className={`h-full transition-colors ${
                charPercent > 90
                  ? "bg-red-500 dark:bg-red-400"
                  : charPercent > 75
                    ? "bg-amber-500 dark:bg-amber-400"
                    : "bg-neutral-400 dark:bg-neutral-600"
              }`}
            />
          </div>
        </div>

        {/* Submit button and motivational text */}
        <div className="flex items-center justify-between gap-4">
          <p className="text-xs text-neutral-500 dark:text-neutral-500">
            {story.trim().length === 0
              ? "Share your momentum today"
              : `${story.trim().split(/\s+/).length} words`}
          </p>

          <button
            type="submit"
            disabled={!story.trim() || isSubmitting}
            className="relative inline-flex items-center gap-2 rounded-full bg-neutral-900 px-5 py-2.5 text-sm font-medium text-white transition-all duration-300 disabled:opacity-50 dark:bg-neutral-100 dark:text-neutral-900 hover:disabled:opacity-50 hover:shadow-lg active:scale-95"
          >
            {isSuccess ? (
              <>
                <CheckCircle2 className="size-4" />
                <span>Saved</span>
              </>
            ) : isSubmitting ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="size-4 rounded-full border-2 border-current border-r-transparent"
                />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Send className="size-4" />
                <span>Share Story</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Subtle hint text below */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="mt-6 text-center text-xs text-neutral-500 dark:text-neutral-500"
      >
        Every story matters. This is your record of momentum.
      </motion.p>
    </motion.form>
  );
}
