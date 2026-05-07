const mongoose = require("mongoose");//It imports Mongoose, which is used to connect and interact with MongoDB in a Node.js application.

const connectDB = async ()=>{
    try{
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB connected: ${conn.connection.host}`);
    }catch(error){
        console.error(`Error : ${error.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;//module.exports = connectDB;