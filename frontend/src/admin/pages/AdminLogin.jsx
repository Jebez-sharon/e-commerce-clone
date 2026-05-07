import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../admin/styles/AdminLogin.css"

const API = import.meta.env.VITE_API_URL;

function AdminLogin(){
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const[loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleLogin = async ()=>{
        if(!username || !password)return setError("Please fill all fields");
        setLoading(true);
        setError("");
        try{
            const res = await fetch(`${API}/api/auth/admin/login`,{
                method:"POST",
                headers:{"Content-Type": "application/json"},
                body:JSON.stringify({username, password}),
            });
            const data = await res.json();
            if(!res.ok) return setError(data.message);

            localStorage.setItem("adminToken", data.token);
            navigate("/admin/dashboard");
        }catch(err){
            setError("Something went wrong. Try again.");
        }finally{
            setLoading(false);
        }
    };

    return(
        <div className="admin-login-page">
            <div className="admin-login-box">
                <div className="admin-login-logo">
                    AJIO
                </div>
                <p className="admin-login-subtitle">Admin Panel</p>

                <h2>Sign In</h2>

                <div className="admin-input-group">
                    <label> Username </label>
                    <input type="text"
                    placeholder="Enter username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    onKeyDown={(e)=> e.key === "Enter" && handleLogin()} 
                />
                </div>

                <div className="admin-input-group">
                    <label>Password</label>
                    <input type="password"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyDown={(e) => e.key==="Enter" && handleLogin()}
                    />
                </div>

                {error && <p className="admin-login-error">{error}</p>}

                <button className="admin-login-btn" onClick={handleLogin} disabled={loading}>
                    {loading? "Signing in..." :"SIGN IN"}
                </button>
                
            </div>
        </div>
    )
}

export default AdminLogin;