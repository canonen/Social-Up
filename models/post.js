const mongoose = require('mongoose');
const User = require("../models/user.js")
const Comment = require("../models/comment.js")

const postSchema = new mongoose.Schema({
  post_text: String,
  createdAt: { type: String, default: new Date().toLocaleString('tr-TR')}, 
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, 
  image:String,
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }], 
  likedBy: [{ type: mongoose.Schema.Types.ObjectId, ref:"User" }], // Like sayısı
});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;