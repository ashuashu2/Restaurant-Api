require("dotenv").config()
const express = require("express");
const app = express();
const PORT =  process.env.PORT || 3000;
const connectDB = require("./db/db.connection");


app.use(express.json())
connectDB(process.env.mongo_pass)


app.get("/",(req,res)=>{
    res.json("i m at restaurant api")
})





const start = async()=>{
    try {
        app.listen(PORT,()=>{
        console.log("i m connected" + PORT)
    })
} catch (error) {
        console.log(error)
    }
}
start()