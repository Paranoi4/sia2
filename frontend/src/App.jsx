import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import axios from "axios";
import Login from "./Login";

import Table from "./components/Table";
import TodoForm from "./components/TodoForm";
import LandingPage from "./LandingPage";
import BookPage from "./BookPage";
import CourtBooking from "./components/CourtBooking";
import logo from "./assets/logo.jpg";
import ManageUnavailableDates from "./components/Admin/ManageUnavailableDates";
import {
  FaHome,
  FaBox,
  FaCalendarAlt,
  FaPowerOff,
  FaAppleAlt,
  FaCocktail,
  FaCubes,
  FaArchive,
  FaCreditCard,
} from 'react-icons/fa';

import { NavLink } from "react-router-dom";




function App() {
  const [todos, setTodos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

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
        <Route path="/" element={<CourtBooking />} />
        <Route path="/first/*" element={<BookPage />} />
        <Route path="/landing-page" element={<LandingPage />} />
        <Route path="/login" element={isAuthenticated ? <Navigate to="/" /> : <Login />} />

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
    className="w-24 h-24 rounded-full border-4 border-white shadow-md object-cover mb-3"
  />
  <h2 className="text-2xl font-bold text-white">Bevanda</h2>

  <p className="text-sm text-gray-400">Admin Panel</p>

</div>
<hr className="my-6 border-t border-gray-600 opacity-50" />

<ul className="space-y-4 text-sm font-medium">
  {/* 🏠 Dashboard */}
  <li className="relative -top-1">
  <NavLink
  to="/landing-page"
  className={({ isActive }) =>
    `flex items-center justify-between w-full gap-3 ${
      isActive ? "bg-indigo-600 text-white" : "bg-blue-600 text-white hover:bg-blue-700"
    } p-2 rounded-md`
  }
>
<span className="flex items-center gap-3">
  <FaHome className="text-white text-xl" />
  Dashboard
</span>

  

</NavLink>

  </li>

  {/* ✅ Inventory-only and Admin Shared Section */}
  {(isInventoryOnly || isSuperUser) && (
    <>
     






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
  <span className="flex items-center gap-3"><FaCalendarAlt className="text-white" />
  Booking Management</span>
  <span className="text-white">›</span>
</button>

        {openBooking && (
          <ul className="pl-6 pt-2 space-y-2 text-sm text-gray-300">
            <li>
              <NavLink to="/admin/payments" className={({ isActive }) => `flex items-center gap-3 p-2 rounded-md ${isActive ? "bg-indigo-600 text-white" : "hover:bg-gray-700 text-gray-300"}`}><FaCreditCard className="text-white" />
              Payment Management</NavLink>
            </li>
            <li>
              <NavLink to="/unavailable" className={({ isActive }) => `flex items-center gap-3 p-2 rounded-md ${isActive ? "bg-indigo-600 text-white" : "hover:bg-gray-700 text-gray-300"}`}><FaPowerOff className="text-white" />
              Manage Unavailable Dates</NavLink>
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
      <FaPowerOff className="text-white" />
      Logout
    </button>
  </li>
</ul>

                </aside>
              )}

              <main className="flex-1 p-8">
                <Routes>


                  <Route path="/admin/*" element={<PrivateRoute><BookPage /></PrivateRoute>} />
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
