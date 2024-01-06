const mongoose = require("mongoose");

const expenseHistorySchema = mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  callStartTime: {
    type: String,
    required: true,
  },
  callEndTime: {
    type: String,
    required: true,
  },
  reductedAmount: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("expense", expenseHistorySchema);
