const mongoose = require('mongoose');

// creting schema for user

const userSchema = new mongoose.Schema({
    email: String,
    password: String,
});

const User = mongoose.model("User",userSchema);

module.exports = User;