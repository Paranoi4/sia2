import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import logo from "./assets/logo.jpg"; // make sure the logo path is correct

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
      const response = await axios.post("http://192.168.254.101:8000/api/login/", {
        username,
        password,
      });

      localStorage.setItem("access", response.data.access);
      localStorage.setItem("refresh", response.data.refresh);
      localStorage.setItem("username", response.data.username);
      localStorage.setItem("groups", JSON.stringify(response.data.groups));


      window.location.href = "/";
    } catch (err) {
      setError("Invalid username or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 to-indigo-200">
      <div className="bg-white shadow-xl rounded-lg overflow-hidden w-full max-w-md">
        {/* Header with logo */}
        <div className="bg-gray-900 p-6 flex flex-col items-center">
          <img
            src={logo}
            alt="Bevanda Logo"
            className="w-20 h-20 rounded-full border-4 border-indigo-400 shadow-md mb-3 object-cover"
          />
          <h2 className="text-white text-2xl font-bold">Bevanda Admin</h2>
          <p className="text-indigo-300 text-sm">Secure Panel Login</p>
        </div>

        {/* Form */}
        <div className="p-6">
          {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700">Username</label>
              <input
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700">Password</label>
              <input
                type="password"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white py-2 rounded-lg font-semibold transition duration-200"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
