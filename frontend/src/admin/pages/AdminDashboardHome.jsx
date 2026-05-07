import { useState, useEffect } from "react";
import{
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer, PieChart, Pie, Cell, Legend,
    LineChart, Line,
}from "recharts";
import "../../admin/styles/AdminDashboard.css";

const API = import.meta.env.VITE_API_URL;
const COLORS= ["#e63946","#1a1a1a","#457b9d","#2d6a4f"];//used in piecharts

function AdminDashboardHome(){
    const [stats,setStats] = useState({
        totalProducts:0,
        totalUsers:0,
        totalOrders:0,
        totalRevenue:0,
    });
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(()=>{
        fetchStats();
    },[])

    const fetchStats =async() =>{
        try{
            const token = localStorage.getItem("adminToken");
            const headers = {Authorization:`Bearer ${token}`};

            const [productsRes, usersRes, OrdersRes] = await Promise.all([
                fetch(`${API}/api/products`,{headers}),
                fetch(`${API}/api/auth/users`,{headers}),
                fetch(`${API}/api/orders`,{headers}),
            ]);

            const products = await productsRes.json();
            const users = await usersRes.json();
            const ordersData = await OrdersRes.json();

            const revenue = ordersData.reduce(
                (acc, order) => acc+order.totalAmount, 0
            );

            setStats({
                totalProducts:products.length,
                totalUsers:users.length,
                totalOrders:ordersData.length,
                totalRevenue:revenue,
            });
            setOrders(ordersData);
        }catch(error){
            console.error("Dashboard error:", error)
        }finally{
            setLoading(false);
        }
    };

    const monthlyData =[
        "Jan","Feb","Mar","Apr","May","Jun",
        "Jul","Aug","Sep","Oct","Nov","Dec",
    ].map((month)=>({
        month,
        orders:orders.filter((o) =>{
            const d = new Date(o.createdAt);
            return d.toLocaleString("default", {month:"short"}) === month;
        }).length,
        revenue:orders.filter((o) => {
            const d = new Date(o.createdAt);
            return d.toLocaleString("default", {month:"short"}) === month;
        }).reduce((acc, o) => acc + o.totalAmount, 0),
    }));//stores the month, orders, revenue like for each month

    const statusData = [
        {name:"Pending", value:orders.filter((o) => o.status === "pending").length},
        {name:"Processing", value:orders.filter((o) => o.status === "processing").length},
        {name:"Shipped", value:orders.filter((o) => o.status === "shipped").length},
        {name:"Delivered", value:orders.filter((o) => o.status === "delivered").length},
    ].filter((d) => d.value > 0);

    if(loading) return <div className="dashboard-page"><h2>Loading...</h2></div>

    return(
        <div className="dashboard-page">
            <h2>Dashboard Overview</h2>

            <div className="dashboard-stats">
                <div className="stat-card">
                    <div className="stat-card-icon"></div>
                    <h3>Total Products</h3>
                    <p>{stats.totalProducts}</p>
                </div>
                <div className="stat-card">
                    <div className="stat-card-icon"></div>
                    <h3>Total Users</h3>
                    <p>{stats.totalUsers}</p>
                </div>
                <div className="stat-card">
                    <div className="stat-card-icon"></div>
                    <h3>Total Orders</h3>
                    <p>{stats.totalOrders}</p>
                </div>
                <div className="stat-card">
                    <div className="stat-card-icon"></div>
                    <h3>Total Revenue</h3>
                    <p>{stats.totalRevenue.toLocaleString()}</p>
                    <span>All time</span>
                </div>
            </div>


            <div className="chart-card-full">
                <h3>Monthly Revenue (&#8377;)</h3>
                <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={monthlyData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0"/>
                        <XAxis dataKey="month" fontSize={12}/>
                        <YAxis fontSize={12}/>
                        <Tooltip />
                        <Line 
                        type="monotone"
                        dataKey="revenue"
                        stroke="#e63946"
                        strokeWidth={2}
                        dot={{fill:"#e63946"}}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            <div className="dashboard-charts">
                <div className="chart-card">
                    <h3>Monthly Orders</h3>
                    <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={monthlyData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0"/>
                        <XAxis dataKey="month" fontSize={12}/>
                        <YAxis fontSize={12}/>
                        <Tooltip />
                        <Bar 
                        dataKey="orders"
                        fill="#1a1a1a"
                        radius={[4,4,0,0]}
                        />
                    </BarChart>
                </ResponsiveContainer>
                </div>

                <div className="chart-card">
                    <h3>Orders by Status</h3>
                    {statusData.length > 0 ? (
                        <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                        <Pie 
                        data={statusData}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        dataKey="value"
                        label={({name,value}) => `${name}:${value}`}
                        >
                        {statusData.map((_, index) => (
                            <Cell key={index} fill={COLORS[index % COLORS.length]}/>
                        ))}
                        </Pie>
                        <Legend />
                        <Tooltip />
                    </PieChart>
                </ResponsiveContainer>
                    ):(
                        <p style={{color:"#666", fontSize:"13px"}}>
                            No orders yet to display
                        </p>
                    )}
                </div>
            </div>
        </div>
    )
}

export default AdminDashboardHome;