import { useState, useEffect } from "react";
import "../../admin/styles/ManageProduct.css";

const API = import.meta.env.VITE_API_URL;

function ManageProduct(){
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editProduct, setEditProduct] = useState(null);
    const [editImage, setEditImage] = useState(null);
    const [updating, setUpdating] = useState(false);

    useEffect(()=>{
        fetchProducts();
    },[]);

    const fetchProducts = async() =>{
        try{
            const res = await fetch (`${API}/api/products`);
            const data = await res.json();
            setProducts(data);
        }catch(error){
            console.error("Error fetching products:", error);
        }finally{
            setLoading(false);
        }
    };

    const handleDelete = async(id) =>{
        if(!window.confirm("Are you sure you want to delete this product?")) return;
        try{
            const token = localStorage.getItem("adminToken");
            await fetch(`${API}/api/products/${id}`,{
                method:"DELETE",
                headers:{Authorization:`Bearer ${token}`},
            });
            setProducts(products.filter((p) => p._id !== id));
        }catch(error){
            console.error("Delete error: ", error);
        }
    };

    const handleUpdate =async()=>{
        setUpdating(true);
        try{
            const token= localStorage.getItem("adminToken");
            const formData = new FormData();
            formData.append("name", editProduct.name);
            formData.append("brand", editProduct.brand);
            formData.append("price", editProduct.price);
            formData.append("discountPrice", editProduct.discountPrice);
            formData.append("category", editProduct.category);
            formData.append("description", editProduct.description);
            if(editImage) formData.append("image", editImage);

            const res = await fetch(`${API}/api/products/${editProduct._id}`,{
                method:"PUT",
                headers:{Authorization:`Bearer ${token}`},
                body:formData,
            });

            const data = await res.json();
            setProducts(products.map((p) => (p._id === data._id ? data:p)));
            setEditProduct(null);
            setEditImage(null);
        }catch(error){
            console.error("update error:",error);
        }finally{
            setUpdating(false);
        }
    };

    if(loading) return <div className="manage-loading">Loading products...</div>;

    return(
        <div className="manage-page">
            <h2>Manage Products({products.length})</h2>

            <div className="manage-table-wrapper">
                <table className="manage-table">
                    <thead>
                        <tr>
                            <th>Image</th>
                            <th>Name</th>
                            <th>Brand</th>
                            <th>Category</th>
                            <th>Price</th>
                            <th>Discount</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((product)=>(
                            <tr key={product._id}>
                                <td>
                                    <img 
                                    src={product.imageUrl} alt={product.name} className="product-table-img"/>
                                </td>
                                <td>{product.name}</td>
                                <td>{product.brand}</td>
                                <td
                                style={{textTransform:"capitalize"}}>
                                    {product.category}
                                </td>
                                <td>&#8377;{product.price}</td>
                                <td>{product.discountPrice || "-"}</td>
                                <td>
                                    <button className="table-btn table-btn-edit"
                                    onClick={() => setEditProduct(product)}>
                                        Edit
                                    </button>
                                    <button className="table-btn table-btn-delete"
                                    onClick={()=>handleDelete(product._id)}>
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* editModal */}

            {editProduct && (
                <div className="edit-modal-overlay" onClick={()=>setEditProduct(null)}>
                <div className="edit-modal" onClick={(e)=>e.stopPropagation()}>
                    <h3>Edit Product</h3>
                    <div className="form-group">
                        <label >Product Name</label>
                        <input type="text"
                        value={editProduct.name}
                        onChange={(e)=>setEditProduct({...editProduct, name:e.target.value})
                        }
                         />
                    </div>

                    <div className="form-group">
                        <label >Brand</label>
                        <input type="text"
                        value={editProduct.brand}
                        onChange={(e)=>setEditProduct({...editProduct, brand:e.target.value})
                        }
                         />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Price (&#8377;)</label>
                            <input type="number" 
                            value={editProduct.price} 
                            onChange={(e) => setEditProduct({...editProduct, price:e.target.value})
                            }
                            />
                        </div>
                        <div className="form-group">
                            <label>Discount Price (&#8377;)</label>
                            <input type="number" 
                            value={editProduct.discountPrice} 
                            onChange={(e) => setEditProduct({...editProduct, discountPrice:e.target.value})
                            }
                            />
                        </div>
                    </div>
                    <div className="form-group">
                         <label>Category</label>
                         <select value={editProduct.category}
                         onChange={(e)=>setEditProduct({...editProduct, category:e.target.value})}>
                            <option value="men">Men</option>
                            <option value="women">Women</option>
                            <option value="kids">Kids</option>
                         </select>
                    </div>

                    <div className="form-group">
                        <label>Description</label>
                         <textarea value={editProduct.description} onChange={(e)=> setEditProduct({
                            ...editProduct, description: e.target.value,
                         })} />
                    </div>

                    <div className="form-group">
                        <label>Change Image (optional)</label>
                        <input type="file" accept="image/*" 
                        onChange={(e)=> setEditImage(e.target.files[0])}/>
                    </div>

                    <div className="edit-modal-btns">
                        <button className="add-product-btn" onClick={handleUpdate}
                        disabled={updating}>
                            {updating? "Updating...": "UPDATE PRODUCT"}
                        </button>
                        <button className="table-btn table-btn-delete" onClick={() => setEditProduct(null)}
                            > Cancel
                        </button>
                    </div>
                </div>
            </div>
            )}
        </div>
    )
}

export default ManageProduct;