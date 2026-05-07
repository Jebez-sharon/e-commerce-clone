const cloudinary = require("cloudinary").v2;
const {CloudinaryStorage} = require("multer-storage-cloudinary");
const multer = require("multer");//Multer is middleware used in Express to handle file uploads from the client.

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
    cloudinary, 
    params: async(req, file) =>{
        return{
        folder:"ajio-clone/products",
        allowed_formats:["jpg", "jpeg", "png", "webp","avif"],
        }
    },
});

const upload = multer({storage});
module.exports = {cloudinary, upload};