const mongoose = require("mongoose")

const user_schema = mongoose.Schema({
    name: String,
    surname: String,
    email: String,
    password: String
})

const User = mongoose.model("user",user_schema)

module.exports = User