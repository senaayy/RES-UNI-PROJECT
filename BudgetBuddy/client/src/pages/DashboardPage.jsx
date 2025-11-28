import { useEffect, useMemo, useState } from 'react';
import AppShell from '../components/AppShell.jsx';
import GlassCard from '../components/GlassCard.jsx';
import api from '../lib/api.js';

const filterOptions = [
  { label: 'Today', value: 'day' },
  { label: 'Week', value: 'week' },
  { label: 'Month', value: 'month' },
  { label: 'Year', value: 'year' }
];

const DashboardPage = () => {
  const [filter, setFilter] = useState('month');
  const [expenses, setExpenses] = useState([]);
  const [summary, setSummary] = useState({ total: 0, byCategory: {}, count: 0 });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setIsLoading(true);
        const [expensesRes, summaryRes] = await Promise.all([
          api.get('/expenses'),
          api.get('/budgets/summary')
        ]);
        setExpenses(expensesRes.data);
        setSummary(summaryRes.data);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  const filteredExpenses = useMemo(() => {
    const now = new Date();
    return expenses.filter((expense) => {
      const expenseDate = new Date(expense.date);
      switch (filter) {
        case 'day':
          return expenseDate.toDateString() === now.toDateString();
        case 'week': {
          const diff = (now - expenseDate) / (1000 * 60 * 60 * 24);
          return diff <= 7;
        }
        case 'year':
          return expenseDate.getFullYear() === now.getFullYear();
        default:
          return (
            expenseDate.getFullYear() === now.getFullYear() &&
            expenseDate.getMonth() === now.getMonth()
          );
      }
    });
  }, [expenses, filter]);

  const totalSpent = filteredExpenses.reduce((sum, exp) => sum + exp.amount, 0);

  return (
    <AppShell>
      <div className="space-y-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-white/50">Overview</p>
            <h1 className="text-4xl font-black">Dashboard</h1>
          </div>
          <div className="glass flex gap-2 rounded-full p-1">
            {filterOptions.map((option) => (
              <button
                key={option.value}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition ${
                  filter === option.value ? 'bg-primary text-white' : 'text-white/60'
                }`}
                onClick={() => setFilter(option.value)}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <GlassCard>
            <p className="text-white/70 text-sm">Total spent</p>
            <p className="text-3xl font-black">${totalSpent.toFixed(2)}</p>
            <p className="text-xs text-white/50">Filtered view</p>
          </GlassCard>
          <GlassCard>
            <p className="text-white/70 text-sm">Expenses logged</p>
            <p className="text-3xl font-black">{filteredExpenses.length}</p>
            <p className="text-xs text-white/50">Current filter</p>
          </GlassCard>
          <GlassCard>
            <p className="text-white/70 text-sm">All-time total</p>
            <p className="text-3xl font-black">${summary.total?.toFixed(2) || '0.00'}</p>
            <p className="text-xs text-white/50">Across all categories</p>
          </GlassCard>
        </div>

        <GlassCard className="p-0">
          <div className="flex items-center justify-between border-b border-white/5 px-6 py-4">
            <p className="text-lg font-semibold">Recent Expenses</p>
            <span className="text-sm text-white/60">{filteredExpenses.length} items</span>
          </div>
          <div className="divide-y divide-white/5">
            {isLoading && <p className="p-6 text-white/60">Loading...</p>}
            {!isLoading && filteredExpenses.length === 0 && (
              <p className="p-6 text-white/60">No expenses for this period yet.</p>
            )}
            {filteredExpenses.map((expense) => (
              <div
                key={expense.id}
                className="flex flex-wrap items-center justify-between gap-4 px-6 py-4 hover:bg-white/5 transition"
              >
                <div>
                  <p className="font-semibold">{expense.category}</p>
                  <p className="text-xs text-white/60">
                    {new Date(expense.date).toLocaleDateString()} • {expense.description || 'No description'}
                  </p>
                </div>
                <p className="text-2xl font-bold text-primary">${expense.amount.toFixed(2)}</p>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </AppShell>
  );
};

export default DashboardPage;