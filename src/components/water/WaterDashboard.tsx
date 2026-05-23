'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Droplets, Plus, Trash2, AlertTriangle, GlassWater
} from 'lucide-react';
import { WaterChart } from '@/components/progress/Charts';
import { DailyScoreDTO } from '@/types';

interface Props {
  userId: string;
  initialWaterMl: number;
  waterGoal: number;
  scoreHistory: DailyScoreDTO[];
}

interface WaterLogEntry {
  id: string;
  amountMl: number;
  timestamp: string;
}

const QUICK_ADD = [150, 250, 350, 500];

export function WaterDashboard({ userId, initialWaterMl, waterGoal, scoreHistory }: Props) {
  const router = useRouter();
  const [water, setWater] = useState(initialWaterMl);
  const [customAmount, setCustomAmount] = useState('');
  const [logs, setLogs] = useState<WaterLogEntry[]>([]);
  const [localDateStr, setLocalDateStr] = useState('');

  // Get current local date string (yyyy-MM-dd) on client mount
  useEffect(() => {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const dateStr = `${year}-${month}-${day}`;
    setLocalDateStr(dateStr);

    // Initialize local storage logs for today
    const key = `water-logs-${userId}-${dateStr}`;
    const saved = localStorage.getItem(key);
    if (saved) {
      try {
        setLogs(JSON.parse(saved));
      } catch {
        setLogs([]);
      }
    }
  }, [userId]);

  // Sync state with server initial value when page loads/reloads
  useEffect(() => {
    setWater(initialWaterMl);
  }, [initialWaterMl]);

  function saveLogsToLocalStorage(updatedLogs: WaterLogEntry[]) {
    if (!localDateStr) return;
    const key = `water-logs-${userId}-${localDateStr}`;
    localStorage.setItem(key, JSON.stringify(updatedLogs));
  }

  async function updateDatabase(newTotal: number) {
    if (!localDateStr) return;
    await fetch('/api/scores', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ date: localDateStr, waterMl: newTotal }),
    });
    router.refresh();
  }

  function handleAddWater(ml: number) {
    const newTotal = water + ml;
    setWater(newTotal);

    const newEntry: WaterLogEntry = {
      id: Date.now().toString(),
      amountMl: ml,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const updatedLogs = [newEntry, ...logs];
    setLogs(updatedLogs);
    saveLogsToLocalStorage(updatedLogs);
    updateDatabase(newTotal);
  }

  function handleDeleteEntry(id: string, amountMl: number) {
    const newTotal = Math.max(0, water - amountMl);
    setWater(newTotal);

    const updatedLogs = logs.filter((log) => log.id !== id);
    setLogs(updatedLogs);
    saveLogsToLocalStorage(updatedLogs);
    updateDatabase(newTotal);
  }

  function handleCustomSubmit(e: React.FormEvent) {
    e.preventDefault();
    const ml = Number(customAmount);
    if (!ml || ml <= 0 || ml > 3000) return;
    handleAddWater(ml);
    setCustomAmount('');
  }

  const rawPct = Math.round((water / waterGoal) * 100);
  const barPct = Math.min(100, rawPct);
  const isExcess = water >= 4000 || rawPct >= 160;

  // Hydration health messages
  let statusMessage = 'Hydration starting... Drink up!';
  let statusColor = 'text-blue-400';
  if (rawPct >= 100) {
    statusMessage = 'Daily Goal Achieved! Excellent job staying hydrated! 🎉';
    statusColor = 'text-emerald-400';
  } else if (rawPct >= 75) {
    statusMessage = 'Optimal Hydration! Almost at your goal.';
    statusColor = 'text-teal-400';
  } else if (rawPct >= 40) {
    statusMessage = 'Steady progress. Keep drinking water regularly.';
    statusColor = 'text-blue-400';
  } else if (water > 0) {
    statusMessage = 'Dehydrated! Keep logging and sipping water.';
    statusColor = 'text-amber-400';
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      {/* Column 1: Wavy Liquid Filling Card */}
      <div className="lg:col-span-1 space-y-6">
        <div className="health-card relative overflow-hidden flex flex-col items-center justify-between min-h-[420px] p-6 text-center group">
          {/* Top Label */}
          <div className="w-full flex items-center justify-between z-20">
            <p className="stat-label">Fluid Hydration</p>
            <GlassWater className="h-5 w-5 text-blue-400 animate-pulse" />
          </div>

          {/* Central Glass with Waves */}
          <div className="relative w-44 h-72 rounded-[32px] border-4 border-slate-700/40 bg-slate-950/60 shadow-2xl overflow-hidden flex flex-col justify-end z-10 transition-colors group-hover:border-slate-600/50">
            {/* Soft inner glow */}
            <div className="absolute inset-0 bg-gradient-to-t from-blue-900/10 to-transparent pointer-events-none z-10" />

            {/* Floating percentage text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center z-20 pointer-events-none select-none">
              <span className="text-4xl font-black text-slate-100 tracking-tight drop-shadow-md">{rawPct}%</span>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Hydrated</span>
            </div>

            {/* Rising wave container */}
            <div 
              className="absolute inset-x-0 bottom-0 bg-blue-500/25 transition-all duration-1000 ease-out"
              style={{ height: `${barPct}%` }}
            >
              {/* Wave layer 1 */}
              <div className="absolute bottom-full left-0 w-[200%] h-8 fill-blue-500/20 liquid-wave-1 pointer-events-none">
                <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-full">
                  <path d="M0,60 C150,100 350,20 500,60 C650,100 850,20 1000,60 C1150,100 1350,20 1500,60 L1500,120 L0,120 Z" />
                </svg>
              </div>
              {/* Wave layer 2 */}
              <div className="absolute bottom-full left-0 w-[200%] h-8 fill-blue-600/30 liquid-wave-2 pointer-events-none">
                <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-full">
                  <path d="M0,50 C150,10 350,90 500,50 C650,10 850,90 1000,50 C1150,10 1350,90 1500,50 L1500,120 L0,120 Z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Bottom stats indicators */}
          <div className="w-full space-y-1.5 z-20 mt-4">
            <div className="flex items-baseline justify-center gap-1.5">
              <span className="text-3xl font-black text-slate-100 tracking-tight">{(water / 1000).toFixed(2)}</span>
              <span className="text-xs text-slate-400 font-semibold">L / {(waterGoal / 1000).toFixed(1)}L Goal</span>
            </div>
            <p className={`text-[11px] font-bold ${statusColor}`}>{statusMessage}</p>
          </div>
        </div>
      </div>

      {/* Column 2: Log Inputs & Daily Log List */}
      <div className="lg:col-span-1 space-y-6">
        {/* Logger Card */}
        <div className="health-card space-y-4">
          <h2 className="section-title">Log Water Intake</h2>
          
          {/* Quick Add Grid */}
          <div className="grid grid-cols-2 gap-2.5">
            {QUICK_ADD.map((ml) => (
              <button
                key={ml}
                onClick={() => handleAddWater(ml)}
                className="flex items-center justify-center gap-2 rounded-xl border border-blue-500/20 bg-blue-500/5 hover:bg-blue-500/15 py-3 text-sm font-bold text-blue-400 transition-all active:scale-95"
              >
                <Plus className="h-4 w-4" />
                +{ml}ml
              </button>
            ))}
          </div>

          {/* Custom Input Form */}
          <form onSubmit={handleCustomSubmit} className="flex gap-2 border-t border-white/5 pt-4">
            <input
              type="number"
              className="input-field"
              placeholder="Custom amount (ml)"
              min={10}
              max={3000}
              value={customAmount}
              onChange={(e) => setCustomAmount(e.target.value)}
              required
            />
            <button
              type="submit"
              className="btn-primary px-4 bg-gradient-to-r from-blue-600 to-blue-400 shadow-blue-500/10 hover:shadow-blue-500/25"
            >
              Add
            </button>
          </form>
        </div>

        {/* Daily Logs Table */}
        <div className="health-card space-y-4 flex-1">
          <div className="flex items-center justify-between border-b border-white/5 pb-2.5">
            <h2 className="section-title">Today&apos;s Logs</h2>
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{logs.length} entries</span>
          </div>

          <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
            {logs.map((log) => (
              <div 
                key={log.id} 
                className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.01] p-3 transition-all hover:bg-white/[0.03]"
              >
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 flex items-center justify-center rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
                    <Droplets className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-200">{log.amountMl} ml</p>
                    <p className="text-[10px] text-slate-500 font-semibold">{log.timestamp}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleDeleteEntry(log.id, log.amountMl)}
                  className="btn-ghost p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-all"
                  aria-label="Delete water entry"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}

            {logs.length === 0 && (
              <div className="text-center py-8">
                <p className="text-2xl mb-1.5">💧</p>
                <p className="text-xs text-slate-500 font-semibold">No logs registered today</p>
              </div>
            )}
          </div>

          {isExcess && (
            <div className="flex gap-2 bg-rose-500/5 border border-rose-500/10 p-3 rounded-xl text-[10px] text-rose-400 leading-normal">
              <AlertTriangle className="h-4 w-4 shrink-0" />
              <span>Warning: Overhydration warning. Make sure not to drink excess water in a short time.</span>
            </div>
          )}
        </div>
      </div>

      {/* Column 3: Water History Chart & Guidelines */}
      <div className="lg:col-span-1 space-y-6">
        {/* Water chart */}
        <div className="health-card space-y-4">
          <div>
            <h2 className="section-title">Water History</h2>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-0.5">30-day hydration trends (Liters)</p>
          </div>
          {scoreHistory.length > 0 ? (
            <WaterChart data={scoreHistory} />
          ) : (
            <div className="flex h-[200px] items-center justify-center rounded-lg border border-white/5 bg-white/[0.02]">
              <p className="text-xs text-slate-500 font-medium">Log water to see history trends</p>
            </div>
          )}
        </div>

        {/* Guidelines Card */}
        <div className="health-card space-y-4">
          <div className="border-b border-white/5 pb-2">
            <h3 className="text-xs text-slate-500 font-bold uppercase tracking-wider">Hydration Guidelines</h3>
          </div>
          <ul className="space-y-3.5 text-xs text-slate-400 leading-relaxed font-semibold">
            <li className="flex gap-2">
              <span className="text-blue-400">✔</span>
              <span><strong>Paced Intake</strong>: Sip 200-300ml of water hourly rather than gulping large volumes at once.</span>
            </li>
            <li className="flex gap-2">
              <span className="text-blue-400">✔</span>
              <span><strong>Active Hydration</strong>: Drink extra water before/after meals or if active to assist metabolic processes.</span>
            </li>
            <li className="flex gap-2">
              <span className="text-blue-400">✔</span>
              <span><strong>Listen to Thirst</strong>: Do not exceed 4-5 liters a day unless engaged in hot temperatures or intense physical labor.</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
