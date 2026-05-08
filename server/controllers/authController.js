const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Otp = require("../models/Otp");
const {sendOtpEmail} = require("../mailSend");

const generateToken = (id, role) =>{
    return jwt.sign({id, role}, process.env.JWT_SECRET, {expiresIn:"30d"});
}

const sendOtp = async(req, res)=>{
    try{
        const{email} = req.body;
        if(!email) return res.status(400).json({message:"Email is required"});

        const existingUser = await User.findOne({email});

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        console.log(`OTP for ${email}: ${otp}`);
        await Otp.deleteMany({email});
        await Otp.create({email, otp});
        await sendOtpEmail(email, otp);

        res.status(200).json({message:"OTP sent successfully",
            isNewUser:!existingUser
        });

    }catch(error){
        res.status(500).json({message:"Failed to send OTP", error:error.message});
    }
};

const registerUser = async(req, res) =>{
    try{
        const {email, otp, name, mobileNumber, gender} = req.body;

        const validOtp= await Otp.findOne({email, otp});
        if(!validOtp) return res.status(400).json({message:"Invalid or expired OTP"});

        let user = await User.findOne({email});
        if(!user){
            user = await User.create({email, name, mobileNumber, gender});
        }

        await Otp.deleteMany({email});
        const token = generateToken(user._id, user.role);

        res.status(200).json({
            token, user:{
                _id: user._id,
                name:user.name,
                email:user.email,
                mobileNumber:user.mobileNumber,
                gender:user.gender,
                role:user.role,
            },
        });
    }catch(error){
        res.status(500).json({message:"Registration failed", error:error.message});
    }
};

const adminLogin = async(req, res) =>{
    try{
        const{username, password} = req.body;
        if(username=== "admin" && password === "1234"){
            const token = generateToken("admin","admin");
            res.status(200).json({token, role:"admin"});
        }else{
            res.status(401).json({message:"Invalid admin credentials"});
        }
    }catch(error){
        res.status(500).json({message:"Admin login failed", error:error.message});
    }
};

const getAllUsers = async(req, res) =>{
    try{
        const users = await User.find().sort({createdAt:-1});
        res.status(200).json(users);
    }catch(error){
        res.status(500).json({message:"Failed to get users", error:error.message});
    }
};

const deleteUser = async(req, res) =>{
    try{
        await User.findByIdAndDelete(req.params.id);
        res.status(200).json({message:"User deleted successfully"});
    }catch(error){
        res.status(500).json({message:"Failed to delete User ", error:error.message});
    }
};


const updateUser = async(req, res)=>{
    try{
        const {name, mobileNumber, gender} = req.body;
        const user = await User.findById(req.user.id);
        if(!user) return res.status(404).json({message:"User not found"});

        user.name = name || user.name;
        user.mobileNumber = mobileNumber|| user.mobileNumber;
        user.gender = gender||user.gender;

        await user.save();

        res.status(200).json({
            message:"Profile updated successfully",
            user:{
                _id:user._id,
                name:user.name,
                email:user.email,
                mobileNumber:user.mobileNumber,
                gender:user.gender,
                role:user.role,
            },
        });
    }catch(error){
        res.status(500).json({message:"Failed to update user.", error:error.message});
    }
}


module.exports = {sendOtp, registerUser, adminLogin, getAllUsers, deleteUser,updateUser};