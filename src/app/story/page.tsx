"use client";

import * as motion from "motion/react-client";
import { DailyStoryCard } from "@/components/story/daily-story-card";
import { StoryArchive } from "@/components/story/story-archive";
import { BookOpen, Sparkles } from "lucide-react";
import { useState, useEffect } from "react";

export default function StoryPage() {
  const [stories, setStories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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
    setIsLoading(false);
  }, []);

  const handleStorySubmit = (newStory: any) => {
    const updatedStories = [newStory, ...stories];
    setStories(updatedStories);
    localStorage.setItem("dailyStories", JSON.stringify(updatedStories));
  };

  return (
    <div className="min-h-screen w-full overflow-hidden bg-white dark:bg-black">
      {/* Subtle Background Gradient - Apple style */}
      <div className="fixed inset-0 -z-10 bg-gradient-to-b from-white via-white to-neutral-50/50 dark:from-black dark:via-black dark:to-neutral-950/50" />

      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center px-6 py-24 sm:px-8 lg:px-12 pt-24">
        <div className="mx-auto w-full max-w-4xl">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="mb-8 flex justify-center"
          >
            <div className="inline-flex items-center gap-2 rounded-full bg-neutral-100/80 px-5 py-2 text-sm backdrop-blur-xl dark:bg-neutral-900/80">
              <Sparkles className="size-3.5 text-neutral-600 dark:text-neutral-400" />
              <span className="text-neutral-600 dark:text-neutral-400">
                Write your story
              </span>
            </div>
          </motion.div>

          {/* Main Headline */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="mb-8 space-y-6 text-center"
          >
            <h1 className="text-5xl font-semibold leading-[1.05] tracking-[-0.02em] sm:text-6xl md:text-7xl">
              Your Story,
              <br />
              <span className="bg-gradient-to-r from-neutral-700 to-neutral-500 bg-clip-text text-transparent dark:from-neutral-300 dark:to-neutral-400">
                Your Choices
              </span>
            </h1>
          </motion.div>

          {/* Subheadline */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="mb-12 text-center"
          >
            <p className="mx-auto max-w-2xl text-lg font-light leading-relaxed text-neutral-600 sm:text-xl dark:text-neutral-400">
              You are the protagonist of your own story. Every day is a new chapter. Share how you moved forward, what you accomplished, and what it felt like. Because momentum isn't just about the metrics—it's about the narrative you're building.
            </p>
          </motion.div>

          {/* Daily Story Input */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="mb-16"
          >
            <DailyStoryCard onSubmit={handleStorySubmit} />
          </motion.div>

          {/* Divider */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="mb-16 flex items-center gap-4"
          >
            <div className="flex-1 border-t border-neutral-200 dark:border-neutral-800" />
            <span className="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-500">
              <BookOpen className="size-3.5" />
              Your archive
            </span>
            <div className="flex-1 border-t border-neutral-200 dark:border-neutral-800" />
          </motion.div>

          {/* Story Archive */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            {!isLoading && <StoryArchive stories={stories} />}
          </motion.div>
        </div>
      </section>
    </div>
  );
}
