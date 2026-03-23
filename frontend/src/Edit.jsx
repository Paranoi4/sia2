import { useEffect, useState } from 'react';
import axios from 'axios';

function Edit() {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    fetchTransactions();
  }, []);

  useEffect(() => {
    const filtered = transactions.filter((transaction) => {
      const matchesSearch = Object.values(transaction).some((value) =>
        String(value).toLowerCase().includes(searchQuery)
      );

      const transactionDate = new Date(transaction.timestamp).toISOString().split("T")[0];
      const matchesDate =
        (!startDate || transactionDate >= startDate) &&
        (!endDate || transactionDate <= endDate);

      return matchesSearch && matchesDate;
    });

    setFilteredTransactions(filtered);
  }, [startDate, endDate, searchQuery, transactions]);

  const fetchTransactions = async () => {
    try {
      const response = await axios.get("http://192.168.254.101:8000/api/transactions/");
      const allowedActions = ["Added", "Deleted", "Updated"];
      const filteredTransactions = response.data.filter(transaction =>
        allowedActions.includes(transaction.action) && transaction.volume
      );

      setTransactions(filteredTransactions);
      setFilteredTransactions(filteredTransactions);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      setIsLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value.toLowerCase());
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen font-sans">
      <div className="max-w-7xl mx-auto bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-4xl font-bold mb-6 text-gray-800">Product History</h1>

        {/* Search + Date Filter + Reset */}
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <input
            type="text"
            className="border border-gray-300 rounded px-4 py-2 w-full md:w-auto"
            placeholder="Search by any field..."
            value={searchQuery}
            onChange={handleSearch}
          />
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="border border-gray-300 rounded px-4 py-2 w-full md:w-auto"
          />
          <span className="text-gray-600 mx-1">to</span>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="border border-gray-300 rounded px-4 py-2 w-full md:w-auto"
          />
          <button
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 w-full md:w-auto"
            onClick={() => {
              setSearchQuery("");
              setStartDate("");
              setEndDate("");
            }}
          >
            Reset
          </button>
        </div>

        {isLoading ? (
          <p className="text-gray-600">Loading transactions...</p>
        ) : filteredTransactions.length === 0 ? (
          <p className="text-gray-600">No product-related transactions found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="table-auto w-full border-separate border-spacing-0 bg-white shadow-md rounded border border-gray-300">
              <thead>
                <tr className="bg-gray-900 text-white text-sm uppercase">
                  <th className="border border-gray-300 px-4 py-2">Action</th>
                  <th className="border border-gray-300 px-4 py-2">ID</th>
                  <th className="border border-gray-300 px-4 py-2">Product</th>
                  <th className="border border-gray-300 px-4 py-2">Type</th>
                  <th className="border border-gray-300 px-4 py-2">Volume</th>
                  <th className="border border-gray-300 px-4 py-2">Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map((transaction) => (
                  <tr key={transaction.id} className="hover:bg-gray-100 transition text-sm">
                    <td className="border border-gray-300 px-4 py-2 text-center">
                      <span className={`px-2 py-1 rounded text-white text-xs font-semibold ${
                        transaction.action === "Added"
                          ? "bg-green-500"
                          : transaction.action === "Deleted"
                          ? "bg-red-500"
                          : "bg-yellow-500"
                      }`}>
                        {transaction.action}
                      </span>
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-center">{transaction.id}</td>
                    <td className="border border-gray-300 px-4 py-2 text-center">{transaction.item_name}</td>
                    <td className="border border-gray-300 px-4 py-2 text-center">{transaction.type}</td>
                    <td className="border border-gray-300 px-4 py-2 text-center">{transaction.volume}</td>
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

export default Edit;
