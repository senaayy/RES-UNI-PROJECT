const mongoose = require('mongoose');

const fixedExpenseSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    amount: { type: Number, required: true },
    category: { type: String, required: true },
    description: { type: String },
    date: { type: Date, required: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model('FixedExpense', fixedExpenseSchema);

