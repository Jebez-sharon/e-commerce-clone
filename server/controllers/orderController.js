const Order = require("../models/Order");
const {sendOrderConfirmationEmail, sendOrderStatusUpdateEmail} = require("../mailSend");
const User = require("../models/User");

const createOrder = async(req, res) =>{
    try{
        const {userId, items , totalAmount , shippingAddress , paymentMethod} = req.body;

        const order = await Order.create({
            userId , items , totalAmount , shippingAddress, paymentMethod,
        });

        const user = await User.findById(userId);
        if(user){
            await sendOrderConfirmationEmail(user.email, order);
        }

        res.status(201).json(order);
    }catch(error){
        res.status(500).json({message:"Failed to create order", error:error.message});
    }
};

const getAllOrders = async(req,res ) =>{
    try{
        const orders = await Order.find().sort({createdAt:-1});
        res.status(200).json(orders);
    }catch(error){
        res.status(500).json({message:"Failed to get orders", error:error.message});
    }
};

const getUserOrders = async(req, res) =>{
    try{
        const orders = await Order.find({userId : req.params.userId}).sort({createdAt:-1});
        res.status(200).json(orders);
    }catch(error){
        res.status(500).json({message:"Failed to get user Orders" , error:error.message})
    }
}

const updateOrderStatus = async(req, res) =>{
    try{
        const order = await Order.findById(req.params.id);
        if(!order) return res.status(404).json({message:"Order not found"});

        order.status = req.body.status;
        await order.save();

        //send status update email
        const user = await User.findById(order.userId);
        if(user){
            await sendOrderStatusUpdateEmail(user.email,order)
        }

        res.status(200).json(order);
    }catch(error){
        res.status(500).json({message:"Failed to update order status ", error:error.message})
    }
};

const deleteOrder = async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Order deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete order", error: error.message });
  }
};

module.exports ={createOrder, getAllOrders, getUserOrders, updateOrderStatus,deleteOrder}