import { useEffect, useMemo, useState } from 'react';
import AppShell from '../components/AppShell.jsx';
import GlassCard from '../components/GlassCard.jsx';
import api from '../lib/api.js';

const periods = [
  { label: 'Weekly', value: 'weekly' },
  { label: 'Monthly', value: 'monthly' }
];

const BudgetsPage = () => {
  const [budgets, setBudgets] = useState([]);
  const [categoryTotals, setCategoryTotals] = useState({});
  const [form, setForm] = useState({ category: '', limit: '', period: 'monthly' });

  const load = async () => {
    const [budgetsRes, summaryRes] = await Promise.all([
      api.get('/budgets'),
      api.get('/budgets/summary')
    ]);
    setBudgets(budgetsRes.data);
    setCategoryTotals(summaryRes.data.byCategory || {});
  };

  useEffect(() => {
    load();
  }, []);

  const totalLimit = useMemo(() => budgets.reduce((sum, item) => sum + item.limit, 0), [budgets]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    await api.post('/budgets', { ...form, limit: Number(form.limit) });
    setForm({ category: '', limit: '', period: 'monthly' });
    load();
  };

  return (
    <AppShell>
      <div className="space-y-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-white/50">Control</p>
            <h1 className="text-4xl font-black">Budgets & Limits</h1>
            <p className="text-white/60">Set and monitor category limits with proactive alerts.</p>
          </div>
          <GlassCard className="px-8 py-4">
            <p className="text-sm text-white/60">Total monthly budget</p>
            <p className="text-3xl font-black">${totalLimit.toFixed(2)}</p>
          </GlassCard>
        </div>

        <GlassCard>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <input
              name="category"
              className="form-input rounded-xl border-white/10 bg-white/5 text-white"
              placeholder="Category"
              value={form.category}
              onChange={handleChange}
              required
            />
            <input
              type="number"
              name="limit"
              step="0.01"
              className="form-input rounded-xl border-white/10 bg-white/5 text-white"
              placeholder="Limit"
              value={form.limit}
              onChange={handleChange}
              required
            />
            <select
              name="period"
              className="form-select rounded-xl border-white/10 bg-white/5 text-white"
              value={form.period}
              onChange={handleChange}
            >
              {periods.map((period) => (
                <option key={period.value} value={period.value}>
                  {period.label}
                </option>
              ))}
            </select>
            <button 
              onClick={handleSubmit}
              className="h-12 rounded-xl bg-primary font-bold tracking-wide shadow-primary/40 hover:scale-[1.02] active:scale-[0.98] transition"
            >
              Add Budget
            </button>
          </div>
        </GlassCard>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {budgets.map((budget) => {
            const spent = categoryTotals[budget.category] || 0;
            const progress = Math.min(100, (spent / budget.limit) * 100);
            const warning = progress >= 90;
            const danger = progress >= 100;
            return (
              <GlassCard
                key={budget.id}
                className={`space-y-3 border ${
                  danger ? 'border-primary' : warning ? 'border-yellow-400/60' : 'border-transparent'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-lg font-semibold">{budget.category}</p>
                    <p className="text-xs text-white/50 uppercase">{budget.period}</p>
                  </div>
                  <p className="text-xl font-bold">${budget.limit.toFixed(2)}</p>
                </div>
                <div className="h-2 rounded-full bg-white/10">
                  <div
                    className={`h-2 rounded-full ${
                      danger ? 'bg-red-500' : warning ? 'bg-yellow-400' : 'bg-secondary'
                    }`}
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-sm text-white/60">
                  <span>${spent.toFixed(2)} used</span>
                  <span>{progress.toFixed(0)}%</span>
                </div>
              </GlassCard>
            );
          })}
          {budgets.length === 0 && (
            <p className="text-white/60 col-span-full text-center">No budgets defined yet.</p>
          )}
        </div>
      </div>
    </AppShell>
  );
};

export default BudgetsPage;