'use client';
import { DailyScoreDTO } from '@/types';
import { cn } from '@/lib/utils';

interface Props { score: DailyScoreDTO | null; }

function Ring({ score }: { score: number }) {
  const R = 54;
  const C = 2 * Math.PI * R;
  const pct = Math.min(100, Math.max(0, score));
  const offset = C - (pct / 100) * C;
  const color = pct >= 75 ? '#10b981' : pct >= 50 ? '#f59e0b' : '#ef4444';

  return (
    <svg width="140" height="140" className="score-ring -rotate-90 transition-transform duration-500 ease-out group-hover:scale-105">
      <circle cx="70" cy="70" r={R} fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="10" />
      <circle
        cx="70" cy="70" r={R} fill="none"
        stroke={color} strokeWidth="10"
        strokeDasharray={C} strokeDashoffset={offset}
        strokeLinecap="round"
        style={{ transition: 'stroke-dashoffset 1s cubic-bezier(0.16, 1, 0.3, 1)' }}
      />
    </svg>
  );
}

export function DisciplineScoreWidget({ score }: Props) {
  const total = score?.disciplineScore ?? 0;

  const breakdown = score ? [
    { label: 'Sugar', value: score.sugarScore, max: 25 },
    { label: 'Steps', value: score.stepsScore, max: 20 },
    { label: 'Calories', value: score.caloriesScore, max: 20 },
    { label: 'Sleep', value: score.sleepScore, max: 15 },
    { label: 'Water', value: score.waterScore, max: 10 },
    { label: 'Workout', value: score.workoutScore, max: 10 },
  ] : [];

  const glowColor = total >= 75 ? 'bg-emerald-500/10' : total >= 50 ? 'bg-amber-500/10' : 'bg-red-500/10';

  return (
    <div className="health-card relative overflow-hidden group flex flex-col gap-4 transition-all duration-300 hover:shadow-md">
      {/* Interactive backglow */}
      <div className={cn("absolute -right-6 -top-6 h-24 w-24 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-all duration-500 pointer-events-none", glowColor)} />

      <div className="flex items-center justify-between">
        <p className="stat-label">Discipline Score</p>
        <span className={`text-xs font-bold px-2 py-0.5 rounded-full transition-all duration-300 ${
          total >= 75 ? 'bg-emerald-500/10 text-emerald-400' :
          total >= 50 ? 'bg-amber-500/10 text-amber-400' : 'bg-red-500/10 text-red-400'
        }`}>
          {total >= 75 ? 'Excellent' : total >= 50 ? 'Good' : 'Needs Work'}
        </span>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-4">
        <div className="relative flex items-center justify-center shrink-0">
          <Ring score={total} />
          <div className="absolute flex flex-col items-center">
            <span className="text-2xl font-extrabold text-slate-100 tracking-tight transition-transform duration-300 group-hover:scale-110">{total}</span>
            <span className="text-[10px] text-slate-500 font-semibold">/ 100</span>
          </div>
        </div>

        <div className="w-full sm:flex-1 space-y-2">
          {breakdown.map((b) => (
            <div key={b.label} className="group/item">
              <div className="flex justify-between text-[10px] text-slate-500 mb-0.5 font-medium transition-colors duration-200 group-hover/item:text-slate-300">
                <span>{b.label}</span>
                <span>{b.value}/{b.max}</span>
              </div>
              <div className="h-1 w-full overflow-hidden rounded-full bg-white/[0.06] border border-white/[0.02]">
                <div
                  className="h-full rounded-full bg-emerald-500 transition-all duration-700 ease-out group-hover/item:bg-emerald-400"
                  style={{ width: `${(b.value / b.max) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
