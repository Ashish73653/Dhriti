import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string | number;
  unit?: string;
  icon: LucideIcon;
  iconColor?: string;
  trend?: { value: number; label: string };
  progress?: { current: number; max: number };
  className?: string;
  children?: React.ReactNode;
}

export function StatCard({
  label, value, unit, icon: Icon, iconColor = 'text-emerald-400',
  trend, progress, className, children,
}: StatCardProps) {
  // Determine color matching theme based on icon color
  let progressBg = 'bg-emerald-500';
  let cardBorder = 'hover:border-emerald-500/30';
  let glowColor = 'bg-emerald-500/10';
  
  if (iconColor.includes('orange')) {
    progressBg = 'bg-orange-500';
    cardBorder = 'hover:border-orange-500/30';
    glowColor = 'bg-orange-500/10';
  } else if (iconColor.includes('red')) {
    progressBg = 'bg-red-500';
    cardBorder = 'hover:border-red-500/30';
    glowColor = 'bg-red-500/10';
  } else if (iconColor.includes('amber')) {
    progressBg = 'bg-amber-500';
    cardBorder = 'hover:border-amber-500/30';
    glowColor = 'bg-amber-500/10';
  } else if (iconColor.includes('indigo')) {
    progressBg = 'bg-indigo-500';
    cardBorder = 'hover:border-indigo-500/30';
    glowColor = 'bg-indigo-500/10';
  } else if (iconColor.includes('purple')) {
    progressBg = 'bg-purple-500';
    cardBorder = 'hover:border-purple-500/30';
    glowColor = 'bg-purple-500/10';
  }

  const progressPct = progress ? Math.min(100, Math.round((progress.current / progress.max) * 100)) : 0;

  return (
    <div 
      className={cn('health-card relative overflow-hidden group border-l-2 hover:shadow-md transition-all duration-300 ease-out', cardBorder, className)}
      style={{ borderLeftColor: iconColor.includes('emerald') ? '#10b981' : iconColor.includes('orange') ? '#f97316' : iconColor.includes('red') ? '#ef4444' : iconColor.includes('amber') ? '#f59e0b' : iconColor.includes('indigo') ? '#6366f1' : '#a855f7' }}
    >
      {/* Background soft glow on hover */}
      <div className={cn("absolute -right-6 -top-6 h-24 w-24 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-all duration-500 ease-out pointer-events-none", glowColor)} />

      <div className="flex items-start justify-between">
        <div>
          <p className="stat-label mb-1.5">{label}</p>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-extrabold text-slate-100 tracking-tight transition-transform duration-300 group-hover:translate-x-0.5 inline-block">{value}</span>
            {unit && <span className="text-xs font-semibold text-slate-400">{unit}</span>}
          </div>
          {trend && (
            <p className={cn('mt-1.5 text-xs font-medium', trend.value >= 0 ? 'text-emerald-400' : 'text-red-400')}>
              {trend.value >= 0 ? '↑' : '↓'} {Math.abs(trend.value)} {trend.label}
            </p>
          )}
        </div>
        
        <div className={cn('flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.03] border border-white/5 transition-all duration-300 ease-out group-hover:scale-110 group-hover:rotate-6 group-hover:bg-white/[0.08]', iconColor)}>
          <Icon className="h-5 w-5" />
        </div>
      </div>

      {progress && (
        <div className="mt-4">
          <div className="flex justify-between text-[10px] text-slate-500 mb-1 font-medium">
            <span>Progress</span>
            <span>{progressPct}% ({progress.current}/{progress.max})</span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/[0.04] border border-white/[0.02]">
            <div
              className={cn('h-full rounded-full transition-all duration-700 ease-out', progressBg)}
              style={{ width: `${Math.min(100, (progress.current / progress.max) * 100)}%` }}
            />
          </div>
        </div>
      )}

      {children}
    </div>
  );
}
