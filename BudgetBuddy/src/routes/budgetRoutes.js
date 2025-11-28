const express = require('express');
const auth = require('../middleware/auth');
const { getDB, saveDB, createId } = require('../utils/db');

const router = express.Router();

router.get('/', auth, async (req, res) => {
  const db = getDB();
  const budgets = db.budgets.filter((budget) => budget.userId === req.user);
  res.json(budgets);
});

router.post('/', auth, async (req, res) => {
  const db = getDB();
  const created = {
    id: createId(),
    userId: req.user,
    category: req.body.category,
    limit: Number(req.body.limit),
    period: req.body.period || 'monthly',
    createdAt: new Date().toISOString()
  };
  db.budgets.push(created);
  saveDB(db);
  res.status(201).json(created);
});

router.put('/:id', auth, async (req, res) => {
  const db = getDB();
  const index = db.budgets.findIndex(
    (budget) => budget.id === req.params.id && budget.userId === req.user
  );
  if (index === -1) {
    return res.status(404).json({ msg: 'Budget not found' });
  }
  db.budgets[index] = { ...db.budgets[index], ...req.body };
  saveDB(db);
  res.json(db.budgets[index]);
});

router.delete('/:id', auth, async (req, res) => {
  const db = getDB();
  const initialLength = db.budgets.length;
  db.budgets = db.budgets.filter(
    (budget) => !(budget.id === req.params.id && budget.userId === req.user)
  );
  if (db.budgets.length === initialLength) {
    return res.status(404).json({ msg: 'Budget not found' });
  }
  saveDB(db);
  res.sendStatus(204);
});

router.get('/summary', auth, async (req, res) => {
  const db = getDB();
  const expenses = db.expenses.filter((expense) => expense.userId === req.user);
  const total = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const byCategory = expenses.reduce((acc, exp) => {
    acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
    return acc;
  }, {});
  res.json({ total, byCategory, count: expenses.length });
});

module.exports = router;

