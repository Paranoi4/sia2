import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            const response = await axios.post("http://127.0.0.1:8000/api/login/", {
                username,
                password
            });

            localStorage.setItem("access", response.data.access);
            localStorage.setItem("refresh", response.data.refresh);
            localStorage.setItem("username", response.data.username);
            

            window.location.href = "/"; // ✅ Redirect to home after login
        } catch (err) {
            setError("Invalid username or password.");
        } finally {
            setLoading(false); // ✅ Stop loading
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
                <h2 className="text-2xl font-bold text-center mb-4">Admin Login</h2>
                {error && <p className="text-red-500 text-center">{error}</p>}
                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label className="block text-sm font-semibold">Username</label>
                        <input 
                            type="text" 
                            className="w-full px-4 py-2 border rounded-lg" 
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold">Password</label>
                        <input 
                            type="password" 
                            className="w-full px-4 py-2 border rounded-lg" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-lg">
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;
