const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  paymentId:
   { type: String, required: true, unique: true },
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
  { type: String, required: true },
  cardType:{type:String},
  cardLastFour:{type:Number}

});

module.exports = mongoose.model("Payment", paymentSchema);