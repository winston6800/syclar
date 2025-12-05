"use client";
import { useEffect, useState } from "react";
import * as motion from "motion/react-client";

export function Counter() {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    async function fetchCount() {
      try {
        const response = await fetch("/api/waitlist/count");
        const data = await response.json();
        setCount(data.count || 0);
      } catch (error) {
        console.error("Error fetching waitlist count:", error);
        setCount(0);
      }
    }

    fetchCount();
    // Refresh count every 30 seconds
    const interval = setInterval(fetchCount, 30000);
    return () => clearInterval(interval);
  }, []);

  if (count === null) {
    return (
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-sm font-light text-neutral-500 dark:text-neutral-500"
        aria-live="polite"
      >
        Loading...
      </motion.p>
    );
  }

  return (
    <motion.p
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="text-sm font-light text-neutral-500 dark:text-neutral-500"
      aria-live="polite"
    >
      Join <span className="font-medium text-neutral-900 dark:text-neutral-100">{count.toLocaleString()}</span>+ others
      who signed up
    </motion.p>
  );
}
