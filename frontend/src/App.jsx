import { useState, useEffect } from 'react'
import Transaction from './Transaction';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import './App.css'
import Table from './components/Table'
import TodoForm from './components/TodoForm'
import axios from 'axios'

function App() {

  const [todos, setTodos] = useState([]); // Use an empty array

  const [isLoading, setisLoading] = useState(true)

  useEffect(() => {
    fetchData()
    console.log(todos);
  }, [])


  const fetchData = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/todo/");
      setTodos(response.data);

      setisLoading(false)                    
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <Router>
    <div className="flex min-h-screen bg-indigo-100">
      {/* Sidebar */}
      <aside className="w-1/4 bg-gray-900 text-white p-4">
        <h2 className="text-2xl font-bold mb-6">Welcome, Admin!</h2>
        <ul className="space-y-4">
          <li className="font-semibold">Dashboard</li>
          <li className="font-semibold">Ingredient List</li>
          <li>
            <details className="cursor-pointer">
              <summary className="font-semibold">Inventory</summary>
              <ul className="ml-4 mt-2 space-y-2">
                <Link to="/transaction" className="hover:underline">Stock-in/Stock-out</Link>
                <li>Transfer</li>
              </ul>
            </details>
          </li>
          <li>
            <details className="cursor-pointer">
              <summary className="font-semibold">Preparation Inventory</summary>
              <ul className="ml-4 mt-2 space-y-2">
                <li>01/23/2024</li>
                <li>02/04/2024</li>
                <li>03/13/2024</li>
                <li>04/28/2024</li>
                <li>05/23/2024</li>
              </ul>
            </details>
          </li>
        </ul>
      </aside>

           {/* Main Content */}
           <main className="w-3/4 p-8">
                    <Routes>
                        {/* Dashboard Route */}
                        <Route
                            path="/"
                            element={
                                <>
                                    <nav className="pt-8">
                                        <h1 className="text-5xl text-center pb-8">Bevanda Inventory</h1>
                                    </nav>
                                    <TodoForm setTodos={setTodos} todos={todos} fetchData={fetchData} />
                                    <Table todos={todos} setTodos={setTodos} isLoading={isLoading} />
                                </>
                            }
                        />

                        {/* Transaction Route */}
                        <Route path="/transaction" element={<Transaction />} />
                    </Routes>
                </main>
            </div>
        </Router>
  );
}

export default App























