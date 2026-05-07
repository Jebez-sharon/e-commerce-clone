import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { FiChevronRight } from "react-icons/fi";
import "../styles/Profile.css";

const API = import.meta.env.VITE_API_URL;

function Profile() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const token = localStorage.getItem("token");

  const [editing, setEditing] = useState(false);
  const [success, setSuccess] = useState("");
  const [form, setForm] = useState({
    name: user?.name || "",
    mobileNumber: user?.mobileNumber || "",
    gender: user?.gender || "",
  });

  if (!user) {
    navigate("/");
    return null;
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      const res = await fetch(`${API}/api/auth/users/update`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) return alert(data.message);

      localStorage.setItem("user", JSON.stringify(data.user));
      window.dispatchEvent(new Event("userUpdated"));
      setSuccess("Profile updated successfully!");
      setEditing(false);
      setTimeout(() => setSuccess(""), 3000);
    } catch (error) {
      console.error("Update error:", error);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    window.dispatchEvent(new Event("userUpdated"));
    navigate("/");
  };

  return (
    <div className="profile-page">
      <Navbar />
      <div className="profile-container">
        <h2 className="profile-title">My Account</h2>
        <div className="profile-card">
          <h3>Personal Information</h3>

          {!editing ? (
            <>
              <div className="profile-row">
                <span className="profile-row-label">Name</span>
                <span className="profile-row-value">{user.name}</span>
              </div>
              <div className="profile-row">
                <span className="profile-row-label">Email</span>
                <span className="profile-row-value">{user.email}</span>
              </div>
              <div className="profile-row">
                <span className="profile-row-label">Mobile</span>
                <span className="profile-row-value">{user.mobileNumber}</span>
              </div>
              <div className="profile-row">
                <span className="profile-row-label">Gender</span>
                <span className="profile-row-value">{user.gender}</span>
              </div>
              <div className="profile-row">
                <span className="profile-row-label">Account Type</span>
                <span
                  className="profile-row-value"
                  style={{ textTransform: "capitalize" }}
                >
                  {user.role}
                </span>
              </div>
              {success && <p className="profile-success">{success}</p>}
              <div style={{ marginTop: "20px" }}>
                <button
                  className="profile-save-btn"
                  onClick={() => setEditing(true)}
                >
                  Edit Profile
                </button>
              </div>
            </>
          ) : (
            <div className="profile-edit-form">
              <div className="profile-input-group">
                <label>Name</label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                />
              </div>
              <div className="profile-input-group">
                <label>Mobile Number</label>
                <input
                  type="tel"
                  name="mobileNumber"
                  value={form.mobileNumber}
                  onChange={handleChange}
                  maxLength={10}
                />
              </div>
              <div className="profile-input-group">
                <label>Gender</label>
                <select
                  name="gender"
                  value={form.gender}
                  onChange={handleChange}
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>
              <div className="profile-btns">
                <button className="profile-save-btn" onClick={handleSave}>
                  Save Changes
                </button>
                <button
                  className="profile-cancel-btn"
                  onClick={() => setEditing(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
        <div className="profile-card">
          <h3>Quick Links</h3>
          <div
            className="profile-row"
            style={{ cursor: "pointer" }}
            onClick={() => navigate("/orders")}
          >
            <span className="profile-row-label">My Orders</span>
            <FiChevronRight size={16} color="#666" />
          </div>
          <div
            className="profile-row"
            style={{ cursor: "pointer" }}
            onClick={() => navigate("/wishlist")}
          >
            <span className="profile-row-label">My Wishlist</span>
            <FiChevronRight size={16} color="#666" />
          </div>
        </div>

        <div className="profile-card">
          <button className="profile-logout-btn" onClick={handleLogout}>
            Sign Out
          </button>
        </div>

      </div>
      <Footer />
    </div>
  );
}

export default Profile;
