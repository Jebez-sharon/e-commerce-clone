import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiTrash2 } from "react-icons/fi";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../styles/Wishlist.css";


function Wishlist(){
    const navigate = useNavigate();
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("wishlist") || "[]");
    setWishlist(saved);
  }, []);

  const removeFromWishlist = (id) => {
    const updated = wishlist.filter((item) => item._id !== id);
    setWishlist(updated);
    localStorage.setItem("wishlist", JSON.stringify(updated));
  };

  const addToCart = (product) => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const exists = cart.find((item) => item._id === product._id);
    if (exists) {
      const updated = cart.map((item) =>
        item._id === product._id ? { ...item, qty: item.qty + 1 } : item
      );
      localStorage.setItem("cart", JSON.stringify(updated));
    } else {
      cart.push({ ...product, qty: 1 });
      localStorage.setItem("cart", JSON.stringify(cart));
    }
    window.dispatchEvent(new Event("cartUpdated"));
    removeFromWishlist(product._id);
    navigate("/cart");
  };

  return(
    <div className="wishlist-page">
        <Navbar />
        <div className="wishlist-container">
             <h2 className="wishlist-title">
          My Wishlist ({wishlist.length} items)
        </h2>

        {wishlist.length === 0 ? (
          <div className="wishlist-empty">
            <h2>Your wishlist is empty!</h2>
            <p>Save items you love to your wishlist.</p>
            <button onClick={() => navigate("/products")}>
              Continue Shopping
            </button>
          </div>
        ) : (
          <div className="wishlist-grid">
            {wishlist.map((product) => (
              <div className="wishlist-card" key={product._id}>
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="wishlist-card-img"
                  onClick={() => navigate(`/product/${product._id}`)}
                />
                <div className="wishlist-card-info">
                  <div className="wishlist-card-brand">{product.brand}</div>
                  <div className="wishlist-card-name">{product.name}</div>
                  <div className="wishlist-card-price">
                    &#8377;{product.discountPrice || product.price}
                  </div>
                </div>
                <div className="wishlist-card-btns">
                  <button
                    className="wishlist-add-cart"
                    onClick={() => addToCart(product)}
                  >
                    Add to Cart
                  </button>
                  <button
                    className="wishlist-remove"
                    onClick={() => removeFromWishlist(product._id)}
                  >
                    <FiTrash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
        </div>
        <Footer />
    </div>
  )
}

export default Wishlist;