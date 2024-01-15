const router = require("express").Router()
const User = require("../models/user.js")
const Post = require("../models/post.js")
const Comment =require("../models/comment.js")
const Friend = require("../models/friend.js")
const Notification = require("../models/notification.js")

router.get("/get-notifications",async(req,res)=>{
    const notifications = await Notification.find({receiver:req.user._id,status:"unread"}).populate({path:"sender",model:"User"}).populate({path:"receiver",model:"User"})
    if (notifications){
        res.json(notifications)
    }
})

module.exports = router