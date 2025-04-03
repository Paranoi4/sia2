import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Transaction() {

  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);  // Added useState for filtered transactions
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");  // Added useState for searchQuery
  const navigate = useNavigate();

  useEffect(() => {
    fetchTransactions();
  }, []);  

  const fetchTransactions = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/transactions/");
  
      const filteredTransactions = response.data.filter(transaction =>
        transaction.action === "Stock-In"  
      );
  
      setTransactions(filteredTransactions);
      setFilteredTransactions(filteredTransactions);  // Set filteredTransactions as the initial data
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
  
    const filtered = transactions.filter(transaction =>
      Object.values(transaction).some(value =>
        String(value).toLowerCase().includes(query)
      )
    );
  
    setFilteredTransactions(filtered);  // Update filtered transactions
  };
  

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto bg-white shadow-lg rounded-lg p-6">
          <h1 className="text-4xl font-bold mb-6 text-gray-800">Stock-In Transactions</h1>

          {/* Search Input */}
          <div className="mb-4">
            <input
              type="text"
              className="border border-gray-300 rounded px-4 py-2 w-full"
              placeholder="Search by any field..."
              value={searchQuery}
              onChange={handleSearch}
            />
          </div>
    
          {isLoading ? (
            <p>Loading transactions...</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="table-auto w-full border-separate border-spacing-0 bg-white shadow-md rounded border border-gray-300">
  <thead>
    <tr className="bg-gray-900 text-white">
      <th className="border border-gray-300 px-4 py-3 text-left">Action</th>
      <th className="border border-gray-300 px-4 py-3 text-left">Product</th>
      <th className="border border-gray-300 px-4 py-3 text-left">Quantity</th>
      <th className="border border-gray-300 px-4 py-3 text-left">Previous Quantity</th>
      <th className="border border-gray-300 px-4 py-3 text-left">Stock-In</th>
      <th className="border border-gray-300 px-4 py-3 text-left">Type</th>
      <th className="border border-gray-300 px-4 py-3 text-left">Volume</th>
      <th className="border border-gray-300 px-4 py-3 text-left">Timestamp</th>
    </tr>
  </thead>
  <tbody>
                  {filteredTransactions.map((transaction) => (
                    <tr key={transaction.id} className="hover:bg-gray-100 transition">
                      <td className="border border-gray-300 px-4 py-2 font-bold">{transaction.action}</td>
                      <td className="border border-gray-300 px-4 py-2">{transaction.item_name}</td>
                      <td className="border border-gray-300 px-4 py-2">{transaction.quantity}</td>
                      <td className="border border-gray-300 px-4 py-2">{transaction.previous_quantity}</td> 
                      <td className="border border-gray-300 px-4 py-2">{transaction.stock_in_quantity || "-"}</td>
                      <td className="border border-gray-300 px-4 py-2">{transaction.type}</td>
                      <td className="border border-gray-300 px-4 py-2">{transaction.volume}</td>
                      <td className="border border-gray-300 px-4 py-2">
                        {new Date(transaction.timestamp).toLocaleString()}
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

export default Transaction;
