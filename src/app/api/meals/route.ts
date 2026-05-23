import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { logMeal, getMealsToday } from '@/features/meals/meals.service';
import { MealSchema } from '@/features/meals/meals.validation';
import { getOrCreateDailyScore } from '@/features/discipline/discipline.service';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const userId = session.user.id;
  const meals = await getMealsToday(userId);
  return NextResponse.json({ meals });
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const userId = session.user.id;

  const body = await req.json();
  const parsed = MealSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const meal = await logMeal(userId, parsed.data);
  // Recompute daily score after logging
  await getOrCreateDailyScore(userId);
  return NextResponse.json({ meal }, { status: 201 });
}
