const express = require('express');
const auth = require('../middleware/auth');
const { getDB, saveDB, createId } = require('../utils/db');

const router = express.Router();

router.get('/', auth, async (req, res) => {
  const db = getDB();
  const expenses = db.expenses
    .filter((expense) => expense.userId === req.user)
    .sort((a, b) => new Date(b.date) - new Date(a.date));
  res.json(expenses);
});

router.post('/', auth, async (req, res) => {
  const db = getDB();
  const expense = {
    id: createId(),
    userId: req.user,
    amount: Number(req.body.amount),
    category: req.body.category,
    date: req.body.date,
    description: req.body.description,
    createdAt: new Date().toISOString()
  };
  db.expenses.push(expense);
  saveDB(db);
  res.status(201).json(expense);
});

router.put('/:id', auth, async (req, res) => {
  const db = getDB();
  const index = db.expenses.findIndex(
    (expense) => expense.id === req.params.id && expense.userId === req.user
  );
  if (index === -1) {
    return res.status(404).json({ msg: 'Expense not found' });
  }
  db.expenses[index] = { ...db.expenses[index], ...req.body };
  saveDB(db);
  res.json(db.expenses[index]);
});

router.delete('/:id', auth, async (req, res) => {
  const db = getDB();
  const initialLength = db.expenses.length;
  db.expenses = db.expenses.filter(
    (expense) => !(expense.id === req.params.id && expense.userId === req.user)
  );
  if (db.expenses.length === initialLength) {
    return res.status(404).json({ msg: 'Expense not found' });
  }
  saveDB(db);
  res.sendStatus(204);
});

module.exports = router;

