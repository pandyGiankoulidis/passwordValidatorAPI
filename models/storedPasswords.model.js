const mongoose = require("mongoose");
const StoredPassword = mongoose.model(
    "PopularPasswords",
    new mongoose.Schema({
        password: String,
        strength: Number
    })
);
module.exports = StoredPassword;