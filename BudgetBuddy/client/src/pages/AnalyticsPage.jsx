import { useEffect, useMemo, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';
import { Line, Pie } from 'react-chartjs-2';
import AppShell from '../components/AppShell.jsx';
import GlassCard from '../components/GlassCard.jsx';
import api from '../lib/api.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Tooltip, Legend);

const AnalyticsPage = () => {
  const [expenses, setExpenses] = useState([]);
  const [summary, setSummary] = useState({ total: 0, byCategory: {}, count: 0 });
  const [period, setPeriod] = useState('month');

  useEffect(() => {
    const load = async () => {
      const [expenseRes, summaryRes] = await Promise.all([
        api.get('/expenses'),
        api.get('/budgets/summary')
      ]);
      setExpenses(expenseRes.data);
      setSummary(summaryRes.data);
    };
    load();
  }, []);

  const lineConfig = useMemo(() => {
    const now = new Date();
    const labels = [];
    const dataPoints = [];

    if (period === 'month') {
      for (let i = 5; i >= 0; i -= 1) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const monthExpenses = expenses.filter((exp) => {
          const expDate = new Date(exp.date);
          return expDate.getFullYear() === date.getFullYear() && expDate.getMonth() === date.getMonth();
        });
        labels.push(date.toLocaleString('default', { month: 'short' }));
        dataPoints.push(
          monthExpenses.reduce((sum, exp) => sum + exp.amount, 0)
        );
      }
    } else {
      for (let i = 6; i >= 0; i -= 1) {
        const date = new Date(now);
        date.setDate(now.getDate() - i);
        const dailyExpenses = expenses.filter((exp) => {
          const expDate = new Date(exp.date);
          return expDate.toDateString() === date.toDateString();
        });
        labels.push(date.toLocaleDateString());
        dataPoints.push(dailyExpenses.reduce((sum, exp) => sum + exp.amount, 0));
      }
    }

    return {
      labels,
      datasets: [
        {
          label: 'Spending',
          data: dataPoints,
          borderColor: '#d5392a',
          backgroundColor: 'rgba(213, 57, 42, 0.4)',
          tension: 0.4,
          fill: true
        }
      ]
    };
  }, [expenses, period]);

  const pieConfig = useMemo(() => {
    const categories = Object.keys(summary.byCategory || {});
    return {
      labels: categories,
      datasets: [
        {
          data: categories.map((key) => summary.byCategory[key]),
          backgroundColor: ['#d5392a', '#6e7791', '#3b4254', '#9da4b9', '#f4a261']
        }
      ]
    };
  }, [summary]);

  return (
    <AppShell>
      <div className="space-y-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-white/50">Insights</p>
            <h1 className="text-4xl font-black">Analytics</h1>
            <p className="text-white/60">Visualize spending trends and category distribution.</p>
          </div>
          <div className="glass flex gap-2 rounded-full p-1">
            {['week', 'month'].map((option) => (
              <button
                key={option}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition ${
                  period === option ? 'bg-primary text-white' : 'text-white/60'
                }`}
                onClick={() => setPeriod(option)}
              >
                {option === 'week' ? 'This Week' : 'This Month'}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <GlassCard>
            <p className="text-white/70 text-sm">Total expenses</p>
            <p className="text-3xl font-black">${summary.total?.toFixed(2) || '0.00'}</p>
            <p className="text-xs text-white/50">{summary.count} transactions</p>
          </GlassCard>
          <GlassCard>
            <p className="text-white/70 text-sm">Categories tracked</p>
            <p className="text-3xl font-black">{Object.keys(summary.byCategory || {}).length}</p>
            <p className="text-xs text-white/50">Active budgets</p>
          </GlassCard>
          <GlassCard>
            <p className="text-white/70 text-sm">Highest category</p>
            <p className="text-3xl font-black">
              {Object.entries(summary.byCategory || {})
                .sort((a, b) => b[1] - a[1])[0]?.[0] || '—'}
            </p>
            <p className="text-xs text-white/50">Based on total spend</p>
          </GlassCard>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <GlassCard className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Expense Trend</h2>
            </div>
            <Line data={lineConfig} options={{ plugins: { legend: { display: false } } }} />
          </GlassCard>
          <GlassCard>
            <h2 className="text-xl font-bold mb-4">By Category</h2>
            {Object.keys(summary.byCategory || {}).length ? (
              <Pie data={pieConfig} />
            ) : (
              <p className="text-white/60">Add expenses to see category breakdown.</p>
            )}
          </GlassCard>
        </div>
      </div>
    </AppShell>
  );
};

export default AnalyticsPage;

