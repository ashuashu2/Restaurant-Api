require("dotenv").config()
const express = require("express");
const app = express();
const PORT =  process.env.PORT || 3000;
const connectDB = require("./db/db.connection");
const restaurentRouter = require("./routes/restaurant.route");
const globalErrorHandlerMiddleware = require("./middlewares/global.errorHandler")
const routesNotFoundMiddleware = require("./middlewares/routes.notFound")



app.use(express.json())
connectDB(process.env.mongo_pass)



app.get("/",(req,res)=>{
    res.json("I M Restaurant API")
})






app.use("/restaurant",restaurentRouter)
app.use(routesNotFoundMiddleware)
app.use(globalErrorHandlerMiddleware)

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