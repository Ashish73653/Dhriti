import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { deleteMeal } from '@/features/meals/meals.service';
import { getOrCreateDailyScore } from '@/features/discipline/discipline.service';

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const userId = session.user.id;

  await deleteMeal(userId, params.id);
  await getOrCreateDailyScore(userId);
  return NextResponse.json({ success: true });
}
