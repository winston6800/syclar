export type Subtask = {
  id: string;
  label: string;
  done: boolean;
  estimatedMinutes?: number;
};

export type Task = {
  id: string;
  label: string;
  subtasks: Subtask[];
  completed: boolean;
  timeSpent: number; // in minutes
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


