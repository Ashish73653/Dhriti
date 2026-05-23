'use client';

import { DisciplineScoreWidget } from '@/components/dashboard/DisciplineScoreWidget';
import { WaterIntakeWidget } from '@/components/dashboard/WaterIntakeWidget';
import { MealSummaryWidget } from '@/components/dashboard/MealSummaryWidget';
import { InsightsPanel } from '@/components/dashboard/InsightsPanel';
import { StatCard } from '@/components/shared/StatCard';
import { Flame, Candy, Scale, TrendingDown } from 'lucide-react';
import { DashboardStats, DailyScoreDTO } from '@/types';
import { HealthIntelligenceData } from '@/features/insights/insights.service';

interface DashboardGridProps {
  stats: DashboardStats;
  score: DailyScoreDTO | null;
  insights: HealthIntelligenceData;
}

export function DashboardGrid({ stats, score, insights }: DashboardGridProps) {
  return (
    <div className="space-y-6">
      {/* Row 1: Key stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          label="Calories Today"
          value={stats.caloriesToday}
          unit="kcal"
          icon={Flame}
          iconColor="text-orange-400"
          progress={{ current: stats.caloriesToday, max: stats.caloriesGoal }}
        />
        <StatCard
          label="Sugar Intake"
          value={stats.sugarToday.toFixed(1)}
          unit="g"
          icon={Candy}
          iconColor={stats.sugarToday > 25 ? 'text-red-400' : 'text-amber-400'}
          progress={{ current: stats.sugarToday, max: 25 }}
        />
        <StatCard
          label="Protein"
          value={stats.proteinToday.toFixed(0)}
          unit="g"
          icon={TrendingDown}
          iconColor="text-indigo-400"
          progress={{ current: stats.proteinToday, max: 120 }}
        />
        <StatCard
          label="Current Weight"
          value={stats.latestWeight ?? '—'}
          unit={stats.latestWeight ? 'kg' : ''}
          icon={Scale}
          iconColor="text-purple-400"
        />
      </div>

      {/* Health Intelligence Rule Insights Panel */}
      <InsightsPanel data={insights} />

      {/* Row 2: Breakdown + Water + Meal Summary */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <DisciplineScoreWidget score={score} />
        <WaterIntakeWidget waterMl={stats.waterToday} goalMl={stats.waterGoal} />
        <MealSummaryWidget counts={stats.mealsToday} />
      </div>
    </div>
  );
}
