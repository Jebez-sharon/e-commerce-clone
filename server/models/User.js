const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name:{type:String, required:true},
    email:{type:String, required:true, unique:true},
    mobileNumber:{type:String, required:true},
    gender:{type:String, required:true},
    inviteCode:{type:String},
    role:{type:String,default:"user"},
},{timestamps:true})

module.exports = mongoose.model("User", userSchema)