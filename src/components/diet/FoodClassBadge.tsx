import { cn } from '@/lib/utils';
import { FoodClass } from '@/types';

interface FoodClassBadgeProps {
  foodClass: FoodClass;
  size?: 'sm' | 'md';
}

const CONFIG = {
  GREEN: { label: 'Green', className: 'badge-green', dot: '🟢' },
  YELLOW: { label: 'Yellow', className: 'badge-yellow', dot: '🟡' },
  RED: { label: 'Red', className: 'badge-red', dot: '🔴' },
};

export function FoodClassBadge({ foodClass, size = 'md' }: FoodClassBadgeProps) {
  const cfg = CONFIG[foodClass];
  return (
    <span className={cn(cfg.className, size === 'sm' && 'text-[10px] px-1.5 py-0')}>
      {cfg.dot} {cfg.label}
    </span>
  );
}
