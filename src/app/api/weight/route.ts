import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { logWeight, getWeightHistory } from '@/features/weight/weight.service';
import { WeightSchema } from '@/features/meals/meals.validation';

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const userId = session.user.id;
  const { searchParams } = new URL(req.url);
  const days = Number(searchParams.get('days') ?? 30);
  const logs = await getWeightHistory(userId, days);
  return NextResponse.json({ logs });
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const userId = session.user.id;
  const body = await req.json();
  const parsed = WeightSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  const log = await logWeight(userId, parsed.data);
  return NextResponse.json({ log }, { status: 201 });
}
