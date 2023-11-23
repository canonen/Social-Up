const router = require("express").Router()
const User = require("../models/user.js")

//GET

//************************************* */
router.get("/login",(req,res)=>{
    res.render("login.ejs")
})

router.get("/register",(req,res)=>{
    res.render("register.ejs")
})
//************************************* */

//POST

//************************************* */

router.post("/login",(req,res)=>{
    
})

router.post("/register",async(req,res)=>{
    console.log(req.body)
    const new_user = new User( {
        name: req.body.name,
        surname: req.body.surname,
        email: req.body.email,
        password: req.body.password
    })

    await new_user.save()
})
//************************************* */


module.exports = router

