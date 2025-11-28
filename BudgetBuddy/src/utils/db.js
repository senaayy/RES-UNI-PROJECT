const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, '..', '..', 'data.json');

const ensureStructure = (data) => ({
  users: data.users || [],
  expenses: data.expenses || [],
  fixedExpenses: data.fixedExpenses || [],
  budgets: data.budgets || []
});

const getDB = () => {
  if (!fs.existsSync(DATA_FILE)) {
    const initial = ensureStructure({});
    fs.writeFileSync(DATA_FILE, JSON.stringify(initial, null, 2));
    return initial;
  }
  const data = JSON.parse(fs.readFileSync(DATA_FILE));
  return ensureStructure(data);
};

const saveDB = (data) => {
  fs.writeFileSync(DATA_FILE, JSON.stringify(ensureStructure(data), null, 2));
};

const createId = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 8);

module.exports = { getDB, saveDB, createId };

