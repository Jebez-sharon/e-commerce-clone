const express = require("express");
const router = express.Router();
const {sendOtp, registerUser, adminLogin, getAllUsers, deleteUser, updateUser} = require("../controllers/authController");
const {protect, admin } = require("../middleware/authMiddleware");

router.post("/send-otp", sendOtp);
router.post("/register", registerUser);
router.post("/admin/login", adminLogin);
router.get("/users", protect , admin, getAllUsers);
router.delete("/users/:id", protect, admin , deleteUser);
router.put("/users/update", protect,updateUser);

module.exports = router;