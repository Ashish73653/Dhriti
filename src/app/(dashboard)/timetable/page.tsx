'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Calendar, Plus, Check, Info 
} from 'lucide-react';
import { FoodClassBadge } from '@/components/diet/FoodClassBadge';

interface TimetableMeal {
  id: string;
  name: string;
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  sugarG: number;
  fiberG: number;
  servingSize: string;
  timeSlot: string; 
  description: string;
  emoji: string;
  foodClass: 'GREEN' | 'YELLOW' | 'RED';
}

interface DayPlan {
  day: string;
  dayIndex: number; // 0 for Sunday, 1 for Monday...
  meals: TimetableMeal[];
}

const DIET_TIMETABLE: DayPlan[] = [
  {
    day: 'Monday',
    dayIndex: 1,
    meals: [
      { id: 'mon-early', name: 'Warm Lemon Water + 5 Almonds', calories: 50, proteinG: 2.5, carbsG: 2.5, fatG: 4, sugarG: 0.2, fiberG: 1, servingSize: '1 serving', timeSlot: 'Early Morning (07:00)', description: 'Boosts metabolism and provides clean, healthy fats to start the day.', emoji: '🍋', foodClass: 'GREEN' },
      { id: 'mon-bfast', name: 'Besan Chilla (2 pieces)', calories: 220, proteinG: 12, carbsG: 28, fatG: 7, sugarG: 2, fiberG: 4, servingSize: '2 pieces', timeSlot: 'Breakfast (08:30)', description: 'Protein-rich chickpea flour pancakes with herbs and spices.', emoji: '🥞', foodClass: 'GREEN' },
      { id: 'mon-mid', name: 'Salted Buttermilk / Chaas (1 glass)', calories: 40, proteinG: 3, carbsG: 5, fatG: 1, sugarG: 4, fiberG: 0, servingSize: '1 glass', timeSlot: 'Mid-Morning (11:00)', description: 'Light, cooling, and excellent for digestion.', emoji: '🥛', foodClass: 'GREEN' },
      { id: 'mon-lunch', name: 'Dal Tadka (1 bowl) + 2 Roti + Mixed Veg Sabzi + Salad', calories: 450, proteinG: 18, carbsG: 65, fatG: 12, sugarG: 5, fiberG: 12, servingSize: '1 serving', timeSlot: 'Lunch (13:30)', description: 'Balanced lunch with complex carbs, fiber, and clean yellow lentil proteins.', emoji: '🍛', foodClass: 'GREEN' },
      { id: 'mon-evening', name: 'Roasted Makhana / Foxnuts (1 bowl)', calories: 100, proteinG: 2.5, carbsG: 20, fatG: 2, sugarG: 0.1, fiberG: 2.5, servingSize: '1 bowl', timeSlot: 'Evening (17:00)', description: 'Light, crunchy, low-calorie roasted foxnuts.', emoji: '🍿', foodClass: 'GREEN' },
      { id: 'mon-dinner', name: 'Moong Dal Khichdi (1 bowl) + Curd', calories: 320, proteinG: 12, carbsG: 45, fatG: 6, sugarG: 3, fiberG: 5, servingSize: '1 serving', timeSlot: 'Dinner (20:00)', description: 'Light, comforting rice and lentil porridge to ensure easy sleep digestion.', emoji: '🥣', foodClass: 'GREEN' },
      { id: 'mon-bed', name: 'Warm Turmeric Milk (no sugar)', calories: 100, proteinG: 3.5, carbsG: 10, fatG: 4, sugarG: 8, fiberG: 0, servingSize: '1 glass', timeSlot: 'Bedtime (22:00)', description: 'Traditional golden milk for immune health and muscle repair.', emoji: '🥛', foodClass: 'GREEN' },
    ]
  },
  {
    day: 'Tuesday',
    dayIndex: 2,
    meals: [
      { id: 'tue-early', name: 'Warm Water + 4 Walnuts', calories: 90, proteinG: 2, carbsG: 2, fatG: 8, sugarG: 0.1, fiberG: 1, servingSize: '1 serving', timeSlot: 'Early Morning (07:00)', description: 'Provides essential Omega-3 fatty acids for brain health.', emoji: '🥜', foodClass: 'GREEN' },
      { id: 'tue-bfast', name: 'Vegetable Poha (1 bowl)', calories: 250, proteinG: 5, carbsG: 45, fatG: 5, sugarG: 3, fiberG: 3, servingSize: '1 bowl', timeSlot: 'Breakfast (08:30)', description: 'Flattened rice cooked with carrots, peas, peanuts, and light mustard seeds.', emoji: '🍛', foodClass: 'GREEN' },
      { id: 'tue-mid', name: '1 Apple', calories: 95, proteinG: 0.5, carbsG: 25, fatG: 0.3, sugarG: 19, fiberG: 4.4, servingSize: '1 medium', timeSlot: 'Mid-Morning (11:00)', description: 'High-fiber snack to stay full and active.', emoji: '🍎', foodClass: 'GREEN' },
      { id: 'tue-lunch', name: 'Rajma Curry (1 bowl) + 1 cup Brown Rice + Salad', calories: 430, proteinG: 16, carbsG: 68, fatG: 6, sugarG: 3, fiberG: 11, servingSize: '1 serving', timeSlot: 'Lunch (13:30)', description: 'Classic kidney beans curry cooked in onion-tomato paste, served with brown rice.', emoji: '🍛', foodClass: 'GREEN' },
      { id: 'tue-evening', name: 'Roasted Papad (1 piece) + Coconut Water', calories: 81, proteinG: 3.2, carbsG: 15, fatG: 0.6, sugarG: 6, fiberG: 3.1, servingSize: '1 serving', timeSlot: 'Evening (17:00)', description: 'Refreshing electrolyte water with a crisp roasted lentil cracker.', emoji: '🥥', foodClass: 'GREEN' },
      { id: 'tue-dinner', name: 'Paneer Bhurji (light oil) + 2 Chapati + Salad', calories: 450, proteinG: 22, carbsG: 42, fatG: 20, sugarG: 2, fiberG: 5, servingSize: '1 serving', timeSlot: 'Dinner (20:00)', description: 'Cottage cheese scrambled with onions, capsicums, and traditional spices.', emoji: '🍳', foodClass: 'YELLOW' },
      { id: 'tue-bed', name: 'Warm Cinnamon Milk (no sugar)', calories: 100, proteinG: 3.5, carbsG: 10, fatG: 4, sugarG: 8, fiberG: 0, servingSize: '1 glass', timeSlot: 'Bedtime (22:00)', description: 'Helps regulate blood sugar levels and promotes sound sleep.', emoji: '🥛', foodClass: 'GREEN' },
    ]
  },
  {
    day: 'Wednesday',
    dayIndex: 3,
    meals: [
      { id: 'wed-early', name: 'Warm Lemon Water + 5 Almonds', calories: 50, proteinG: 2.5, carbsG: 2.5, fatG: 4, sugarG: 0.2, fiberG: 1, servingSize: '1 serving', timeSlot: 'Early Morning (07:00)', description: 'Metabolism kickoff with clean almonds.', emoji: '🍋', foodClass: 'GREEN' },
      { id: 'wed-bfast', name: 'Vegetable Upma (1 bowl)', calories: 200, proteinG: 5, carbsG: 34, fatG: 6, sugarG: 2, fiberG: 2, servingSize: '1 bowl', timeSlot: 'Breakfast (08:30)', description: 'Semolina porridge loaded with mixed fresh garden vegetables.', emoji: '🍛', foodClass: 'GREEN' },
      { id: 'wed-mid', name: 'Salted Buttermilk / Chaas (1 glass)', calories: 40, proteinG: 3, carbsG: 5, fatG: 1, sugarG: 4, fiberG: 0, servingSize: '1 glass', timeSlot: 'Mid-Morning (11:00)', description: 'Aids hydration and digestive tract cooling.', emoji: '🥛', foodClass: 'GREEN' },
      { id: 'wed-lunch', name: 'Chole Curry (1 bowl) + 2 Roti + Salad', calories: 460, proteinG: 17, carbsG: 65, fatG: 10, sugarG: 4, fiberG: 10, servingSize: '1 serving', timeSlot: 'Lunch (13:30)', description: 'Spiced chickpeas curry served alongside two fresh whole wheat rotis.', emoji: '🍛', foodClass: 'GREEN' },
      { id: 'wed-evening', name: 'Dry Roasted Chana (1 handful)', calories: 120, proteinG: 6.5, carbsG: 18, fatG: 2, sugarG: 0.8, fiberG: 4.5, servingSize: '1 handful', timeSlot: 'Evening (17:00)', description: 'Superb high-protein, high-fiber, fat-free roasted chickpeas snack.', emoji: '🥜', foodClass: 'GREEN' },
      { id: 'wed-dinner', name: 'Soya Chunks Curry + 1 Roti + Salad', calories: 320, proteinG: 26, carbsG: 30, fatG: 5, sugarG: 1, fiberG: 7, servingSize: '1 serving', timeSlot: 'Dinner (20:00)', description: 'Soya chunks cooked in home-style tomato onion gravy. Exceptional protein for vegetarians.', emoji: '🍲', foodClass: 'GREEN' },
      { id: 'wed-bed', name: 'Warm Turmeric Milk (no sugar)', calories: 100, proteinG: 3.5, carbsG: 10, fatG: 4, sugarG: 8, fiberG: 0, servingSize: '1 glass', timeSlot: 'Bedtime (22:00)', description: 'Supports physical recoverability.', emoji: '🥛', foodClass: 'GREEN' },
    ]
  },
  {
    day: 'Thursday',
    dayIndex: 4,
    meals: [
      { id: 'thu-early', name: 'Warm Water + 4 Walnuts', calories: 90, proteinG: 2, carbsG: 2, fatG: 8, sugarG: 0.1, fiberG: 1, servingSize: '1 serving', timeSlot: 'Early Morning (07:00)', description: 'Clean fats to boost cognitive function.', emoji: '🥜', foodClass: 'GREEN' },
      { id: 'thu-bfast', name: 'Moong Dal Chilla with Paneer filling', calories: 280, proteinG: 15, carbsG: 30, fatG: 10, sugarG: 2, fiberG: 4.5, servingSize: '1 piece', timeSlot: 'Breakfast (08:30)', description: 'Yellow split-lentil crepe filled with grated fresh cottage cheese.', emoji: '🥞', foodClass: 'GREEN' },
      { id: 'thu-mid', name: '1 bowl Papaya or Watermelon', calories: 55, proteinG: 0.9, carbsG: 14, fatG: 0.2, sugarG: 8, fiberG: 2.5, servingSize: '1 bowl', timeSlot: 'Mid-Morning (11:00)', description: 'Vitamin-rich, light fresh seasonal fruits.', emoji: '🍉', foodClass: 'GREEN' },
      { id: 'thu-lunch', name: 'Yellow Moong Dal (1 bowl) + Bhindi Fry + 2 Roti', calories: 420, proteinG: 15, carbsG: 55, fatG: 10, sugarG: 3, fiberG: 9, servingSize: '1 serving', timeSlot: 'Lunch (13:30)', description: 'Comforting yellow lentils paired with spiced okra sabzi and whole wheat rotis.', emoji: '🍛', foodClass: 'GREEN' },
      { id: 'thu-evening', name: 'Bhel Puri (Home-style, no sweet chutney)', calories: 130, proteinG: 4, carbsG: 22, fatG: 4, sugarG: 2, fiberG: 2, servingSize: '1 bowl', timeSlot: 'Evening (17:00)', description: 'Crisp puffed rice tossed with peanuts, onions, tomatoes, coriander, and lemon.', emoji: '🥗', foodClass: 'GREEN' },
      { id: 'thu-dinner', name: 'Mixed Vegetable Curry + 1 Roti + 1 bowl Curd + Salad', calories: 380, proteinG: 12, carbsG: 48, fatG: 9, sugarG: 5, fiberG: 8, servingSize: '1 serving', timeSlot: 'Dinner (20:00)', description: 'Seasonal local vegetables cooked with light spices, paired with curd.', emoji: '🍲', foodClass: 'GREEN' },
      { id: 'thu-bed', name: 'Warm Milk (no sugar)', calories: 100, proteinG: 3.5, carbsG: 10, fatG: 4, sugarG: 8, fiberG: 0, servingSize: '1 glass', timeSlot: 'Bedtime (22:00)', description: 'Traditional warm bedtime milk.', emoji: '🥛', foodClass: 'GREEN' },
    ]
  },
  {
    day: 'Friday',
    dayIndex: 5,
    meals: [
      { id: 'fri-early', name: 'Warm Lemon Water + 5 Almonds', calories: 50, proteinG: 2.5, carbsG: 2.5, fatG: 4, sugarG: 0.2, fiberG: 1, servingSize: '1 serving', timeSlot: 'Early Morning (07:00)', description: 'Metabolic boost with clean nuts.', emoji: '🍋', foodClass: 'GREEN' },
      { id: 'fri-bfast', name: 'Masala Oats with vegetables (1 bowl)', calories: 180, proteinG: 6, carbsG: 30, fatG: 4, sugarG: 2, fiberG: 5.5, servingSize: '1 bowl', timeSlot: 'Breakfast (08:30)', description: 'Heart-healthy rolled oats prepared savory style with peas and spices.', emoji: '🥣', foodClass: 'GREEN' },
      { id: 'fri-mid', name: '1 Guava or 1 Orange', calories: 60, proteinG: 1.3, carbsG: 14, fatG: 0.3, sugarG: 9, fiberG: 4.5, servingSize: '1 medium', timeSlot: 'Mid-Morning (11:00)', description: 'Rich in Vitamin C to maintain strong immunity.', emoji: '🍊', foodClass: 'GREEN' },
      { id: 'fri-lunch', name: 'Kadhi (Light, no deep fry) + 1 cup Cooked Rice + Salad', calories: 410, proteinG: 10, carbsG: 62, fatG: 8, sugarG: 4, fiberG: 4, servingSize: '1 serving', timeSlot: 'Lunch (13:30)', description: 'Tangy gram flour and yogurt curry with light steamed white/brown rice.', emoji: '🍛', foodClass: 'GREEN' },
      { id: 'fri-evening', name: 'Masala Chai (Low sugar) + 2 Marie Gold Biscuits', calories: 130, proteinG: 3.5, carbsG: 20, fatG: 3.5, sugarG: 6, fiberG: 0.5, servingSize: '1 serving', timeSlot: 'Evening (17:00)', description: 'Classic afternoon tea break pairing.', emoji: '☕', foodClass: 'YELLOW' },
      { id: 'fri-dinner', name: 'Palak Paneer + 2 Roti + Salad', calories: 400, proteinG: 16, carbsG: 44, fatG: 15, sugarG: 3, fiberG: 6, servingSize: '1 serving', timeSlot: 'Dinner (20:00)', description: 'Spiced spinach puree cooked with cubed fresh paneer.', emoji: '🍲', foodClass: 'GREEN' },
      { id: 'fri-bed', name: 'Warm Turmeric Milk (no sugar)', calories: 100, proteinG: 3.5, carbsG: 10, fatG: 4, sugarG: 8, fiberG: 0, servingSize: '1 glass', timeSlot: 'Bedtime (22:00)', description: 'Comforting turmeric golden milk.', emoji: '🥛', foodClass: 'GREEN' },
    ]
  },
  {
    day: 'Saturday',
    dayIndex: 6,
    meals: [
      { id: 'sat-early', name: 'Warm Water + 4 Walnuts', calories: 90, proteinG: 2, carbsG: 2, fatG: 8, sugarG: 0.1, fiberG: 1, servingSize: '1 serving', timeSlot: 'Early Morning (07:00)', description: 'Brain-boosting essential fatty acids.', emoji: '🥜', foodClass: 'GREEN' },
      { id: 'sat-bfast', name: 'Idli (3 pieces) with Coconut Chutney', calories: 220, proteinG: 6, carbsG: 38, fatG: 3, sugarG: 1, fiberG: 2, servingSize: '3 pieces', timeSlot: 'Breakfast (08:30)', description: 'Light, steamed fermented rice-lentil cakes.', emoji: '🥞', foodClass: 'GREEN' },
      { id: 'sat-mid', name: 'Coconut Water (1 glass)', calories: 46, proteinG: 1.7, carbsG: 9, fatG: 0.5, sugarG: 6, fiberG: 2.6, servingSize: '1 glass', timeSlot: 'Mid-Morning (11:00)', description: 'Natural hydration rich in potassium.', emoji: '🥥', foodClass: 'GREEN' },
      { id: 'sat-lunch', name: 'Dal Fry (1 bowl) + Aloo Gobi + 2 Roti + Curd', calories: 440, proteinG: 16, carbsG: 58, fatG: 12, sugarG: 4, fiberG: 10, servingSize: '1 serving', timeSlot: 'Lunch (13:30)', description: 'Hearty yellow dal paired with potato cauliflower sabzi and yogurt.', emoji: '🍛', foodClass: 'GREEN' },
      { id: 'sat-evening', name: 'Roasted Makhana / Foxnuts (1 bowl)', calories: 100, proteinG: 2.5, carbsG: 20, fatG: 2, sugarG: 0.1, fiberG: 2.5, servingSize: '1 bowl', timeSlot: 'Evening (17:00)', description: 'Light roasted snack.', emoji: '🍿', foodClass: 'GREEN' },
      { id: 'sat-dinner', name: 'Paneer Tikka (Home-grilled, 5 pieces) + Salad', calories: 290, proteinG: 16, carbsG: 8, fatG: 20, sugarG: 3, fiberG: 2, servingSize: '5 pieces', timeSlot: 'Dinner (20:00)', description: 'Cottage cheese marinated in yogurt and spices, grilled at home with bell peppers.', emoji: '🍢', foodClass: 'YELLOW' },
      { id: 'sat-bed', name: 'Warm Cinnamon Milk (no sugar)', calories: 100, proteinG: 3.5, carbsG: 10, fatG: 4, sugarG: 8, fiberG: 0, servingSize: '1 glass', timeSlot: 'Bedtime (22:00)', description: 'Blood sugar balancer before sleep.', emoji: '🥛', foodClass: 'GREEN' },
    ]
  },
  {
    day: 'Sunday',
    dayIndex: 0,
    meals: [
      { id: 'sun-early', name: 'Warm Lemon Water + 5 Almonds', calories: 50, proteinG: 2.5, carbsG: 2.5, fatG: 4, sugarG: 0.2, fiberG: 1, servingSize: '1 serving', timeSlot: 'Early Morning (07:00)', description: 'Metabolism startup.', emoji: '🍋', foodClass: 'GREEN' },
      { id: 'sun-bfast', name: 'Plain Dosa with Mint Chutney', calories: 170, proteinG: 4, carbsG: 32, fatG: 3, sugarG: 1, fiberG: 1.2, servingSize: '1 piece', timeSlot: 'Breakfast (08:30)', description: 'Crisp fermented crepe served with cooling mint dip.', emoji: '🥞', foodClass: 'GREEN' },
      { id: 'sun-mid', name: '1 Bowl Fresh Papaya', calories: 55, proteinG: 0.9, carbsG: 14, fatG: 0.2, sugarG: 8, fiberG: 2.5, servingSize: '1 bowl', timeSlot: 'Mid-Morning (11:00)', description: 'Rich in papain enzyme, excellent for gut health.', emoji: '🥭', foodClass: 'GREEN' },
      { id: 'sun-lunch', name: 'Veg Biryani (Home-style) + Mixed Veg Raita', calories: 440, proteinG: 11, carbsG: 68, fatG: 11, sugarG: 5, fiberG: 6, servingSize: '1 serving', timeSlot: 'Lunch (13:30)', description: 'Flavored spice rice cooked with carrots, beans, cottage cheese, served with raita.', emoji: '🍛', foodClass: 'YELLOW' },
      { id: 'sun-evening', name: 'Roasted Peanut Mix (1 small bowl)', calories: 120, proteinG: 5, carbsG: 6, fatG: 9, sugarG: 0.8, fiberG: 2, servingSize: '1 serving', timeSlot: 'Evening (17:00)', description: 'Roasted peanuts mixed with chopped onions, tomatoes, and lime juice.', emoji: '🥜', foodClass: 'GREEN' },
      { id: 'sun-dinner', name: 'Moong Dal Khichdi (1 bowl) + Roasted Papad + Curd', calories: 320, proteinG: 12, carbsG: 45, fatG: 6, sugarG: 3, fiberG: 5, servingSize: '1 serving', timeSlot: 'Dinner (20:00)', description: 'Soothes stomach, very easy to digest before the busy week ahead.', emoji: '🥣', foodClass: 'GREEN' },
      { id: 'sun-bed', name: 'Warm Turmeric Milk (no sugar)', calories: 100, proteinG: 3.5, carbsG: 10, fatG: 4, sugarG: 8, fiberG: 0, servingSize: '1 glass', timeSlot: 'Bedtime (22:00)', description: 'Calming bedtime golden milk.', emoji: '🥛', foodClass: 'GREEN' },
    ]
  }
];

export default function DietTimetable() {
  // Identify the current day of the week to set as default tab
  const [activeDay, setActiveDay] = useState('Monday');
  const [logStatus, setLogStatus] = useState<Record<string, 'idle' | 'loading' | 'success'>>({});
  const router = useRouter();

  useEffect(() => {
    // Current day Index: Sunday = 0, Monday = 1 ...
    const curIdx = new Date().getDay();
    const matched = DIET_TIMETABLE.find(d => d.dayIndex === curIdx);
    if (matched) {
      setActiveDay(matched.day);
    }
  }, []);

  const currentPlan = DIET_TIMETABLE.find((d) => d.day === activeDay) || DIET_TIMETABLE[0];

  // Calculate day totals
  const totalCal = currentPlan.meals.reduce((sum, m) => sum + m.calories, 0);
  const totalProt = currentPlan.meals.reduce((sum, m) => sum + m.proteinG, 0);
  const totalCarb = currentPlan.meals.reduce((sum, m) => sum + m.carbsG, 0);
  const totalFat = currentPlan.meals.reduce((sum, m) => sum + m.fatG, 0);
  const totalFib = currentPlan.meals.reduce((sum, m) => sum + m.fiberG, 0);

  async function handleQuickLog(meal: TimetableMeal) {
    setLogStatus(prev => ({ ...prev, [meal.id]: 'loading' }));
    try {
      const res = await fetch('/api/meals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: meal.name,
          calories: meal.calories,
          proteinG: meal.proteinG,
          carbsG: meal.carbsG,
          fatG: meal.fatG,
          sugarG: meal.sugarG,
          fiberG: meal.fiberG,
          servingSize: meal.servingSize,
          mealType: meal.timeSlot.includes('Breakfast') ? 'BREAKFAST' :
                    meal.timeSlot.includes('Lunch') ? 'LUNCH' :
                    meal.timeSlot.includes('Dinner') ? 'DINNER' : 'SNACK',
          foodClass: meal.foodClass,
          notes: `Logged from Diet Timetable (${activeDay})`
        }),
      });
      if (res.ok) {
        setLogStatus(prev => ({ ...prev, [meal.id]: 'success' }));
        setTimeout(() => {
          setLogStatus(prev => ({ ...prev, [meal.id]: 'idle' }));
        }, 2500);
        router.refresh();
      } else {
        setLogStatus(prev => ({ ...prev, [meal.id]: 'idle' }));
        alert('Failed to log meal. Please try again.');
      }
    } catch {
      setLogStatus(prev => ({ ...prev, [meal.id]: 'idle' }));
      alert('Network error. Please try again.');
    }
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2 text-gradient">
          <Calendar className="h-6 w-6 text-emerald-400" />
          <h1 className="text-2xl font-extrabold tracking-tight">Diet Timetable</h1>
        </div>
        <p className="text-sm text-slate-500 font-semibold leading-relaxed">
          Sustained healthy eating routines tailored for daily North Indian home food. Crafted for non-gym-goers focusing on light, gut-friendly digestion and weight balance.
        </p>
      </div>

      {/* Info Callout */}
      <div className="flex items-start gap-3 bg-emerald-500/5 border border-emerald-500/20 p-4 rounded-2xl">
        <Info className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
        <div className="text-xs text-slate-400 leading-relaxed font-semibold">
          <p className="text-slate-200 font-bold mb-1">💡 Portions & Quick Logging</p>
          Each meal lists standard household serving sizes. You can directly log any item into your daily health tracker using the <span className="text-emerald-400 font-bold inline-flex items-center gap-0.5"><Plus className="h-3 w-3" /> Log Meal</span> button!
        </div>
      </div>

      {/* Days Tabs Selection */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
        {DIET_TIMETABLE.map((plan) => (
          <button
            key={plan.day}
            onClick={() => setActiveDay(plan.day)}
            className={`rounded-xl px-4 py-2.5 text-xs font-extrabold uppercase tracking-wider transition-all duration-300 active:scale-95 border flex-shrink-0 ${
              activeDay === plan.day
                ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-400 shadow-md font-black'
                : 'border-white/5 bg-white/[0.02] text-slate-500 hover:text-slate-300'
            }`}
          >
            {plan.day}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Timetable List Grid */}
        <div className="lg:col-span-2 space-y-4">
          {currentPlan.meals.map((meal) => (
            <div 
              key={meal.id} 
              className="health-card p-3 sm:p-5 relative overflow-hidden group flex gap-3 sm:gap-4 transition-all duration-300 hover:shadow-md border-l-4 hover:translate-x-0.5"
              style={{ borderLeftColor: meal.foodClass === 'GREEN' ? '#10b981' : meal.foodClass === 'YELLOW' ? '#f59e0b' : '#ef4444' }}
            >
              {/* Left Slot: Emoji & Time */}
              <div className="flex flex-col items-center gap-2 shrink-0">
                <span className="text-3xl transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6 cursor-default">
                  {meal.emoji}
                </span>
                <span className="text-[10px] bg-white/5 border border-white/5 text-slate-500 font-bold px-1.5 py-0.5 rounded-md">
                  {meal.timeSlot.split(' ')[0]}
                </span>
              </div>

              {/* Central & Action container */}
              <div className="flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-3 min-w-0">
                <div className="flex-1 space-y-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="text-sm font-bold text-slate-200 leading-tight group-hover:text-white transition-colors">
                        {meal.name}
                      </h3>
                      <p className="text-[10px] text-slate-500 font-semibold">{meal.timeSlot}</p>
                    </div>
                    <FoodClassBadge foodClass={meal.foodClass} size="sm" />
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed font-medium">
                    {meal.description}
                  </p>

                  {/* Micro Macros details */}
                  <div className="flex flex-wrap items-center gap-1.5 sm:gap-3 pt-2 text-[10px] text-slate-500 font-bold">
                    <span className="text-orange-400">{meal.calories} kcal</span>
                    <span>·</span>
                    <span>P: <strong className="text-indigo-400">{meal.proteinG}g</strong></span>
                    <span>·</span>
                    <span>C: <strong className="text-blue-400">{meal.carbsG}g</strong></span>
                    <span>·</span>
                    <span>F: <strong className="text-yellow-400">{meal.fatG}g</strong></span>
                    <span>·</span>
                    <span>Fiber: <strong className="text-emerald-400">{meal.fiberG}g</strong></span>
                  </div>
                </div>

                {/* Action Button: Quick Log */}
                <div className="shrink-0 sm:self-center flex justify-end sm:pl-2">
                  {logStatus[meal.id] === 'success' ? (
                    <div className="flex h-8 items-center gap-1 rounded-xl bg-emerald-500/10 px-3 text-xs font-bold text-emerald-400 border border-emerald-500/20 animate-fade-in">
                      <Check className="h-3.5 w-3.5" />
                      <span>Logged</span>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleQuickLog(meal)}
                      disabled={logStatus[meal.id] === 'loading'}
                      className="flex h-8 items-center gap-1 rounded-xl bg-white/5 border border-white/5 hover:bg-emerald-500/10 hover:text-emerald-400 hover:border-emerald-500/20 px-3 text-xs font-bold text-slate-400 transition-all active:scale-95 disabled:opacity-50 w-full sm:w-auto justify-center"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      <span>{logStatus[meal.id] === 'loading' ? 'Logging...' : 'Log'}</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Right Panel: Daily Macros Summary & Quick Tips */}
        <div className="space-y-6">
          {/* Day Macros Breakdown Card */}
          <div className="health-card space-y-4 relative overflow-hidden group">
            <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-emerald-500/5 blur-2xl opacity-0 group-hover:opacity-100 transition-all duration-500" />
            
            <div className="border-b border-white/5 pb-3">
              <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Day Totals</p>
              <h2 className="text-lg font-extrabold text-slate-200">{activeDay} Summary</h2>
            </div>

            <div className="space-y-3.5">
              {/* Calories Item */}
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400 font-semibold">Total Calories</span>
                <span className="text-sm font-extrabold text-orange-400">{totalCal} kcal</span>
              </div>
              <div className="h-1.5 w-full bg-white/[0.04] rounded-full overflow-hidden">
                <div className="h-full bg-orange-500 rounded-full" style={{ width: '80%' }} />
              </div>

              {/* Simple Macro Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 gap-3 pt-2">
                <div className="bg-white/[0.01] border border-white/5 p-2.5 rounded-xl text-center">
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Protein</p>
                  <p className="text-sm font-black text-indigo-400 mt-0.5">{totalProt.toFixed(1)}g</p>
                </div>
                <div className="bg-white/[0.01] border border-white/5 p-2.5 rounded-xl text-center">
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Carbs</p>
                  <p className="text-sm font-black text-blue-400 mt-0.5">{totalCarb.toFixed(1)}g</p>
                </div>
                <div className="bg-white/[0.01] border border-white/5 p-2.5 rounded-xl text-center">
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Fat</p>
                  <p className="text-sm font-black text-yellow-400 mt-0.5">{totalFat.toFixed(1)}g</p>
                </div>
                <div className="bg-white/[0.01] border border-white/5 p-2.5 rounded-xl text-center">
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Fiber</p>
                  <p className="text-sm font-black text-emerald-400 mt-0.5">{totalFib.toFixed(1)}g</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Diet Guidelines Card */}
          <div className="health-card space-y-4">
            <div className="border-b border-white/5 pb-2">
              <h3 className="text-xs text-slate-500 font-bold uppercase tracking-wider">North Indian Guidelines</h3>
            </div>
            <ul className="space-y-3 text-xs text-slate-400 leading-relaxed font-semibold">
              <li className="flex gap-2">
                <span className="text-emerald-400">✔</span>
                <span><strong>Limit Oil/Ghee</strong>: Cook veggies and dals in 1 tsp oil. Use dry chillas and plain rotis regularly.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-emerald-400">✔</span>
                <span><strong>No Sugar Tea</strong>: Switch to unsweetened Masala Chai or use Stevia. Steer clear of sweets/lassi.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-emerald-400">✔</span>
                <span><strong>Hydration First</strong>: Keep up sweet buttermilk, salted chaas, and lemon water intake throughout the day.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-emerald-400">✔</span>
                <span><strong>Early Dinner</strong>: Eat dinner by 8:00 PM. Moong khichdi and paneer are perfect light options.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
