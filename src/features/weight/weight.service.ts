import { prisma } from '@/lib/prisma';
import { WeightInput } from '../meals/meals.validation';
import { WeightLogDTO } from '@/types';

type WeightLogRecord = {
  id: string;
  weightKg: number;
  bodyFatPct: number | null;
  musclePct: number | null;
  bmi: number | null;
  notes: string | null;
  loggedAt: Date;
};

export async function logWeight(userId: string, data: WeightInput): Promise<WeightLogDTO> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { heightCm: true },
  });

  let bmi: number | undefined = undefined;
  if (user?.heightCm) {
    const heightM = user.heightCm / 100;
    bmi = parseFloat((data.weightKg / (heightM * heightM)).toFixed(1));
  }

  const entry = await prisma.weightLog.create({
    data: {
      userId,
      weightKg: data.weightKg,
      bodyFatPct: data.bodyFatPct,
      musclePct: data.musclePct,
      bmi,
      notes: data.notes,
      loggedAt: data.loggedAt ? new Date(data.loggedAt) : new Date(),
    },
  });
  return toDTO(entry);
}

export async function getWeightHistory(userId: string, days = 30): Promise<WeightLogDTO[]> {
  const from = new Date(Date.now() - days * 86400000);
  const entries = await prisma.weightLog.findMany({
    where: { userId, loggedAt: { gte: from } },
    orderBy: { loggedAt: 'asc' },
  });
  return entries.map(toDTO);
}

export async function getLatestWeight(userId: string): Promise<WeightLogDTO | null> {
  const entry = await prisma.weightLog.findFirst({
    where: { userId },
    orderBy: { loggedAt: 'desc' },
  });
  return entry ? toDTO(entry) : null;
}

export async function deleteWeightLog(userId: string, id: string): Promise<void> {
  await prisma.weightLog.deleteMany({ where: { id, userId } });
}

function toDTO(e: WeightLogRecord): WeightLogDTO {
  return {
    id: e.id,
    weightKg: e.weightKg,
    bodyFatPct: e.bodyFatPct,
    musclePct: e.musclePct,
    bmi: e.bmi,
    notes: e.notes,
    loggedAt: e.loggedAt.toISOString(),
  };
}
