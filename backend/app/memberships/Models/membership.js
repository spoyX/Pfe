const mongoose = require("mongoose");

const membershipSchema = new mongoose.Schema({
  membershipId:
   { type: Number, required: true, unique: true },
  startDate: 
  { type: Date, required: true },
  endDate: 
  { type: Date, required: true },
  membershipStatus: 
  { type: String, required: true },
  notesId: 
  { type: String },
  userId: 
  { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }

});

module.exports = mongoose.model("Membership", membershipSchema);