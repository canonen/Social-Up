const router = require("express").Router()
const User = require("../models/user.js")
const Message = require("../models/custom_message.js")
const bcrypt = require("bcryptjs")
const passport = require("../controllers/authentication.js")
const multer = require("multer")
const Post = require("../models/post.js")
const path = require("path")
const mongoose = require("mongoose")
const Comment =require("../models/comment.js")
const { send } = require("process")

//Multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/'); 
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    },
  });
  
const upload = multer({ storage: storage });


router.post("/post-upload",upload.single('image'),(req,res)=>{

    const currentDate = new Date();

    const options = {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    second: 'numeric'
    };

    const formattedDate = currentDate.toLocaleString('tr-TR', options);


    if (req.file){
        const image = req.file.path
        const imagePath = path.normalize(image).replace("\\", '/').replace("uploads/","");
        const textValue = req.body.text
        const newPost = new Post({
            post_text: textValue,
            createdAt:formattedDate,
            createdBy:req.user._id,
            image:imagePath,
            comments:[],
            likedBy:[]
        }
        )
        newPost.save().then((savedpost)=>{
            res.redirect("/profile?userId=" + req.user._id.toString())
        }).catch((er)=>{alert("An Error Occured...")})
        console.log(image)
    }
    else{
        const textValue = req.body.text
        console.log(textValue)
        const newPost = new Post({
            post_text: textValue,
            createdAt:formattedDate,
            createdBy:req.user._id,
            image:null,
            comments:[],
            likedBy:[]
            
        }
        )
        newPost.save().then((savedpost)=>{
            

            res.redirect("/profile?userId=" + req.user._id.toString())

        }).catch((er)=>{alert("An Error Occured...")})
    }

})

router.post("/like",async(req,res)=>{

    await Post.findById(req.body.post_id).then(async (post)=>{
        if (!post){
            return
        }
        if (post.likedBy.includes(req.user._id)){
            return
        }


        post.likedBy.push(req.user._id)

        await post.save()
        res.sendStatus(200)
    })
    
})

router.delete("/like",async(req,res)=>{

    await Post.findById(req.body.post_id).then(async(post)=>{
        if(!post.likedBy.includes(req.user._id)){
            return
        }
        post.likedBy = post.likedBy.filter(likedUserId=>likedUserId.toString() != req.user._id.toString())

        await post.save()
        res.sendStatus(200)
    }).catch(er=>{
        console.log(er)
        return
    })
    
})

router.post("/post-comment",async(req,res)=>{
    const currentDate = new Date();

    const options = {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    second: 'numeric'
    };

    const formattedDate = currentDate.toLocaleString('tr-TR', options);

    var temp_comment = new Comment({
        createdBy: req.user._id,
        createdAt: formattedDate,
        text: req.body.comment,
        likedBy:[]
    })
    await temp_comment.save()
    await Post.findById(req.body.post_id).then((post)=>{
        if(!post){
            return
        }
        post.comments.push(temp_comment._id)
        post.save().then(res.status(200).send("OK"))
    })
    
})
router.post("/like-comment",async(req,res)=>{
    const comment = await Comment.findById(req.body.comment_id)
    comment.likedBy.push(req.user._id)
    await comment.save()
    res.sendStatus(200)
})
router.delete("/like-comment",async(req,res)=>{
    const comment = await Comment.findById(req.body.comment_id)
    comment.likedBy = comment.likedBy.filter(likedUserId=>likedUserId.toString() != req.user._id.toString())
    await comment.save()
    res.sendStatus(200)
})

router.delete("/delete-post",async(req,res)=>{
    const post = await Post.findById(req.body.postId)
    console.log(req.body.postId)
    console.log(post)
    try{
        await Comment.deleteMany({_id: {$in:post.comments}})
    }catch{
        
    }
    
    await Post.deleteOne({_id:req.body.postId})
    res.sendStatus(200)
})

router.delete("/delete-comment",async(req,res)=>{
    await Comment.deleteOne({_id:req.body.commentId})
    res.sendStatus(200)
})



module.exports = router