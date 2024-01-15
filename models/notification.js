const mongoose = require("mongoose")
const User = require("./user")

const notification_schema = new mongoose.Schema({
    receiver:{type: mongoose.Schema.Types.ObjectId,ref:"User"},
    sender:{type: mongoose.Schema.Types.ObjectId,ref:"User"},
    content:{type:String, enum:["friendRequest","chatMessage"]},
    status:{type:String, enum:["read","unread"]},
    createdAt:{ type: String, default: new Date().toLocaleString('tr-TR')}
})

const Notification = mongoose.model("Notification",notification_schema)

module.exports = Notification