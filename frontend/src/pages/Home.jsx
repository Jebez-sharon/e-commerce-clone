import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import HeroCarousel from "../components/HeroCarousel";
import "../styles/Home.css"

const API = import.meta.env.VITE_API_URL;

const bankOffers = Array.from({ length: 3 }, (_, i) => `/images/offers/offers${i + 1}.avif`);
const menBanners = Array.from({ length: 6 }, (_, i) => `/images/men/men${i + 1}.avif`);
const womenBanners = Array.from({ length: 7 }, (_, i) => `/images/women/women${i + 1}.avif`);
const kidsBanners = Array.from({ length: 4 }, (_, i) => `/images/kids/kids${i + 1}.avif`);

function ImageCarousel({ images, onClick, height = "400px" }) {
  const trackRef = useRef(null);

  const scroll = (dir) => {
    if (trackRef.current) {
      trackRef.current.scrollBy({ left: dir * 300, behavior: "smooth" });
    }
  };

  return (
    <div className="product-carousel-wrapper">
      <button className="carousel-nav-btn prev" onClick={() => scroll(-1)}>
        <FiChevronLeft size={18} />
      </button>
      <div className="product-carousel-track" ref={trackRef}>
        {images.map((src, i) => (
          <div
            key={i}
            style={{ minWidth: "320px", flexShrink: 0, cursor: "pointer", borderRadius: "4px", overflow: "hidden" }}
            onClick={onClick}
          >
            <img
              src={src}
              alt={`banner-${i}`}
              style={{ width: "100%", height: height, objectFit: "cover", display: "block" }}
            />
          </div>
        ))}
      </div>
      <button className="carousel-nav-btn next" onClick={() => scroll(1)}>
        <FiChevronRight size={18} />
      </button>
    </div>
  );
}

function ProductCarousel({ title, category, viewAllLink }) {
  const navigate = useNavigate();
  const trackRef = useRef(null);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch(`${API}/api/products?category=${category}`)
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error(err));
  }, [category]);

  const scroll = (dir) => {
    if (trackRef.current) {
      trackRef.current.scrollBy({ left: dir * 250, behavior: "smooth" });
    }
  };

  const getDiscount = (price, discountPrice) => {
    if (!discountPrice) return null;
    return Math.round(((price - discountPrice) / price) * 100);
  };

  return (
    <div>
      <div className="section-header">
        <h2>{title}</h2>
        <Link to={viewAllLink}>View All</Link>
      </div>
      <div className="product-carousel-wrapper">
        <button className="carousel-nav-btn prev" onClick={() => scroll(-1)}>
          <FiChevronLeft size={18} />
        </button>
        <div className="product-carousel-track" ref={trackRef}>
          {products.map((product) => (
            <div
              className="product-carousel-card"
              key={product._id}
              onClick={() => navigate(`/product/${product._id}`)}
            >
              <img
                src={product.imageUrl}
                alt={product.name}
                className="product-carousel-img"
              />
              <div className="product-carousel-info">
                <div className="product-carousel-brand">{product.brand}</div>
                <div className="product-carousel-name">{product.name}</div>
                <div className="product-carousel-price">
                  <span className="carousel-price-discount">
                    &#8377;{product.discountPrice || product.price}
                  </span>
                  {product.discountPrice && (
                    <>
                      <span className="carousel-price-original">
                        &#8377;{product.price}
                      </span>
                      <span className="carousel-price-off">
                        {getDiscount(product.price, product.discountPrice)}% off
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        <button className="carousel-nav-btn next" onClick={() => scroll(1)}>
          <FiChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}

function Home() {
  const navigate = useNavigate();

  return (
    <div>
      <Navbar />
      <HeroCarousel />

      <div className="section-header">
        <h2>Bank Offers</h2>
      </div>
      <ImageCarousel
        images={bankOffers}
        onClick={() => {}}
        height="150px"
      />

      <div className="section-header">
        <h2>Men's Fashion</h2>
        <Link to="/men">View All</Link>
      </div>
      <ImageCarousel
        images={menBanners}
        onClick={() => navigate("/men")}
      />

      <ProductCarousel
        title="Top Picks For Men"
        category="men"
        viewAllLink="/men"
      />

      <div className="section-header">
        <h2>Women's Fashion</h2>
        <Link to="/women">View All</Link>
      </div>
      <ImageCarousel
        images={womenBanners}
        onClick={() => navigate("/women")}
      />

      <ProductCarousel
        title="Top Picks For Women"
        category="women"
        viewAllLink="/women"
      />

      <div className="section-header">
        <h2>Shop By Category</h2>
      </div>
      <div className="category-grid">
        <div className="category-grid-item" onClick={() => navigate("/men")}>
          <img src="/images/men/men1.avif" alt="Men" />
          <div className="category-grid-label">Men</div>
        </div>
        <div className="category-grid-item" onClick={() => navigate("/women")}>
          <img src="/images/women/women1.avif" alt="Women" />
          <div className="category-grid-label">Women</div>
        </div>
        <div className="category-grid-item" onClick={() => navigate("/kids")}>
          <img src="/images/kids/kids1.avif" alt="Kids" />
          <div className="category-grid-label">Kids</div>
        </div>
      </div>

      <div className="section-header">
        <h2>Kids Fashion</h2>
        <Link to="/kids">View All</Link>
      </div>
      <ImageCarousel
        images={kidsBanners}
        onClick={() => navigate("/kids")}
      />

      <ProductCarousel
        title="Top Picks For Kids"
        category="kids"
        viewAllLink="/kids"
      />

      <Footer />
    </div>
  );
}

export default Home;