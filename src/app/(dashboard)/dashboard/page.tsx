import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getMealsToday } from '@/features/meals/meals.service';
import { getLatestWeight } from '@/features/weight/weight.service';
import { getOrCreateDailyScore } from '@/features/discipline/discipline.service';
import { getHealthIntelligence } from '@/features/insights/insights.service';
import { prisma } from '@/lib/prisma';
import { DashboardGrid } from '@/components/dashboard/DashboardGrid';
import { DashboardStats, DailyScoreDTO, MealDTO } from '@/types';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  const userId = session?.user.id;

  if (!userId) {
    throw new Error('Authenticated user id is missing');
  }

  const [meals, latestWeight, scoreRecord, user, insights] = await Promise.all([
    getMealsToday(userId),
    getLatestWeight(userId),
    getOrCreateDailyScore(userId),
    prisma.user.findUnique({ where: { id: userId }, select: { calorieGoal: true, waterGoal: true, weightGoal: true, name: true } }),
    getHealthIntelligence(userId),
  ]);

  const caloriesToday = meals.reduce((sum: number, meal: MealDTO) => sum + meal.calories, 0);
  const sugarToday = meals.reduce((sum: number, meal: MealDTO) => sum + meal.sugarG, 0);
  const proteinToday = meals.reduce((sum: number, meal: MealDTO) => sum + meal.proteinG, 0);

  const mealCounts = meals.reduce(
    (acc, m) => {
      if (m.foodClass === 'GREEN') acc.green++;
      else if (m.foodClass === 'YELLOW') acc.yellow++;
      else acc.red++;
      acc.total++;
      return acc;
    },
    { green: 0, yellow: 0, red: 0, total: 0 }
  );

  const stats: DashboardStats = {
    caloriesToday,
    caloriesGoal: user?.calorieGoal ?? 1600,
    sugarToday,
    proteinToday,
    waterToday: scoreRecord?.waterMl ?? 0,
    waterGoal: user?.waterGoal ?? 2500,
    disciplineScore: scoreRecord?.disciplineScore ?? 0,
    mealsToday: mealCounts,
    latestWeight: latestWeight?.weightKg,
    weightGoal: user?.weightGoal,
  };

  const score: DailyScoreDTO = scoreRecord
    ? {
        id: scoreRecord.id,
        date: scoreRecord.date.toISOString(),
        disciplineScore: scoreRecord.disciplineScore,
        stepsScore: scoreRecord.stepsScore,
        sugarScore: scoreRecord.sugarScore,
        sleepScore: scoreRecord.sleepScore,
        caloriesScore: scoreRecord.caloriesScore,
        waterScore: scoreRecord.waterScore,
        workoutScore: scoreRecord.workoutScore,
        steps: scoreRecord.steps,
        sleepHours: scoreRecord.sleepHours,
        sugarG: scoreRecord.sugarG,
        calories: scoreRecord.calories,
        waterMl: scoreRecord.waterMl,
        workouts: scoreRecord.workouts,
      }
    : {
        id: 'fallback',
        date: new Date().toISOString(),
        disciplineScore: 0,
        stepsScore: 0,
        sugarScore: 0,
        sleepScore: 0,
        caloriesScore: 0,
        waterScore: 0,
        workoutScore: 0,
        steps: null,
        sleepHours: null,
        sugarG: null,
        calories: null,
        waterMl: 0,
        workouts: 0,
      };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-100">
          Good {getGreeting()}, {user?.name?.split(' ')[0] ?? 'Warrior'} 👋
        </h1>
        <p className="mt-1 text-sm text-slate-500">Here&apos;s your health overview for today.</p>
      </div>
      <DashboardGrid stats={stats} score={score} insights={insights} />
    </div>
  );
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'morning';
  if (h < 17) return 'afternoon';
  return 'evening';
}
