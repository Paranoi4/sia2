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
        window.location.href = "/login";  // Redirect to login
    };

    return (
        <Router>
            <Routes>
                {/* Landing Page should be a separate full-screen route */}
                <Route path="/landing-page" element={<LandingPage />} />

                {/* Authenticated Routes with Sidebar and Layout */}
                <Route 
                    path="/*"
                    element={
                        <div className="flex min-h-screen bg-indigo-100">
                            {isAuthenticated && (
                                <aside className="w-1/4 bg-gray-900 text-white p-4">
                                    <h2 className="text-2xl font-bold mb-6">Welcome, Admin!</h2>
                                    <ul className="space-y-4">
                                        {/* Force a full page reload to redirect outside layout */}
                                        <li className="font-semibold">
                                            <a href="/landing-page">Dashboard</a>
                                        </li>
                                        <li className="font-semibold"><a href="/main-inventory">Main Inventory</a></li>
                                        <li className="font-semibold"><a href="/transaction">Stock-In</a></li>
                                        <li className="font-semibold"><a href="/stock-out">Stock-Out</a></li>
                                        <li className="font-semibold"><a href="/stock-in-return">Stock In Return</a></li>
                                        <li className="font-semibold"><a href="/stock-out-event">Preparation Inventory</a></li>
                                        <li className="font-semibold"><a href="/edit">Product History</a></li>
                                        <li className="font-semibold">
                                            <button onClick={handleLogout} className="bg-red-500 px-4 py-2 rounded-lg">
                                                Logout
                                            </button>
                                        </li>
                                    </ul>
                                </aside>
                            )}

                            <main className="w-3/4 p-8">
                                <Routes>
                                    <Route path="/login" element={isAuthenticated ? <Navigate to="/" /> : <Login />} />
                                    <Route path="/main-inventory" element={
                                        <>
                                            <nav className="pt-8">
                                                <h1 className="text-5xl text-center pb-8">Bevanda Inventory</h1>
                                            </nav>
                                            <TodoForm setTodos={setTodos} todos={todos} />
                                            <Table todos={todos} setTodos={setTodos} isLoading={isLoading} />
                                        </>
                                    }/>
                                    <Route path="/transaction" element={<Transaction />} />
                                    <Route path="/edit" element={<Edit />} />
                                    <Route path="/stock-in" element={<Stockin />} />
                                    <Route path="/stock-out" element={<Stockout />} />
                                    <Route path="/stock-out-event" element={<StockOutEvent />} />
                                    <Route path="/stock-in-return" element={<StockInReturn />} />
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
