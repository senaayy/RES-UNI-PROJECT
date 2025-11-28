const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    amount: { type: Number, required: true },
    category: {
      type: String,
      enum: ['Food', 'Travel', 'Bills', 'Shopping', 'Other'],
      required: true
    },
    date: { type: Date, required: true },
    description: { type: String, trim: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Expense', expenseSchema);

