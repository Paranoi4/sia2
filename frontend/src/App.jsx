import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import axios from "axios";
import Login from "./Login";
import Transaction from "./Transaction";
import Edit from "./Edit";
import Stockin from "./Stockin";
import Stockout from "./Stockout";
import StockOutEvent from "./StockOutEvent";
import StockInReturn from "./StockInReturn";
import Table from "./components/Table";
import TodoForm from "./components/TodoForm";
import LandingPage from "./LandingPage";
import BookPage from "./BookPage";
import ManagePackages from "./components/Admin/ManagePackages";
import logo from "./assets/logo.jpg";

function App() {
  const [todos, setTodos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("access");
    setIsAuthenticated(!!token);
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/todo/");
      setTodos(response.data);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    localStorage.removeItem("username");
    setIsAuthenticated(false);
    window.location.href = "/login";
  };

  const PrivateRoute = ({ children }) => {
    const token = localStorage.getItem("access");
    return token ? children : <Navigate to="/login" />;
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/first/*" element={<BookPage />} />
        <Route path="/landing-page" element={<LandingPage />} />
        <Route path="/login" element={isAuthenticated ? <Navigate to="/main-inventory" /> : <Login />} />

        {/* Authenticated Routes */}
        <Route
          path="/*"
          element={
            <div className="flex min-h-screen bg-indigo-100 font-sans">
              {isAuthenticated && (
                <aside className="w-64 min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white p-6 shadow-lg">
                 <div className="mb-10 flex flex-col items-center">
  <img
    src={logo}
    alt="Bevanda Logo"
    className="w-24 h-24 rounded-full border-4 border-indigo-400 shadow-md object-cover mb-3"
  />
  <h2 className="text-2xl font-bold text-indigo-400">Bevanda</h2>
  <p className="text-sm text-gray-400">Admin Panel</p>
</div>
                  <ul className="space-y-4 text-sm font-medium">
                    <li>
                      <a href="/landing-page" className="flex items-center gap-3 hover:bg-gray-700 p-2 rounded-md">
                        🏠 Dashboard
                      </a>
                    </li>
                    <li>
                      <a href="/main-inventory" className="flex items-center gap-3 hover:bg-gray-700 p-2 rounded-md">
                        📦 Main Inventory
                      </a>
                    </li>

                    {/* Transaction History Dropdown */}
                    <li className="group">
                      <div className="flex flex-col">
                        <span className="flex items-center justify-between gap-3 hover:bg-gray-700 p-2 rounded-md cursor-pointer">
                          <span className="flex items-center gap-3">📂 Transaction History</span>
                          <svg className="w-4 h-4 transform group-hover:rotate-90 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </span>
                        <ul className="pl-6 pt-2 space-y-2 text-sm text-gray-300 group-hover:block hidden">
                          <li>
                            <a href="/transaction" className="flex items-center gap-2 hover:text-white">
                              ➕ Stock-In
                            </a>
                          </li>
                          <li>
                            <a href="/stock-out" className="flex items-center gap-2 hover:text-white">
                              ➖ Stock-Out
                            </a>
                          </li>
                          <li>
                            <a href="/edit" className="flex items-center gap-2 hover:text-white">
                              📜 Product History
                            </a>
                          </li>
                        </ul>
                      </div>
                    </li>

                    <li>
                      <a href="/stock-in-return" className="flex items-center gap-3 hover:bg-gray-700 p-2 rounded-md">
                        🔁 Stock-In Return
                      </a>
                    </li>
                    <li>
                      <a href="/stock-out-event" className="flex items-center gap-3 hover:bg-gray-700 p-2 rounded-md">
                        🎉 Preparation Inventory
                      </a>
                    </li>
                    <li>
                      <a href="/admin/payments" className="flex items-center gap-3 hover:bg-gray-700 p-2 rounded-md">
                        💳 Payment Management
                      </a>
                    </li>
                    <li>
                      <a href="/manage-packages" className="flex items-center gap-3 hover:bg-gray-700 p-2 rounded-md">
                        🎁 Manage Packages
                      </a>
                    </li>
                    <li>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 bg-red-600 hover:bg-red-700 p-2 rounded-md mt-6"
                      >
                        🚪 Logout
                      </button>
                    </li>
                  </ul>
                </aside>
              )}

              <main className="flex-1 p-8">
                <Routes>
                  <Route
                    path="/main-inventory"
                    element={
                      <PrivateRoute>
                        <>
                          <nav className="pt-8">
                            <h1 className="text-5xl text-center pb-8">Bevanda Inventory</h1>
                          </nav>
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
  <div className="bg-white p-4 rounded-lg shadow hover:shadow-md transition">
    <h3 className="text-gray-500 text-sm">Total Items</h3>
    <p className="text-2xl font-semibold text-indigo-600">{todos.length}</p>
  </div>
  <div className="bg-white p-4 rounded-lg shadow hover:shadow-md transition">
    <h3 className="text-gray-500 text-sm">Total Quantity</h3>
    <p className="text-2xl font-semibold text-indigo-600">
      {todos.reduce((acc, item) => acc + parseInt(item.quantity), 0)}
    </p>
  </div>
  <div className="bg-white p-4 rounded-lg shadow hover:shadow-md transition">
    <h3 className="text-gray-500 text-sm">Beverages</h3>
    <p className="text-2xl font-semibold text-indigo-600">
      {todos.filter(item => item.type === "Beverage").length}
    </p>
  </div>
  <div className="bg-white p-4 rounded-lg shadow hover:shadow-md transition">
    <h3 className="text-gray-500 text-sm">Fruits</h3>
    <p className="text-2xl font-semibold text-indigo-600">
      {todos.filter(item => item.type === "Fruits").length}
    </p>
  </div>
  <div className="bg-white p-4 rounded-lg shadow hover:shadow-md transition">
    <h3 className="text-gray-500 text-sm">Non-Perishable Items</h3>
    <p className="text-2xl font-semibold text-indigo-600">
      {todos.filter(item => item.type === "Non-Perishable Item").length}
    </p>
  </div>
</div>
                          <TodoForm setTodos={setTodos} todos={todos} />
                          <Table todos={todos} setTodos={setTodos} isLoading={isLoading} />
                        </>
                      </PrivateRoute>
                    }
                  />
                  <Route path="/transaction" element={<PrivateRoute><Transaction /></PrivateRoute>} />
                  <Route path="/edit" element={<PrivateRoute><Edit /></PrivateRoute>} />
                  <Route path="/stock-in" element={<PrivateRoute><Stockin /></PrivateRoute>} />
                  <Route path="/stock-out" element={<PrivateRoute><Stockout /></PrivateRoute>} />
                  <Route path="/stock-out-event" element={<PrivateRoute><StockOutEvent /></PrivateRoute>} />
                  <Route path="/stock-in-return" element={<PrivateRoute><StockInReturn /></PrivateRoute>} />
                  <Route path="/admin/*" element={<PrivateRoute><BookPage /></PrivateRoute>} />
                  <Route path="/manage-packages" element={<PrivateRoute><ManagePackages /></PrivateRoute>} />
                </Routes>
              </main>
            </div>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
