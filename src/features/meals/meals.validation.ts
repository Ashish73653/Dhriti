import { z } from 'zod';

export const MealSchema = z.object({
  name: z.string().min(1, 'Food name is required'),
  calories: z.number().min(0).max(5000),
  proteinG: z.number().min(0).default(0),
  carbsG: z.number().min(0).default(0),
  fatG: z.number().min(0).default(0),
  sugarG: z.number().min(0).default(0),
  fiberG: z.number().min(0).default(0),
  servingSize: z.string().default('1 serving'),
  mealType: z.enum(['BREAKFAST', 'LUNCH', 'DINNER', 'SNACK']).default('LUNCH'),
  foodClass: z.enum(['GREEN', 'YELLOW', 'RED']),
  notes: z.string().optional(),
  loggedAt: z.string().optional(),
});

export type MealInput = z.infer<typeof MealSchema>;

export const WeightSchema = z.object({
  weightKg: z.number().min(20).max(300),
  bodyFatPct: z.number().min(1).max(70).optional(),
  musclePct: z.number().min(1).max(70).optional(),
  notes: z.string().optional(),
  loggedAt: z.string().optional(),
});

export type WeightInput = z.infer<typeof WeightSchema>;

export const DailyScoreUpdateSchema = z.object({
  date: z.string(),
  steps: z.number().min(0).optional(),
  sleepHours: z.number().min(0).max(24).optional(),
  waterMl: z.number().min(0).optional(),
  workouts: z.number().min(0).optional(),
});

export type DailyScoreUpdateInput = z.infer<typeof DailyScoreUpdateSchema>;
