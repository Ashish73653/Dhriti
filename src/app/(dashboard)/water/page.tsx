import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getOrCreateDailyScore, getScoreHistory } from '@/features/discipline/discipline.service';
import { prisma } from '@/lib/prisma';
import { WaterDashboard } from '@/components/water/WaterDashboard';

export const dynamic = 'force-dynamic';

export default async function WaterPage() {
  const session = await getServerSession(authOptions);
  const userId = session?.user.id;

  if (!userId) {
    throw new Error('Authenticated user id is missing');
  }

  const [scoreRecord, scoreHistory, user] = await Promise.all([
    getOrCreateDailyScore(userId),
    getScoreHistory(userId, 30),
    prisma.user.findUnique({
      where: { id: userId },
      select: { waterGoal: true },
    }),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-100">Water Intake</h1>
        <p className="mt-1 text-sm text-slate-500">Track and analyze your daily hydration habits.</p>
      </div>
      <WaterDashboard 
        userId={userId}
        initialWaterMl={scoreRecord?.waterMl ?? 0}
        waterGoal={user?.waterGoal ?? 2500}
        scoreHistory={scoreHistory}
      />
    </div>
  );
}
