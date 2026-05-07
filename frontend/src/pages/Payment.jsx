import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../styles/Payment.css"

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);
const API = import.meta.env.VITE_API_URL;

const CARD_STYLE = {
  style: {
    base: {
      fontSize: "16px",
      color: "#1a1a1a",
      fontFamily: "Segoe UI, sans-serif",
      "::placeholder": { color: "#aaa" },
    },
    invalid: { color: "#e63946" },
  },
};

function CheckoutForm({ cart, shippingAddress, user, token, getTotal }) {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleStripePayment = async () => {
    if (!stripe || !elements) return;
    setLoading(true);
    setError("");

    try {
      const intentRes = await fetch(`${API}/api/payment/create-payment-intent`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ amount: getTotal() }),
      });
      const { clientSecret } = await intentRes.json();

      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      });

      if (result.error) {
        setError(result.error.message);
        setLoading(false);
        return;
      }

      const orderData = {
        userId: user._id,
        items: cart.map((item) => ({
          productId: item._id,
          name: item.name,
          brand: item.brand,
          imageUrl: item.imageUrl,
          price: item.price,
          discountPrice: item.discountPrice,
          qty: item.qty,
        })),
        totalAmount: getTotal(),
        shippingAddress,
        paymentMethod: "Stripe",
      };

      const res = await fetch(`${API}/api/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(orderData),
      });

      const data = await res.json();
      if (!res.ok) return setError(data.message);

      localStorage.removeItem("cart");
      localStorage.removeItem("shippingAddress");
      window.dispatchEvent(new Event("cartUpdated"));
      navigate("/orders");
    } catch (err) {
      setError("Payment failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div style={{
        border: "1.5px solid #e0e0e0",
        borderRadius: "4px",
        padding: "16px",
        marginBottom: "16px",
        background: "#fafafa"
      }}>
        <CardElement options={CARD_STYLE} />
      </div>
      {error && <p style={{ color: "#e63946", fontSize: "13px", marginBottom: "12px" }}>{error}</p>}
      <button
        className="payment-place-btn"
        onClick={handleStripePayment}
        disabled={loading || !stripe}
      >
        {loading ? "Processing Payment..." : `Pay ₹${getTotal()}`}
      </button>
    </div>
  );
}

function Payment() {
  const navigate = useNavigate();
  const cart = JSON.parse(localStorage.getItem("cart") || "[]");
  const shippingAddress = JSON.parse(localStorage.getItem("shippingAddress") || "{}");
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const token = localStorage.getItem("token");

  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [loading, setLoading] = useState(false);

  const getTotal = () =>
    cart.reduce(
      (acc, item) => acc + (item.discountPrice || item.price) * item.qty, 0
    );

  const handleCODOrder = async () => {
    if (!user) return navigate("/");
    setLoading(true);
    try {
      const orderData = {
        userId: user._id,
        items: cart.map((item) => ({
          productId: item._id,
          name: item.name,
          brand: item.brand,
          imageUrl: item.imageUrl,
          price: item.price,
          discountPrice: item.discountPrice,
          qty: item.qty,
        })),
        totalAmount: getTotal(),
        shippingAddress,
        paymentMethod: "COD",
      };

      const res = await fetch(`${API}/api/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(orderData),
      });

      const data = await res.json();
      if (!res.ok) return alert(data.message);

      localStorage.removeItem("cart");
      localStorage.removeItem("shippingAddress");
      window.dispatchEvent(new Event("cartUpdated"));
      navigate("/orders");
    } catch (error) {
      alert("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="payment-page">
      <Navbar />
      <div className="payment-container">
        <div className="payment-box">
          <h2>Payment Method</h2>

          <div className="payment-address-box">
            <strong>Delivering to:</strong>
            {shippingAddress.name} | {shippingAddress.phone}
            <br />
            {shippingAddress.addressLine}, {shippingAddress.city} -{" "}
            {shippingAddress.pincode}
          </div>

          <div className="payment-options">
            <div
              className={`payment-option ${paymentMethod === "COD" ? "selected" : ""}`}
              onClick={() => setPaymentMethod("COD")}
            >
              <input type="radio" checked={paymentMethod === "COD"}
                onChange={() => setPaymentMethod("COD")} />
              <div>
                <div className="payment-option-label">Cash on Delivery</div>
                <div className="payment-option-desc">Pay when your order arrives</div>
              </div>
            </div>

            <div
              className={`payment-option ${paymentMethod === "Stripe" ? "selected" : ""}`}
              onClick={() => setPaymentMethod("Stripe")}
            >
              <input type="radio" checked={paymentMethod === "Stripe"}
                onChange={() => setPaymentMethod("Stripe")} />
              <div>
                <div className="payment-option-label">Pay Online (Card/UPI)</div>
                <div className="payment-option-desc">Secure payment via Stripe</div>
              </div>
            </div>
          </div>

          {paymentMethod === "COD" && (
            <button
              className="payment-place-btn"
              onClick={handleCODOrder}
              disabled={loading}
            >
              {loading ? "Placing Order..." : `Place Order • ₹${getTotal()}`}
            </button>
          )}

          {paymentMethod === "Stripe" && (
            <Elements stripe={stripePromise}>
              <CheckoutForm
                cart={cart}
                shippingAddress={shippingAddress}
                user={user}
                token={token}
                getTotal={getTotal}
              />
            </Elements>
          )}
        </div>

        <div className="order-summary-box">
          <h3>Order Summary</h3>
          {cart.map((item) => (
            <div className="order-summary-item" key={item._id}>
              <img src={item.imageUrl} alt={item.name} />
              <div className="order-summary-item-info">
                <div className="order-summary-item-name">{item.name}</div>
                <div className="order-summary-item-price">
                  &#8377;{item.discountPrice || item.price} × {item.qty}
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


export default Payment;