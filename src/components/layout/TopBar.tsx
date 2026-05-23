'use client';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Menu, Bell, Sun, Moon } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { formatDate } from '@/lib/utils';

export function TopBar() {
  const { toggleSidebar } = useAppStore();
  const { data: session } = useSession();
  const today = formatDate(new Date(), 'EEEE, dd MMM yyyy');
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  useEffect(() => {
    const saved = localStorage.getItem('theme') as 'dark' | 'light' | null;
    if (saved) {
      setTheme(saved);
      document.documentElement.classList.toggle('light', saved === 'light');
    }
  }, []);

  function toggleTheme() {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    localStorage.setItem('theme', next);
    document.documentElement.classList.toggle('light', next === 'light');
  }

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b border-white/[0.04] bg-[#030306]/60 px-4 md:px-6 backdrop-blur-xl transition-all duration-300">
      <button
        onClick={toggleSidebar}
        className="btn-ghost p-2"
        aria-label="Toggle sidebar"
      >
        <Menu className="h-4 w-4" />
      </button>

      <div className="flex-1">
        <p className="text-xs text-slate-500 font-semibold">{today}</p>
      </div>

      <div className="flex items-center gap-3">
        {/* Sync removed: keep layout minimal */}

        {/* Dark/Light mode toggle */}
        <button
          onClick={toggleTheme}
          className="btn-ghost p-2 text-slate-400 hover:text-slate-200"
          aria-label="Toggle theme"
          id="theme-toggle"
        >
          {theme === 'dark' ? (
            <Sun className="h-4 w-4 text-amber-400" />
          ) : (
            <Moon className="h-4 w-4 text-indigo-500" />
          )}
        </button>

        <button className="btn-ghost relative p-2" aria-label="Notifications">
          <Bell className="h-4 w-4" />
          <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-emerald-400" />
        </button>

        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/20 text-sm font-semibold text-emerald-400 border border-emerald-500/10">
          {session?.user?.name?.[0]?.toUpperCase() ?? 'U'}
        </div>
      </div>

    </header>
  );
}

