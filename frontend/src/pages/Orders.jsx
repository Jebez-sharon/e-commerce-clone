import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiDownload } from "react-icons/fi";
import jsPDF from "jspdf";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../styles/Orders.css";

const API = import.meta.env.VITE_API_URL;

function Orders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const token = localStorage.getItem("token");

  useEffect(() => {
    if(!user) {
        navigate("/");
        return;
    }
    fetchOrders();
  },[]);

   const fetchOrders = async () => {
    try {
      const res = await fetch(`${API}/api/orders/${user._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setOrders(data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const downloadInvoice = (order) =>{
    const doc = new jsPDF();
    const gst = Math.round(order.totalAmount * 0.18);
    const subtotal = order.totalAmount - gst;

    doc.setFontSize(20);
    doc.setFont("helvetica" , "bold")
    doc.text("AJIO CLONE", 20,20);

    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text("Tax Invoice / Bill of Supply", 20 , 30);
    doc.text(`Order ID: #${order._id.slice(-8).toUpperCase()}`,20,45);
    doc.text(`Date: ${new Date(order.createdAt).toLocaleDateString()}`, 20,55);
    doc.text(`Payment: ${order.paymentMethod}`, 20,65);

    doc.line(20, 70,190, 70);

    doc.setFont("helvetica", "bold");
    doc.text("Delivery Address :" , 20,80);
    doc.setFont("helvetica", "normal");
    doc.text(`${order.shippingAddress.name} | ${order.shippingAddress.phone}`, 20, 90);
    doc.text(`${order.shippingAddress.addressLine}`, 20, 100);
    doc.text(`${order.shippingAddress.city} - ${order.shippingAddress.pincode}`, 20, 110);

    doc.line(20, 115, 190, 115);

    doc.setFont("helvetica", "bold");
    doc.text("Product", 20, 125);
    doc.text("Qty", 130, 125);
    doc.text("Price", 160, 125);

    doc.line(20, 130, 190, 130);

    let y =140;
    doc.setFont("helvetica", "normal");
    order.items.forEach((item) => {
      doc.text(item.name.substring(0, 35), 20, y);
      doc.text(`${item.qty}`, 130, y);
      doc.text(`Rs.${item.discountPrice || item.price}`, 160, y);
      y += 12;
    });

     doc.line(20, y, 190, y);
    y += 10;

    doc.text(`Subtotal:`, 130, y);
    doc.text(`Rs.${subtotal}`, 160, y);
    y += 10;
    doc.text(`GST (18%):`, 130, y);
    doc.text(`Rs.${gst}`, 160, y);
    y += 10;
    doc.setFont("helvetica", "bold");
    doc.text(`Total:`, 130, y);
    doc.text(`Rs.${order.totalAmount}`, 160, y);

     doc.save(`Invoice_${order._id.slice(-8).toUpperCase()}.pdf`);
  };

  if (loading) return (
    <div className="orders-page">
      <Navbar />
      <div className="orders-loading">Loading orders...</div>
    </div>
  );

  return(
    <div className="orders-page">
        <Navbar />
        <div className="orders-container">
            <h2 className="orders-title">My Orders ({orders.length})</h2>

        {orders.length === 0 ? (
          <div className="orders-empty">
            <h2>No orders yet!</h2>
            <p>Start shopping to place your first order.</p>
            <button onClick={() => navigate("/products")}>
              Shop Now
            </button>
          </div>
        ):(
            orders.map((order) => (
            <div className="order-card" key={order._id}>
              <div className="order-card-header">
                <div>
                  <div className="order-card-id">
                    Order #{order._id.slice(-8).toUpperCase()}
                  </div>
                  <div className="order-card-date">
                    {new Date(order.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <span className={`status-badge status-${order.status}`}>
                    {order.status}
                  </span>
                  <button
                    className="order-download-btn"
                    onClick={() => downloadInvoice(order)}
                  >
                    <FiDownload size={14} />
                    Invoice
                  </button>
                </div>
              </div>

              <div className="order-card-body">
                {order.items.map((item, i) => (
                  <div className="order-item-row" key={i}>
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="order-item-img"
                    />
                    <div className="order-item-info">
                      <div className="order-item-name">{item.name}</div>
                      <div className="order-item-brand">{item.brand}</div>
                      <div className="order-item-qty">Qty: {item.qty}</div>
                    </div>
                    <div className="order-item-price">
                      &#8377;{item.discountPrice || item.price}
                    </div>
                  </div>
                ))}
              </div>

              <div className="order-card-footer">
                <div className="order-address">
                  <strong>Delivering to:</strong><br />
                  {order.shippingAddress?.name} | {order.shippingAddress?.phone}<br />
                  {order.shippingAddress?.addressLine}, {order.shippingAddress?.city}
                </div>
                <div className="order-total">
                  Total: &#8377;{order.totalAmount}
                </div>
              </div>
            </div>
          ))
        )}
        </div>
        <Footer />
    </div>
  )
}

export default Orders;
