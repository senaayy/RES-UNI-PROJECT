import { Navigate, Route, Routes } from 'react-router-dom';
import './App.css';
import DashboardPage from './pages/DashboardPage.jsx';
import AddExpensePage from './pages/AddExpensePage.jsx';
import FixedExpensesPage from './pages/FixedExpensesPage.jsx';
import BudgetsPage from './pages/BudgetsPage.jsx';
import AnalyticsPage from './pages/AnalyticsPage.jsx';

const App = () => (
  <Routes>
    <Route path="/" element={<DashboardPage />} />
    <Route path="/add-expense" element={<AddExpensePage />} />
    <Route path="/fixed-expenses" element={<FixedExpensesPage />} />
    <Route path="/budgets" element={<BudgetsPage />} />
    <Route path="/analytics" element={<AnalyticsPage />} />
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
);

export default App;
