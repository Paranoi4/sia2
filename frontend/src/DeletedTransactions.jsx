import { useEffect, useState } from 'react';
import axios from 'axios';

function DeletedTransactions() {
  const [deletedTransactions, setDeletedTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDeletedTransactions();
  }, []);

  const fetchDeletedTransactions = async () => {
    try {
      const response = await axios.get("http://192.168.254.154:8000/api/transactions/");

      // Only include "Deleted" transactions (volume is optional)
      const filtered = response.data.filter(transaction =>
        transaction.action === "Deleted"
      );

      setDeletedTransactions(filtered);
      setIsLoading(false);
    } catch (error) {
        console.log("🔎 Deleted Transactions:", filtered);

      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen font-sans">
      <div className="max-w-7xl mx-auto bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-4xl font-bold mb-6 text-gray-800">Deleted Transactions</h1>

        {isLoading ? (
          <p className="text-gray-600">Loading deleted transactions...</p>
        ) : deletedTransactions.length === 0 ? (
          <p className="text-gray-600">No deleted transactions found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="table-auto w-full border-separate border-spacing-0 bg-white shadow-md rounded border border-gray-300">
              <thead>
                <tr className="bg-red-700 text-white text-sm uppercase">
                  <th className="border border-gray-300 px-4 py-2">Product</th>
                  <th className="border border-gray-300 px-4 py-2">Type</th>
                  <th className="border border-gray-300 px-4 py-2">Volume</th>
                  <th className="border border-gray-300 px-4 py-2">Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {deletedTransactions.map((transaction) => (
                  <tr key={transaction.id} className="hover:bg-gray-100 transition text-sm">
                    <td className="border border-gray-300 px-4 py-2 text-center">{transaction.item_name}</td>
                    <td className="border border-gray-300 px-4 py-2 text-center">{transaction.type}</td>
                    <td className="border border-gray-300 px-4 py-2 text-center">
                    {transaction?.volume ?? "—"}

                    </td>
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

export default DeletedTransactions;
