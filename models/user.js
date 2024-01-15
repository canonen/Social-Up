const mongoose = require("mongoose")

const user_schema = mongoose.Schema({
    name: String,
    surname: String,
    email: String,
    password: String,
    image:String,
    bg_image:String,
    friends:[{type:mongoose.Schema.Types.ObjectId,ref:"User"}]
})

const User = mongoose.model("User",user_schema)

module.exports = User