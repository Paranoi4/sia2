import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Edit() {

    const [transactions, setTransactions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();
  
    useEffect(() => {
      fetchTransactions();
    }, []);  
  
    const fetchTransactions = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/transactions/');
        setTransactions(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching transactions:', error);
      }
    };
  
  
    return (
        <div>
            <h1 className="text-4xl font-bold mb-4">Stock-in/Stock-out Transactions </h1>
            <button onClick={() => navigate(-1)}>Back</button>
      
            {isLoading ? (
          <p>Loading transactions...</p>
        ) : (
          <table className="table-auto w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="border border-gray-300 px-4 py-2">Action</th>
                <th className="border border-gray-300 px-4 py-2">Product</th>
                <th className="border border-gray-300 px-4 py-2">Type</th>
                <th className="border border-gray-300 px-4 py-2">Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction) => (
                <tr key={transaction.id} className="hover:bg-gray-100">
                  <td className="border border-gray-300 px-4 py-2">{transaction.action}</td>
                  <td className="border border-gray-300 px-4 py-2">{transaction.item_name}</td>
                  <td className="border border-gray-300 px-4 py-2">{transaction.type}</td>
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