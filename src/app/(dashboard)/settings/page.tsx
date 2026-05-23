import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { SettingsForm } from '@/components/settings/SettingsForm';

export const dynamic = 'force-dynamic';

export default async function SettingsPage() {
  const session = await getServerSession(authOptions);
  const userId = session?.user.id;

  if (!userId) {
    throw new Error('Authenticated user id is missing');
  }
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { name: true, email: true, calorieGoal: true, waterGoal: true, weightGoal: true, heightCm: true },
  });

  if (!user) {
    throw new Error('User record is missing');
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <h1 className="text-2xl font-bold text-slate-100">Settings</h1>
      <div className="health-card">
        <h2 className="section-title mb-1">Profile & Goals</h2>
        <p className="section-subtitle mb-5">Adjust your fat-loss targets and daily goals.</p>
        <SettingsForm user={user} />
      </div>

      <div className="health-card">
        <h2 className="section-title mb-3">Discipline Score Weights</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
          {[
            { label: 'Sugar Control', pts: 25, target: '≤ 25g/day', color: 'text-red-400' },
            { label: 'Steps', pts: 20, target: '≥ 8000 steps', color: 'text-emerald-400' },
            { label: 'Calorie Goal', pts: 20, target: '1400–1800 kcal', color: 'text-orange-400' },
            { label: 'Sleep', pts: 15, target: '7–9 hours', color: 'text-indigo-400' },
            { label: 'Water', pts: 10, target: '≥ 2500ml', color: 'text-blue-400' },
            { label: 'Workout', pts: 10, target: '≥ 1 session', color: 'text-purple-400' },
          ].map((r) => (
            <div key={r.label} className="flex items-center justify-between rounded-lg border border-white/5 bg-white/[0.02] p-3">
              <div>
                <p className="font-medium text-slate-200">{r.label}</p>
                <p className="text-xs text-slate-500">{r.target}</p>
              </div>
              <span className={`text-lg font-bold ${r.color}`}>{r.pts}pts</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
