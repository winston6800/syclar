export type Subtask = {
  id: string;
  label: string;
  done: boolean;
  estimatedMinutes?: number;
  source?: "ai" | "user";
  note?: string;
};

export type Task = {
  id: string;
  label: string;
  subtasks: Subtask[];
  completed: boolean;
  timeSpent: number; // in minutes
  estimatedMinutes?: number; // task-level ETA in minutes
  successCriteria?: string;
  timeSaved?: number; // minutes saved when completed
};

export type FocusSession = {
  taskId: string | null;
  startTime: Date | null;
  elapsedSeconds: number;
  isRunning: boolean;
};

export type Stone = {
  id: string;
  name: string;
  pillarId: "1" | "2";
};


