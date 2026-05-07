import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../styles/Cart.css";


function Cart(){
    const navigate = useNavigate();
    const [cart, setCart] = useState([]);

    useEffect(() =>{
        const saved = JSON.parse(localStorage.getItem("cart") || "[]");
        setCart(saved);
    },[]);

    const updateCart = (updated)=>{
        setCart(updated);
        localStorage.setItem("cart", JSON.stringify(updated));
        window.dispatchEvent(new Event("cartUpdated"));
    };

    const increaseQty = (id) =>{
        const updated = cart.map((item) =>item._id === id? {...item, qty:item.qty +1} : item)
        updateCart(updated);
};
const decreaseQty =(id) =>{
    const updated = cart.map((item) =>
        item._id === id? {...item, qty:item.qty - 1} : item
    ).filter((item) => item.qty > 0);
    updateCart(updated);
}

const removeItem =(id) =>{
    const updated = cart.filter((item) => item._id !== id);
    updateCart(updated);
};

const getTotal = ()=>
    cart.reduce((acc, item) => acc + (item.discountPrice || item.price) * item.qty, 0);

const getOriginalTotal = ()=>
    cart.reduce((acc, item) => acc + item.price * item.qty, 0);



const getSavings = ()=>
    getOriginalTotal() - getTotal();

const getTotalItems = ()=>
    cart.reduce((acc, item) => acc + item.qty,0);



return(
    <div className="cart-page">
        <Navbar />
        <div className="cart-container">
            {cart.length === 0 ? (
                <div className="cart-empty">
                    <h2>Your cart is empty!</h2>
                    <p>Add items to your cart to proceed.</p>
                    <button onClick={() => navigate("/products")}>
                        Continue Shopping
                    </button>
                </div>
            ):(
                <>
                <div>
                    <h2 className="cart-title">
                         My Cart ({getTotalItems()} items)

                    </h2>

                    <div className="cart-items">
                        {cart.map((item) => (
                            <div className="cart-item" key={item._id}>
                                <img src={item.imageUrl} alt={item.name}
                                className="cart-item-img"
                                onClick={() =>navigate(`/product/${item._id}`)}
                                style={{cursor:"pointer"}}/>

                                <div className="cart-item-info">
                                    <div className="cart-item-brand">{item.brand}</div>
                                    <div className="cart-item-name">{item.name}</div>
                                    <div className="cart-item-price">
                                        &#8377;{item.discountPrice || item.price}</div>
                                        <div className="cart-item-qty">
                                            <button className="qty-btn" onClick={() => decreaseQty(item._id)}>
                                                -

                                            </button>

                                            <span className="qty-value">{item.qty}</span>
                                            <button className="qty-btn" onClick={() => increaseQty(item._id)}>
                                                +
                                            </button>
                                        </div>
                                </div>

                                <button className="cart-item-remove" onClick={() => removeItem(item._id)}>
                                    Remove
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="cart-summary">
                    <h3>Price Details</h3>
                    <div className="cart-summary-row">
                        <span>Price({getTotalItems()} items )</span>
                        <span>&#8377;{getOriginalTotal()}</span>
                    </div>
                    {getSavings() >0 && (
                        <div className="cart-summary-row savings">
                            <span>Discount</span>
                            <span>&#8377;{getSavings()}</span>
                        </div>
                    )}

                    <div className="cart-summary-row">
                        <span>Delivery Charges</span>
                        <span style={{color:"#2d6a4f", fontWeight:"600"}}>
                            FREE
                        </span>
                    </div>

                    <div className="cart-summary-row total">
                        <span>Total Amount</span>
                        <span>&#8377;{getTotal()}</span>
                    </div>

                    {getSavings() > 0 && (
                        <p
                        style={{
                            color:"#2d6a4f",
                            fontSize:"13px",
                            fontWeight:"600",
                            marginTop:"12px",
                        }}>You will save &#8377;{getSavings()} on this order!</p>
                    )}

                    <button className="cart-checkout-btn" onClick={()=> navigate("/shipping")}>
                         Proceed to Checkout
                    </button>
                </div>
                </>
            )}
        </div>
        <Footer />
    </div>
)


}

export default Cart;