const router = require("express").Router()
const User = require("../models/user.js")
const Message = require("../models/custom_message.js")
const bcrypt = require("bcryptjs")
const passport = require("../controllers/authentication.js")
const multer = require("multer")
const Post = require("../models/post.js")
const path = require("path")
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



//GET

//************************************* */
router.get("/login",(req,res)=>{
    const message= req.flash("error")
    res.render("login.ejs",{messages:message})
})

router.get("/register",(req,res)=>{
    res.render("register.ejs",{messages:null,body:null})
})
//************************************* */

//POST

//************************************* */

router.post("/login",passport.authenticate("local",{
    successRedirect : "/",
    failureRedirect : "/login",
    failureFlash:true,
    session:true
}))

router.post("/register",async(req,res)=>{
    
    var messages = []
    var body = req.body

    

    if(body.password_again != body.password){
        messages.push(new Message("601","Passwords doesnt match...","error"))  
    }
    if(body.password.length < 5 || body.password.length >15){
        messages.push(new Message("602","Password length has to be between 5 and 15","error"))
    }
    

    if(await User.findOne({email:body.email})){
        messages.push(new Message("603","This user already exists...","error"))
    }

    if(messages.length == 0){
        var hashed_password = await bcrypt.hash(body.password,10)

        const new_user = new User( {
            name: body.name,
            surname: body.surname,
            email: body.email,
            password: hashed_password,
            image:null,
            bg_image:null
        })

        try{
            await new_user.save()
        }catch (er) {console.log(er)}

        messages.push(new Message("801","You have registered succesfully.You can login now.","success"))
        return res.render("register.ejs",{messages,body})
    }
    else{
        return res.render("register.ejs",{messages,body})
    }
})
router.get("/logout",(req,res)=>{
    req.logOut(()=>{
        res.redirect("/")
    })
    
})
//************************************* */

router.get("/profile",async(req,res)=>{
    targetUserId=req.query.userId
    if (targetUserId== null){
        res.redirect("/")
    }
    targetUser= await User.findById(targetUserId)
    const posts = await Post.find({ createdBy: targetUserId })
  .populate({ path: 'createdBy', model: 'User' })
  .populate({ path: 'comments',model:"Comment", options: { sort: { createdAt: -1 } }, populate: { path: 'createdBy', model: 'User' } })
  .sort({ createdAt: -1 });
    res.render("profile.ejs",{user:req.user,posts:posts,targetUser})
})

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
            comments:null,
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
router.post("/avatar-upload",upload.single('image'),async(req,res)=>{
    console.log("1")
    if(req.file){
        console.log("2")

        await User.findById(req.user._id).then(async(user)=>{
            const image = req.file.path
            const imagePath = path.normalize(image).replace("\\", '/').replace("uploads/","");
            user.image= imagePath
            await user.save()
            res.redirect("/profile?userId=" + req.user._id.toString())

        }).catch((er)=>{
            console.log(er)
            res.redirect("/profile?userId=" + req.user._id.toString())

        })
    }
})
router.post("/background-upload",upload.single('image'),async(req,res)=>{
    console.log("1")
    if(req.file){
        console.log("2")

        await User.findById(req.user._id).then(async(user)=>{
            const image = req.file.path
            const imagePath = path.normalize(image).replace("\\", '/').replace("uploads/","");
            user.bg_image= imagePath
            await user.save()
            res.redirect("/profile?userId=" + req.user._id.toString())

        }).catch((er)=>{
            console.log(er)
            res.redirect("/profile?userId=" + req.user._id.toString())

        })
    }
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

router.get("/search", async (req, res) => {
    const searchTerm = req.query.q;

    // Boşluklara göre terimi ayır
    const terms = searchTerm.split(" ");

    // Her bir terim için ayrı regex oluştur
    const regexTerms = terms.map(term => new RegExp(`^${term}`, 'i'));

    // $and operatörü ile tüm regex'lerin eşleştiği kullanıcıları bul
    const users = await User.find({
        $and: regexTerms.map(regex => ({
            $or: [
                { name: { $regex: regex } },
                { surname: { $regex: regex } }
            ]
        }))
    });

    console.log(users);
    res.json(users);
});


module.exports = router

