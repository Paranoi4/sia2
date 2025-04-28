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
import ManageUnavailableDates from "./components/Admin/ManageUnavailableDates";
import { FaBox, FaCubes, FaCocktail, FaAppleAlt, FaArchive } from 'react-icons/fa';
import { NavLink } from "react-router-dom";




function App() {
  const [todos, setTodos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [openTransaction, setOpenTransaction] = useState(false);
  const [openPreparation, setOpenPreparation] = useState(false);
  const [openBooking, setOpenBooking] = useState(false);
  

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

  const groups = JSON.parse(localStorage.getItem("groups") || "[]");
  const isInventoryOnly = groups.includes("inventory_only");
  const isSuperUser = groups.includes("admin") || groups.length === 0;


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
<hr className="my-6 border-t border-gray-600 opacity-50" />

<ul className="space-y-4 text-sm font-medium">
  {/* 🏠 Dashboard */}
  <li>
  <NavLink
  to="/landing-page"
  className={({ isActive }) =>
    `flex items-center justify-between w-full gap-3 ${
      isActive ? "bg-indigo-600 text-white" : "bg-blue-600 text-white hover:bg-blue-700"
    } p-2 rounded-md`
  }
>
  <span className="flex items-center gap-3">🏠 Dashboard</span>

</NavLink>

  </li>

  {/* ✅ Inventory-only and Admin Shared Section */}
  {(isInventoryOnly || isSuperUser) && (
    <>
     

      <li>
        <NavLink
  to="/main-inventory"
  className={({ isActive }) =>
    `flex items-center justify-between w-full gap-3 ${
      isActive ? "bg-indigo-600 text-white" : "bg-blue-600 text-white hover:bg-blue-700"
    } p-2 rounded-md`
  }
>
  <span className="flex items-center gap-3">📦 Main Inventory</span>
  
</NavLink>

      </li>

      {/* 📂 Transaction History */}
      <li>
      <button
  onClick={() => setOpenTransaction(!openTransaction)}
  className={`flex items-center justify-between w-full gap-3 ${
    openTransaction
      ? "bg-indigo-600 text-white"
      : "bg-blue-600 text-white hover:bg-blue-700"
  } p-2 rounded-md`}
>
  <span className="flex items-center gap-3">📂 Transaction History</span>
  <span className="text-white">›</span>
</button>


  {openTransaction && (
    <ul className="pl-6 pt-2 space-y-2 text-sm text-gray-300">
      <li>
        <NavLink to="/transaction" className={({ isActive }) => `block p-2 rounded-md ${isActive ? "bg-indigo-600 text-white" : "hover:bg-gray-700 text-gray-300"}`}>➕ Stock-In</NavLink>
      </li>
      <li>
        <NavLink to="/stock-out-event" className={({ isActive }) => `block p-2 rounded-md ${isActive ? "bg-indigo-600 text-white" : "hover:bg-gray-700 text-gray-300"}`}>➖ Stock-Out</NavLink>
      </li>
      <li>
        <NavLink to="/edit" className={({ isActive }) => `block p-2 rounded-md ${isActive ? "bg-indigo-600 text-white" : "hover:bg-gray-700 text-gray-300"}`}>📜 Product History</NavLink>
      </li>
    </ul>
  )}
</li>

      {/* 🎉 Preparation Inventory */}
      <li>
      <button
  onClick={() => setOpenPreparation(!openPreparation)}
  className={`flex items-center justify-between w-full gap-3 ${
    openPreparation
      ? "bg-indigo-600 text-white"
      : "bg-blue-600 text-white hover:bg-blue-700"
  } p-2 rounded-md`}
>
  <span className="flex items-center gap-3">🎉 Preparation Inventory</span>
  <span className="text-white">›</span>
</button>

        {openPreparation && (
          <ul className="pl-6 pt-2 space-y-2 text-sm text-gray-300">
            <li>
              <NavLink to="/stock-out" className={({ isActive }) => `flex items-center gap-3 p-2 rounded-md ${isActive ? "bg-indigo-600 text-white" : "hover:bg-gray-700 text-gray-300"}`}>🎯 Stock-Out Event</NavLink>
            </li>
            <li>
              <NavLink to="/stock-in-return" className={({ isActive }) => `flex items-center gap-3 p-2 rounded-md ${isActive ? "bg-indigo-600 text-white" : "hover:bg-gray-700 text-gray-300"}`}>🔁 Stock-In Return</NavLink>
            </li>
          </ul>
        )}
      </li>
    </>
  )}

  {/* 📅 Booking Management */}
  {isSuperUser && (
    <>
      

      <li>
      <button
  onClick={() => setOpenBooking(!openBooking)}
  className={`flex items-center justify-between w-full gap-3 ${
    openBooking
      ? "bg-indigo-600 text-white"
      : "bg-blue-600 text-white hover:bg-blue-700"
  } p-2 rounded-md`}
>
  <span className="flex items-center gap-3">📅 Booking Management</span>
  <span className="text-white">›</span>
</button>

        {openBooking && (
          <ul className="pl-6 pt-2 space-y-2 text-sm text-gray-300">
            <li>
              <NavLink to="/admin/payments" className={({ isActive }) => `flex items-center gap-3 p-2 rounded-md ${isActive ? "bg-indigo-600 text-white" : "hover:bg-gray-700 text-gray-300"}`}>💳 Payment Management</NavLink>
            </li>
            <li>
              <NavLink to="/manage-packages" className={({ isActive }) => `flex items-center gap-3 p-2 rounded-md ${isActive ? "bg-indigo-600 text-white" : "hover:bg-gray-700 text-gray-300"}`}>🎁 Manage Packages</NavLink>
            </li>
            <li>
              <NavLink to="/unavailable" className={({ isActive }) => `flex items-center gap-3 p-2 rounded-md ${isActive ? "bg-indigo-600 text-white" : "hover:bg-gray-700 text-gray-300"}`}>📅 Manage Unavailable Dates</NavLink>
            </li>
          </ul>
        )}
      </li>
    </>
  )}

  {/* 🚪 Logout button */}
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
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
      <div className="bg-white p-4 rounded-lg shadow hover:shadow-md transition flex items-center gap-4 w-full max-w-[280px]">
        <FaBox className="text-blue-500 text-3xl" />
        <div>
          <h3 className="text-gray-500 text-sm">Total Items</h3>
          <p className="text-2xl font-semibold text-blue-700">{todos.length}</p>
        </div>
      </div>
      <div className="bg-white p-4 rounded-lg shadow hover:shadow-md transition flex items-center gap-4 w-full max-w-[280px]">
        <FaCubes className="text-green-500 text-3xl" />
        <div>
          <h3 className="text-gray-500 text-sm">Total Quantity</h3>
          <p className="text-2xl font-semibold text-green-700">{todos.reduce((acc, item) => acc + parseInt(item.quantity), 0)}</p>
        </div>
      </div>
      <div className="bg-white p-4 rounded-lg shadow hover:shadow-md transition flex items-center gap-4 w-full max-w-[280px]">
        <FaCocktail className="text-purple-500 text-3xl" />
        <div>
          <h3 className="text-gray-500 text-sm">Beverages</h3>
          <p className="text-2xl font-semibold text-purple-700">{todos.filter(item => item.type === "Beverage").length}</p>
        </div>
      </div>
      <div className="bg-white p-4 rounded-lg shadow hover:shadow-md transition flex items-center gap-4 w-full max-w-[280px]">
        <FaAppleAlt className="text-red-500 text-3xl" />
        <div>
          <h3 className="text-gray-500 text-sm">Fruits</h3>
          <p className="text-2xl font-semibold text-red-700">{todos.filter(item => item.type === "Fruits").length}</p>
        </div>
      </div>
      <div className="bg-white p-4 rounded-lg shadow hover:shadow-md transition flex items-center gap-4 w-full max-w-[280px]">
        <FaArchive className="text-yellow-500 text-3xl" />
        <div>
          <h3 className="text-gray-500 text-sm">Non-Perishable Items</h3>
          <p className="text-2xl font-semibold text-yellow-700">{todos.filter(item => item.type === "Non-Perishable Item").length}</p>
        </div>
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
                  <Route path="/unavailable" element={<PrivateRoute><ManageUnavailableDates /></PrivateRoute>} />
                  
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
