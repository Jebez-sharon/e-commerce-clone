const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);

const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const app = express();

app.use(cors());//used for ports to work in diff browsers
app.use(express.json());//converts to json to js object

//Routes
const authRoutes = require("./routes/authRoutes");
const productRoutes= require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");
const paymentRoutes = require("./routes/paymentRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payment", paymentRoutes);



app.get("/", (req, res)=>{
    res.send("AJIO Clone Api is running...");//it sends a GET request to the server, and the server responds with data.
});


const PORT = process.env.PORT || 5000;



app.listen(PORT,()=>{
    console.log(`Server runnig on port ${PORT}`);
})

app.use((err, req, res, next)=>{
    console.error("Global error", err);
    res.status(500).json({message:err.message||"Internal server error"});

});