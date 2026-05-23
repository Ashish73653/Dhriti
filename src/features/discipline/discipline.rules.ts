import { FoodClass } from '@/types';

// Fat-loss focused scoring rules
export const DISCIPLINE_RULES = {
  // Steps: 20 pts
  STEPS: { weight: 20, target: 8000 },
  // Sugar: 25 pts (higher weight - sugar reduction is key goal)
  SUGAR: { weight: 25, dailyLimitG: 25 },
  // Sleep: 15 pts
  SLEEP: { weight: 15, minHours: 7, maxHours: 9 },
  // Calories: 20 pts (fat loss: 1400–1800 kcal deficit range)
  CALORIES: { weight: 20, minKcal: 1200, targetKcal: 1600, maxKcal: 1900 },
  // Water: 10 pts
  WATER: { weight: 10, targetMl: 2500 },
  // Workouts: 10 pts
  WORKOUTS: { weight: 10, targetSessions: 1 },
} as const;

// Food classification thresholds
export const FOOD_CLASS_RULES = {
  GREEN: { maxSugarG: 5, maxCalories: 300 },
  YELLOW: { maxSugarG: 15, maxCalories: 500 },
  // RED = above YELLOW thresholds
} as const;

export function classifyFood(calories: number, sugarG: number): FoodClass {
  if (sugarG > 15 || calories > 500) return 'RED';
  if (sugarG > 5 || calories > 300) return 'YELLOW';
  return 'GREEN';
}
