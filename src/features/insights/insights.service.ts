import { prisma } from '@/lib/prisma';
import { startOfDay, subDays } from 'date-fns';

export interface HealthIntelligenceData {
  fatRisk: {
    score: number;
    level: 'BURNING' | 'MAINTENANCE' | 'STORAGE';
    label: string;
  };
  sugarDamage: {
    score: number;
    level: 'LOW' | 'ELEVATED' | 'CRITICAL';
    label: string;
  };
  streaks: {
    calories: number;
    sugar: number;
    water: number;
    steps: number;
  };
  warnings: string[];
  recommendations: string[];
}

export async function getHealthIntelligence(userId: string): Promise<HealthIntelligenceData> {
  const today = startOfDay(new Date());
  const sevenDaysAgo = subDays(today, 7);

  // 1. Fetch user data (goals & height)
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { calorieGoal: true, waterGoal: true, heightCm: true, weightGoal: true },
  });

  const calorieGoal = user?.calorieGoal ?? 1600;
  const waterGoal = user?.waterGoal ?? 2500;
  const heightCm = user?.heightCm ?? 175;

  // 2. Fetch past 7 days scores and meals
  const [scores, meals, weightLogs] = await Promise.all([
    prisma.dailyScore.findMany({
      where: { userId, date: { gte: sevenDaysAgo, lte: today } },
      orderBy: { date: 'asc' },
    }),
    prisma.meal.findMany({
      where: { userId, loggedAt: { gte: sevenDaysAgo } },
    }),
    prisma.weightLog.findMany({
      where: { userId, loggedAt: { gte: subDays(today, 10) } },
      orderBy: { loggedAt: 'desc' },
    }),
  ]);

  // Determine TDEE (sedentary Mifflin-St Jeor)
  const latestWeight = weightLogs[0]?.weightKg ?? user?.weightGoal ?? 75;
  const bmr = Math.round(10 * latestWeight + 6.25 * heightCm - 5 * 30 + 5);
  const tdee = Math.round(bmr * 1.2);

  // Get today's stats from DB or local calculations
  const todayScore = scores.find(s => s.date.getTime() === today.getTime());
  const todayWater = todayScore?.waterMl ?? 0;
  const todaySugar = meals.filter(m => startOfDay(m.loggedAt).getTime() === today.getTime()).reduce((s, m) => s + m.sugarG, 0);

  // --- A. SUGAR DAMAGE SCORE CALCULATION ---
  let avgSugar = 0;
  let sugarVol = 0;
  let hasSugarExcessStreak = false;

  if (scores.length > 0) {
    const totalSugar = scores.reduce((sum, s) => sum + (s.sugarG ?? 0), 0);
    avgSugar = totalSugar / scores.length;
    sugarVol = scores.filter(s => (s.sugarG ?? 0) > 25).length;

    // Check consecutive sugar excess days at the end of the window
    let consecutiveSugarDays = 0;
    for (let i = scores.length - 1; i >= 0; i--) {
      if ((scores[i].sugarG ?? 0) > 25) {
        consecutiveSugarDays++;
      } else {
        break;
      }
    }
    hasSugarExcessStreak = consecutiveSugarDays >= 3;
  }

  const baseSugarScore = (avgSugar / 25) * 50;
  const volSugarScore = sugarVol * 10;
  const streakSugarScore = hasSugarExcessStreak ? 15 : 0;
  const rawSugarScore = Math.round(baseSugarScore + volSugarScore + streakSugarScore);
  const sugarScore = Math.max(0, Math.min(100, rawSugarScore));

  let sugarLevel: 'LOW' | 'ELEVATED' | 'CRITICAL' = 'LOW';
  let sugarLabel = 'Low Risk';
  if (sugarScore >= 71) {
    sugarLevel = 'CRITICAL';
    sugarLabel = 'Critical Risk';
  } else if (sugarScore >= 36) {
    sugarLevel = 'ELEVATED';
    sugarLabel = 'Elevated Risk';
  }

  // --- B. FAT RISK SCORE CALCULATION ---
  let avgCalories = 0;
  let redMealRatio = 0;
  let weightVelocity = 0; // Positive if weight is rising

  if (scores.length > 0) {
    const totalCals = scores.reduce((sum, s) => sum + (s.calories ?? 0), 0);
    avgCalories = totalCals / scores.length;
  }

  if (meals.length > 0) {
    const redMealsCount = meals.filter(m => m.foodClass === 'RED').length;
    redMealRatio = redMealsCount / meals.length;
  }

  if (weightLogs.length >= 2) {
    const weightDiff = weightLogs[0].weightKg - weightLogs[weightLogs.length - 1].weightKg;
    weightVelocity = weightDiff; // gain is positive
  }

  const calRiskPoints = avgCalories > 0 ? (avgCalories / tdee) * 45 : 0;
  const weightRiskPoints = weightVelocity > 0 ? 25 : 0;
  const dietQualityRiskPoints = redMealRatio * 30;
  const rawFatScore = Math.round(calRiskPoints + weightRiskPoints + dietQualityRiskPoints);
  const fatScore = Math.max(0, Math.min(100, rawFatScore));

  let fatLevel: 'BURNING' | 'MAINTENANCE' | 'STORAGE' = 'BURNING';
  let fatLabel = 'Burning Fat';
  if (fatScore >= 66) {
    fatLevel = 'STORAGE';
    fatLabel = 'Fat Storage';
  } else if (fatScore >= 36) {
    fatLevel = 'MAINTENANCE';
    fatLabel = 'Calorie Maintenance';
  }

  // --- C. HABIT STREAKS ---
  // Fetch all historical scores in descending order to calculate active streaks
  const history = await prisma.dailyScore.findMany({
    where: { userId },
    orderBy: { date: 'desc' },
  });

  let calStreak = 0;
  let sugarStreak = 0;
  let waterStreak = 0;
  let stepsStreak = 0;

  let checkCal = true;
  let checkSugar = true;
  let checkWater = true;
  let checkSteps = true;

  for (const dayScore of history) {
    // Calorie Streak (intake <= goal)
    if (checkCal && dayScore.calories && dayScore.calories <= calorieGoal) {
      calStreak++;
    } else if (dayScore.calories) {
      checkCal = false;
    }

    // Sugar Streak (sugar <= 25g)
    if (checkSugar && dayScore.sugarG !== null && dayScore.sugarG <= 25) {
      sugarStreak++;
    } else if (dayScore.sugarG !== null) {
      checkSugar = false;
    }

    // Water Streak (water >= goal)
    if (checkWater && dayScore.waterMl >= waterGoal) {
      waterStreak++;
    } else {
      checkWater = false;
    }

    // Steps Streak (steps >= 8000)
    if (checkSteps && dayScore.steps && dayScore.steps >= 8000) {
      stepsStreak++;
    } else if (dayScore.steps) {
      checkSteps = false;
    }
  }

  // --- D. WARNINGS ENGINE ---
  const warnings: string[] = [];

  if (todaySugar > 25) {
    warnings.push('Critical sugar limit exceeded! Avoid processed carbs and sweets for the rest of today.');
  }

  const currentHour = new Date().getHours();
  if (todayWater < 1200 && currentHour >= 16) {
    warnings.push('Dehydration alert! You have consumed less than 1.2L of water and it is past 4:00 PM.');
  }

  if (scores.length >= 3) {
    const last3Days = scores.slice(-3);
    const avgSleep = last3Days.reduce((sum, s) => sum + (s.sleepHours ?? 0), 0) / 3;
    if (avgSleep < 6.5) {
      warnings.push('Sleep debt detected! Your average sleep over the last 3 days is below 6.5 hours.');
    }
  }

  // --- E. DHRITI RECOMMENDATIONS ENGINE ---
  const recommendations: string[] = [];

  if (redMealRatio > 0.25) {
    recommendations.push('Red-classified meals comprise more than 25% of your recent diet. Substitute with Green items (like fruits, curd, or chana) to improve nutritional density.');
  }

  if (sugarScore > 50) {
    recommendations.push('Sugar Damage levels are elevated. Prioritize bitter/astringent foods (lemon water, buttermilk) and take a 15-minute post-meal walk to stabilize glucose levels.');
  }

  if (fatScore > 65) {
    recommendations.push('Your body is in a Fat Storage environment. Reduce carbs in your dinner and replace them with rich-protein soya chunk curry or paneer bhurji.');
  }

  if (calStreak > 3) {
    recommendations.push(`Fantastic calorie discipline! You have hit your calorie goal for ${calStreak} consecutive days. Your deficit will yield fat loss.`);
  } else {
    recommendations.push('Stay focused on your daily deficit target. Swap white rice for single rotis and dry subzis to easily cut 200 kcal.');
  }

  if (waterStreak >= 5) {
    recommendations.push(`Consistent hydration champion! You have hit your water goal for ${waterStreak} days straight.`);
  }

  return {
    fatRisk: { score: fatScore, level: fatLevel, label: fatLabel },
    sugarDamage: { score: sugarScore, level: sugarLevel, label: sugarLabel },
    streaks: { calories: calStreak, sugar: sugarStreak, water: waterStreak, steps: stepsStreak },
    warnings,
    recommendations,
  };
}
