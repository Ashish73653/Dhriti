'use client';
import { HealthIntelligenceData } from '@/features/insights/insights.service';
import { 
  Activity, AlertTriangle, Flame, Lightbulb, TrendingUp, Sparkles, CheckCircle2 
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Props {
  data: HealthIntelligenceData;
}

export function InsightsPanel({ data }: Props) {
  const { fatRisk, sugarDamage, streaks, warnings, recommendations } = data;

  // Color mappings for Fat Risk
  const fatColors = {
    BURNING: { text: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', bar: 'bg-emerald-500' },
    MAINTENANCE: { text: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20', bar: 'bg-amber-500' },
    STORAGE: { text: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/20', bar: 'bg-rose-500' },
  }[fatRisk.level];

  // Color mappings for Sugar Damage
  const sugarColors = {
    LOW: { text: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', bar: 'bg-emerald-500' },
    ELEVATED: { text: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20', bar: 'bg-amber-500' },
    CRITICAL: { text: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/20', bar: 'bg-rose-500' },
  }[sugarDamage.level];

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex items-center gap-2 text-gradient">
        <Sparkles className="h-5 w-5 text-emerald-400" />
        <h2 className="text-lg font-extrabold tracking-tight">Dhriti Health Intelligence</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: Fat Risk Dial */}
        <div className="health-card relative overflow-hidden flex flex-col justify-between p-5 group">
          <div className="flex items-center justify-between border-b border-white/5 pb-2.5">
            <p className="stat-label">Fat Risk Score</p>
            <TrendingUp className={cn("h-4 w-4", fatColors.text)} />
          </div>

          <div className="py-4 flex items-baseline gap-1.5 justify-center">
            <span className="text-4xl font-black text-slate-100 tracking-tight">{fatRisk.score}</span>
            <span className="text-xs text-slate-500 font-semibold">/ 100</span>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-slate-500 font-medium">Status</span>
              <span className={cn("font-bold px-2 py-0.5 rounded-full", fatColors.bg, fatColors.text, "border", fatColors.border)}>
                {fatRisk.label}
              </span>
            </div>
            <div className="h-1.5 w-full bg-white/[0.04] rounded-full overflow-hidden">
              <div className={cn("h-full rounded-full transition-all duration-1000", fatColors.bar)} style={{ width: `${fatRisk.score}%` }} />
            </div>
          </div>
        </div>

        {/* Card 2: Sugar Damage Dial */}
        <div className="health-card relative overflow-hidden flex flex-col justify-between p-5 group">
          <div className="flex items-center justify-between border-b border-white/5 pb-2.5">
            <p className="stat-label">Sugar Damage Score</p>
            <Activity className={cn("h-4 w-4", sugarColors.text)} />
          </div>

          <div className="py-4 flex items-baseline gap-1.5 justify-center">
            <span className="text-4xl font-black text-slate-100 tracking-tight">{sugarDamage.score}</span>
            <span className="text-xs text-slate-500 font-semibold">/ 100</span>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-slate-500 font-medium">Status</span>
              <span className={cn("font-bold px-2 py-0.5 rounded-full", sugarColors.bg, sugarColors.text, "border", sugarColors.border)}>
                {sugarDamage.label}
              </span>
            </div>
            <div className="h-1.5 w-full bg-white/[0.04] rounded-full overflow-hidden">
              <div className={cn("h-full rounded-full transition-all duration-1000", sugarColors.bar)} style={{ width: `${sugarDamage.score}%` }} />
            </div>
          </div>
        </div>

        {/* Card 3: Habit Streaks */}
        <div className="health-card relative overflow-hidden flex flex-col justify-between p-5">
          <div className="flex items-center justify-between border-b border-white/5 pb-2.5">
            <p className="stat-label">Active Habit Streaks</p>
            <Flame className="h-4 w-4 text-orange-400" />
          </div>

          <div className="grid grid-cols-2 gap-2 py-2">
            {[
              { label: 'Deficit', value: streaks.calories, color: 'text-orange-400', bg: 'bg-orange-500/10' },
              { label: 'Sugar Control', value: streaks.sugar, color: 'text-rose-400', bg: 'bg-rose-500/10' },
              { label: 'Hydration', value: streaks.water, color: 'text-blue-400', bg: 'bg-blue-500/10' },
              { label: 'Steps', value: streaks.steps, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
            ].map((streak) => (
              <div 
                key={streak.label} 
                className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.01] px-2.5 py-1.5"
              >
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{streak.label}</span>
                <div className={cn("flex items-center gap-0.5 px-1.5 py-0.5 rounded-md text-xs font-black", streak.color, streak.bg)}>
                  <Flame className="h-3 w-3 fill-current" />
                  <span>{streak.value}d</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Warnings & Recommendations Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Warnings Card */}
        {warnings.length > 0 && (
          <div className="health-card border-l-4 border-l-rose-500 p-5 space-y-3 bg-rose-500/[0.01]">
            <div className="flex items-center gap-2 border-b border-white/5 pb-2">
              <AlertTriangle className="h-4 w-4 text-rose-400" />
              <h3 className="text-sm font-bold text-rose-400">Active Warnings</h3>
            </div>
            <ul className="space-y-2.5">
              {warnings.map((w, idx) => (
                <li key={idx} className="flex gap-2.5 text-xs text-slate-400 leading-relaxed font-semibold">
                  <span className="text-rose-400 mt-0.5">⚠️</span>
                  <span>{w}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Recommendations Card */}
        <div className={cn("health-card border-l-4 border-l-emerald-500 p-5 space-y-3", warnings.length === 0 && "lg:col-span-2")}>
          <div className="flex items-center gap-2 border-b border-white/5 pb-2">
            <Lightbulb className="h-4 w-4 text-emerald-400" />
            <h3 className="text-sm font-bold text-emerald-400">Rule-based Recommendations</h3>
          </div>
          <ul className="space-y-2.5">
            {recommendations.map((r, idx) => (
              <li key={idx} className="flex gap-2.5 text-xs text-slate-400 leading-relaxed font-semibold">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>{r}</span>
              </li>
            ))}
            {recommendations.length === 0 && (
              <li className="text-xs text-slate-500 font-medium italic">No active recommendations. Maintain your discipline scores!</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
