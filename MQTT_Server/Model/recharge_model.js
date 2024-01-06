const mongoose = require("mongoose");

const rechargeHistorySchema = mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  amount: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("recharge", rechargeHistorySchema);