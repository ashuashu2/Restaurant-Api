require("dotenv").config()
const connectDB = require("./db.connection");
const restaurantModel = require("../models/retaurantModel");
const restaurantData= require("../jsonData/restaurantData.json")



const uploadDataToMongo = async()=>{
    try {
   connectDB(process.env.mongo_pass)
   await restaurantModel.create(restaurantData)
   console.log("saveData")
} catch (error) {
        console.log(error)
    }
} 
uploadDataToMongo()
