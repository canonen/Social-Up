const mongoose = require("mongoose")
const User = require("../models/user")

const friendSchema = new mongoose.Schema({
    sender:{type:mongoose.Schema.Types.ObjectId,ref:"User"},
    receiver:{type:mongoose.Schema.Types.ObjectId,ref:"User"},
    status:{type:String, enum:["pending","accepted","rejected"]}

})

const Friend = mongoose.model("Friend",friendSchema)

module.exports = Friend