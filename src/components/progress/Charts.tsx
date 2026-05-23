'use client';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  BarChart, Bar, ResponsiveContainer, LineChart, Line,
} from 'recharts';
import type { DailyScoreDTO } from '@/types';
import { formatDate } from '@/lib/utils';

const TOOLTIP_STYLE = {
  backgroundColor: '#111118',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: '8px',
  color: '#f1f5f9',
  fontSize: '12px',
};

interface WeightData { loggedAt: string; weightKg: number; }
export function WeightChart({ data }: { data: WeightData[] }) {
  const formatted = data.map((d) => ({ ...d, date: formatDate(d.loggedAt, 'dd MMM') }));
  return (
    <ResponsiveContainer width="100%" height={200}>
      <AreaChart data={formatted}>
        <defs>
          <linearGradient id="weightGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
        <XAxis dataKey="date" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} domain={['dataMin - 1', 'dataMax + 1']} />
        <Tooltip contentStyle={TOOLTIP_STYLE} />
        <Area type="monotone" dataKey="weightKg" stroke="#6366f1" strokeWidth={2} fill="url(#weightGrad)" name="Weight (kg)" />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function CaloriesChart({ data }: { data: DailyScoreDTO[] }) {
  const formatted = data.map((d) => ({ ...d, date: formatDate(d.date, 'dd MMM'), calories: d.calories ?? 0 }));
  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={formatted}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
        <XAxis dataKey="date" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
        <Tooltip contentStyle={TOOLTIP_STYLE} />
        <Bar dataKey="calories" fill="#f97316" radius={[4, 4, 0, 0]} name="Calories (kcal)" />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function SugarChart({ data }: { data: DailyScoreDTO[] }) {
  const formatted = data.map((d) => ({ ...d, date: formatDate(d.date, 'dd MMM'), sugarG: d.sugarG ?? 0 }));
  return (
    <ResponsiveContainer width="100%" height={200}>
      <LineChart data={formatted}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
        <XAxis dataKey="date" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
        <Tooltip contentStyle={TOOLTIP_STYLE} />
        <Line type="monotone" dataKey="sugarG" stroke="#ef4444" strokeWidth={2} dot={{ fill: '#ef4444', r: 3 }} name="Sugar (g)" />
      </LineChart>
    </ResponsiveContainer>
  );
}

export function DisciplineChart({ data }: { data: DailyScoreDTO[] }) {
  const formatted = data.map((d) => ({ ...d, date: formatDate(d.date, 'dd MMM') }));
  return (
    <ResponsiveContainer width="100%" height={200}>
      <AreaChart data={formatted}>
        <defs>
          <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
        <XAxis dataKey="date" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} domain={[0, 100]} />
        <Tooltip contentStyle={TOOLTIP_STYLE} />
        <Area type="monotone" dataKey="disciplineScore" stroke="#10b981" strokeWidth={2} fill="url(#scoreGrad)" name="Discipline Score" />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function WaterChart({ data }: { data: DailyScoreDTO[] }) {
  const formatted = data.map((d) => ({ ...d, date: formatDate(d.date, 'dd MMM'), waterL: (d.waterMl ?? 0) / 1000 }));
  return (
    <ResponsiveContainer width="100%" height={200}>
      <AreaChart data={formatted}>
        <defs>
          <linearGradient id="waterGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
        <XAxis dataKey="date" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
        <Tooltip contentStyle={TOOLTIP_STYLE} />
        <Area type="monotone" dataKey="waterL" stroke="#3b82f6" strokeWidth={2} fill="url(#waterGrad)" name="Water (Liters)" />
      </AreaChart>
    </ResponsiveContainer>
  );
}
