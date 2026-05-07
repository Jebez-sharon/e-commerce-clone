const {cloudinary}= require("../config/cloudinary");
const Product = require("../models/Product");

const getPublicId = (imageUrl) =>{
    const parts = imageUrl.split("/");
    const folder = parts[parts.length - 2];
    const filename = parts[parts.length -1 ].split(".")[0];
    return `${folder}/${filename}`;
};

const getProducts = async (req, res) =>{
    try{
        const {search, category} = req.query;
        let query = {};

        if(search) {
            query .$or = [
                {name: {$regex: search, $options:"i"}},
                {brand:{$regex:search, $options:"i"}},
                {category:{$regex:search, $options:"i"}},
            ];
        }

        if(category){
            query.category = {$regex:`^${category}$`, $options:"i"};
        }

        const products = await Product.find(query).sort({createdAt:-1});
        res.status(200).json(products);
    }catch(error){
        res.status(500).json({message:"Failed to get products ", error:error.message});
    }
};

const getProductById = async(req, res) =>{
    try{
        const product = await Product.findById(req.params.id);
        if(!product) return res.status(404).json({message:"Product not found"});
        res.status(200).json(product);
    }catch(error){
        res.status(500).json({message:"Failed to get product ", error:error.message});
    }
};

const createProduct = async(req, res)=>{
    try{
        const {name, brand, price, discountPrice, category, description} = req.body;
        const imageUrl = req.file?.path;
        if(!imageUrl) return res.status(400).json({message:"Image is required"});

        const product = await Product.create({
            name, brand, price, discountPrice, category, description, imageUrl,
        });
        res.status(201).json(product);
    }catch(error){
        res.status(500).json({message:"Failed to create product ", error:error.message})
    }
};

const updateProduct = async(req, res)=>{
    try{
        const product = await Product.findById(req.params.id);
        if(!product) return res.status(404).json({message:"Product no found"});

        const {name, brand , price, discountPrice, category, description} =req.body;

        if(req.file){
            await cloudinary.uploader.destroy(getPublicId(product.imageUrl));
            product.imageUrl = req.file.path;
        }

        product.name = name || product.name;
        product.brand = brand || product.brand;
        product.price = price || product.price;
        product.discountPrice = discountPrice || product.discountPrice;
        product.category = category || product.category;
        product.description = description || product.description;

        await product.save();
        res.status(200).json(product);
    }catch(error){
        res.status(500).json({message:"Failed to update product ", error:error.message});
    }
};

const deleteProduct = async(req, res) =>{
    try{
        const product = await Product.findById(req.params.id);
        if(!product) return res.status(404).json({message:"Product not found"});

        await cloudinary.uploader.destroy(getPublicId(product.imageUrl));
        await Product.findByIdAndDelete(req.params.id);

        res.status(200).json({message:"Product deleted successfully"});
    }catch(error){
        res.status(500).json({message:"Failed to delete product", error:error.message})
    }
};

module.exports = {getProducts, getProductById, createProduct, updateProduct, deleteProduct};