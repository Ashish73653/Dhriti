import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getMealsToday } from '@/features/meals/meals.service';
import { MealLogForm } from '@/components/diet/MealLogForm';
import { MealCard } from '@/components/diet/MealCard';

export const dynamic = 'force-dynamic';

export default async function DietPage() {
  const session = await getServerSession(authOptions);
  const userId = session?.user.id;

  if (!userId) {
    throw new Error('Authenticated user id is missing');
  }
  const meals = await getMealsToday(userId);

  const totals = meals.reduce(
    (acc, m) => ({
      calories: acc.calories + m.calories,
      protein: acc.protein + m.proteinG,
      carbs: acc.carbs + m.carbsG,
      fat: acc.fat + m.fatG,
      sugar: acc.sugar + m.sugarG,
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0, sugar: 0 }
  );

  const byType = {
    BREAKFAST: meals.filter((m) => m.mealType === 'BREAKFAST'),
    LUNCH: meals.filter((m) => m.mealType === 'LUNCH'),
    DINNER: meals.filter((m) => m.mealType === 'DINNER'),
    SNACK: meals.filter((m) => m.mealType === 'SNACK'),
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-100">Diet & Meals</h1>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Log form */}
        <div className="health-card lg:col-span-1">
          <h2 className="section-title mb-4">Log a Meal</h2>
          <MealLogForm />
        </div>

        {/* Today summary + meals */}
        <div className="space-y-4 lg:col-span-2">
          {/* Macro summary bar */}
          <div className="health-card">
            <h2 className="section-title mb-3">Today&apos;s Macros</h2>
            <div className="grid grid-cols-5 gap-1.5 sm:gap-3 text-center">
              {[
                { label: 'Calories', value: Math.round(totals.calories), unit: 'kcal', color: 'text-orange-400' },
                { label: 'Protein', value: Math.round(totals.protein), unit: 'g', color: 'text-indigo-400' },
                { label: 'Carbs', value: Math.round(totals.carbs), unit: 'g', color: 'text-blue-400' },
                { label: 'Fat', value: Math.round(totals.fat), unit: 'g', color: 'text-amber-400' },
                { label: 'Sugar', value: Math.round(totals.sugar), unit: 'g', color: totals.sugar > 25 ? 'text-red-400' : 'text-emerald-400' },
              ].map(({ label, value, unit, color }) => (
                <div key={label} className="rounded-lg border border-white/5 bg-white/[0.02] p-1.5 sm:p-3">
                  <p className={`text-xs sm:text-lg font-extrabold sm:font-bold ${color}`}>{value}</p>
                  <p className="text-[8px] sm:text-[10px] text-slate-600 font-medium">{unit}</p>
                  <p className="text-[8px] sm:text-[10px] text-slate-500 font-semibold">{label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Meals by type */}
          {(Object.entries(byType) as [string, typeof meals][]).map(([type, typeMeals]) => (
            typeMeals.length > 0 && (
              <div key={type} className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 pl-1">
                  {type === 'BREAKFAST' ? '🌅' : type === 'LUNCH' ? '☀️' : type === 'DINNER' ? '🌙' : '🍎'} {type}
                </p>
                {typeMeals.map((meal) => <MealCard key={meal.id} meal={meal} />)}
              </div>
            )
          ))}

          {meals.length === 0 && (
            <div className="health-card text-center py-12">
              <p className="text-4xl mb-3">🍽️</p>
              <p className="text-slate-400">No meals logged today yet.</p>
              <p className="text-sm text-slate-600 mt-1">Use the form to log your first meal.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
