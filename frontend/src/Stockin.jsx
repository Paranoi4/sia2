import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import axios from "axios";

function StockIn() {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchTransactions();
  }, []);

  useEffect(() => {
    filterByDate(); // Automatically filter when selectedDate changes
  }, [selectedDate]);

  const fetchTransactions = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/transactions/");

      // Filter only Stock-In transactions
      const stockInTransactions = response.data.filter(
        (transaction) => transaction.action === "Stock-In"
      );

      setTransactions(stockInTransactions);
      setFilteredTransactions(stockInTransactions); // Set initial filtered data
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  // Function to filter transactions by the selected date
  const filterByDate = () => {
    if (!selectedDate) {
      setFilteredTransactions(transactions); // Reset if no date is selected
      return;
    }

    const filtered = transactions.filter((transaction) => {
      const transactionDate = new Date(transaction.timestamp).toISOString().split("T")[0];
      return transactionDate === selectedDate; // Compare only the date part
    });

    setFilteredTransactions(filtered);
  };

  return (
    <div>
      <h1 className="text-4xl font-bold mb-4">Stock-In Transactions</h1>

      {/* Date Filter Input */}
      <div className="mb-4 flex gap-4">
        <div>
          <label className="block text-gray-700">Select Date:</label>
          <input
            type="date"
            className="border px-2 py-1"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </div>
        <button
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-700"
          onClick={() => {
            setSelectedDate("");
            setFilteredTransactions(transactions);
          }}
        >
          Reset
        </button>
      </div>

      {/* Transactions Table */}
      {isLoading ? (
        <p>Loading transactions...</p>
      ) : (
        <table className="table-auto w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-gray-300 px-4 py-2">Action</th>
              <th className="border border-gray-300 px-4 py-2">Product</th>
              <th className="border border-gray-300 px-4 py-2">Quantity</th>
              <th className="border border-gray-300 px-4 py-2">Previous Quantity</th>
              <th className="border border-gray-300 px-4 py-2">Stock-In</th>
              <th className="border border-gray-300 px-4 py-2">Type</th>
              <th className="border border-gray-300 px-4 py-2">Volume</th>
              <th className="border border-gray-300 px-4 py-2">Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.map((transaction) => (
              <tr key={transaction.id} className="hover:bg-gray-100">
                <td className="border border-gray-300 px-4 py-2">{transaction.action}</td>
                <td className="border border-gray-300 px-4 py-2">{transaction.item_name}</td>
                <td className="border border-gray-300 px-4 py-2">{transaction.quantity}</td>
                <td className="border border-gray-300 px-4 py-2">{transaction.previous_quantity}</td>
                <td className="border border-gray-300 px-4 py-2">{transaction.stock_in_quantity}</td>
                <td className="border border-gray-300 px-4 py-2">{transaction.type}</td>
                <td className="border border-gray-300 px-4 py-2">{transaction.volume}</td>
                <td className="border border-gray-300 px-4 py-2">
                  {new Date(transaction.timestamp).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default StockIn;
