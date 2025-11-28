require('dotenv').config();
const path = require('path');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const authRoutes = require('./src/routes/authRoutes');
const expenseRoutes = require('./src/routes/expenseRoutes');
const fixedExpenseRoutes = require('./src/routes/fixedExpenseRoutes');
const budgetRoutes = require('./src/routes/budgetRoutes');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(helmet());
app.use(cors({ origin: '*' }));
app.use(express.json());
app.use(morgan('dev'));

app.use('/api/auth', authRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/fixed-expenses', fixedExpenseRoutes);
app.use('/api/budgets', budgetRoutes);

const clientDist = path.join(__dirname, 'client/dist');
app.use(express.static(clientDist));
app.get(/^(?!\/api).*/, (_, res) => {
  res.sendFile(path.join(clientDist, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 BudgetBuddy API running at http://localhost:${PORT}`);
});