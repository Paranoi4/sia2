import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import './App.css';
import Transaction from './Transaction';
import Edit from './Edit';
import Table from './components/Table';
import TodoForm from './components/TodoForm';
import Preparation from './Preparation';
import axios from 'axios';

// ✅ Move PreparationPage Above App()
const PreparationPage = ({ date }) => {
  return (
    <div>
      <h1 className="text-4xl font-bold mb-4">Preparation Inventory for {date}</h1>
      <p>This is a new page for inventory management on {date}.</p>
    </div>
  );
};

function App() {
  const [todos, setTodos] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [createdDates, setCreatedDates] = useState([]);
  const [isLoading, setisLoading] = useState(true);

  // ✅ Load Created Dates from Local Storage
  useEffect(() => {
    const savedDates = localStorage.getItem("createdDates");
    if (savedDates) {
      try {
        setCreatedDates(JSON.parse(savedDates));
      } catch (error) {
        console.error("Error loading saved dates:", error);
        setCreatedDates([]);
      }
    }
    fetchData();
  }, []);
  
  


  // ✅ Save Created Dates to Local Storage when it changes
  useEffect(() => {
    if (createdDates.length > 0) {
      localStorage.setItem("createdDates", JSON.stringify(createdDates));
    }
  }, [createdDates]);
  


  const fetchData = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/todo/");
      setTodos(response.data);
      setisLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

   // ✅ Save Created Date to State & Local Storage
   const handleCreateDate = () => {
    if (!selectedDate) {
      alert("Please select a date!");
      return;
    }
  
    if (createdDates.includes(selectedDate)) {
      alert("This date already exists!");
      return;
    }
  
    const formattedDate = selectedDate.replaceAll("/", "-"); // Ensure correct format
    const updatedDates = [...createdDates, formattedDate];
    setCreatedDates(updatedDates);
    localStorage.setItem("createdDates", JSON.stringify(updatedDates));
  };
  
  

  // ✅ Allow Users to Delete a Created Date
  const handleDeleteDate = (dateToDelete) => {
    const updatedDates = createdDates.filter(date => date !== dateToDelete);
    setCreatedDates(updatedDates);
    localStorage.setItem("createdDates", JSON.stringify(updatedDates)); // ✅ Update Local Storage
  };

  return (
    <Router>
      <div className="flex min-h-screen bg-indigo-100">
        {/* Sidebar */}
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
            <li>
            <details className="cursor-pointer">
                <summary className="font-semibold">Preparation Inventory</summary>
                <ul className="ml-4 mt-2 space-y-2">
                  {/* ✅ Step 3: Allow Date Selection */}
                  <li>
                    <input
                      type="date"
                      className="input input-bordered text-black p-2 w-full"
                      value={selectedDate}
                      onChange={handleDateChange}
                    />
                  </li>
                  {/* ✅ Step 4: Create a Page for the Selected Date */}
                  <li>
                    <button className="btn btn-primary mt-2" onClick={handleCreateDate}>
                      Create New Date Page
                    </button>
                  </li>
                  {/* ✅ Step 5: Show Created Dates as Links */}
                  {createdDates.length > 0 && (
  <ul className="ml-4 mt-2 space-y-2">
    {createdDates.map((date, index) => (
      <li key={index} className="flex justify-between items-center">
        <Link to={`/preparation/${encodeURIComponent(date)}`} className="hover:underline">{date}</Link>
        <button 
          className="ml-2 text-red-500 hover:text-red-700"
          onClick={() => handleDeleteDate(date)}
        >
                            ❌
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
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
              path="/main-inventory"
              element={
                <>
                  <nav className="pt-8">
                    <h1 className="text-5xl text-center pb-8">Bevanda Inventory</h1>
                  </nav>
                  <TodoForm setTodos={setTodos} todos={todos} />

                  {/* <TodoForm setTodos={setTodos} todos={todos} fetchData={fetchData} /> */}
                  <Table todos={todos} setTodos={setTodos} isLoading={isLoading} createdDates={createdDates} />

                </>
              }
            />

{/* ✅ Dynamic Routes for Each Created Date (No Duplicate Mapping) */}
{createdDates.map((date, index) => (
  <Route 
  key={index} 
  path={`/preparation/${encodeURIComponent(date)}`}
  element={<Preparation selectedDate={date} />} />
))}
            <Route path="/transaction" element={<Transaction />} />
            <Route path="/edit" element={<Edit />} />
            <Route path="/preparation" element={<Preparation />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
