import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import './App.css';
import Transaction from './Transaction';
import Edit from './Edit';
import Table from './components/Table';
import TodoForm from './components/TodoForm';
import axios from 'axios';

function App() {
  const [todos, setTodos] = useState([]);
  const [isLoading, setisLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);
  
  const fetchData = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/todo/");
      setTodos(response.data);
      setisLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Router>
      <div className="flex min-h-screen bg-indigo-100">
        <aside className="w-1/4 bg-gray-900 text-white p-4">
          <h2 className="text-2xl font-bold mb-6">Welcome, Admin!</h2>
          <ul className="space-y-4">
            <li className="font-semibold">
              <Link to="/" className="hover:underline">Dashboard</Link>
            </li>
            <li className="font-semibold">
              <Link to="/ingredient-list" className="hover:underline">Ingredient List</Link>
            </li>
            <li>
              <details className="cursor-pointer">
                <summary className="font-semibold">Inventory</summary>
                <ul className="ml-4 mt-2 space-y-2">
                  <li>
                    <Link to="/main-inventory" className="hover:underline">Main Inventory</Link>
                  </li>
                  <li>
                    <Link to="/transaction" className="hover:underline">Stock-in/Stock-out</Link>
                  </li>
                </ul>
                <ul className="ml-4 mt-2 space-y-2">
                  <li>
                    <Link to="/edit" className="hover:underline">Product History</Link>
                  </li>
                </ul>
              </details>
            </li>
          </ul>
        </aside>

        <main className="w-3/4 p-8">
          <Routes>
            <Route path="/main-inventory"
              element={
                <>
                  <nav className="pt-8">
                    <h1 className="text-5xl text-center pb-8">Bevanda Inventory</h1>
                  </nav>
                  <TodoForm setTodos={setTodos} todos={todos} />
                  <Table todos={todos} setTodos={setTodos} isLoading={isLoading} />
                </>
              }
            />
            <Route path="/transaction" element={<Transaction />} />
            <Route path="/edit" element={<Edit />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
