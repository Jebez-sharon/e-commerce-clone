const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const createPaymentIntent = async(req, res) =>{
    try{
        const {amount} = req.body;

        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(amount * 100),
            currency:"inr",
        });
        res.status(200).json({clientSecret:paymentIntent.client_secret});
    }catch(error){
        res.status(500).json({message:"Payment failed ", error: error.message});
    }
};
module.exports = {createPaymentIntent}