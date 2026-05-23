'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MealDTO } from '@/types';
import { FoodClassBadge } from './FoodClassBadge';
import { getMealTypeEmoji, formatDate } from '@/lib/utils';
import { Trash2, ChevronDown, ChevronUp, FileText } from 'lucide-react';

interface Props { meal: MealDTO; }

export function MealCard({ meal }: Props) {
  const router = useRouter();
  const [expanded, setExpanded] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    if (!confirm('Remove this meal?')) return;
    setDeleting(true);
    await fetch(`/api/meals/${meal.id}`, { method: 'DELETE' });
    router.refresh();
  }

  return (
    <div className="glass-card p-4 transition-all duration-300 hover:border-slate-700/30">
      <div className="flex items-center gap-3">
        <span className="text-2xl transition-transform duration-300 hover:scale-110 cursor-default">
          {getMealTypeEmoji(meal.mealType)}
        </span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="text-sm font-bold text-slate-200 truncate">{meal.name}</p>
            <FoodClassBadge foodClass={meal.foodClass} size="sm" />
          </div>
          <p className="text-xs text-slate-500 font-semibold">
            {meal.calories} kcal · {meal.servingSize} · {formatDate(meal.loggedAt, 'HH:mm')}
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setExpanded(!expanded)}
            className="btn-ghost p-1.5 rounded-lg hover:bg-white/5 transition-all"
            aria-label="Toggle details"
          >
            {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="btn-ghost p-1.5 rounded-lg text-red-400 hover:bg-red-500/10 transition-all"
            aria-label="Delete meal"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {expanded && (
        <div className="mt-3.5 space-y-3 pt-3 border-t border-white/5 animate-slide-up">
          {/* Macronutrients Grid */}
          <div className="grid grid-cols-5 gap-1 sm:gap-1.5 bg-white/[0.01] border border-white/[0.02] p-1.5 sm:p-2.5 rounded-xl text-center">
            {[
              { label: 'Protein', value: meal.proteinG, unit: 'g', color: 'text-indigo-400' },
              { label: 'Carbs', value: meal.carbsG, unit: 'g', color: 'text-blue-400' },
              { label: 'Fat', value: meal.fatG, unit: 'g', color: 'text-amber-400' },
              { label: 'Sugar', value: meal.sugarG, unit: 'g', color: 'text-red-400' },
              { label: 'Fiber', value: meal.fiberG, unit: 'g', color: 'text-emerald-400' },
            ].map(({ label, value, unit, color }) => (
              <div key={label} className="flex flex-col items-center">
                <p className={`text-[10px] sm:text-sm font-extrabold ${color}`}>{value.toFixed(1)}{unit}</p>
                <p className="text-[8px] sm:text-[9px] text-slate-500 font-bold uppercase tracking-wider mt-0.5">{label}</p>
              </div>
            ))}
          </div>

          {/* Notes section if present */}
          {meal.notes && (
            <div className="flex items-start gap-2 bg-white/[0.01] border border-white/[0.02] p-2.5 rounded-xl">
              <FileText className="h-4 w-4 text-slate-500 shrink-0 mt-0.5" />
              <p className="text-xs text-slate-400 leading-relaxed italic">{meal.notes}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
