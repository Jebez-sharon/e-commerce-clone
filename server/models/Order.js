const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    userId:{type:mongoose.Schema.Types.ObjectId,ref:"User"},//It stores a user’s ID in the order and links it to the User collection so related data can be fetched.
    items:[{
        productId:{type:String},
        name:{type:String},
        brand:{type:String},
        imageUrl:{type:String},
        price:{type:Number},
        discountPrice:{type:Number},
        qty:{type:Number}
    },],
    totalAmount:{type:Number,required:true},
    shippingAddress:{
        name:{type:String},
        phone:{type:String},
        addressLine:{type:String},
        city:{type:String},
        pincode:{type:String},
    },
    paymentMethod:{type:String, default:"COD"},
    status:{type:String, default:"pending"}, 
},{timestamps:true})

module.exports = mongoose.model("Order", orderSchema);