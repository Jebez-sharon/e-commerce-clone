import { useState, useEffect } from "react";
import "../../admin/styles/ManageUser.css"
import "../../admin/styles/ManageProduct.css"

const API = import.meta.env.VITE_API_URL;
function ManageUser(){
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedUser, setSelectedUser] = useState(null);

    useEffect(() => {
        fetchUsers();
    },[]);

    const fetchUsers = async()=>{
        try{
            const token = localStorage.getItem("adminToken");
            const res = await fetch(`${API}/api/auth/users`,{
                headers:{Authorization:`Bearer ${token}`},
            });

            const data = await res.json();
            setUsers(data);
        }catch(error){
            console.error("Error fetching users:", error)
        }finally{
            setLoading(false);
        }
    };

    const handleDelete = async(id)=>{
        if(!window.confirm("Are you sure you want to delete this user?")) return;
        try{
            const token = localStorage.getItem("adminToken");
            await fetch(`${API}/api/auth/users/${id}`,{
                method:"DELETE",
                headers:{Authorization:`Bearer ${token}`},
            });
            setUsers(users.filter((u) => u._id !== id));
        }catch(error){
            console.error("Delete error:" , error)
        }
    };

    if (loading) return <div className="manage-loading">Loading users...</div>;

    return(
        <div className="manage-page">
            <h2>Manage Users ({users.length})</h2>

            <div className="manage-table-wrapper">
                <table className="manage-table">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Mobile</th>
                            <th>Gender</th>
                            <th>Role</th>
                            <th>Joined</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user, index)=>(
                            <tr key={user._id}>
                                <td>{index +1}</td>
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                <td>{user.mobileNumber}</td>
                                <td>{user.gender}</td>
                                <td>
                                    <span className={
                                        `status-badge ${
                                            user.role === "admin" ? "status-processing" : "status-delivered"
                                        }`
                                    }>{user.role}</span>
                                </td>
                                <td style={{fontSize:"12px", color:"#666"}}>
                                    {new Date(user.createdAt).toLocaleDateString()}
                                </td>
                                <td>
                                    <button className="table-btn table-btn-edit" onClick={()=> setSelectedUser(user)}>
                                        View
                                    </button>
                                    <button className="table-btn table-btn-delete"
                                    onClick={()=> handleDelete(user._id)}>
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {selectedUser && (
                <div className="edit-modal-overlay" onClick={()=> setSelectedUser(null)}>
                    <div className="edit-modal" onClick={(e) => e.stopPropagation()}>
                        <h3>User Details</h3>
                        <div className="user-detail-row">
                            <span>Name:</span><strong>{selectedUser.name}</strong>
                        </div>
                        <div className="user-detail-row">
                            <span>Email:</span><strong>{selectedUser.email}</strong>
                        </div>
                        <div className="user-detail-row">
                            <span>Mobile:</span><strong>{selectedUser.mobileNumber}</strong>
                        </div>
                        <div className="user-detail-row">
                            <span>Gender:</span><strong>{selectedUser.gender}</strong>
                        </div>
                        <div className="user-detail-row">
                            <span>Role:</span><strong>{selectedUser.role}</strong>
                        </div>
                        <div className="user-detail-row">
                            <span>Joined:</span>
                            <strong>{new Date(selectedUser.createdAt).toLocaleDateString()}</strong>
                        </div>

                        <button className="add-product-btn" style={{marginTop:"20px"}}
                        onClick={()=>setSelectedUser(null)}>
                            CLOSE
                        </button>

                    </div>
                </div>
            )}
        </div>
    )
}

export default ManageUser;