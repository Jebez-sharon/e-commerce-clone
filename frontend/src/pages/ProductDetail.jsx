import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FiHeart, FiArrowLeft } from "react-icons/fi";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../styles/ProductDetail.css";

const API = import.meta.env.VITE_API_URL;

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [wishlisted, setWishlisted] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);

  useEffect(() => {
    fetchProduct();
    const wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");
    setWishlisted(wishlist.some((item) => item._id === id));
  }, [id]);

  const fetchProduct = async () => {
    try {
      const res = await fetch(`${API}/api/products/${id}`);
      const data = await res.json();
      setProduct(data);
    } catch (error) {
      console.error("Error fetching product :", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const exists = cart.find((item) => item._id === product._id);
    if (exists) {
      const updated = cart.map((item) =>
        item._id === product._id ? { ...item, qty: item.qty + 1 } : item,
      );
      localStorage.setItem("cart", JSON.stringify(updated));
    } else {
      cart.push({ ...product, qty: 1 });
      localStorage.setItem("cart", JSON.stringify(cart));
    }
    window.dispatchEvent(new Event("cartUpdated"));
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const handleWishlist = () => {
    const wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");
    const exists = wishlist.some((item) => item._id === product._id);
    let updated;
    if (exists) {
      updated = wishlist.filter((item) => item._id !== product._id);
      setWishlisted(false);
    } else {
      updated = [...wishlist, product];
      setWishlisted(true);
    }
    localStorage.setItem("wishlist", JSON.stringify(updated));
  };

  const getDiscount = (price, discountPrice) => {
    if (!discountPrice) return null;
    return Math.round(((price - discountPrice) / price) * 100);
  };

  if (loading)
    return (
      <div className="product-detail-page">
        <Navbar />
        <div style={{ padding: "60px", textAlign: "center", color: "#666" }}>
          Loading...
        </div>
      </div>
    );

  if (!product)
    return (
      <div className="product-detail-page">
        <Navbar />
        <div
          style={{
            padding: "60px",
            textAlign: "center",
            color: "#666",
          }}
        >
          Product not found!
        </div>
      </div>
    );

  return (
    <div className="product-detail-page">
      <Navbar />
      <div className="product-detail-container">
        <div>
          <img
            src={product.imageUrl}
            alt={product.name}
            className="product-detail-img"
          />
        </div>
        <div className="product-detail-info">
          <button
            onClick={() => navigate(-1)}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              color: "#666",
              fontSize: "13px",
              marginBottom: "16px",
            }}
          >
            <FiArrowLeft size={14} />
          </button>

          <div className="product-detail-brand">{product.brand}</div>
          <div className="product-detail-name">{product.name}</div>

          <div className="product-detail-price">
            <span className="product-detail-discount">
              &#8377;{product.discountPrice || product.price}
            </span>
            {product.discountPrice && (
              <>
                <span className="product-detail-original">
                  &#8377;{product.price}
                </span>
                <span className="product-detail-off">
                  {getDiscount(product.price, product.discountPrice)}%off
                </span>
              </>
            )}
          </div>
          <p className="product-detail-tax">Inclusive of all taxes</p>
          <hr className="product-detail-divider" />
          <div className="product-detail-desc-title">Description</div>
          <p className="product-detail-desc">{product.description}</p>

          <div className="product-detail-btns">
            <button className="btn-add-cart" onClick={handleAddToCart}>
                Add to Cart
            </button>
            <button className={`btn-wishlist ${wishlisted ? "wishlisted" : ""}`} onClick={handleWishlist}>
                <FiHeart size={18} fill={wishlisted ?"#e63946" :"none"} />
                {wishlisted ? "Wishlisted " : "Wishlist"}
            </button>
          </div>

          {addedToCart && (
            <div className="product-detail-added">
                Added to cart successfully!
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default ProductDetail;
