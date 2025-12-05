export type Pillar = {
  id: string;
  name: string;
  winDefinition: string;
};

export type Stone = {
  id: string;
  pillarId: string;
  name: string;
  completed: boolean;
};


