import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../styles/Shipping.css";

function Shipping(){
    const navigate = useNavigate();
    const cart = JSON.parse(localStorage.getItem("cart")|| "[]");
    const [error, setError] = useState("");

    const[form, setForm] = useState({
        name:"",
        phone:"",
        addressLine:"",
        city:"",
        pincode:"",
    });

    const handleChange =(e) =>{
        setForm({...form, [e.target.name] : e.target.value});
    };

    const handleContinue =()=>{
        const {name, phone , addressLine , city, pincode} = form;
        if(!name || !phone || !addressLine || !city || !pincode){
            return setError("Please fill all fields");
        }

        if(phone.length !== 10){
            return setError("Please enter a valid 10-digit phone number");
        }

        if(pincode.length !== 6){
            return setError("Please enter a valid 6-digit pincode");
        }

        localStorage.setItem("shippingAddress" , JSON.stringify(form));
        navigate("/payment");
    };

    const getTotal = () =>
        cart.reduce(
            (acc, item) => acc + (item.discountPrice || item.price ) * item.qty,0
        );

        return (
            <div className="shipping-page">
                <Navbar />
                <div className="shipping-container">
                    <div className="shipping-form-box">
                        <h2>Delivery Address</h2>

                        <div className="shipping-form-row">
                            <div className="shipping-input-group">
                                <label>Full Name</label>
                                <input type="text"
                                name="name"
                                placeholder="Enter your full name"
                                value={form.name}
                                onChange={handleChange} />
                            </div>

                            <div className="shipping-input-group">
                                <label htmlFor="">Phone Number *</label>
                                <input type="tel" 
                                name="phone" 
                                placeholder="Enter 10- digit phone number"
                                value={form.phone}
                                onChange={handleChange}
                                maxLength={10}/>
                            </div>
                        </div>

                        <div className="shipping-input-group">
                            <label htmlFor="">Address Line *</label>
                            <input type="text"
                            name="addressLine"
                            placeholder="House no, Street , Area"
                            value={form.addressLine}
                            onChange={handleChange} />
                        </div>

                        <div className="shipping-form-row">
                            <div className="shipping-input-group">
                                <label htmlFor="">City *</label>
                                <input type="text"
                                name="city"
                                placeholder="Enter your city"
                                value={form.city}
                                onChange={handleChange} />
                            </div>
                            <div className="shipping-input-group">
                                <label htmlFor="">Pincode *</label>
                                <input type="text"
                                name="pincode"
                                placeholder="Enter 6-digit pincode"
                                value={form.pincode}
                                onChange={handleChange} 
                                maxLength={6}/>
                            </div>

                        </div>

                        {error && <p className="shipping-error">{error}</p>}

                        <button className="shipping-continue-btn" onClick={handleContinue}>
                            Continue to Payment
                        </button>
                    </div>

                    <div className="order-summary-box">
                        <h3>Order Summary</h3>
                        {cart.map((item) =>(
                            <div className="order-summary-item" key={item._id}>
                                <img src={item.imageUrl} alt={item.name} />
                                <div className="order-summary-item-info">
                                    <div className="order-summary-item-name">{item.name}</div>
                                    <div className="order-summary-item-price">
                                        &#8377;{item.discountPrice || item.price} x {item.qty}
                                    </div>
                                </div>
                            </div>
                        ))}

                        <div className="order-summary-total">
                            <span>Total</span>
                            <span>&#8377;{getTotal()}</span>
                        </div>
                    </div>
                </div>

                <Footer />
            </div>
        );
}

export default Shipping;