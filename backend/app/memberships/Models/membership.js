const mongoose = require("mongoose");

const membershipSchema = new mongoose.Schema({
  membershipId:
   { type: Number, required: true, unique: true },
  startDate: 
  { type: Date, required: true },
  endDate: 
  { type: Date, required: true },
  planType: { type: String, enum: ['monthly', '3months', '6months'], required: true },
  status: { type: String, enum: ['active', 'expired'], default: 'active' },
  notesId: 
  { type: String },
  userId: 
  { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }

});

module.exports = mongoose.model("Membership", membershipSchema);