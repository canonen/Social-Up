const express = require("express")
const app = express()
require("dotenv").config()
const mongoose = require("mongoose")

express.json()
express.urlencoded({extended:true})
app.set("view engine","ejs")
app.use(express.static('public'));


env = process.env

app.get("/login",(req,res)=>{
    res.render("login.ejs")
})


app.get("/",(req,res)=>{
    res.render("index.ejs")
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

