import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import axios from "axios";

function StockOut() {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");  // Added search query for global filter
  const [filterDate, setFilterDate] = useState("");  // 🆕 Filter by event date

  const navigate = useNavigate();

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/transactions/");

      // Filter only Stock-Out transactions
      const stockOutTransactions = response.data.filter(
        (transaction) => transaction.action === "Stock-Out"
      );

      setTransactions(stockOutTransactions);
      setFilteredTransactions(stockOutTransactions);  // Set initial filtered data
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  // Global search filter function
  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    const filtered = transactions.filter(transaction =>
      Object.values(transaction).some(value =>
        String(value).toLowerCase().includes(query)
      )
    );

    setFilteredTransactions(filtered);
  };

  useEffect(() => {
    const filtered = transactions.filter(transaction => {
      const matchesSearch = Object.values(transaction).some(value =>
        String(value).toLowerCase().includes(searchQuery)
      );
  
      const matchesDate = !filterDate || transaction.transaction_date === filterDate;
  
      return matchesSearch && matchesDate;
    });
  
    setFilteredTransactions(filtered);
  }, [filterDate, transactions, searchQuery]);
  

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-4xl font-bold mb-6 text-gray-800">Preparation Inventory</h1>

        {/* Global Search Input */}
        <div className="mb-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
  {/* Search Input */}
  <input
    type="text"
    className="border border-gray-300 rounded px-4 py-2 w-full md:w-1/2"
    placeholder="Search by any field..."
    value={searchQuery}
    onChange={handleSearch}
  />

  {/* Event Date Filter */}
  <input
    type="date"
    className="border border-gray-300 rounded px-4 py-2 w-full md:w-1/3"
    value={filterDate}
    onChange={(e) => setFilterDate(e.target.value)}
    placeholder="Filter by event date"
  />
   <button
    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 w-full sm:w-auto mt-1"
    onClick={() => {
      setSelectedDate("");
      setFilteredTransactions(transactions);
    }}
  >
    Reset
  </button>
</div>

        {isLoading ? (
          <p>Loading transactions...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="table-auto w-full border-separate border-spacing-0 bg-white shadow-md rounded border border-gray-300">
              <thead>
                <tr className="bg-gray-900 text-white">
                  
                  <th className=  "border border-gray-300 px-4 py-3 text-center">Product</th>
                  <th className="border border-gray-300 px-4 py-3 text-center">Type</th>
                  <th className="border border-gray-300 px-4 py-3 text-center">Volume</th>
                  <th className="border border-gray-300 px-4 py-3 text-center">Stock-Out</th>
                  
                  <th className="border border-gray-300 px-4 py-3 text-center">Previous Quantity</th>
                  <th className="border border-gray-300 px-4 py-3 text-center">Quantity</th>
                  
                  <th className="border border-gray-300 px-4 py-3 text-center">Timestamp</th>
                  <th className="border border-gray-300 px-4 py-3 text-center">Event Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map((transaction) => (
                  <tr key={transaction.id} className="hover:bg-gray-100 transition">
                    
                    <td className="border border-gray-300 px-4 py-2 text-center">{transaction.item_name}</td>
                    <td className="border border-gray-300 px-4 py-2 text-center">{transaction.type}</td>
                    <td className="border border-gray-300 px-4 py-2 text-center">{transaction.volume}</td>
                  
                    <td className="border border-gray-300 px-4 py-2 text-center font-bold">{transaction.stock_out_quantity}</td>
                  
                    <td className="border border-gray-300 px-4 py-2 text-center">{transaction.previous_quantity}</td>
                    <td className="border border-gray-300 px-4 py-2 text-center">{transaction.quantity}</td>
                    
                    <td className="border border-gray-300 px-4 py-2 text-center">
                      {new Date(transaction.timestamp).toLocaleString()}
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-center">
  {transaction.transaction_date ? new Date(transaction.transaction_date).toLocaleDateString() : "N/A"}
</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default StockOut;
