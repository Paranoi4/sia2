import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import axios from "axios";
import Login from "./Login";
import Expenses from "./Expenses";
import Transaction from "./Transaction";
import Edit from "./Edit";
import Stockin from "./Stockin";
import Stockout from "./Stockout";
import StockOutEvent from "./StockOutEvent";

import Table from "./components/Table";
import TodoForm from "./components/TodoForm";
import LandingPage from "./LandingPage";
import BookPage from "./BookPage";
import ManagePackages from "./components/Admin/ManagePackages";
import logo from "./assets/logo.jpg";
import ManageUnavailableDates from "./components/Admin/ManageUnavailableDates";
import POS from "./POS";
import { FaListUl, FaPlusCircle, FaChartBar } from "react-icons/fa";
import {
  FaHome,
  FaBox,
  FaHistory,
  FaCalendarAlt,
  FaGift,
  FaPowerOff,
  FaAppleAlt,
  FaCocktail,
  FaCubes,
  FaArchive,
  FaCreditCard,
  FaRegCalendarMinus,
  FaTruckLoading,
  FaUndoAlt,
  FaCashRegister,
} from 'react-icons/fa';

import { NavLink } from "react-router-dom";




function App() {
  const [todos, setTodos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(() => !!localStorage.getItem("access"));
  const [openTransaction, setOpenTransaction] = useState(false);
  const [openPreparation, setOpenPreparation] = useState(false);
  const [openBooking, setOpenBooking] = useState(false);
  const [openPOS, setOpenPOS] = useState(false);
  

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get("http://192.168.254.154:8000/api/todo/");
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
     

      <li>
        <NavLink
  to="/main-inventory"
  className={({ isActive }) =>
    `flex items-center justify-between w-full gap-3 ${
      isActive ? "bg-indigo-600 text-white" : "bg-blue-600 text-white hover:bg-blue-700"
    } p-2 rounded-md`
  }
>
  <span className="flex items-center gap-3"><FaBox className="text-white" />
  Main Inventory</span>
  
</NavLink>

      </li>

      <li>
        <button
          onClick={() => setOpenPOS(!openPOS)}
          className={`flex items-center justify-between w-full gap-3 ${
            openPOS ? "bg-indigo-600 text-white" : "bg-blue-600 text-white hover:bg-blue-700"
          } p-2 rounded-md`}
        >
          <span className="flex items-center gap-3"><FaCashRegister className="text-white" />
          POS</span>
          <span className="text-white">›</span>
        </button>
        {openPOS && (
          <ul className="pl-4 pt-1 space-y-0.5 text-sm">
          
               <li>
              <NavLink to="/pos?view=cashier" className="flex items-center gap-2 px-3 py-2 rounded-md text-gray-400 hover:bg-gray-700 hover:text-white transition">
                <FaCashRegister className="text-gray-400" />
                Cashier
              </NavLink>
            </li>
              <li>
              <NavLink to="/expenses" className={({ isActive }) => `flex items-center gap-2 px-3 py-2 rounded-md text-gray-400 hover:bg-gray-700 hover:text-white transition ${isActive ? 'bg-indigo-600 text-white' : ''}`}>
                <FaHistory className="text-gray-400" />
                Expenses
              </NavLink>
               </li>
            <li>
              <NavLink to="/pos?view=history" className="flex items-center gap-2 px-3 py-2 rounded-md text-gray-400 hover:bg-gray-700 hover:text-white transition">
                <FaHistory className="text-gray-400" />
                Sales History
              </NavLink>
            </li>
            <li>
              <NavLink to="/pos?view=items" className="flex items-center gap-2 px-3 py-2 rounded-md text-gray-400 hover:bg-gray-700 hover:text-white transition">
                <FaListUl className="text-gray-400" />
                All POS Items
              </NavLink>
            </li>
            <li>
              <NavLink to="/pos?view=create" className="flex items-center gap-2 px-3 py-2 rounded-md text-gray-400 hover:bg-gray-700 hover:text-white transition">
                <FaPlusCircle className="text-gray-400" />
                Create Item
              </NavLink>
            </li>
            <li>
              <NavLink to="/pos?view=summary" className="flex items-center gap-2 px-3 py-2 rounded-md text-gray-400 hover:bg-gray-700 hover:text-white transition">
                <FaChartBar className="text-gray-400" />
                Daily Summary
              </NavLink>
            </li>
          </ul>
        )}
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
  <span className="flex items-center gap-3"><FaHistory className="text-white" />
  Transaction History</span>
  <span className="text-white">›</span>
</button>


  {openTransaction && (
    <ul className="pl-6 pt-2 space-y-2 text-sm text-gray-300">
      <li>
      <NavLink
  to="/transaction"
  className={({ isActive }) =>
    `flex items-center gap-3 p-2 rounded-md ${isActive ? "bg-indigo-600 text-white" : "hover:bg-gray-700 text-gray-300"}`
  }
>
  <FaTruckLoading className="text-white" />
  Stock-In
</NavLink>

      </li>
      <li>
        <NavLink to="/stock-out-event" className={({ isActive }) =>
            `flex items-center gap-3 p-2 rounded-md ${isActive ? "bg-indigo-600 text-white" : "hover:bg-gray-700 text-gray-300"}`}>
        <FaBox className="text-white" />
        Stock-Out Event</NavLink>
      </li>
      <li>
        <NavLink to="/stock-out" className={({ isActive }) => `flex items-center gap-3 p-2 rounded-md ${isActive ? "bg-indigo-600 text-white" : "hover:bg-gray-700 text-gray-300"}`}>
          <FaBox className="text-white" />
          Inventory Stock Out
        </NavLink>
      </li>
      <li>
        <NavLink to="/edit" className={({ isActive }) =>  `flex items-center gap-3 p-2 rounded-md ${isActive ? "bg-indigo-600 text-white" : "hover:bg-gray-700 text-gray-300"}`}><FaHistory className="text-white" />
        Product History</NavLink>
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
              <NavLink to="/manage-packages" className={({ isActive }) => `flex items-center gap-3 p-2 rounded-md ${isActive ? "bg-indigo-600 text-white" : "hover:bg-gray-700 text-gray-300"}`}><FaRegCalendarMinus className="text-white" />
              Manage Packages</NavLink>
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
                  <Route
                    path="/main-inventory"
                    element={
                      <PrivateRoute>
                        <>
                          <nav className="pt-8">
                            <h1 className="text-5xl text-center pb-8 text-gray-800 font-bold">Bevanda Inventory</h1>
                          </nav>
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                          <div className="bg-[#0F1626] p-4 rounded-lg flex items-center gap-4 w-full max-w-[280px]">
  <FaCubes className="text-white text-3xl" />
  <div>
    <h3 className="text-white text-sm">Total Items</h3>
    <p className="text-2xl font-semibold text-white">{todos.length}</p>
  </div>
</div>

<div className="bg-[#0F1626] p-4 rounded-lg flex items-center gap-4 w-full max-w-[280px]">
    <FaBox className="text-white text-3xl" />
    <div>
      <h3 className="text-white text-sm">Total Quantity</h3>
      <p className="text-white text-2xl font-semibold">
        {todos.reduce((acc, item) => acc + parseInt(item.quantity), 0)}
      </p>
    </div>
  </div>
      {/* Dynamically render a card for each unique type */}
      {Array.from(new Set(todos.map(item => item.type)))
        .filter(type => type && type.trim() !== "")
        .map((type, idx) => (
          <div key={type} className="bg-[#0F1626] p-4 rounded-lg flex items-center gap-4 w-full max-w-[280px]">
            {/* Optionally, you can use different icons based on type, or use a default icon */}
            <FaBox className="text-white text-3xl" />
            <div>
              <h3 className="text-white text-sm">{type}</h3>
              <p className="text-2xl font-semibold text-white">{todos.filter(item => item.type === type).length}</p>
            </div>
          </div>
        ))}
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

                  <Route path="/pos" element={<PrivateRoute><POS /></PrivateRoute>} />
                  <Route path="/expenses" element={<PrivateRoute><Expenses /></PrivateRoute>} />
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
