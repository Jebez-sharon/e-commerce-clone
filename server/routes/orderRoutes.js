const express = require("express");
const router = express.Router();
const{createOrder, getAllOrders, getUserOrders, updateOrderStatus, deleteOrder} = require("../controllers/orderController");
const{protect, admin} = require("../middleware/authMiddleware");

router.post("/", protect, createOrder);
router.get("/", protect, admin, getAllOrders);
router.put("/:id/status", protect,admin, updateOrderStatus);
router.delete("/:id", protect, admin, deleteOrder);
router.get("/:userId", protect, getUserOrders);

module.exports =router;