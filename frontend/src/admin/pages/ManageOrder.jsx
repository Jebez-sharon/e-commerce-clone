import { useState, useEffect } from "react";
import "../../admin/styles/ManageOrder.css";
import "../../admin/styles/ManageProduct.css";

const API = import.meta.env.VITE_API_URL;

function ManageOrder() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);
  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const res = await fetch(`${API}/api/orders`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setOrders(data);
    } catch (error) {
      console.error("Error fetching orders :", error);
    } finally {
      setLoading(false);
    }
  };
  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem("adminToken");
      const res = await fetch(`${API}/api/orders/${orderId}/status`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      setOrders(orders.map((o) => (o._id === data._id ? data : o)));
    } catch (error) {
      console.error("Status update error: ", error);
    }
  };

  const handleDeleteOrder = async (id) => {
    if (!window.confirm("Delete this order?")) return;
    try {
      const token = localStorage.getItem("adminToken");
      await fetch(`${API}/api/orders/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(orders.filter((o) => o._id !== id));
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  if (loading) return <div className="manage-loading">Loading orders...</div>;

  return (
    <div className="manage-page">
      <h2>Manage Orders ({orders.length})</h2>

      {orders.length === 0 ? (
        <div className="manage-loading">No orders yet.</div>
      ) : (
        <div className="manage-table-wrapper">
          <table className="manage-table">
            <thead>
              <tr>
                <th>Order Id</th>
                <th>Customer</th>
                <th>Items</th>
                <th>Total</th>
                <th>Payment</th>
                <th>Status</th>
                <th>Date</th>
                <th>Update Status</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id}>
                  <td style={{ fontSize: "11px", color: "#666" }}>
                    #{order._id.slice(-8).toUpperCase()}
                  </td>
                  <td>
                    <div>{order.shippingAddress?.name}</div>
                    <div style={{ fontSize: "11px", color: "#666" }}>
                      {order.shippingAddress?.phone}
                    </div>
                  </td>
                  <td>
                    <div className="order-items-list">
                      {order.items.map((item, i) => (
                        <div key={i}>
                          {item.name} x {item.qty}
                        </div>
                      ))}
                    </div>
                  </td>
                  <td>&#8377;{order.totalAmount}</td>
                  <td>{order.paymentMethod}</td>
                  <td>
                    <span className={`status-badge status-${order.status}`}>
                      {order.status}
                    </span>
                  </td>
                  <td style={{ fontSize: "12px", color: "#666" }}>
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>

                  <td>
                    <select
                      className="status-select"
                      value={order.status}
                      onChange={(e) =>
                        handleStatusChange(order._id, e.target.value)
                      }
                    >
                      <option value="pending"> Pending </option>
                      <option value="processing"> Processing </option>
                      <option value="shipped"> Shipped </option>
                      <option value="delivered"> Delivered </option>
                    </select>
                  </td>

                  <td>
                    <button
                      className="table-btn table-btn-delete"
                      onClick={() => handleDeleteOrder(order._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default ManageOrder;
