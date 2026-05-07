import { useState } from "react";
import "../../admin/styles/AddProduct.css";

const API = import.meta.env.VITE_API_URL;

function AddProduct(){
    const[name, setName] = useState("");
    const[brand, setBrand] = useState("");
    const[price, setPrice] = useState("");
    const[discountPrice, setDiscountPrice] = useState("");
    const[category, setCategory] = useState("");
    const[description, setDescription] = useState("");
    const[image, setImage] = useState("");
    const[preview, setPreview] = useState("");
    const[loading, setLoading] = useState(false);
    const[success, setSuccess] = useState("");
    const[error, setError] = useState("");

    const handleImageChange = (e) =>{
        const file = e.target.files[0];
        setImage(file);
        setPreview(URL.createObjectURL(file));
    };

    const handleSubmit = async () =>{
        if(!name || !brand || !price || !category || !description || !image)
            return setError("Please fill all fields and select an image");

        setLoading(true);
        setError("");
        setSuccess("");

        try{
            const formData = new FormData();
            formData.append("name", name);
            formData.append("brand", brand);
            formData.append("price", price);
            formData.append("discountPrice", discountPrice);
            formData.append("category", category);
            formData.append("description", description);
            formData.append("image", image);

            const token = localStorage.getItem("adminToken");
            const res = await fetch(`${API}/api/products`, {
                method:"POST",
                headers:{Authorization: `Bearer ${token}`},
                body:formData,
            });

            const data = await res.json();
            if(!res.ok) return setError(data.message);

            setSuccess("Product added successfully!")
            setName("");
            setBrand("");
            setPrice("");
            setDiscountPrice("");
            setCategory("");
            setDescription("");
            setImage("");
            setPreview("");
        }catch(err){
            setError("Something went wrong. Try again.")
        }finally{
            setLoading(false);
        }
    };

    return(
        <div className="add-product-page">
            <h2>Add New Product</h2>

            <div className="add-product-form">
                <div className="form-row">
                    <div className="form-group">
                        <label>Product Name *</label>
                        <input type="text" placeholder="Enter product name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        />
                    </div>

                     <div className="form-group">
                        <label>Brand *</label>
                        <input type="text" placeholder="Enter brand name"
                        value={brand}
                        onChange={(e) => setBrand(e.target.value)}
                        />
                    </div>
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label>Price (&#8377;)*</label>
                        <input type="number"
                        placeholder="Enter original price"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)} 
                        />
                    </div>
                    <div className="form-group">
                        <label>Discount Price (&#8377;)</label>
                        <input type="number"
                        placeholder="Enter discount price"
                        value={discountPrice}
                        onChange={(e) => setDiscountPrice(e.target.value)} 
                        />
                    </div>
                </div>

                <div className="form-group">
                        <label>Category *</label>
                        <select 
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}>
                            <option value="">Select category</option>
                            <option value="men">Men</option>
                            <option value="women">Women</option>
                            <option value="kids">Kids</option>
                        </select>
                    </div>

                     <div className="form-group">
                        <label>Description</label>
                        <textarea 
                        placeholder="Enter product description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}></textarea>
                    </div>

                    <div className="form-group">
                        <label>Product Image *</label>
                        <input type="file"
                        accept="image/*"
                        onChange={handleImageChange} 
                        />
                        {preview && (
                            <img src={preview} alt="Preview" className="form-image-preview" />
                        )}
                    </div>

                    {error && <p className="form-error">{error}</p>}
                    {success && <p className="form-success">{success}</p>}

                    <button className="add-product-btn"
                    onClick={handleSubmit}
                    disabled={loading}>
                        {loading ? "Adding..." : "ADD PRODUCT"}
                    </button>
            </div>
        </div>
    )
}

export default AddProduct;