const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username:
   { type: String, required: true, unique: true },
  firstName: 
  { type: String, required: true },
  lastName: 
  { type: String, required: true },
  email: 
  { type: String, required: true, unique: true },
  password: 
  { type: String, required: true },
  phone: 
  { type: String },
  role: 
  { type: String, default: "user" },
  dateOfBirth: 
  { type: Date },
  gender: 
  { type: String },
  job: 
  { type: String },
  aboutMe: 
  { type: String },
  country: 
  { type: String },
  city: 
  { type: String },
  profileImage: 
  { type: String ,
    default: 'avatar.png' },
  idType: 
  { type: String },
  createdAt: 
  { type: Date, default: Date.now },
  updatedAt: 
  { type: Date, default: Date.now },
});

module.exports = mongoose.model("User", userSchema);
