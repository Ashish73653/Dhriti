'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Scale } from 'lucide-react';

export function WeightLogForm() {
  const router = useRouter();
  const [form, setForm] = useState({ weightKg: '', bodyFatPct: '', notes: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.weightKg) { setError('Weight is required'); return; }
    setLoading(true);
    setError('');
    const res = await fetch('/api/weight', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        weightKg: Number(form.weightKg),
        bodyFatPct: form.bodyFatPct ? Number(form.bodyFatPct) : undefined,
        notes: form.notes || undefined,
      }),
    });
    setLoading(false);
    if (!res.ok) { setError('Failed to save. Try again.'); return; }
    setForm({ weightKg: '', bodyFatPct: '', notes: '' });
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <label className="text-xs text-slate-500 mb-1 block">Weight (kg) *</label>
        <input
          id="weight-input"
          type="number"
          step="0.1"
          min="20"
          max="300"
          className="input-field"
          placeholder="e.g. 78.5"
          value={form.weightKg}
          onChange={(e) => setForm((f) => ({ ...f, weightKg: e.target.value }))}
          required
        />
      </div>
      <div>
        <label className="text-xs text-slate-500 mb-1 block">Body Fat % (optional)</label>
        <input
          id="bodyfat-input"
          type="number"
          step="0.1"
          min="1"
          max="70"
          className="input-field"
          placeholder="e.g. 22.5"
          value={form.bodyFatPct}
          onChange={(e) => setForm((f) => ({ ...f, bodyFatPct: e.target.value }))}
        />
      </div>
      <div>
        <label className="text-xs text-slate-500 mb-1 block">Notes (optional)</label>
        <input
          className="input-field"
          placeholder="e.g. morning weight, post-workout..."
          value={form.notes}
          onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
        />
      </div>
      {error && <p className="text-xs text-red-400">{error}</p>}
      <button id="log-weight-submit" type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-50">
        <Scale className="h-4 w-4" />
        {loading ? 'Saving...' : 'Log Weight'}
      </button>
    </form>
  );
}
