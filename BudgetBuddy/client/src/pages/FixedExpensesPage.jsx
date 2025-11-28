import { useEffect, useMemo, useState } from 'react';
import AppShell from '../components/AppShell.jsx';
import GlassCard from '../components/GlassCard.jsx';
import api from '../lib/api.js';

const FixedExpensesPage = () => {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({
    amount: '',
    category: '',
    description: '',
    date: ''
  });

  const total = useMemo(() => items.reduce((sum, item) => sum + item.amount, 0), [items]);

  const load = async () => {
    const { data } = await api.get('/fixed-expenses');
    setItems(data);
  };

  useEffect(() => {
    load();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    await api.post('/fixed-expenses', { ...form, amount: Number(form.amount) });
    setForm({ amount: '', category: '', description: '', date: '' });
    load();
  };

  return (
    <AppShell>
      <div className="space-y-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-white/50">Planning</p>
            <h1 className="text-4xl font-black">Fixed Expenses</h1>
            <p className="text-white/60">Manage your recurring monthly costs with ease.</p>
          </div>
          <GlassCard className="px-8 py-4">
            <p className="text-sm text-white/60">Monthly total</p>
            <p className="text-3xl font-black">${total.toFixed(2)}</p>
          </GlassCard>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((expense) => (
            <GlassCard key={expense.id} className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-lg font-semibold">{expense.category}</p>
                <p className="text-xl font-bold text-primary">${expense.amount.toFixed(2)}</p>
              </div>
              <p className="text-sm text-white/60">{expense.description || 'No description'}</p>
              <p className="text-xs text-white/40">
                Next billing: {new Date(expense.date).toLocaleDateString()}
              </p>
            </GlassCard>
          ))}
          {items.length === 0 && (
            <p className="text-white/60 col-span-full text-center">No fixed expenses yet.</p>
          )}
        </div>

        <GlassCard>
          <h2 className="text-2xl font-bold mb-4">Add a fixed expense</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              name="amount"
              step="0.01"
              className="form-input rounded-xl border-white/10 bg-white/5 text-white"
              placeholder="Amount"
              value={form.amount}
              onChange={handleChange}
              required
            />
            <input
              type="date"
              name="date"
              className="form-input rounded-xl border-white/10 bg-white/5 text-white"
              value={form.date}
              onChange={handleChange}
              required
            />
            <input
              name="description"
              className="form-input rounded-xl border-white/10 bg-white/5 text-white"
              placeholder="Description"
              value={form.description}
              onChange={handleChange}
            />
            <button 
              onClick={handleSubmit}
              className="md:col-span-2 h-12 rounded-xl bg-primary font-bold tracking-wide shadow-primary/30 hover:shadow-primary/60 hover:scale-[1.02] active:scale-[0.98] transition"
            >
              Save fixed expense
            </button>
          </div>
        </GlassCard>
      </div>
    </AppShell>
  );
};

export default FixedExpensesPage;