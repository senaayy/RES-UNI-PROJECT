import { useState } from 'react';
import api from '../lib/api.js';

const AuthPage = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    setError('');
    setLoading(true);
    try {
      const { data } = await api.post('/auth/login', formData);
      localStorage.setItem('auth-token', data.token);
      localStorage.setItem('auth-user', JSON.stringify(data.user));
      setFormData({ email: '', password: '' });
      window.location.href = '/';
    } catch (err) {
      setError(err.response?.data?.msg || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
      <div className="blur-bg absolute inset-0" />
      <div className="glass max-w-md w-full rounded-3xl p-10 space-y-8 relative">
        <div className="text-center space-y-2">
          <p className="text-4xl font-black tracking-tight">
            <span className="text-primary">Budget</span>
            <span className="text-secondary">Buddy</span>
          </p>
          <p className="text-white/70">Log in to manage your finances.</p>
          <p className="text-xs text-white/50">
            Registration is temporarily disabled. Use the demo account:
            <br />
            <span className="font-semibold text-white/80">demo@example.com / DemoPass123!</span>
          </p>
        </div>

        <div className="space-y-5">
          <label className="block text-sm font-semibold text-white/80">
            Email address
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 p-3 focus:border-primary focus:ring-2 focus:ring-primary/40 text-white"
              placeholder="you@email.com"
            />
          </label>
          <label className="block text-sm font-semibold text-white/80">
            Password
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 p-3 focus:border-primary focus:ring-2 focus:ring-primary/40 text-white"
              placeholder="••••••••"
            />
          </label>
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <button 
            onClick={handleSubmit}
            disabled={loading}
            className="w-full h-12 rounded-xl bg-gradient-to-br from-primary to-red-500 font-bold shadow-lg shadow-primary/40 hover:scale-[1.02] active:scale-[0.98] transition disabled:opacity-50"
          >
            {loading ? 'Logging in...' : 'Log In'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;