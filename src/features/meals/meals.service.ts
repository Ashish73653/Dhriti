import { prisma } from '@/lib/prisma';
import { MealInput } from './meals.validation';
import { FoodClass, MealDTO, MealType } from '@/types';
import { getTodayRange } from '@/lib/utils';

type MealRecord = {
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
  notes: string | null;
  loggedAt: Date;
};

export async function logMeal(userId: string, data: MealInput): Promise<MealDTO> {
  const meal = await prisma.meal.create({
    data: {
      userId,
      name: data.name,
      calories: data.calories,
      proteinG: data.proteinG ?? 0,
      carbsG: data.carbsG ?? 0,
      fatG: data.fatG ?? 0,
      sugarG: data.sugarG ?? 0,
      fiberG: data.fiberG ?? 0,
      servingSize: data.servingSize ?? '1 serving',
      mealType: data.mealType ?? 'LUNCH',
      foodClass: data.foodClass,
      notes: data.notes,
      loggedAt: data.loggedAt ? new Date(data.loggedAt) : new Date(),
    },
  });
  return toDTO(meal);
}

export async function getMealsToday(userId: string): Promise<MealDTO[]> {
  const { start, end } = getTodayRange();
  const meals = await prisma.meal.findMany({
    where: { userId, loggedAt: { gte: start, lte: end } },
    orderBy: { loggedAt: 'asc' },
  });
  return meals.map(toDTO);
}

export async function getMealsForDate(userId: string, date: Date): Promise<MealDTO[]> {
  const start = new Date(date); start.setHours(0, 0, 0, 0);
  const end = new Date(date); end.setHours(23, 59, 59, 999);
  const meals = await prisma.meal.findMany({
    where: { userId, loggedAt: { gte: start, lte: end } },
    orderBy: { loggedAt: 'asc' },
  });
  return meals.map(toDTO);
}

export async function deleteMeal(userId: string, mealId: string): Promise<void> {
  await prisma.meal.deleteMany({ where: { id: mealId, userId } });
}

function toDTO(meal: MealRecord): MealDTO {
  return {
    id: meal.id,
    name: meal.name,
    calories: meal.calories,
    proteinG: meal.proteinG,
    carbsG: meal.carbsG,
    fatG: meal.fatG,
    sugarG: meal.sugarG,
    fiberG: meal.fiberG,
    servingSize: meal.servingSize,
    mealType: meal.mealType,
    foodClass: meal.foodClass,
    notes: meal.notes,
    loggedAt: meal.loggedAt.toISOString(),
  };
}
