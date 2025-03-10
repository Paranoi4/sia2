import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import axios from "axios";

function StockInReturn() {
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
      const response = await axios.get("http://127.0.0.1:8000/api/transactions/");

      // Filter only Stock-In-Return transactions
      const stockInReturnTransactions = response.data.filter(
        (transaction) => transaction.action === "Stock-In-Return"
      );

      setTransactions(stockInReturnTransactions);
      setFilteredTransactions(stockInReturnTransactions);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching return transactions:", error);
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
    <div>
      <h1 className="text-4xl font-bold mb-4">Stock-In Return Transactions</h1>

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

      <button onClick={() => navigate(-1)} className="mb-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700">
        Back
      </button>

      {isLoading ? (
        <p>Loading return transactions...</p>
      ) : (
        <table className="table-auto w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-gray-300 px-4 py-2">Action</th>
              <th className="border border-gray-300 px-4 py-2">Product</th>
              <th className="border border-gray-300 px-4 py-2">Returned Quantity</th>
              <th className="border border-gray-300 px-4 py-2">Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.map((transaction) => (
              <tr key={transaction.id} className="hover:bg-gray-100">
                <td className="border border-gray-300 px-4 py-2">{transaction.action}</td>
                <td className="border border-gray-300 px-4 py-2">{transaction.item_name}</td>
                <td className="border border-gray-300 px-4 py-2">{transaction.stock_in_quantity}</td>
                <td className="border border-gray-300 px-4 py-2">{new Date(transaction.timestamp).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default StockInReturn;
