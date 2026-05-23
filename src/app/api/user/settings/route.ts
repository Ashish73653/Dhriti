import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const Schema = z.object({
  name: z.string().min(1).optional(),
  calorieGoal: z.number().min(800).max(4000).optional(),
  waterGoal: z.number().min(500).max(6000).optional(),
  weightGoal: z.union([z.number().min(20).max(300), z.literal('')]).optional(),
  heightCm: z.union([z.number().min(50).max(250), z.literal('')]).optional(),
});

export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const userId = session.user.id;
  const body = await req.json();
  const parsed = Schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const { weightGoal, heightCm, ...rest } = parsed.data;
  const user = await prisma.user.update({
    where: { id: userId },
    data: {
      ...rest,
      weightGoal: weightGoal === '' ? null : (weightGoal as number | undefined),
      heightCm: heightCm === '' ? null : (heightCm as number | undefined),
    },
    select: { id: true, name: true, calorieGoal: true, waterGoal: true, weightGoal: true, heightCm: true },
  });

  return NextResponse.json({ user });
}
