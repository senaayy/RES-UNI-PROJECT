import { useState } from 'react';
import AppShell from '../components/AppShell.jsx';
import GlassCard from '../components/GlassCard.jsx';
import api from '../lib/api.js';

const categories = ['Food', 'Travel', 'Bills', 'Shopping', 'Other'];

const AddExpensePage = () => {
  const [form, setForm] = useState({
    amount: '',
    category: '',
    date: '',
    description: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    const payload = {
      ...form,
      amount: Number(form.amount)
    };
    await api.post('/expenses', payload);
    setForm({ amount: '', category: '', date: '', description: '' });
    window.location.href = '/';
  };

  return (
    <AppShell>
      <GlassCard className="max-w-3xl mx-auto space-y-8">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-white/50">Create</p>
          <h1 className="text-4xl font-black">Add a New Expense</h1>
          <p className="text-white/60">Enter the details of your transaction below.</p>
        </div>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <label className="flex flex-col gap-2">
              <span className="text-sm font-semibold">Amount</span>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40">$</span>
                <input
                  type="number"
                  name="amount"
                  min="0"
                  step="0.01"
                  value={form.amount}
                  onChange={handleChange}
                  className="w-full rounded-xl border-white/10 bg-white/10 pl-10 p-3 text-white focus:border-primary focus:ring-primary"
                  placeholder="0.00"
                  required
                />
              </div>
            </label>
            <label className="flex flex-col gap-2">
              <span className="text-sm font-semibold">Category</span>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className="w-full rounded-xl border-white/10 bg-white/10 p-3 text-white focus:border-primary focus:ring-primary"
                required
              >
                <option value="">Select</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <label className="flex flex-col gap-2">
            <span className="text-sm font-semibold">Date</span>
            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              className="w-full rounded-xl border-white/10 bg-white/10 p-3 text-white focus:border-primary focus:ring-primary"
              required
            />
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-sm font-semibold">
              Description <span className="text-white/40">(optional)</span>
            </span>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={4}
              className="w-full rounded-xl border-white/10 bg-white/10 p-3 text-white focus:border-primary focus:ring-primary resize-none"
              placeholder="Lunch with a client"
            />
          </label>

          <button 
            onClick={handleSubmit}
            className="w-full h-12 rounded-xl bg-primary font-bold tracking-wide shadow-lg shadow-primary/40 hover:shadow-primary/60 hover:scale-[1.02] active:scale-[0.98] transition"
          >
            Save Expense
          </button>
        </div>
      </GlassCard>
    </AppShell>
  );
};

export default AddExpensePage;