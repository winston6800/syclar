export type Pillar = {
  id: string;
  description: string;
};

export type DailyGoal = {
  id: string;
  description: string;
  pillarId: string;
  estimatedMinutes: number;
  createdAt: Date;
};



