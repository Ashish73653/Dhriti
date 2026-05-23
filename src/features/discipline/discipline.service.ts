import { prisma } from '@/lib/prisma';
import { DISCIPLINE_RULES } from './discipline.rules';
import { DailyScoreDTO } from '@/types';
import { startOfDay } from 'date-fns';

type MealAggregateRow = {
  sugarG: number;
  calories: number;
};

type DailyScoreRecord = {
  id: string;
  date: Date;
  disciplineScore: number;
  stepsScore: number;
  sugarScore: number;
  sleepScore: number;
  caloriesScore: number;
  waterScore: number;
  workoutScore: number;
  steps: number | null;
  sleepHours: number | null;
  sugarG: number | null;
  calories: number | null;
  waterMl: number;
  workouts: number;
};

interface ScoreComponents {
  steps?: number | null;
  sleepHours?: number | null;
  sugarG?: number | null;
  calories?: number | null;
  waterMl?: number | null;
  workouts?: number | null;
}

export function computeScore(data: ScoreComponents): {
  total: number;
  stepsScore: number;
  sugarScore: number;
  sleepScore: number;
  caloriesScore: number;
  waterScore: number;
  workoutScore: number;
} {
  const R = DISCIPLINE_RULES;

  // Steps (0-20)
  const stepsScore = data.steps
    ? Math.min(R.STEPS.weight, Math.round((data.steps / R.STEPS.target) * R.STEPS.weight))
    : 0;

  // Sugar (0-25): inverse — less sugar = higher score
  const sugar = data.sugarG ?? 999;
  const sugarScore =
    sugar <= R.SUGAR.dailyLimitG
      ? R.SUGAR.weight
      : Math.max(0, Math.round(R.SUGAR.weight * (1 - (sugar - R.SUGAR.dailyLimitG) / 30)));

  // Sleep (0-15)
  const sleep = data.sleepHours ?? 0;
  let sleepScore = 0;
  if (sleep >= R.SLEEP.minHours && sleep <= R.SLEEP.maxHours) sleepScore = R.SLEEP.weight;
  else if (sleep > 0) sleepScore = Math.max(0, Math.round(R.SLEEP.weight * (1 - Math.abs(sleep - 8) / 4)));

  // Calories (0-20): score highest near 1600, penalise over/under
  const cals = data.calories ?? 0;
  let caloriesScore = 0;
  if (cals >= R.CALORIES.minKcal && cals <= R.CALORIES.maxKcal) {
    const diff = Math.abs(cals - R.CALORIES.targetKcal);
    caloriesScore = Math.max(0, Math.round(R.CALORIES.weight * (1 - diff / 400)));
  }

  // Water (0-10)
  const waterScore = data.waterMl
    ? Math.min(R.WATER.weight, Math.round((data.waterMl / R.WATER.targetMl) * R.WATER.weight))
    : 0;

  // Workouts (0-10)
  const workoutScore = (data.workouts ?? 0) >= R.WORKOUTS.targetSessions ? R.WORKOUTS.weight : 0;

  const total = stepsScore + sugarScore + sleepScore + caloriesScore + waterScore + workoutScore;

  return { total, stepsScore, sugarScore, sleepScore, caloriesScore, waterScore, workoutScore };
}

export async function getOrCreateDailyScore(userId: string, date: Date = new Date()) {
  const day = startOfDay(date);

  // Get today's meals for sugar + calories
  const meals = await prisma.meal.findMany({
    where: {
      userId,
      loggedAt: { gte: day, lt: new Date(day.getTime() + 86400000) },
    },
  });

  const sugarG = meals.reduce((sum: number, meal: MealAggregateRow) => sum + meal.sugarG, 0);
  const calories = meals.reduce((sum: number, meal: MealAggregateRow) => sum + meal.calories, 0);

  const existing = await prisma.dailyScore.findUnique({
    where: { userId_date: { userId, date: day } },
  });

  const scoreInput = {
    steps: existing?.steps,
    sleepHours: existing?.sleepHours,
    sugarG,
    calories,
    waterMl: existing?.waterMl ?? 0,
    workouts: existing?.workouts ?? 0,
  };

  const scores = computeScore(scoreInput);

  try {
    return await prisma.dailyScore.upsert({
      where: { userId_date: { userId, date: day } },
      update: {
        sugarG,
        calories,
        disciplineScore: scores.total,
        stepsScore: scores.stepsScore,
        sugarScore: scores.sugarScore,
        sleepScore: scores.sleepScore,
        caloriesScore: scores.caloriesScore,
        waterScore: scores.waterScore,
        workoutScore: scores.workoutScore,
      },
      create: {
        userId,
        date: day,
        sugarG,
        calories,
        waterMl: 0,
        workouts: 0,
        disciplineScore: scores.total,
        stepsScore: scores.stepsScore,
        sugarScore: scores.sugarScore,
        sleepScore: scores.sleepScore,
        caloriesScore: scores.caloriesScore,
        waterScore: scores.waterScore,
        workoutScore: scores.workoutScore,
      },
    });
  } catch (error) {
    if (typeof error === 'object' && error && 'code' in error && (error as { code?: string }).code === 'P2003') {
      return prisma.dailyScore.findUnique({
        where: { userId_date: { userId, date: day } },
      });
    }

    throw error;
  }
}

export async function updateDailyMetrics(
  userId: string,
  data: { date: Date; steps?: number; sleepHours?: number; waterMl?: number; workouts?: number }
) {
  const day = startOfDay(data.date);

  const existing = await prisma.dailyScore.findUnique({
    where: { userId_date: { userId, date: day } },
  });

  const meals = await prisma.meal.findMany({
    where: { userId, loggedAt: { gte: day, lt: new Date(day.getTime() + 86400000) } },
  });
  const sugarG = meals.reduce((sum: number, meal: MealAggregateRow) => sum + meal.sugarG, 0);
  const calories = meals.reduce((sum: number, meal: MealAggregateRow) => sum + meal.calories, 0);

  const merged = {
    steps: data.steps ?? existing?.steps,
    sleepHours: data.sleepHours ?? existing?.sleepHours,
    waterMl: data.waterMl ?? existing?.waterMl ?? 0,
    workouts: data.workouts ?? existing?.workouts ?? 0,
    sugarG,
    calories,
  };

  const { total, ...scoreFields } = computeScore(merged);

  try {
    return await prisma.dailyScore.upsert({
      where: { userId_date: { userId, date: day } },
      update: { ...merged, ...scoreFields, disciplineScore: total },
      create: { userId, date: day, ...merged, ...scoreFields, disciplineScore: total },
    });
  } catch (error) {
    if (typeof error === 'object' && error && 'code' in error && (error as { code?: string }).code === 'P2003') {
      return prisma.dailyScore.findUnique({
        where: { userId_date: { userId, date: day } },
      });
    }

    throw error;
  }
}

export async function getScoreHistory(userId: string, days = 30): Promise<DailyScoreDTO[]> {
  const from = new Date(Date.now() - days * 86400000);
  const records = await prisma.dailyScore.findMany({
    where: { userId, date: { gte: from } },
    orderBy: { date: 'asc' },
  });
  return records.map((r: DailyScoreRecord) => ({
    id: r.id,
    date: r.date.toISOString(),
    disciplineScore: r.disciplineScore,
    stepsScore: r.stepsScore,
    sugarScore: r.sugarScore,
    sleepScore: r.sleepScore,
    caloriesScore: r.caloriesScore,
    waterScore: r.waterScore,
    workoutScore: r.workoutScore,
    steps: r.steps,
    sleepHours: r.sleepHours,
    sugarG: r.sugarG,
    calories: r.calories,
    waterMl: r.waterMl,
    workouts: r.workouts,
  }));
}
