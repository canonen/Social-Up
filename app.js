const express = require("express")
const app = express()
require("dotenv").config()
const mongoose = require("mongoose")

port = process.env.PORT
db = process.env.DB

try{
    mongoose.connect(db).then(
        console.log("Veritabanına bağlanıldı.")
    )
}catch (error){
    console.log(error)
}


app.listen((port||"5000"),()=>{
    console.log("Sunucu çalışıyor.")
    console.log(port)
})