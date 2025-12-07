export type Pillar = {
  id: string;
  name: string;
  winDefinition: string;
  estimatedWeeks?: number;
  estimatedCompletion?: Date;
};

export type Stone = {
  id: string;
  pillarId: string;
  name: string;
  completed: boolean;
  estimatedWeeks?: number;
  scheduledWeek?: number;
  inProgress?: boolean; // whether this stone is currently being worked on (max 1)
};


