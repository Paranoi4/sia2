import { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import axios from "axios";
import Transaction from "./Transaction";
import Edit from "./Edit";
import Table from "./components/Table";
import TodoForm from "./components/TodoForm";

const Login = ({ setToken }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://127.0.0.1:8000/api/token/", {
        username,
        password,
      });

      // Store tokens in localStorage
      localStorage.setItem("access", response.data.access);
      localStorage.setItem("refresh", response.data.refresh);
      setToken(response.data.access);
    } catch (error) {
      alert("Invalid credentials");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <form onSubmit={handleLogin} className="bg-white p-6 rounded shadow-md">
        <h2 className="text-2xl mb-4">Login</h2>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="border p-2 mb-2 w-full"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border p-2 mb-2 w-full"
        />
        <button type="submit" className="bg-blue-500 text-white p-2 w-full">
          Login
        </button>
      </form>
    </div>
  );
};

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("access");
  return token ? children : <Navigate to="/login" />;
};

function App() {
  const [token, setToken] = useState(localStorage.getItem("access") || "");

  const logout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    setToken("");
  };

  return (
    <Router>
      <div className="flex min-h-screen bg-indigo-100">
        {token && (
          <aside className="w-1/4 bg-gray-900 text-white p-4">
            <h2 className="text-2xl font-bold mb-6">Welcome, Admin!</h2>
            <ul className="space-y-4">
              <li className="font-semibold">
                <button onClick={logout} className="hover:underline">
                  Logout
                </button>
              </li>
              <li className="font-semibold">
                <a href="/main-inventory" className="hover:underline">
                  Inventory
                </a>
              </li>
              <li className="font-semibold">
                <a href="/transaction" className="hover:underline">
                  Stock Transactions
                </a>
              </li>
            </ul>
          </aside>
        )}

        <main className="w-3/4 p-8">
          <Routes>
            <Route path="/login" element={<Login setToken={setToken} />} />
            <Route
              path="/main-inventory"
              element={
                <ProtectedRoute>
                  <>
                    <h1 className="text-5xl text-center pb-8">Bevanda Inventory</h1>
                    <TodoForm />
                    <Table />
                  </>
                </ProtectedRoute>
              }
            />
            <Route
              path="/transaction"
              element={
                <ProtectedRoute>
                  <Transaction />
                </ProtectedRoute>
              }
            />
            <Route
              path="/edit"
              element={
                <ProtectedRoute>
                  <Edit />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to={token ? "/main-inventory" : "/login"} />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
