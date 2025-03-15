const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  paymentId:
   { type: Number, required: true, unique: true },
  amount: 
  { type: Number, required: true },
  paymentDate: 
  { type: Date, default: Date.now },
  userId: 
  { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  method: 
  { type: String, required: true },
  stripeTransactionId: 
  { type: String },
  status:
  { type: String, required: true }

});

module.exports = mongoose.model("Payment", paymentSchema);