'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface UserData { 
  name: string | null; 
  email: string; 
  calorieGoal: number; 
  waterGoal: number; 
  weightGoal: number | null; 
  heightCm: number | null; 
}

export function SettingsForm({ user }: { user: UserData | null }) {
  const router = useRouter();
  const [form, setForm] = useState({
    name: user?.name ?? '',
    calorieGoal: user?.calorieGoal ?? 1600,
    waterGoal: user?.waterGoal ?? 2500,
    weightGoal: user?.weightGoal ?? '',
    heightCm: user?.heightCm ?? '',
  });
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await fetch('/api/user/settings', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...form,
        weightGoal: form.weightGoal === '' ? '' : Number(form.weightGoal),
        heightCm: form.heightCm === '' ? '' : Number(form.heightCm),
      }),
    });
    setLoading(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-xs text-slate-500 mb-1 block">Display Name</label>
          <input className="input-field" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
        </div>
        <div>
          <label className="text-xs text-slate-500 mb-1 block">Email</label>
          <input className="input-field opacity-50 cursor-not-allowed" value={user?.email ?? ''} readOnly />
        </div>
        <div>
          <label className="text-xs text-slate-500 mb-1 block">Height (cm)</label>
          <input id="height-input" type="number" className="input-field" min={50} max={250} placeholder="e.g. 175"
            value={form.heightCm} onChange={(e) => setForm((f) => ({ ...f, heightCm: e.target.value }))} />
        </div>
        <div>
          <label className="text-xs text-slate-500 mb-1 block">Target Weight (kg)</label>
          <input id="weight-goal" type="number" step="0.1" className="input-field" placeholder="e.g. 70"
            value={form.weightGoal} onChange={(e) => setForm((f) => ({ ...f, weightGoal: e.target.value }))} />
        </div>
        <div>
          <label className="text-xs text-slate-500 mb-1 block">Daily Calorie Goal (kcal)</label>
          <input id="calorie-goal" type="number" className="input-field" min={800} max={4000}
            value={form.calorieGoal} onChange={(e) => setForm((f) => ({ ...f, calorieGoal: Number(e.target.value) }))} />
        </div>
        <div>
          <label className="text-xs text-slate-500 mb-1 block">Water Goal (ml)</label>
          <input id="water-goal" type="number" className="input-field" min={500} max={6000}
            value={form.waterGoal} onChange={(e) => setForm((f) => ({ ...f, waterGoal: Number(e.target.value) }))} />
        </div>
      </div>
      <button id="save-settings" type="submit" disabled={loading} className="btn-primary disabled:opacity-50">
        {saved ? '✓ Saved!' : loading ? 'Saving...' : 'Save Settings'}
      </button>
    </form>
  );
}
