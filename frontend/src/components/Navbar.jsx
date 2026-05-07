import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  FiSearch,
  FiHeart,
  FiShoppingBag,
  FiUser,
  FiChevronDown,
} from "react-icons/fi";
import "../styles/Navbar.css";
import AuthModal from "./AuthModal";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [showAuth, setShowAuth] = useState(false);
  const [user, setUser] = useState(null);
  const [cartCount, setCartCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const updateNavbar = ()=>{
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
    else setUser(null);

    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    setCartCount(cart.reduce((acc, item) => acc + item.qty, 0));
  };
  updateNavbar();

  window.addEventListener("userUpdated", updateNavbar);
  window.addEventListener("cartUpdated", updateNavbar);

  return ()=>{
    window.removeEventListener("userUpdated", updateNavbar);
    window.removeEventListener("cartUpdated", updateNavbar);
  };
}, [location]);

  const handleSearch = (e) => {
    if (e.key === "Enter" && searchQuery.trim()) {
      navigate(`/products?search=${searchQuery}`);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
    window.dispatchEvent(new Event("userUpdated"));
    navigate("/");
  };
  return (
    <>
      <nav className="navbar">
        <div className="navbar-topbar">
          {user ? (
            <>
              <span>{user.name?.split(" ")[0]}</span>
              <span className="navbar-topbar-divider">|</span>
              <Link to="/profile">My Account</Link>
              <span className="navbar-topbar-divider">|</span>
              <button onClick={handleLogout}>Sign Out</button>
              <span className="navbar-topbar-divider">|</span>
            </>
          ) : (
            <>
              <button onClick={() => setShowAuth(true)}>
                Sign In / Join AJIO
              </button>
              <span className="navbar-topbar-divider">|</span>
            </>
          )}
          <a href="#">Customer Care</a>
        </div>

        <div className="navbar-main">
          <Link to="/" className="navbar-logo">
            AJIO
          </Link>

          <ul className="navbar-links">
            <li>
              <Link
                to="/men"
                className={location.pathname === "/men" ? "navbar-active" : ""}
              >
                Men
                <FiChevronDown size={13} />
              </Link>
            </li>
            <li>
              <Link
                to="/women"
                className={
                  location.pathname === "/women" ? "navbar-active" : ""
                }
              >
                Women
                <FiChevronDown size={13} />
              </Link>
            </li>
            <li>
              <Link
                to="/kids"
                className={location.pathname === "/kids" ? "navbar-active" : ""}
              >
                Kids
                <FiChevronDown size={13} />
              </Link>
            </li>
          </ul>

          <div className="navbar-right">
            <div className="navbar-search">
              <FiSearch size={16} color="#aaa" />
              <input
                type="text"
                placeholder="Search AJIO"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearch}
              />
            </div>

            <button
              className="navbar-icon-btn"
              onClick={() => navigate("/wishlist")}
            >
              <FiHeart size={22} />
            </button>

            <button
              className="navbar-icon-btn"
              onClick={() => navigate("/cart")}
            >
              <FiShoppingBag size={22} />
              {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </button>

          </div>
        </div>
      </nav>

      {showAuth && (
        <AuthModal
          onClose={() => setShowAuth(false)}
          onLogin={(userData) => {
            setUser(userData);
            setShowAuth(false);
          }}
        />)}
    </>
  );
}

export default Navbar;
