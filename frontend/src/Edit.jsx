import { useEffect, useState } from 'react';
import axios from 'axios';

function Edit() {
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

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
    } catch (error) {
      console.error("Error fetching transactions:", error);
    } finally {
      setIsLoading(false); // Ensure loading state is cleared
    }
  };

  return (
    <div className="p-6 font-sans">
      <h1 className="text-4xl font-bold mb-6 text-gray-800">Product History</h1>

      {isLoading ? (
        <p className="text-gray-600">Loading transactions...</p>
      ) : transactions.length === 0 ? (
        <p className="text-gray-600">No product-related transactions found.</p>
      ) : (
        <table className="table-auto w-full border-collapse border border-gray-300 shadow">
          <thead>
            <tr className="bg-gray-200 text-sm text-gray-700 uppercase">
              <th className="border border-gray-300 px-4 py-2">Action</th>
              <th className="border border-gray-300 px-4 py-2">Product</th>
              <th className="border border-gray-300 px-4 py-2">Type</th>
              <th className="border border-gray-300 px-4 py-2">Volume</th>
              <th className="border border-gray-300 px-4 py-2">Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction) => (
              <tr key={transaction.id} className="hover:bg-gray-100 text-sm">
                <td className="border border-gray-300 px-4 py-2">
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
                <td className="border border-gray-300 px-4 py-2">{transaction.item_name}</td>
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

export default Edit;
