import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

//User pages
import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Shipping from "./pages/Shipping";
import Payment from "./pages/Payment";
import Orders from "./pages/Orders";
import Profile from "./pages/Profile";
import Wishlist from "./pages/Wishlist";
import Men from "./pages/Men";
import Women from "./pages/Women";
import Kids from "./pages/Kids";

//Admin Pages
import AdminLogin from "./admin/pages/AdminLogin";
import AdminDashboardHome from "./admin/pages/AdminDashboardHome";
import AddProduct from "./admin/pages/AddProduct";
import ManageProduct from "./admin/pages/ManageProduct";
import ManageOrder from "./admin/pages/ManageOrder";
import ManageUser from "./admin/pages/ManageUser";

//Components
import AdminLayout from "./admin/components/AdminLayout";
import ProtectedRoute from "./components/ProtectedRoute";

function App(){
    return(
        <Router>
            <Routes>
                {/* User Routes */}
                <Route path="/" element={<Home />}/>
                <Route path="/men" element={<Men />}/>
                <Route path="/women" element={<Women />}/>
                <Route path="/kids" element={<Kids />}/>
                <Route path="/products" element={<Products />}/>
                <Route path="/product/:id" element={<ProductDetail />}/>
                <Route path="/cart" element={<Cart />}/>
                <Route path="/shipping" element={<Shipping />}/>
                <Route path="/payment" element={<Payment />}/>
                <Route path="/orders" element={<Orders />}/>
                <Route path="/profile" element={<Profile />}/>
                <Route path="/wishlist" element={<Wishlist />}/>

                {/* admin Routes */}
                <Route path="/admin" element={<AdminLogin/>}/>
                <Route path="/admin/dashboard" element={
                    <ProtectedRoute>
                        <AdminLayout>
                            <AdminDashboardHome />
                        </AdminLayout>
                    </ProtectedRoute>
                }/>
                <Route path="/admin/dashboard/add-product" element={
                    <ProtectedRoute>
                        <AdminLayout>
                            <AddProduct />
                        </AdminLayout>
                    </ProtectedRoute>
                }/>
                <Route path="/admin/dashboard/manage-products" element={
                    <ProtectedRoute>
                        <AdminLayout>
                            <ManageProduct />
                        </AdminLayout>
                    </ProtectedRoute>
                }/>
                <Route path="/admin/dashboard/manage-orders" element={
                    <ProtectedRoute>
                        <AdminLayout>
                            <ManageOrder />
                        </AdminLayout>
                    </ProtectedRoute>
                }/>
                <Route path="/admin/dashboard/manage-users" element={
                    <ProtectedRoute>
                        <AdminLayout>
                            <ManageUser />
                        </AdminLayout>
                    </ProtectedRoute>
                }/>

            </Routes>
        </Router>
    )
}

export default App;