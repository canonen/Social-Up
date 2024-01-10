const mongoose = require("mongoose")

const comment_schema = mongoose.Schema({
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, 
    createdAt: { type: Date, default: Date.now }, 
    text:String,
    likedBy: [{ type: mongoose.Schema.Types.ObjectId, ref:"User" }], // Like sayısı

})

const Comment = mongoose.model("Comment",comment_schema) 
module.exports= Comment;