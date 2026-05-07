import { NavLink, useNavigate } from "react-router-dom";

import{
    FiGrid, FiPackage, FiShoppingBag, FiUsers, FiPlusCircle, FiLogOut,
} from "react-icons/fi";
import "../styles/AdminLayout.css";

function AdminLayout({children}){

    const navigate= useNavigate();

    const handleLogout =()=>{
        localStorage.removeItem("adminToken");
        navigate("/admin");
    }

    return (
        <div className="admin-layout">
            <aside className="admin-sidebar">
                <div className="admin-sidebar-logo">AJIO</div>
                <p className="admin-sidebar-subtitle">Admin Panel</p>

                <nav className="admin-sidebar-nav">
                    <NavLink to="/admin/dashboard"
                    end
                    className={({isActive}) => 
                    isActive? "admin-nav-link active" : "admin-nav-link"}>
                        <FiGrid size={16}/> Dashboard
                    </NavLink>

                    <NavLink to="/admin/dashboard/add-product"
                    className={({isActive}) => 
                    isActive? "admin-nav-link active" : "admin-nav-link"}>
                        <FiPlusCircle size={16}/> Add Product
                    </NavLink>

                    <NavLink to="/admin/dashboard/manage-products"
                    className={({isActive}) => 
                    isActive? "admin-nav-link active" : "admin-nav-link"}>
                        <FiPackage size={16}/> Manage Product
                    </NavLink>

                    <NavLink to="/admin/dashboard/manage-orders"
                    className={({isActive}) => 
                    isActive? "admin-nav-link active" : "admin-nav-link"}>
                        <FiShoppingBag size={16}/> Manage Orders
                    </NavLink>

                    <NavLink to="/admin/dashboard/manage-users"
                    className={({isActive}) => 
                    isActive? "admin-nav-link active" : "admin-nav-link"}>
                        <FiUsers size={16}/> Manage Users
                    </NavLink>
                </nav>

                <button className="admin-sidebar-logout" onClick={handleLogout}>
                    <FiLogOut size={16}/>
                    Logout
                </button>
            </aside>

            <main className="admin-main">{children}</main>
        </div>
    )
}
export default AdminLayout;