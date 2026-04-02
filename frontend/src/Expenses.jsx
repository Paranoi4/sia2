import { useState, useEffect } from "react";
import axios from "axios";

const BASE_URL = "http://192.168.254.101:8000/api";

export default function Expenses() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ description: "", amount: "", date: new Date().toISOString().slice(0, 10) });
  const [formError, setFormError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const fetchExpenses = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${BASE_URL}/expenses/`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("access")}` },
      });
      setExpenses(res.data);
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setFormError("");
    setSuccessMsg("");
    if (!form.description || !form.amount || !form.date) {
      setFormError("All fields are required.");
      return;
    }
    try {
      await axios.post(`${BASE_URL}/expenses/`, form, {
        headers: { Authorization: `Bearer ${localStorage.getItem("access")}` },
      });
      setSuccessMsg("Expense recorded!");
      setForm({ description: "", amount: "", date: new Date().toISOString().slice(0, 10) });
      fetchExpenses();
      setTimeout(() => setSuccessMsg(""), 2000);
    } catch {
      setFormError("Failed to record expense.");
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Daily Expenses</h1>
      <div className="flex flex-col md:flex-row md:space-x-8 items-stretch">
        <form onSubmit={handleCreate} className="bg-gray-900 border border-gray-800 p-6 rounded-lg shadow space-y-4 mb-8 md:mb-0 md:w-1/2 flex flex-col justify-between">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
            <input
              type="text"
              className="w-full border border-gray-700 rounded-md px-3 py-2 text-sm bg-gray-800 text-gray-100 placeholder-gray-500 focus:outline-none"
              placeholder="e.g. Ice purchase"
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Amount (₱)</label>
            <input
              type="number"
              min="0"
              step="0.01"
              className="w-full border border-gray-700 rounded-md px-3 py-2 text-sm bg-gray-800 text-gray-100 placeholder-gray-500 focus:outline-none"
              placeholder="e.g. 500.00"
              value={form.amount}
              onChange={e => setForm({ ...form, amount: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Date</label>
            <input
              type="date"
              className="w-full border border-gray-700 rounded-md px-3 py-2 text-sm bg-gray-800 text-gray-100 focus:outline-none"
              value={form.date}
              onChange={e => setForm({ ...form, date: e.target.value })}
            />
          </div>
          {formError && <div className="mb-2 p-2 bg-red-900 text-red-300 rounded">{formError}</div>}
          {successMsg && <div className="mb-2 p-2 bg-green-900 text-green-300 rounded">{successMsg}</div>}
          <div className="flex justify-center">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-1 px-4 rounded transition text-base"
              style={{ minWidth: 0, width: 'auto' }}
            >
              Add Expense
            </button>
          </div>
        </form>
        <div className="md:w-1/2 flex flex-col justify-between h-full">
          <div className="h-full flex flex-col">
            <h2 className="text-xl font-bold mb-4 text-gray-700">Expense History</h2>
            <div className="flex-1 flex flex-col">
              {loading ? (
                <p className="text-gray-400">Loading...</p>
              ) : expenses.length === 0 ? (
                <p className="text-gray-400">No expenses recorded yet.</p>
              ) : (
                <div className="h-full flex flex-col">
                  <table className="w-full text-sm overflow-hidden shadow border border-gray-200 border-separate border-spacing-0 h-full">
                    <thead>
                      <tr className="bg-gray-900 text-white">
                        <th className="px-4 py-2 text-left font-semibold border-b border-gray-300">Date</th>
                        <th className="px-4 py-2 text-center font-semibold border-b border-gray-300">Description</th>
                        <th className="px-4 py-2 text-center font-semibold border-b border-gray-300">Amount (₱)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {expenses.map((exp, i) => (
                        <tr key={exp.id} className={i % 2 === 1 ? "bg-gray-50" : "bg-white"}>
                          <td className="px-4 py-2 text-gray-800 text-left border-b border-r border-gray-200">{exp.date}</td>
                          <td className="px-4 py-2 text-gray-800 text-center border-b border-r border-gray-200">{exp.description || <span className='text-gray-400'>—</span>}</td>
                          <td className="px-4 py-2 text-green-700 font-bold text-center border-b border-gray-200">₱{parseFloat(exp.amount).toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
