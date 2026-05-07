const express = require("express");
const router = express.Router();
const {getProducts, getProductById, createProduct, updateProduct, deleteProduct}= require("../controllers/productController");
const {upload} = require("../config/cloudinary");
const {protect, admin} = require("../middleware/authMiddleware");

router.get("/", getProducts);
router.get("/:id", getProductById);
router.post("/", protect, admin, upload.single("image"), createProduct);
router.put("/:id", protect, admin, upload.single("image"), updateProduct);
router.delete("/:id", protect, admin, deleteProduct);

module.exports = router;