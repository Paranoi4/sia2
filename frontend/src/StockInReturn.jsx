import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import axios from "axios";

function StockInReturn() {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterDate, setFilterDate] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/transactions/");
      const returnTransactions = response.data.filter(
        (transaction) => transaction.action === "Stock-In-Return"
      );

      setTransactions(returnTransactions);
      setFilteredTransactions(returnTransactions);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching return transactions:", error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const filtered = transactions.filter((transaction) => {
      const matchesSearch = Object.values(transaction).some((value) =>
        String(value).toLowerCase().includes(searchQuery)
      );

      const matchesDate =
        !filterDate ||
        new Date(transaction.timestamp).toISOString().split("T")[0] === filterDate;

      return matchesSearch && matchesDate;
    });

    setFilteredTransactions(filtered);
  }, [transactions, searchQuery, filterDate]);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-4xl font-bold mb-6 text-gray-800">Stock-In Return Transactions</h1>

        {/* Search + Date + Reset */}
        <div className="mb-4 flex flex-wrap items-center gap-3">
          {/* Search */}
          <input
            type="text"
            className="border border-gray-300 rounded px-4 py-2 w-full md:w-auto resize-x overflow-auto min-w-[150px] max-w-full"
            placeholder="Search by any field..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value.toLowerCase())}
          />

          {/* Date */}
          <input
            type="date"
            className="border border-gray-300 rounded px-4 py-2 w-full md:w-auto resize-x overflow-auto min-w-[150px] max-w-full"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
          />

          {/* Reset */}
          <button
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 w-full sm:w-auto -mt-1"
            onClick={() => {
              setSearchQuery("");
              setFilterDate("");
            }}
          >
            Reset
          </button>
        </div>

  
    
        {isLoading ? (
          <p>Loading return transactions...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="table-auto w-full border-separate border-spacing-0 bg-white shadow-md rounded border border-gray-300 ">
              <thead>
                <tr className="bg-gray-900 text-white">
                  
                  <th className="border border-gray-300 px-4 py-3 text-center">Product</th>
                  <th className="border border-gray-300 px-4 py-3  text-center">Type</th>
                  <th className="border border-gray-300 px-4 py-3 text-center">Volume</th>
                  <th className="border border-gray-300 px-4 py-3 text-center">Returned Quantity</th>
                  <th className="border border-gray-300 px-4 py-3 text-center">Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map((transaction) => (
                  <tr key={transaction.id} className="hover:bg-gray-100 transition">
          
                    <td className="border border-gray-300 px-4 py-2 text-center">{transaction.item_name}</td>
                    <td className="border border-gray-300 px-4 py-2 text-center">{transaction.type}</td>
                    <td className="border border-gray-300 px-4 py-2 text-center">{transaction.volume || "-"}</td>
                    <td className="border border-gray-300 px-4 py-2 text-center">{transaction.stock_in_quantity}</td>
                    <td className="border border-gray-300 px-4 py-2 text-center">
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

export default StockInReturn;
