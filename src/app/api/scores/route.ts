import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import {
  getOrCreateDailyScore,
  getScoreHistory,
  updateDailyMetrics,
} from '@/features/discipline/discipline.service';
import { DailyScoreUpdateSchema } from '@/features/meals/meals.validation';

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const userId = session.user.id;
  const { searchParams } = new URL(req.url);
  const days = Number(searchParams.get('days') ?? 30);

  if (searchParams.get('today') === '1') {
    const score = await getOrCreateDailyScore(userId);
    return NextResponse.json({ score });
  }

  const history = await getScoreHistory(userId, days);
  return NextResponse.json({ history });
}

export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const userId = session.user.id;

  const body = await req.json();
  const parsed = DailyScoreUpdateSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const { date, ...metrics } = parsed.data;
  const score = await updateDailyMetrics(userId, { date: new Date(date), ...metrics });
  return NextResponse.json({ score });
}
