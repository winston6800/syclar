// Hero Rank System
// Rank format: [Class] class Rank #[Number] (e.g., "C class Rank #391")
// Classes: F (lowest), E, D, C, B, A, S (highest)
// Each class has ranks numbered from 1 (highest in class) to max (lowest in class)

export type RankClass = "F" | "E" | "D" | "C" | "B" | "A" | "S";

export interface HeroRank {
  class: RankClass;
  number: number; // Rank number within class (1 = highest, higher = lower)
  points: number; // Current points (can go negative)
}

const CLASS_ORDER: RankClass[] = ["F", "E", "D", "C", "B", "A", "S"];
const RANKS_PER_CLASS = 1000; // Each class has 1000 ranks (1-1000)
const POINTS_PER_RANK_DOWN = 10; // Points lost per rank down
const INITIAL_POINTS = 0;

// Progressive point requirements for rank-ups (doubling each time)
const getRankUpThreshold = (currentRank: HeroRank): number => {
  const classIndex = CLASS_ORDER.indexOf(currentRank.class);
  if (classIndex === CLASS_ORDER.length - 1 && currentRank.number === 1) {
    return Infinity; // Already at ceiling (S class Rank #1)
  }
  
  // Calculate base threshold based on class and rank
  // Lower ranks in higher classes require more points
  const baseThreshold = 100 * Math.pow(2, classIndex); // 100, 200, 400, 800, 1600, 3200, 6400
  const rankMultiplier = 1 + (currentRank.number - 1) / 100; // Slight increase per rank
  return Math.floor(baseThreshold * rankMultiplier);
};

// Calculate rank from total points
// Simple approach: Start at C class Rank #500 at 0 points
// Each 10 points = 1 rank change (up or down)
// Rank-ups within class are easier, class changes require more points
export const calculateRankFromPoints = (points: number): HeroRank => {
  // Floor: F class Rank #1000 (lowest possible)
  const floorPoints = -5000; // F class Rank #1000
  if (points <= floorPoints) {
    return { class: "F", number: 1000, points };
  }

  // Start at C class Rank #500 at 0 points
  // Each rank change = 10 points
  const rankOffset = Math.floor((points - 0) / POINTS_PER_RANK_DOWN);
  
  let currentClass: RankClass = "C";
  let currentNumber = 500;
  
  // Adjust rank based on offset
  if (rankOffset > 0) {
    // Going up (positive points)
    let remaining = rankOffset;
    while (remaining > 0 && (currentClass !== "S" || currentNumber !== 1)) {
      if (currentNumber > 1) {
        currentNumber--;
        remaining--;
      } else if (currentClass !== "S") {
        const currentIndex = CLASS_ORDER.indexOf(currentClass);
        currentClass = CLASS_ORDER[currentIndex + 1];
        currentNumber = RANKS_PER_CLASS;
        remaining--;
      } else {
        break;
      }
    }
  } else if (rankOffset < 0) {
    // Going down (negative points)
    let remaining = Math.abs(rankOffset);
    while (remaining > 0 && (currentClass !== "F" || currentNumber !== 1000)) {
      if (currentNumber < RANKS_PER_CLASS) {
        currentNumber++;
        remaining--;
      } else if (currentClass !== "F") {
        const currentIndex = CLASS_ORDER.indexOf(currentClass);
        currentClass = CLASS_ORDER[currentIndex - 1];
        currentNumber = 1;
        remaining--;
      } else {
        break;
      }
    }
  }
  
  // Ensure we don't go below floor
  if (currentClass === "F" && currentNumber > 1000) {
    currentNumber = 1000;
  }
  
  // Ensure we don't go above ceiling
  if (currentClass === "S" && currentNumber < 1) {
    currentNumber = 1;
  }
  
  return { class: currentClass, number: currentNumber, points };
};

// Deduct points for visiting unproductive website
export const deductPointsForUnproductiveSite = (
  currentRank: HeroRank,
  minutesSpent: number = 1
): HeroRank => {
  // Deduct 1 point per minute on unproductive site
  const pointsDeducted = minutesSpent;
  const newPoints = currentRank.points - pointsDeducted;
  
  // Calculate new rank (points can go negative, but rank has floor)
  const newRank = calculateRankFromPoints(newPoints);
  
  // Ensure rank never goes below floor
  if (newRank.class === "F" && newRank.number > 1000) {
    newRank.number = 1000;
  }
  
  return newRank;
};

// Add points for completing work (task completion)
export const addPointsForWorkCompleted = (
  currentRank: HeroRank,
  pointsToAdd: number = 10
): HeroRank => {
  // Add points for completing work (default: 10 points = 1 rank change)
  const newPoints = currentRank.points + pointsToAdd;
  
  // Calculate new rank from updated points
  const newRank = calculateRankFromPoints(newPoints);
  
  // Ensure rank never goes above ceiling
  if (newRank.class === "S" && newRank.number < 1) {
    newRank.number = 1;
  }
  
  return newRank;
};

// Format rank as string
export const formatRank = (rank: HeroRank): string => {
  return `${rank.class} class Rank #${rank.number}`;
};

// Get initial rank (C class Rank #500)
export const getInitialRank = (): HeroRank => {
  return { class: "C", number: 500, points: INITIAL_POINTS };
};

// Check if rank-up is possible and calculate points needed
export const getRankUpInfo = (currentRank: HeroRank): {
  canRankUp: boolean;
  pointsNeeded: number;
  nextRank: HeroRank | null;
} => {
  // Can't rank up if at ceiling
  if (currentRank.class === "S" && currentRank.number === 1) {
    return { canRankUp: false, pointsNeeded: Infinity, nextRank: null };
  }
  
  const threshold = getRankUpThreshold(currentRank);
  const pointsNeeded = threshold - currentRank.points;
  
  // Calculate next rank
  let nextRank: HeroRank;
  if (currentRank.number > 1) {
    // Rank up within same class
    nextRank = { ...currentRank, number: currentRank.number - 1 };
  } else {
    // Rank up to next class
    const currentIndex = CLASS_ORDER.indexOf(currentRank.class);
    if (currentIndex < CLASS_ORDER.length - 1) {
      nextRank = {
        class: CLASS_ORDER[currentIndex + 1],
        number: RANKS_PER_CLASS,
        points: threshold,
      };
    } else {
      return { canRankUp: false, pointsNeeded: Infinity, nextRank: null };
    }
  }
  
  return {
    canRankUp: currentRank.points >= threshold,
    pointsNeeded: Math.max(0, pointsNeeded),
    nextRank,
  };
};

