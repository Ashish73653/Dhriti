'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { searchFoods } from '@/features/meals/food-database';
import { classifyFood } from '@/features/discipline/discipline.rules';
import { FoodItem, MealType } from '@/types';
import { FoodClassBadge } from './FoodClassBadge';
import { Search, Plus, X } from 'lucide-react';

type MealFormState = {
  name: string;
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  sugarG: number;
  fiberG: number;
  servingSize: string;
  notes: string;
};

type MacroKey = Exclude<keyof MealFormState, 'name' | 'servingSize' | 'notes'>;

const MEAL_TYPES: { value: MealType; label: string; emoji: string }[] = [
  { value: 'BREAKFAST', label: 'Breakfast', emoji: '🌅' },
  { value: 'LUNCH', label: 'Lunch', emoji: '☀️' },
  { value: 'DINNER', label: 'Dinner', emoji: '🌙' },
  { value: 'SNACK', label: 'Snack', emoji: '🍎' },
];

const EMPTY: MealFormState = { name: '', calories: 0, proteinG: 0, carbsG: 0, fatG: 0, sugarG: 0, fiberG: 0, servingSize: '1 serving', notes: '' };

export function MealLogForm({ onSuccess }: { onSuccess?: () => void }) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<FoodItem[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [form, setForm] = useState<MealFormState>(EMPTY);
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);
  const [multiplier, setMultiplier] = useState<number>(1);
  const [mealType, setMealType] = useState<MealType>('LUNCH');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (query.length >= 1) {
      setResults(searchFoods(query));
      setShowResults(true);
    } else {
      setShowResults(false);
    }
  }, [query]);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowResults(false);
      }
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  function selectFood(food: FoodItem) {
    setSelectedFood(food);
    setMultiplier(1);
    setForm({
      name: food.name,
      calories: food.calories,
      proteinG: food.proteinG,
      carbsG: food.carbsG,
      fatG: food.fatG,
      sugarG: food.sugarG,
      fiberG: food.fiberG,
      servingSize: food.servingSize,
      notes: '',
    });
    setQuery(food.name);
    setShowResults(false);
  }

  function handleMultiplierChange(val: number) {
    if (val < 0) return;
    setMultiplier(val);
    if (selectedFood) {
      setForm((prev) => ({
        ...prev,
        calories: Math.round(selectedFood.calories * val),
        proteinG: parseFloat((selectedFood.proteinG * val).toFixed(1)),
        carbsG: parseFloat((selectedFood.carbsG * val).toFixed(1)),
        fatG: parseFloat((selectedFood.fatG * val).toFixed(1)),
        sugarG: parseFloat((selectedFood.sugarG * val).toFixed(1)),
        fiberG: parseFloat((selectedFood.fiberG * val).toFixed(1)),
        servingSize: val === 1 ? selectedFood.servingSize : `${val} x ${selectedFood.servingSize}`,
      }));
    }
  }

  function clearForm() {
    setForm(EMPTY);
    setSelectedFood(null);
    setMultiplier(1);
    setQuery('');
  }

  const foodClass = classifyFood(form.calories, form.sugarG);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name) { setError('Please select or enter a food item'); return; }
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/meals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, mealType, foodClass }),
      });
      if (!res.ok) { setError('Failed to log meal. Please try again.'); return; }
      clearForm();
      onSuccess?.();
      router.refresh();
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Meal type selector */}
      <div className="grid grid-cols-4 gap-2">
        {MEAL_TYPES.map((t) => (
          <button
            key={t.value}
            type="button"
            id={`meal-type-${t.value.toLowerCase()}`}
            onClick={() => setMealType(t.value)}
            className={`rounded-xl border py-2 text-center text-xs font-semibold transition-all duration-300 hover:scale-105 active:scale-95 ${
              mealType === t.value
                ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-400 font-bold shadow-md'
                : 'border-white/5 bg-white/[0.02] text-slate-500 hover:text-slate-300'
            }`}
          >
            <div className="text-xl mb-0.5">{t.emoji}</div>
            <div>{t.label}</div>
          </button>
        ))}
      </div>

      {/* Food search */}
      <div ref={searchRef} className="relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <input
            id="food-search"
            className="input-field pl-9 pr-8"
            placeholder="Search food (e.g. dal tadka, idli, paneer...)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoComplete="off"
          />
          {query && (
            <button type="button" onClick={clearForm} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300">
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {showResults && results.length > 0 && (
          <div className="absolute z-50 mt-1 w-full rounded-xl border border-border bg-card shadow-2xl overflow-hidden max-h-64 overflow-y-auto">
            {results.map((food) => (
              <button
                key={food.id}
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  selectFood(food);
                }}
                className="flex w-full items-center justify-between px-4 py-2.5 text-left hover:bg-muted transition-colors text-foreground"
              >
                <div>
                  <p className="text-sm font-semibold">{food.name}</p>
                  <p className="text-[11px] text-slate-500 font-medium">
                    {food.calories} kcal · P:{food.proteinG}g · C:{food.carbsG}g · F:{food.fatG}g
                  </p>
                </div>
                <FoodClassBadge foodClass={food.foodClass} size="sm" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Dynamic portion sizing calculator */}
      {selectedFood && (
        <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4 space-y-3 animate-slide-up">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/5 pb-3">
            <div>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Serving Size</p>
              <p className="text-sm font-bold text-slate-200">{selectedFood.servingSize}</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 font-semibold">Quantity:</span>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => handleMultiplierChange(Math.max(0.1, parseFloat((multiplier - 0.1).toFixed(2))))}
                  className="h-7 w-7 flex items-center justify-center rounded-lg bg-white/5 hover:bg-white/10 active:scale-95 text-slate-300 text-sm font-bold transition-all"
                >
                  -
                </button>
                <input
                  type="number"
                  step="0.05"
                  min="0.05"
                  className="input-field text-center font-bold text-sm w-16 h-8 px-1"
                  value={multiplier}
                  onChange={(e) => handleMultiplierChange(Number(e.target.value))}
                />
                <button
                  type="button"
                  onClick={() => handleMultiplierChange(parseFloat((multiplier + 0.1).toFixed(2)))}
                  className="h-7 w-7 flex items-center justify-center rounded-lg bg-white/5 hover:bg-white/10 active:scale-95 text-slate-300 text-sm font-bold transition-all"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* Quick Serving Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {([0.5, 1, 1.5, 2, 3] as const).map((q) => (
              <button
                key={q}
                type="button"
                onClick={() => handleMultiplierChange(q)}
                className={`rounded-lg px-2.5 py-1 text-xs font-bold transition-all active:scale-95 border ${
                  multiplier === q
                    ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-400'
                    : 'border-white/5 bg-white/[0.01] text-slate-500 hover:text-slate-300'
                }`}
              >
                {q}x
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Macro grid */}
      {form.name && (
        <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4 animate-slide-up space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-slate-200">{form.name}</p>
              {multiplier !== 1 && (
                <p className="text-[10px] text-slate-500 font-semibold">{form.servingSize}</p>
              )}
            </div>
            <FoodClassBadge foodClass={foodClass} />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {([
              { label: 'Calories', key: 'calories', unit: 'kcal', color: 'text-orange-400' },
              { label: 'Protein', key: 'proteinG', unit: 'g', color: 'text-indigo-400' },
              { label: 'Carbs', key: 'carbsG', unit: 'g', color: 'text-blue-400' },
              { label: 'Fat', key: 'fatG', unit: 'g', color: 'text-yellow-400' },
              { label: 'Sugar', key: 'sugarG', unit: 'g', color: 'text-red-400' },
              { label: 'Fiber', key: 'fiberG', unit: 'g', color: 'text-emerald-400' },
            ] as const).map(({ label, key, unit, color }) => (
              <div key={key} className="space-y-1">
                <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{label}</label>
                <div className="flex items-center gap-1.5 bg-white/[0.01] rounded-xl border border-white/5 px-2.5 py-1.5 focus-within:border-emerald-500/40 transition-colors">
                  <input
                    type="number"
                    step="0.1"
                    className="bg-transparent border-none outline-none font-bold text-sm w-full text-slate-200 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    value={form[key as MacroKey]}
                    min={0}
                    onChange={(e) => setForm((f) => ({ ...f, [key]: Number(e.target.value) }))}
                  />
                  <span className={`text-xs font-semibold ${color}`}>{unit}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Notes / Labels input */}
      {form.name && (
        <div className="space-y-1 animate-slide-up">
          <label className="text-xs text-slate-500 font-semibold mb-1 block">Notes / Labels (Optional)</label>
          <input
            className="input-field"
            placeholder="e.g. Post-workout meal, low sodium, leftovers..."
            value={form.notes}
            onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
          />
        </div>
      )}

      {/* Manual custom name if no search selection */}
      {!form.name && query.length > 1 && results.length === 0 && (
        <div className="animate-slide-up space-y-1">
          <label className="text-xs text-slate-500 font-semibold mb-1 block">Food not found — enter manually</label>
          <input
            className="input-field"
            placeholder="Food name"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          />
        </div>
      )}

      {error && <p className="text-sm text-red-400 font-medium">{error}</p>}

      <button
        id="log-meal-submit"
        type="submit"
        disabled={loading || !form.name}
        className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed justify-center"
      >
        <Plus className="h-4 w-4" />
        {loading ? 'Logging...' : 'Log Meal'}
      </button>
    </form>
  );
}
