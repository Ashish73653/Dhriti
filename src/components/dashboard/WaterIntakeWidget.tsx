'use client';
import { useState } from 'react';
import { Droplets, Plus, AlertTriangle } from 'lucide-react';

interface Props { waterMl: number; goalMl: number; }

const QUICK_ADD = [150, 250, 350, 500];

export function WaterIntakeWidget({ waterMl: initial, goalMl }: Props) {
  const [water, setWater] = useState(initial);

  function addWater(ml: number) {
    const newTotal = water + ml;
    setWater(newTotal);
    
    // Get client local date string (yyyy-MM-dd)
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const localDateStr = `${year}-${month}-${day}`;

    fetch('/api/scores', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ date: localDateStr, waterMl: newTotal }),
    });
  }

  const rawPct = Math.round((water / goalMl) * 100);
  const barPct = Math.min(100, rawPct);
  const glasses = Math.floor(water / 250);

  // Warning thresholds for excess water (e.g. 4.0 Liters or 1.6x of the goal)
  const isExcess = water >= 4000 || rawPct >= 160;

  return (
    <div className="health-card flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <p className="stat-label">Water Intake</p>
        <Droplets className="h-4 w-4 text-blue-400" />
      </div>

      <div className="flex items-baseline gap-2">
        <span className="text-3xl font-extrabold text-slate-100">{(water / 1000).toFixed(1)}</span>
        <span className="text-xs text-slate-500 font-semibold">L / {(goalMl / 1000).toFixed(1)}L</span>
        {isExcess && (
          <span className="ml-auto inline-flex items-center gap-1 text-[10px] font-bold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-full border border-rose-500/20">
            <AlertTriangle className="h-3 w-3" />
            Excess
          </span>
        )}
      </div>

      {/* Wave progress bar - switches to warning gradient if excess */}
      <div className="relative h-2 overflow-hidden rounded-full bg-white/[0.06]">
        <div
          className={`h-full rounded-full transition-all duration-700 ${
            isExcess 
              ? 'bg-gradient-to-r from-amber-500 to-rose-500' 
              : 'bg-gradient-to-r from-blue-600 to-blue-400'
          }`}
          style={{ width: `${barPct}%` }}
        />
      </div>

      <div className="flex items-center justify-between text-[10px] font-medium">
        <span className="text-slate-500">{glasses} glasses</span>
        <span className={isExcess ? 'text-rose-400 font-bold' : 'text-slate-400'}>
          {rawPct}% of goal
        </span>
      </div>

      {isExcess && (
        <p className="text-[9px] text-rose-400 leading-normal border-t border-rose-500/10 pt-2">
          ⚠️ Warning: High water intake detected. Limit drinking to prevent overhydration.
        </p>
      )}

      {/* Quick add */}
      <div className="grid grid-cols-4 gap-1.5 mt-auto">
        {QUICK_ADD.map((ml) => (
          <button
            key={ml}
            id={`water-add-${ml}`}
            onClick={() => addWater(ml)}
            className="flex items-center justify-center gap-1 rounded-lg border border-blue-500/20 bg-blue-500/10 py-1.5 text-xs font-semibold text-blue-400 transition-all hover:bg-blue-500/25 active:scale-95"
          >
            <Plus className="h-3 w-3" />
            {ml}ml
          </button>
        ))}
      </div>
    </div>
  );
}
