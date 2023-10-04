require("dotenv").config()
const express = require("express");
const app = express();
const PORT =  process.env.PORT || 3000;
const connectDB = require("./db/db.connection");
const restaurentRouter = require("./routes/restaurant.route")


app.use(express.json())
connectDB(process.env.mongo_pass)



app.get("/",(req,res)=>{
    res.json("I M Restaurant API")
})






app.use("/restaurant",restaurentRouter)

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