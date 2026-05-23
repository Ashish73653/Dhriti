import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getWeightHistory } from '@/features/weight/weight.service';
import { getScoreHistory } from '@/features/discipline/discipline.service';
import { WeightLogForm } from '@/components/progress/WeightLogForm';
import { WeightChart, CaloriesChart, SugarChart, DisciplineChart, WaterChart } from '@/components/progress/Charts';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export default async function ProgressPage() {
  const session = await getServerSession(authOptions);
  const userId = session?.user.id;

  if (!userId) {
    throw new Error('Authenticated user id is missing');
  }

  const [weightLogs, scoreHistory, user] = await Promise.all([
    getWeightHistory(userId, 30),
    getScoreHistory(userId, 30),
    prisma.user.findUnique({
      where: { id: userId },
      select: { heightCm: true, calorieGoal: true, weightGoal: true },
    }),
  ]);

  const latest = weightLogs.at(-1);
  const prev = weightLogs.at(-2);
  const weightChange = latest && prev ? (latest.weightKg - prev.weightKg) : null;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-100">Progress & Analytics</h1>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left Column: Log Weight & Health Analysis */}
        <div className="space-y-6">
          <div className="health-card">
            <h2 className="section-title mb-4">Log Weight</h2>
            <WeightLogForm />
            {latest && (
              <div className="mt-4 rounded-lg border border-white/5 bg-white/[0.02] p-3 text-center">
                <p className="text-2xl font-bold text-slate-100">{latest.weightKg} kg</p>
                <p className="text-xs text-slate-500">Latest weight</p>
                {weightChange !== null && (
                  <p className={`text-sm mt-1 ${weightChange <= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                    {weightChange <= 0 ? '↓' : '↑'} {Math.abs(weightChange).toFixed(1)} kg from last entry
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Height & Weight Metabolic Analysis */}
          {user?.heightCm && latest ? (
            (() => {
              const heightM = user.heightCm / 100;
              const bmi = parseFloat((latest.weightKg / (heightM * heightM)).toFixed(1));
              let bmiCategory = 'Normal';
              let bmiColor = 'text-emerald-400';
              if (bmi < 18.5) { bmiCategory = 'Underweight'; bmiColor = 'text-blue-400'; }
              else if (bmi >= 25 && bmi < 30) { bmiCategory = 'Overweight'; bmiColor = 'text-yellow-400'; }
              else if (bmi >= 30) { bmiCategory = 'Obese'; bmiColor = 'text-red-400'; }

              // Mifflin-St Jeor formula (assuming average age 30 and sedentary activity multiplier 1.2)
              const bmr = Math.round(10 * latest.weightKg + 6.25 * user.heightCm - 5 * 30 + 5); 
              const tdee = Math.round(bmr * 1.2);
              const deficit = tdee - user.calorieGoal;

              const idealMin = parseFloat((18.5 * heightM * heightM).toFixed(1));
              const idealMax = parseFloat((24.9 * heightM * heightM).toFixed(1));

              return (
                <div className="health-card space-y-4">
                  <div className="border-b border-white/5 pb-2">
                    <h2 className="section-title">Health & BMI Analysis</h2>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-0.5">Calculated using height & weight</p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white/[0.01] border border-white/5 p-2.5 rounded-xl">
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Height</p>
                      <p className="text-base font-extrabold text-slate-200 mt-0.5">{user.heightCm} cm</p>
                    </div>
                    <div className="bg-white/[0.01] border border-white/5 p-2.5 rounded-xl">
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Weight</p>
                      <p className="text-base font-extrabold text-slate-200 mt-0.5">{latest.weightKg} kg</p>
                    </div>
                  </div>

                  <div className="space-y-2 rounded-xl bg-white/[0.02] border border-white/5 p-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-400 font-semibold">Body Mass Index (BMI)</span>
                      <span className={`text-sm font-extrabold ${bmiColor}`}>{bmi}</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-500 font-medium">Status</span>
                      <span className={`font-bold ${bmiColor}`}>{bmiCategory}</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/[0.04] rounded-full overflow-hidden mt-1 relative">
                      <div 
                        className="absolute top-0 bottom-0 w-2 bg-emerald-500 rounded-full transition-all duration-500 animate-pulse-slow"
                        style={{ left: `${Math.max(0, Math.min(100, ((bmi - 15) / 20) * 100))}%` }}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span className="text-slate-400">Ideal Weight Range</span>
                      <span className="text-slate-200">{idealMin} – {idealMax} kg</span>
                    </div>
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span className="text-slate-400">Basal Metabolic Rate (BMR)</span>
                      <span className="text-orange-400">{bmr} kcal/day</span>
                    </div>
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span className="text-slate-400">Daily Maintenance (TDEE)</span>
                      <span className="text-indigo-400">{tdee} kcal/day</span>
                    </div>
                  </div>

                  <div className="rounded-xl bg-emerald-500/5 border border-emerald-500/10 p-3 text-xs text-slate-400 leading-relaxed font-semibold">
                    <p className="text-slate-200 font-bold mb-1">🎯 Deficit Analysis</p>
                    {deficit > 0 ? (
                      <span>
                        Your target of <strong>{user.calorieGoal} kcal</strong> creates a deficit of <strong>{deficit} kcal</strong> from maintenance. This supports a healthy weight loss of ~<strong>{(deficit * 7 / 7700).toFixed(2)} kg</strong> per week.
                      </span>
                    ) : (
                      <span>
                        Your target of <strong>{user.calorieGoal} kcal</strong> is close to or above maintenance ({tdee} kcal), which will maintain or slightly increase weight. Consider adjusting in settings for weight loss.
                      </span>
                    )}
                  </div>
                </div>
              );
            })()
          ) : (
            <div className="health-card space-y-3">
              <h2 className="section-title">Health & BMI Analysis</h2>
              <div className="rounded-xl bg-amber-500/5 border border-amber-500/10 p-3.5 text-xs text-slate-400 leading-relaxed font-semibold">
                <p className="text-amber-400 font-bold mb-1">⚠️ Missing Profile Data</p>
                {!user?.heightCm ? (
                  <span>Please configure your <strong>Height</strong> in Settings to unlock BMI metabolic analysis, BMR tracking, and customized deficit evaluations.</span>
                ) : (
                  <span>Log a weight entry above to compute your live BMI and TDEE maintenance statistics.</span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Charts */}
        <div className="space-y-4 lg:col-span-2">
          <div className="health-card">
            <h2 className="section-title mb-4">Weight Trend (30 days)</h2>
            {weightLogs.length > 1 ? (
              <WeightChart data={weightLogs} />
            ) : (
              <EmptyChart message="Log at least 2 weight entries to see the trend" />
            )}
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="health-card">
              <h2 className="section-title mb-4">Discipline Score</h2>
              {scoreHistory.length > 0 ? (
                <DisciplineChart data={scoreHistory} />
              ) : (
                <EmptyChart message="Not enough data yet" />
              )}
            </div>
            <div className="health-card">
              <h2 className="section-title mb-4">Water Intake (L/day)</h2>
              {scoreHistory.length > 0 ? (
                <WaterChart data={scoreHistory} />
              ) : (
                <EmptyChart message="Not enough data yet" />
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="health-card">
              <h2 className="section-title mb-4">Calories (kcal/day)</h2>
              {scoreHistory.length > 0 ? (
                <CaloriesChart data={scoreHistory} />
              ) : (
                <EmptyChart message="Not enough data yet" />
              )}
            </div>
            <div className="health-card">
              <h2 className="section-title mb-4">Sugar Intake (g/day)</h2>
              {scoreHistory.length > 0 ? (
                <SugarChart data={scoreHistory} />
              ) : (
                <EmptyChart message="Not enough data yet" />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function EmptyChart({ message }: { message: string }) {
  return (
    <div className="flex h-[200px] items-center justify-center rounded-lg border border-white/5 bg-white/[0.02]">
      <p className="text-sm text-slate-600">{message}</p>
    </div>
  );
}
