import { useEffect, useState } from 'react';
import axios from 'axios';

function Edit() {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");  // Added for global filter

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/transactions/");
      
      const allowedActions = ["Added", "Deleted", "Updated"];
      const filteredTransactions = response.data.filter(transaction =>
        allowedActions.includes(transaction.action)
      );

      setTransactions(filteredTransactions);
      setFilteredTransactions(filteredTransactions);  // Set initial filtered data
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      setIsLoading(false);
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

  return (
    <div className="p-6 bg-gray-100 min-h-screen font-sans">
      <div className="max-w-7xl mx-auto bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-4xl font-bold mb-6 text-gray-800">Product History</h1>

        {/* Global Search Input */}
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
          <p className="text-gray-600">Loading transactions...</p>
        ) : filteredTransactions.length === 0 ? (
          <p className="text-gray-600">No product-related transactions found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="table-auto w-full border-separate border-spacing-0 bg-white shadow-md rounded border border-gray-300">
              <thead>
                <tr className="bg-gray-900 text-white text-sm uppercase">
                  <th className="border border-gray-300 px-4 py-2">Action</th>
                  <th className="border border-gray-300 px-4 py-2">Product</th>
                  <th className="border border-gray-300 px-4 py-2">Type</th>
                  <th className="border border-gray-300 px-4 py-2">Volume</th>
                  <th className="border border-gray-300 px-4 py-2">Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map((transaction) => (
                  <tr key={transaction.id} className="hover:bg-gray-100 transition text-sm ">
                    <td className="border border-gray-300 px-4 py-2 text-center">
                      <span className={`px-2 py-1 rounded text-white text-xs font-semibold  ${
                        transaction.action === "Added"
                          ? "bg-green-500"
                          : transaction.action === "Deleted"
                          ? "bg-red-500"
                          : "bg-yellow-500"
                      }`}>
                        {transaction.action}
                      </span>
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-center">{transaction.item_name}</td>
                    <td className="border border-gray-300 px-4 py-2 text-center" >{transaction.type}</td>
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
