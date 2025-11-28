import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const navLinks = [
  { label: 'Dashboard', path: '/' },
  { label: 'Add Expense', path: '/add-expense' },
  { label: 'Fixed Expenses', path: '/fixed-expenses' },
  { label: 'Budgets', path: '/budgets' },
  { label: 'Analytics', path: '/analytics' }
];

const AppShell = ({ children }) => {
  const location = useLocation();
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-transparent text-white relative overflow-hidden">
      <div className="blur-bg absolute inset-0" />
      <div className="relative flex flex-col min-h-screen px-4 sm:px-8 lg:px-16">
        <header className="flex flex-wrap items-center justify-between gap-4 border border-white/10 rounded-2xl glass px-6 py-4 mt-6">
          <div className="flex items-center gap-4">
            <div className="size-10 flex items-center justify-center rounded-full bg-primary/20 text-primary">
              ₿
            </div>
            <p className="text-2xl font-black tracking-tight">
              <span className="text-primary">Budget</span>
              <span className="text-secondary">Buddy</span>
            </p>
          </div>
          <nav className="flex-1 flex flex-wrap justify-end gap-4 text-sm font-semibold">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-3 py-2 rounded-lg transition ${
                  location.pathname === link.path
                    ? 'bg-primary text-white shadow-primary/40 shadow-lg'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </header>
        <main className="flex-1 w-full max-w-6xl mx-auto py-10">{children}</main>
        <footer className="py-6 text-center text-white/50 text-sm">
          {user?.username} · {user?.email}
        </footer>
      </div>
    </div>
  );
};

export default AppShell;

