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
const Friend = require("../models/friend.js")
const Notification = require("../models/notification.js")


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
            bg_image:null,
            friends:[]
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

router.post("/add-friend",async(req,res)=>{
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



    const tempFriendRequest = new Friend({
        sender: req.body.sender,
        receiver: req.body.receiver,
        status: "pending"
    })
    console.log(tempFriendRequest)
    try{
        await tempFriendRequest.save()
        const tempNotification = new Notification({
            receiver:req.body.receiver,
            sender:req.body.sender,
            content:"friendRequest",
            status:"unread",
            createdAt:formattedDate
        })
        await tempNotification.save()
    }catch(er){
        console.log(er)
        return
    }
    res.sendStatus(200)
})

router.post("/process-friend-request",async(req,res)=>{
    const op = req.body.op
    const target_id = req.body.target_id
    const user_id = req.user._id
    const notif_id = req.body.notif_id
    try {
        const friendRequest = await Friend.findOne({sender:target_id,receiver:user_id})
        friendRequest.status = op.toString()
        await friendRequest.save()
        const notification = await Notification.findById(notif_id)
        notification.status = "read"
        await notification.save()

        if (op.toString() === "accepted"){
            const target_user = await User.findById(target_id)
            const current_user = await User.findById(user_id)
            
            await target_user.friends.push(user_id)
            await current_user.friends.push(target_id)
            await target_user.save()
            await current_user.save()
            res.sendStatus(200)
            
        }
             
        
        
    }catch(er){
        console.log(er)
        return
    }

})


module.exports = router

