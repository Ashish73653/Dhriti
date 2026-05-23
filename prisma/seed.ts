import { config } from 'dotenv';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import bcrypt from 'bcryptjs';

config({ path: '.env.local' });

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }),
});

async function main() {
  console.log('🌱 Seeding database...');

  const password = await bcrypt.hash('password123', 12);

  const user = await prisma.user.upsert({
    where: { email: 'demo@healthos.com' },
    update: {},
    create: {
      name: 'Health Warrior',
      email: 'demo@healthos.com',
      password,
      calorieGoal: 1600,
      proteinGoal: 120,
      waterGoal: 2500,
      weightGoal: 70,
    },
  });

  console.log(`✅ User created: ${user.email}`);

  // Seed weight logs (last 7 days)
  const today = new Date();
  const weights = [82.5, 82.2, 82.0, 81.8, 81.5, 81.3, 81.0];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    await prisma.weightLog.create({
      data: { userId: user.id, weightKg: weights[6 - i], loggedAt: d },
    });
  }
  console.log('✅ Weight logs seeded');

  // Seed today's meals
  const todayMeals = [
    { name: 'Oats Porridge (1 bowl)', calories: 180, proteinG: 7, carbsG: 30, fatG: 4, sugarG: 3, fiberG: 4, mealType: 'BREAKFAST' as const, foodClass: 'GREEN' as const },
    { name: 'Boiled Egg (2 whole)', calories: 136, proteinG: 12, carbsG: 1, fatG: 10, sugarG: 0, fiberG: 0, mealType: 'BREAKFAST' as const, foodClass: 'GREEN' as const },
    { name: 'Dal Tadka (1 bowl)', calories: 188, proteinG: 10, carbsG: 28, fatG: 5, sugarG: 3, fiberG: 7, mealType: 'LUNCH' as const, foodClass: 'GREEN' as const },
    { name: 'Roti / Chapati (2 pieces)', calories: 208, proteinG: 6, carbsG: 40, fatG: 4, sugarG: 1, fiberG: 4, mealType: 'LUNCH' as const, foodClass: 'GREEN' as const },
    { name: 'Grilled Chicken Breast (150g)', calories: 248, proteinG: 46, carbsG: 0, fatG: 6, sugarG: 0, fiberG: 0, mealType: 'DINNER' as const, foodClass: 'GREEN' as const },
    { name: 'Mixed Vegetable Curry', calories: 120, proteinG: 4, carbsG: 18, fatG: 4, sugarG: 5, fiberG: 5, mealType: 'DINNER' as const, foodClass: 'GREEN' as const },
  ];

  for (const meal of todayMeals) {
    await prisma.meal.create({
      data: { userId: user.id, servingSize: '1 serving', ...meal },
    });
  }
  console.log('✅ Today meals seeded');

  // Seed a daily score
  const todayStart = new Date(); todayStart.setHours(0,0,0,0);
  await prisma.dailyScore.upsert({
    where: { userId_date: { userId: user.id, date: todayStart } },
    update: {},
    create: {
      userId: user.id,
      date: todayStart,
      steps: 7200,
      sleepHours: 7.5,
      waterMl: 1750,
      workouts: 1,
      sugarG: 12,
      calories: 880,
      disciplineScore: 72,
      stepsScore: 18,
      sugarScore: 25,
      sleepScore: 15,
      caloriesScore: 12,
      waterScore: 7,
      workoutScore: 10,
    },
  });
  console.log('✅ Daily score seeded');
  console.log('\n🎉 Seed complete! Login: demo@healthos.com / password123');
}

main().catch(console.error).finally(() => prisma.$disconnect());
