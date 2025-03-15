const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  firstName: { type: String },
  lastName: { type: String },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String },
  role: { type: String, default: "user" },
  dateOfBirth: { type: Date },
  gender: { type: String },
  job: { type: String },
  aboutMe: { type: String },
  country: { type: String },
  city: { type: String },
  profileImage: { type: String, default: 'avatar.png' },
  idType: { type: String },

  status: { 
    type: String, 
   

  }
}, { timestamps: true });  

module.exports = mongoose.model("User", userSchema);