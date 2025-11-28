const express = require('express');
const auth = require('../middleware/auth');
const { getDB, saveDB, createId } = require('../utils/db');

const router = express.Router();

router.get('/', auth, async (req, res) => {
  const db = getDB();
  const fixedExpenses = db.fixedExpenses
    .filter((item) => item.userId === req.user)
    .sort((a, b) => new Date(b.date) - new Date(a.date));
  res.json(fixedExpenses);
});

router.post('/', auth, async (req, res) => {
  const db = getDB();
  const created = {
    id: createId(),
    userId: req.user,
    amount: Number(req.body.amount),
    category: req.body.category,
    description: req.body.description,
    date: req.body.date,
    createdAt: new Date().toISOString()
  };
  db.fixedExpenses.push(created);
  saveDB(db);
  res.status(201).json(created);
});

router.put('/:id', auth, async (req, res) => {
  const db = getDB();
  const index = db.fixedExpenses.findIndex(
    (item) => item.id === req.params.id && item.userId === req.user
  );
  if (index === -1) {
    return res.status(404).json({ msg: 'Fixed expense not found' });
  }
  db.fixedExpenses[index] = { ...db.fixedExpenses[index], ...req.body };
  saveDB(db);
  res.json(db.fixedExpenses[index]);
});

router.delete('/:id', auth, async (req, res) => {
  const db = getDB();
  const initialLength = db.fixedExpenses.length;
  db.fixedExpenses = db.fixedExpenses.filter(
    (item) => !(item.id === req.params.id && item.userId === req.user)
  );
  if (db.fixedExpenses.length === initialLength) {
    return res.status(404).json({ msg: 'Fixed expense not found' });
  }
  saveDB(db);
  res.sendStatus(204);
});

module.exports = router;

