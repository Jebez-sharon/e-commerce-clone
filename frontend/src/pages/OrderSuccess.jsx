import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiCheckCircle } from "react-icons/fi";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function OrderSuccess() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/orders");
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f5f5f5" }}>
      <Navbar />
      <div style={{
        maxWidth: "600px",
        margin: "80px auto",
        background: "white",
        borderRadius: "8px",
        padding: "60px 40px",
        textAlign: "center",
        boxShadow: "0 4px 20px rgba(0,0,0,0.08)"
      }}>
        <FiCheckCircle size={64} color="#2d6a4f" style={{ marginBottom: "24px" }} />
        
        <h1 style={{ fontSize: "28px", fontWeight: "800", color: "#1a1a1a", marginBottom: "12px" }}>
          Order Placed Successfully!
        </h1>
        
        <p style={{ fontSize: "15px", color: "#666", marginBottom: "8px" }}>
          Thank you for shopping with AJIO Clone! 🎉
        </p>
        
        <p style={{ fontSize: "13px", color: "#999", marginBottom: "32px" }}>
          A confirmation email with your invoice has been sent to your email address.
        </p>

        <div style={{
          background: "#f0fdf4",
          border: "1px solid #bbf7d0",
          borderRadius: "8px",
          padding: "16px",
          marginBottom: "32px",
          fontSize: "13px",
          color: "#166534"
        }}>
          You will be redirected to your orders page in 5 seconds...
        </div>

        <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
          <button
            onClick={() => navigate("/orders")}
            style={{
              padding: "12px 28px",
              backgroundColor: "#1a1a1a",
              color: "white",
              border: "none",
              borderRadius: "2px",
              fontSize: "14px",
              fontWeight: "700",
              cursor: "pointer",
              letterSpacing: "1px"
            }}
          >
            VIEW ORDERS
          </button>
          <button
            onClick={() => navigate("/products")}
            style={{
              padding: "12px 28px",
              backgroundColor: "white",
              color: "#1a1a1a",
              border: "1.5px solid #1a1a1a",
              borderRadius: "2px",
              fontSize: "14px",
              fontWeight: "700",
              cursor: "pointer",
              letterSpacing: "1px"
            }}
          >
            CONTINUE SHOPPING
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default OrderSuccess;