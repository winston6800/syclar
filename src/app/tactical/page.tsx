"use client";

import { useEffect, useRef, useState } from "react";
import { Sparkles } from "lucide-react";
import { toast } from "sonner";
import { useScreentimeTracker } from "@/lib/use-screentime-tracker";
import { recordCycle, recordFocusTime } from "@/lib/stats";
import { GamificationPanel } from "@/components/gamification-panel";
import type { Task, Subtask, FocusSession, Stone } from "@/components/tactical/types";
import { StoneDropZone } from "@/components/tactical/stone-drop-zone";
import { DailyAccomplishment } from "@/components/tactical/daily-accomplishment";
import { AccomplishmentCalendar } from "@/components/tactical/accomplishment-calendar";
import { HeroRankDisplay } from "@/components/tactical/hero-rank-display";
import { AllowanceDisplay } from "@/components/tactical/allowance-display";
import { TaskList } from "@/components/tactical/task-list";

export default function TacticalPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskLabel, setNewTaskLabel] = useState("");
  const [isBreakingDown, setIsBreakingDown] = useState(false);
  const [focusSession, setFocusSession] = useState<FocusSession>({
    taskId: null,
    startTime: null,
    elapsedSeconds: 0,
    isRunning: false,
  });
  const [allowance, setAllowance] = useState(0);
  const [goodwill, setGoodwill] = useState(0);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [availableStones, setAvailableStones] = useState<Stone[]>([]);

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

  // Load stones from localStorage (synced from strategy page)
  useEffect(() => {
    const loadStones = () => {
      const saved = localStorage.getItem("strategyStones");
      if (saved) {
        try {
          const stones = JSON.parse(saved);
          const incomplete = stones.filter((s: { completed: boolean }) => !s.completed);
          setAvailableStones(incomplete);
        } catch (e) {
          console.error("Failed to load stones:", e);
        }
      }
    };
    loadStones();
    window.addEventListener("storage", loadStones);
    const interval = setInterval(loadStones, 1000);
    return () => {
      window.removeEventListener("storage", loadStones);
      clearInterval(interval);
    };
  }, []);

  // Handle pending stone from click (instead of drag)
  useEffect(() => {
    const checkPendingStone = () => {
      const pendingStone = localStorage.getItem("pendingStone");
      if (pendingStone) {
        try {
          const stoneData = JSON.parse(pendingStone);
          localStorage.removeItem("pendingStone");
          
          const newTaskId = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
          
          setTasks((prev) => {
            if (prev.some((task) => task.label === stoneData.name)) {
              return prev;
            }
            
            const newTask: Task = {
              id: newTaskId,
              label: stoneData.name,
              subtasks: [],
              completed: false,
              timeSpent: 0,
            };

            return [...prev, newTask];
          });

          setTimeout(() => {
            startFocus(newTaskId);
          }, 500);

          setIsBreakingDown(true);
          fetch("/api/ai/breakdown-task", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ task: stoneData.name }),
          })
            .then((res) => res.json())
            .then((data) => {
              if (data.success && data.subtasks) {
                const newSubtasks: Subtask[] = data.subtasks.map(
                  (subtask: { label: string; estimatedMinutes: number }) => ({
                    id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
                    label: subtask.label,
                    done: false,
                    estimatedMinutes: subtask.estimatedMinutes,
                  }),
                );
                setTasks((prev) =>
                  prev.map((task) =>
                    task.id === newTaskId
                      ? { ...task, subtasks: [...task.subtasks, ...newSubtasks] }
                      : task,
                  ),
                );
              }
            })
            .catch((error) => {
              console.error("Failed to break down task:", error);
            })
            .finally(() => {
              setIsBreakingDown(false);
            });
        } catch (e) {
          console.error("Failed to process pending stone:", e);
        }
      }
    };
    
    checkPendingStone();
    const interval = setInterval(checkPendingStone, 500);
    return () => clearInterval(interval);
  }, []);

  // Focus timer effect
  useEffect(() => {
    if (focusSession.isRunning && focusSession.taskId) {
      timerRef.current = setInterval(() => {
        setFocusSession((prev) => ({
          ...prev,
          elapsedSeconds: prev.elapsedSeconds + 1,
        }));
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
  }, [focusSession.isRunning, focusSession.taskId]);

  const addTask = () => {
    const trimmed = newTaskLabel.trim();
    if (!trimmed) return;
    const task: Task = {
      id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      label: trimmed,
      subtasks: [],
      completed: false,
      timeSpent: 0,
    };
    setTasks((prev) => [...prev, task]);
    setNewTaskLabel("");
  };

  const startFocus = (taskId: string) => {
    if (focusSession.isRunning && focusSession.taskId !== taskId) {
      stopFocus();
    }
    setFocusSession({
      taskId,
      startTime: new Date(),
      elapsedSeconds: 0,
      isRunning: true,
    });
  };

  const pauseFocus = () => {
    if (!focusSession.taskId) return;
    setFocusSession((prev) => ({
      ...prev,
      isRunning: false,
    }));
  };

  const resumeFocus = () => {
    if (!focusSession.taskId) return;
    setFocusSession((prev) => ({
      ...prev,
      isRunning: true,
    }));
  };

  const stopFocus = () => {
    if (!focusSession.taskId) return;

    const minutes = Math.floor(focusSession.elapsedSeconds / 60);
    const fiveMinuteBlocks = Math.floor(minutes / 5);
    const earnedAllowance = fiveMinuteBlocks * 0.05;
    const earnedGoodwill = fiveMinuteBlocks;

    setTasks((prev) =>
      prev.map((task) =>
        task.id === focusSession.taskId
          ? { ...task, timeSpent: task.timeSpent + minutes }
          : task,
      ),
    );

    setAllowance((prev) => prev + earnedAllowance);
    setGoodwill((prev) => prev + earnedGoodwill);

    if (minutes > 0) {
      const updatedStats = recordFocusTime(minutes);
      fetch("/api/stats/record", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stats: updatedStats }),
      }).catch(console.error);
    }

    setFocusSession({
      taskId: null,
      startTime: null,
      elapsedSeconds: 0,
      isRunning: false,
    });
  };

  const toggleTaskComplete = (taskId: string) => {
    setTasks((prev) => {
      const task = prev.find((t) => t.id === taskId);
      const wasCompleted = task?.completed;
      const updated = prev.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task,
      );
      
      const nowCompleted = updated.find((t) => t.id === taskId)?.completed;
      
      // Play completion sound when task is completed
      if (nowCompleted && !wasCompleted) {
        // Calculate time saved if we have estimates
        if (task) {
          const totalEstimatedMinutes = task.subtasks.reduce((sum, s) => {
            return sum + (s.estimatedMinutes || 0);
          }, 0);
          
          if (totalEstimatedMinutes > 0 && task.timeSpent > 0) {
            const timeSaved = totalEstimatedMinutes - task.timeSpent;
            if (timeSaved > 0) {
              const savedHours = Math.floor(timeSaved / 60);
              const savedMinutes = timeSaved % 60;
              let savedText = "";
              if (savedHours > 0) {
                savedText = savedMinutes > 0 
                  ? `${savedHours}h ${savedMinutes}m` 
                  : `${savedHours}h`;
              } else {
                savedText = `${savedMinutes}m`;
              }
              
              toast.success(`🎉 Time saved: ${savedText}!`, {
                description: `Completed ${savedText} ahead of schedule`,
              });
            } else if (timeSaved < 0) {
              const overTime = Math.abs(timeSaved);
              const overHours = Math.floor(overTime / 60);
              const overMinutes = overTime % 60;
              let overText = "";
              if (overHours > 0) {
                overText = overMinutes > 0 
                  ? `${overHours}h ${overMinutes}m` 
                  : `${overHours}h`;
              } else {
                overText = `${overMinutes}m`;
              }
              
              toast.info(`Completed ${overText} over estimate`, {
                description: "Keep pushing forward!",
              });
            }
          }
        }
        
        // Create a satisfying completion sound using Web Audio API
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        // Create a pleasant chime sound
        oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime); // C5
        oscillator.frequency.setValueAtTime(659.25, audioContext.currentTime + 0.1); // E5
        oscillator.frequency.setValueAtTime(783.99, audioContext.currentTime + 0.2); // G5
        
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.3);
        
        const updatedStats = recordCycle();
        fetch("/api/stats/record", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ stats: updatedStats }),
        }).catch(console.error);
        
        // Add points to hero rank for completing work
        addPoints(10); // 10 points = 1 rank change
      }
      
      return updated;
    });
  };

  const removeTask = (taskId: string) => {
    if (focusSession.taskId === taskId && focusSession.isRunning) {
      stopFocus();
    }
    setTasks((prev) => prev.filter((task) => task.id !== taskId));
  };

  const breakDownWithAI = async (taskId: string, taskLabel: string) => {
    setIsBreakingDown(true);
    try {
      const response = await fetch("/api/ai/breakdown-task", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          task: taskLabel,
        }),
      });

      const data = await response.json();
      if (data.success && data.subtasks) {
        const newSubtasks: Subtask[] = data.subtasks.map(
          (subtask: { label: string; estimatedMinutes: number }) => ({
            id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
            label: subtask.label,
            done: false,
            estimatedMinutes: subtask.estimatedMinutes,
          }),
        );
        setTasks((prev) =>
          prev.map((task) =>
            task.id === taskId
              ? { ...task, subtasks: [...task.subtasks, ...newSubtasks] }
              : task,
          ),
        );
      }
    } catch (error) {
      console.error("Failed to break down task:", error);
      alert("Failed to break down task. Please try again.");
    } finally {
      setIsBreakingDown(false);
    }
  };

  const toggleSubtask = (taskId: string, subtaskId: string) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId
          ? {
              ...task,
              subtasks: task.subtasks.map((s) =>
                s.id === subtaskId ? { ...s, done: !s.done } : s,
              ),
            }
          : task,
      ),
    );
  };

  const addSubtask = (taskId: string, subtaskLabel: string) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId
          ? {
              ...task,
              subtasks: [
                ...task.subtasks,
                {
                  id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
                  label: subtaskLabel,
                  done: false,
                },
              ],
            }
          : task,
      ),
    );
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

  const formatMinutes = (minutes: number) => {
    if (minutes < 60) return `${minutes}m`;
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return m > 0 ? `${h}h ${m}m` : `${h}h`;
  };

  const handleDrop = async (task: Task) => {
    setTasks((prev) => [...prev, task]);
  };

  const handleBreakDown = async (taskId: string, taskLabel: string) => {
    await breakDownWithAI(taskId, taskLabel);
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
                Tactical Station
              </span>
            </div>
              <h1 className="mt-4 text-4xl font-semibold tracking-[-0.03em] sm:text-5xl">
                Focus & Execute
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

          {/* Plate UI - Drop zone for stones */}
          <StoneDropZone
            availableStones={availableStones}
            onDrop={handleDrop}
            onBreakDown={handleBreakDown}
            onStartFocus={startFocus}
          />

          {/* Todoist-style Task List */}
          <TaskList
            tasks={tasks}
            newTaskLabel={newTaskLabel}
            focusSession={focusSession}
            isBreakingDown={isBreakingDown}
            onNewTaskChange={setNewTaskLabel}
            onAddTask={addTask}
            onToggleComplete={toggleTaskComplete}
            onStartFocus={startFocus}
            onPauseFocus={pauseFocus}
            onResumeFocus={resumeFocus}
            onStopFocus={stopFocus}
            onRemove={removeTask}
            onBreakDown={breakDownWithAI}
            onToggleSubtask={toggleSubtask}
            onAddSubtask={addSubtask}
            formatTime={formatTime}
            formatMinutes={formatMinutes}
          />

          {/* Gamification Panel */}
          <div className="mt-8">
            <GamificationPanel />
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
