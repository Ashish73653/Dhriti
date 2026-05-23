export type FoodClass = 'GREEN' | 'YELLOW' | 'RED';
export type MealType = 'BREAKFAST' | 'LUNCH' | 'DINNER' | 'SNACK';

export interface FoodItem {
  id: string;
  name: string;
  category: string;
  cuisine: 'indian' | 'western' | 'continental' | 'universal';
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  sugarG: number;
  fiberG: number;
  servingSize: string;
  foodClass: FoodClass;
}

export interface MealDTO {
  id: string;
  name: string;
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  sugarG: number;
  fiberG: number;
  servingSize: string;
  mealType: MealType;
  foodClass: FoodClass;
  notes?: string | null;
  loggedAt: string;
}

export interface WeightLogDTO {
  id: string;
  weightKg: number;
  bodyFatPct?: number | null;
  musclePct?: number | null;
  bmi?: number | null;
  notes?: string | null;
  loggedAt: string;
}

export interface DailyScoreDTO {
  id: string;
  date: string;
  disciplineScore: number;
  stepsScore: number;
  sugarScore: number;
  sleepScore: number;
  caloriesScore: number;
  waterScore: number;
  workoutScore: number;
  steps?: number | null;
  sleepHours?: number | null;
  sugarG?: number | null;
  calories?: number | null;
  waterMl: number;
  workouts: number;
}

export interface DashboardStats {
  caloriesToday: number;
  caloriesGoal: number;
  sugarToday: number;
  proteinToday: number;
  waterToday: number;
  waterGoal: number;
  disciplineScore: number;
  mealsToday: { green: number; yellow: number; red: number; total: number };
  latestWeight?: number | null;
  weightGoal?: number | null;
}
