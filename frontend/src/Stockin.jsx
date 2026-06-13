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
    filterByDate();
  }, [selectedDate]);

  const fetchTransactions = async () => {
    try {
      const response = await axios.get("http://192.168.254.154:8000/api/transactions/");
      const stockInTransactions = response.data.filter(
        (transaction) => transaction.action === "Stock-In"
      );
      setTransactions(stockInTransactions);
      setFilteredTransactions(stockInTransactions);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  const filterByDate = () => {
    if (!selectedDate) {
      setFilteredTransactions(transactions);
      return;
    }

    const filtered = transactions.filter((transaction) => {
      const transactionDate = new Date(transaction.timestamp).toISOString().split("T")[0];
      return transactionDate === selectedDate;
    });

    setFilteredTransactions(filtered);
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-4xl font-bold mb-6 text-gray-800">Stock-In Transactions</h1>

        <div className="mb-6 flex gap-4 items-center">
          <div>
            <label className="block text-gray-700 mb-1 font-semibold">Select Date:</label>
            <input
              type="date"
              className="border border-gray-300 rounded px-3 py-2 w-full text-black"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </div>
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 transition"
            onClick={() => {
              setSelectedDate("");
              setFilteredTransactions(transactions);
            }}
          >
            Reset
          </button>
        </div>

        {isLoading ? (
          <p className="text-center text-gray-600">Loading transactions...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="table-auto w-full border-collapse bg-white shadow-md rounded">
              <thead>
                <tr className="bg-blue-600 text-white">
                  <th className="px-4 py-3 text-left">Action</th>
                  <th className="px-4 py-3 text-left">Product</th>
                  <th className="px-4 py-3 text-left">Quantity</th>
                  <th className="px-4 py-3 text-left">Previous Quantity</th>
                  <th className="px-4 py-3 text-left">Stock-In</th>
                  <th className="px-4 py-3 text-left">Type</th>
                  <th className="px-4 py-3 text-left">Volume</th>
                  <th className="px-4 py-3 text-left">Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map((transaction) => (
                  <tr key={transaction.id} className="border-b hover:bg-gray-100 transition text-gray-900">
                    <td className="px-4 py-2">{transaction.action}</td>
                    <td className="px-4 py-2">{transaction.item_name}</td>
                    <td className="px-4 py-2">{transaction.quantity}</td>
                    <td className="px-4 py-2">{transaction.previous_quantity}</td>
                    <td className="px-4 py-2">{transaction.stock_in_quantity}</td>
                    <td className="px-4 py-2">{transaction.type}</td>
                    <td className="px-4 py-2">{transaction.volume}</td>
                    <td className="px-4 py-2">{new Date(transaction.timestamp).toLocaleString()}</td>
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

export default StockIn;
