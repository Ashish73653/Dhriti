interface Props {
  counts: { green: number; yellow: number; red: number; total: number };
}

export function MealSummaryWidget({ counts }: Props) {
  const bars = [
    { label: 'Green', count: counts.green, color: 'bg-emerald-500', text: 'text-emerald-400', border: 'hover:border-emerald-500/30' },
    { label: 'Yellow', count: counts.yellow, color: 'bg-amber-500', text: 'text-amber-400', border: 'hover:border-amber-500/30' },
    { label: 'Red', count: counts.red, color: 'bg-red-500', text: 'text-red-400', border: 'hover:border-red-500/30' },
  ];

  return (
    <div className="health-card group flex flex-col gap-4 transition-all duration-300 hover:shadow-md">
      <div className="flex items-center justify-between">
        <p className="stat-label">Meal Summary</p>
        <span className="text-xs text-slate-500 font-semibold group-hover:text-emerald-400 transition-colors duration-300">
          {counts.total} meals today
        </span>
      </div>

      {counts.total === 0 ? (
        <div className="flex flex-col items-center justify-center py-6">
          <p className="text-center text-xs text-slate-500">No meals logged yet</p>
        </div>
      ) : (
        <>
          {/* Animated composite progress bar */}
          <div className="flex h-2 overflow-hidden rounded-full gap-0.5 bg-white/[0.04] border border-white/[0.02]">
            {bars.map((b) => b.count > 0 && (
              <div
                key={b.label}
                className={`${b.color} transition-all duration-1000 ease-out`}
                style={{ width: `${(b.count / counts.total) * 100}%` }}
              />
            ))}
          </div>

          <div className="grid grid-cols-3 gap-2">
            {bars.map((b) => (
              <div 
                key={b.label} 
                className={`text-center rounded-xl border border-white/5 bg-white/[0.02] p-2 transition-all duration-300 ease-out hover:bg-white/[0.06] hover:scale-105 active:scale-95 cursor-default ${b.border}`}
              >
                <p className={`text-xl font-extrabold ${b.text}`}>{b.count}</p>
                <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">{b.label}</p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
