const mongoose = require("mongoose")

const comment_schema = mongoose.Schema({
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, 
    createdAt: { type: Date, default: Date.now }, 
    text:String

})