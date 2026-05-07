import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import{FiHeart} from "react-icons/fi";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../styles/Products.css";

const API = import.meta.env.VITE_API_URL;

function Products(){
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const[products, setProducts] = useState([]);
    const[loading, setLoading] = useState(true);
    const[wishlist, setWishlist] = useState([]);
    const[sortBy, setSortBy] = useState("");

    const search = searchParams.get("search") || "";
    const category = searchParams.get("category") || "";

    useEffect(()=>{
        fetchProducts();
        const saved = JSON.parse(localStorage.getItem("wishlist")|| "[]");
        setWishlist(saved.map((item)=> item._id));
    }, [search, category]);

    const fetchProducts = async ()=>{
        setLoading(true);
        try{
            let url =`${API}/api/products?`;
            if(search) url += `search=${search}&`;
            if(category) url += `category=${category}`;
            const res = await fetch(url);
            const data = await res.json();
            setProducts(data);
        }catch(error){
            console.error("Error fetching products", error);
        }finally{
            setLoading(false);
        }
    };

    const getSortedProducts = ()=>{
        const sorted =[...products];
        if(sortBy === "price-low") sorted.sort((a, b) => (a.discountPrice || a.price) - (b.discountPrice || b.price));
        if(sortBy === "price-high") sorted.sort((a, b) => (b.discountPrice || b.price) - (a.discountPrice || a.price));
        if(sortBy === "discount") sorted.sort((a,b)=>{
            const discA = a.discountPrice ? Math.round(((a.price - a.discountPrice)/ a.price) * 100):0;
            const discB = b.discountPrice ? Math.round(((b.price - b.discountPrice)/ b.price) * 100):0;
            return discB-discA;
        });
        return sorted
    };

    const toogleWishlist = (e, product) =>{
        e.stopPropagation();
        const saved = JSON.parse(localStorage.getItem("wishlist")|| "[]");
        const exists = saved.find((item)=> item._id === product._id);
        let updated;
        if(exists){
            updated = saved.filter((item) => item._id !== product._id);
        }else{
            updated =[...saved, product];
        }
        localStorage.setItem("wishlist", JSON.stringify(updated));
        setWishlist(updated.map((item) => item._id));
    };

    const getDiscount =(price, discountPrice) =>{
        if(!discountPrice) return null;
        return Math.round(((price - discountPrice )/ price)*100);
    };

    const getTitle = ()=>{
        if(search) return `Search results for "${search}"`;
        if(category) return category.charAt(0).toUpperCase() + category.slice(1);
        return "All Products"
    }

    const sorted = getSortedProducts();

    return(
        <div className="products-page">
            <Navbar />
            <div className="products-header">
                <div>
                    <h2>{getTitle()}</h2>
                    <span>{sorted.length} products found</span>
                </div>
                <select className="products-sort" 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}>
                    <option value="">Sort By</option>
                    <option value="price-low">Price : Low to High</option>
                    <option value="price-high">Price : High to Low</option>
                    <option value="discount">Best Discount</option>
                </select>
            </div>
            <div className="products-container">
                <div className="products-grid">
                    {loading && <div className="products-loading">Loading products...</div>}

                    {!loading && sorted.length === 0 && (
                        <div className="products-empty">
                            No products found. Try a different search!
                        </div>
                    )}

                    {!loading && sorted.map((product) =>(
                        <div className="product-card" key={product._id} onClick={() => navigate(`/product/${product._id}`)}>
                            <img src={product.imageUrl} alt={product.name} className="product-card-img" />

                            <button className={`product-card-wishlist ${
                                wishlist.includes(product._id) ? "wishlisted": ""
                            }`}
                            onClick={(e) => toogleWishlist(e, product)}>
                                <FiHeart size={16} fill={wishlist.includes(product._id) ? "#e63946" :"none"}/>
                            </button>
                            <div className="product-card-info">
                                    <div className="product-card-brand">{product.brand}</div>
                                    <div className="product-card-name">{product.name}</div>
                                    <div className="product-card-price">
                                        <span className="product-card-discount">
                                            &#8377;{product.discountPrice || product.price}

                                        </span> 
                                        {product.discountPrice && (
                                            <>
                                            <span className="product-card-original">
                                                &#8377;{product.price}
                                            </span>
                                            <span className="product-card-off">
                                                {getDiscount(product.price, product.discountPrice)}%off
                                            </span>
                                            </>
                                        )}                                   
                                    </div>
                                </div>
                        </div>
                    ))}
                </div>
            </div>
            <Footer />
        </div>
    )
}

export default Products;