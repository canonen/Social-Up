const express = require("express")
const app = express()
require("dotenv").config()
const mongoose = require("mongoose")
const user_controller = require("./controllers/user-controller")
const session = require("express-session")
const passport = require("./controllers/authentication")
const flash = require("express-flash")
const User = require("./models/user")
const post_controller = require("./controllers/post-controller")
const notification_controller = require("./controllers/notification_controller")


app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.set("view engine","ejs")
app.use(express.static('public'));
app.use(express.static("uploads"))

env = process.env

app.use(session({
    secret:env.SECRET,
    resave:false,
    saveUninitialized:false,
    cookie:{
        maxAge: 60000*60
    }
}))
app.use(flash())
app.use(passport.initialize())
app.use(passport.session())



app.use("/",(req,res,next)=>{
    if(!req.isAuthenticated()&&req.url!="/login"&&req.url!="/register"){
        return res.redirect("/login")
    }
    if(req.isAuthenticated()&&req.url=="/login"||req.isAuthenticated()&&req.url=="/register"){
        return res.redirect("/")
    }
    next()
})

app.use("/",user_controller)
app.use("/",post_controller)
app.use("/",notification_controller)


app.get("/",async (req,res)=>{
    try{
        const user = await User.findById(req.user._id)
        console.log(user)
        res.render("index.ejs",{user:user})
    }
    catch(error){
        console.log(error)
        res.status(500).send("Internal Server Error")
    }
})




//Connecting to Database
try{
    mongoose.connect(env.db).then(()=>{
        console.log("Connected to database succesfully.")
        app.listen(env.port||"5000",()=>{
            console.log("Server is running...")
        })
    })

}catch (error){
    console.log(error)
}

