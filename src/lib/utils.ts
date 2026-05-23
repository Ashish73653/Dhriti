import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format, startOfDay, endOfDay } from 'date-fns';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string, fmt = 'dd MMM yyyy'): string {
  return format(new Date(date), fmt);
}

export function getTodayRange() {
  const now = new Date();
  return { start: startOfDay(now), end: endOfDay(now) };
}

export function getDateRange(days: number) {
  const end = endOfDay(new Date());
  const start = startOfDay(new Date(Date.now() - days * 24 * 60 * 60 * 1000));
  return { start, end };
}

export function calcBMI(weightKg: number, heightCm: number): number {
  const h = heightCm / 100;
  return Math.round((weightKg / (h * h)) * 10) / 10;
}

export function getFoodClassColor(cls: string) {
  switch (cls) {
    case 'GREEN': return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20';
    case 'YELLOW': return 'text-amber-400 bg-amber-400/10 border-amber-400/20';
    case 'RED': return 'text-red-400 bg-red-400/10 border-red-400/20';
    default: return 'text-slate-400 bg-slate-400/10 border-slate-400/20';
  }
}

export function getMealTypeEmoji(type: string) {
  switch (type) {
    case 'BREAKFAST': return '🌅';
    case 'LUNCH': return '☀️';
    case 'DINNER': return '🌙';
    case 'SNACK': return '🍎';
    default: return '🍽️';
  }
}
