"use client";

import * as motion from "motion/react-client";
import { Trash2 } from "lucide-react";
import { useState } from "react";

interface Story {
  id: number;
  content: string;
  date: string;
  createdAt: string;
}

interface StoryArchiveProps {
  stories: Story[];
}

export function StoryArchive({ stories }: StoryArchiveProps) {
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [localStories, setLocalStories] = useState(stories);

  const handleDelete = (id: number) => {
    setDeletingId(id);
    setTimeout(() => {
      const updated = localStories.filter((s) => s.id !== id);
      setLocalStories(updated);
      localStorage.setItem("dailyStories", JSON.stringify(updated));
      setDeletingId(null);
    }, 300);
  };

  if (localStories.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="rounded-2xl border border-dashed border-neutral-200 bg-neutral-50/30 px-8 py-16 text-center dark:border-neutral-800 dark:bg-neutral-950/30"
      >
        <p className="text-neutral-500 dark:text-neutral-500">
          No stories yet. Start writing your momentum journey today.
        </p>
      </motion.div>
    );
  }

  return (
    <div className="space-y-3">
      {localStories.map((story, index) => (
        <motion.div
          key={story.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{
            opacity: deletingId === story.id ? 0 : 1,
            y: deletingId === story.id ? -10 : 0,
          }}
          transition={{ duration: 0.3 }}
          className="group relative overflow-hidden rounded-xl border border-neutral-200 bg-white/50 p-5 transition-all duration-300 hover:bg-white hover:shadow-sm dark:border-neutral-800 dark:bg-neutral-950/50 dark:hover:bg-neutral-950"
        >
          {/* Delete button */}
          <button
            onClick={() => handleDelete(story.id)}
            className="absolute right-4 top-4 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
            aria-label="Delete story"
          >
            <Trash2 className="size-4 text-neutral-400 hover:text-red-500 dark:text-neutral-600 dark:hover:text-red-400" />
          </button>

          {/* Date header */}
          <div className="mb-3 flex items-center justify-between pr-8">
            <p className="text-xs font-semibold uppercase tracking-widest text-neutral-600 dark:text-neutral-400">
              {story.createdAt}
            </p>
            <span className="text-xs text-neutral-400 dark:text-neutral-600">
              {story.content.split(/\s+/).length} words
            </span>
          </div>

          {/* Story content */}
          <p className="text-sm leading-relaxed text-neutral-700 dark:text-neutral-300">
            {story.content}
          </p>

          {/* Subtle accent line */}
          <div className="absolute bottom-0 left-0 h-0.5 w-full bg-gradient-to-r from-neutral-200 via-neutral-200 to-transparent dark:from-neutral-700 dark:via-neutral-700" />
        </motion.div>
      ))}
    </div>
  );
}
