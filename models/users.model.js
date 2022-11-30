const mongoose = require("mongoose");
const User = mongoose.model(
  "User",
  new mongoose.Schema({
    username: String,
    email: String,
    password: String,
    length: String,
    upperCase: Number,
    specialCharacters: Number,
    numbers: Number,
    whiteSpacesTabs: Boolean,
    incrementNumber: Number,
    critical:String
  })
);
module.exports = User;