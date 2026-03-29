import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import {
  FaTrash,
  FaKey,
  FaEdit,
  FaCheck,
  FaTimes,
  FaCashRegister,
  FaPlus,
  FaMinus,
  FaShoppingCart,
  FaHistory,
  FaListUl,
  FaSearch
} from "react-icons/fa";
import { MdEditNote, MdOutlineDeleteOutline } from "react-icons/md";

const BASE_URL = "http://192.168.254.101:8000/api";

const TILE_COLORS = [
  "#4f46e5","#0891b2","#059669","#d97706",
  "#e11d48","#7c3aed","#ea580c","#0d9488",
  "#2563eb","#db2777","#65a30d","#1d4ed8",
];

const getAuthHeaders = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem("access")}` },
});

function DailySummary({ history, historyLoading }) {
  const [summaryDate, setSummaryDate] = useState(() => new Date().toISOString().slice(0, 10));
  const dayTx = history.filter((tx) => !tx.voided && tx.created_at.slice(0, 10) === summaryDate);
  const totalRevenue = dayTx.reduce((s, tx) => s + parseFloat(tx.total), 0);
  const totalTransactions = dayTx.length;
  const byCash = dayTx.filter((tx) => !tx.payment_method || tx.payment_method === "cash").reduce((s, tx) => s + parseFloat(tx.total), 0);
  const byGcash = dayTx.filter((tx) => tx.payment_method === "gcash").reduce((s, tx) => s + parseFloat(tx.total), 0);
  const byCard = dayTx.filter((tx) => tx.payment_method === "card").reduce((s, tx) => s + parseFloat(tx.total), 0);
  const totalDiscount = dayTx.reduce((s, tx) => s + parseFloat(tx.senior_discount || 0), 0);
  const itemMap = {};
  dayTx.forEach((tx) => tx.items.forEach((item) => {
    if (!itemMap[item.item_name]) itemMap[item.item_name] = { qty: 0, revenue: 0 };
    itemMap[item.item_name].qty += item.quantity;
    itemMap[item.item_name].revenue += parseFloat(item.subtotal);
  }));
  const topItems = Object.entries(itemMap).sort((a, b) => b[1].qty - a[1].qty).slice(0, 5);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">📊 Daily Summary</h1>
        <input
          type="date"
          value={summaryDate}
          onChange={(e) => setSummaryDate(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      {historyLoading ? (
        <p className="text-gray-500">Loading...</p>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-blue-600 text-white rounded-xl p-4">
              <p className="text-xs opacity-80">Total Revenue</p>
              <p className="text-2xl font-bold mt-1">₱{totalRevenue.toFixed(2)}</p>
            </div>
            <div className="bg-gray-800 text-white rounded-xl p-4">
              <p className="text-xs opacity-80">Transactions</p>
              <p className="text-2xl font-bold mt-1">{totalTransactions}</p>
            </div>
            <div className="bg-green-700 text-white rounded-xl p-4">
              <p className="text-xs opacity-80">Cash</p>
              <p className="text-2xl font-bold mt-1">₱{byCash.toFixed(2)}</p>
            </div>
            <div className="bg-indigo-600 text-white rounded-xl p-4">
              <p className="text-xs opacity-80">GCash / Card</p>
              <p className="text-2xl font-bold mt-1">₱{(byGcash + byCard).toFixed(2)}</p>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow p-5 mb-6 max-w-md">
            <h2 className="font-bold text-gray-700 mb-3">Payment Breakdown</h2>
            {[["Cash", byCash, "text-green-600"], ["GCash", byGcash, "text-indigo-600"], ["Card", byCard, "text-blue-600"]].map(([label, amt, color]) => (
              <div key={label} className="flex justify-between text-sm py-1 border-b border-gray-100 last:border-0">
                <span className="text-gray-600">{label}</span>
                <span className={`font-semibold ${color}`}>₱{parseFloat(amt).toFixed(2)}</span>
              </div>
            ))}
            {totalDiscount > 0 && (
              <div className="flex justify-between text-sm py-1 mt-1">
                <span className="text-yellow-600">Senior Discounts Given</span>
                <span className="font-semibold text-yellow-600">−₱{totalDiscount.toFixed(2)}</span>
              </div>
            )}
          </div>
          <div className="bg-white rounded-xl shadow p-5 max-w-md">
            <h2 className="font-bold text-gray-700 mb-3">Top Selling Items</h2>
            {topItems.length === 0 ? (
              <p className="text-gray-400 text-sm">No sales on this date.</p>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-gray-400 text-xs border-b">
                    <th className="text-left py-1">Item</th>
                    <th className="text-center py-1">Qty Sold</th>
                    <th className="text-right py-1">Revenue</th>
                  </tr>
                </thead>
                <tbody>
                  {topItems.map(([name, data], i) => (
                    <tr key={name} className="border-b border-gray-50 last:border-0">
                      <td className="py-1.5 text-gray-800">
                        <span className="text-xs text-gray-400 mr-1">#{i + 1}</span>{name}
                      </td>
                      <td className="text-center py-1.5 font-semibold text-gray-700">{data.qty}</td>
                      <td className="text-right py-1.5 text-green-600 font-semibold">₱{data.revenue.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default function POS() {
    const [itemSearch, setItemSearch] = useState("");
  const [searchParams] = useSearchParams();
  const activeSection = searchParams.get("view") || "items";
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", price: "", category: "", description: "", inventory_item: "", deduct_per_sale: 1 });
  const [formError, setFormError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ name: "", price: "", category: "", description: "", inventory_item: "", deduct_per_sale: 1 });
  const [inventoryItems, setInventoryItems] = useState([]);
  const groups = JSON.parse(localStorage.getItem("groups") || "[]");
  const isSuperUser = groups.includes("admin") || groups.length === 0;

  // Cashier state
  const [cart, setCart] = useState([]);
  const [cashTendered, setCashTendered] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [saveError, setSaveError] = useState("");
  const [saving, setSaving] = useState(false);
  const [activeCategory, setActiveCategory] = useState("all");
  const [receiptData, setReceiptData] = useState(null);
  const [numPax, setNumPax] = useState("");
  const [numSeniors, setNumSeniors] = useState("");

  // History state
  const [history, setHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [expandedTx, setExpandedTx] = useState(null);
  const [filterDate, setFilterDate] = useState("");

  const addToCart = (item) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.id === item.id);
      if (existing) return prev.map((c) => c.id === item.id ? { ...c, qty: c.qty + 1 } : c);
      return [...prev, { ...item, qty: 1 }];
    });
  };

  const updateQty = (id, delta) => {
    setCart((prev) =>
      prev
        .map((c) => c.id === id ? { ...c, qty: c.qty + delta } : c)
        .filter((c) => c.qty > 0)
    );
  };

  const removeFromCart = (id) => setCart((prev) => prev.filter((c) => c.id !== id));

  const cartTotal = cart.reduce((sum, c) => sum + parseFloat(c.price) * c.qty, 0);
  const pax = parseInt(numPax) || 0;
  const seniors = parseInt(numSeniors) || 0;
  const perPaxAmount = pax > 0 ? cartTotal / pax : 0;
  const seniorDiscount = seniors > 0 && pax > 0 ? seniors * (perPaxAmount * 0.20) : 0;
  const discountedTotal = cartTotal - seniorDiscount;
  const change = paymentMethod === "cash" ? parseFloat(cashTendered || 0) - discountedTotal : 0;

  const fetchHistory = async () => {
    setHistoryLoading(true);
    try {
      const res = await axios.get(`${BASE_URL}/pos-transactions/`, getAuthHeaders());
      setHistory(res.data);
    } catch {
      // silent
    } finally {
      setHistoryLoading(false);
    }
  };

  const handleVoid = async (txId) => {
    if (!window.confirm(`Void transaction #${txId}? This will restore inventory stock.`)) return;
    try {
      await axios.post(`${BASE_URL}/pos-transactions/${txId}/void/`, {}, getAuthHeaders());
      setHistory((prev) => prev.map((tx) => tx.id === txId ? { ...tx, voided: true } : tx));
      setExpandedTx(null);
    } catch (err) {
      alert(err.response?.data?.error || "Failed to void transaction.");
    }
  };

  useEffect(() => {
    if (activeSection === "history" || activeSection === "summary") fetchHistory();
  }, [activeSection]);

  const handleSaveTransaction = async () => {
    if (cart.length === 0 || change < 0) return;
    setSaving(true);
    setSaveError("");
    const payload = {
      total: discountedTotal.toFixed(2),
      cash_tendered: paymentMethod === "cash" ? parseFloat(cashTendered).toFixed(2) : discountedTotal.toFixed(2),
      change: paymentMethod === "cash" ? change.toFixed(2) : "0.00",
      payment_method: paymentMethod,
      served_by: localStorage.getItem("username") || "",
      senior_discount: seniorDiscount.toFixed(2),
      num_pax: pax,
      num_seniors: seniors,
      items: cart.map((c) => ({
        item_name: c.name,
        item_key: c.item_key,
        price: parseFloat(c.price).toFixed(2),
        quantity: c.qty,
        subtotal: (parseFloat(c.price) * c.qty).toFixed(2),
      })),
    };
    try {
      await axios.post(`${BASE_URL}/pos-transactions/`, payload, getAuthHeaders());
      setReceiptData({ ...payload, date: new Date(), senior_discount: seniorDiscount, num_seniors: seniors, num_pax: pax });
      setCart([]);
      setCashTendered("");
      setPaymentMethod("cash");
      setNumPax("");
      setNumSeniors("");
    } catch {
      setSaveError("Failed to save transaction. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const fetchItems = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${BASE_URL}/pos-items/`, getAuthHeaders());
      setItems(res.data);
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  };

  const fetchInventoryItems = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/todo/`, getAuthHeaders());
      setInventoryItems(res.data);
    } catch {
      // silent
    }
  };

  useEffect(() => {
    fetchItems();
    fetchInventoryItems();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setFormError("");
    setSuccessMsg("");
    if (!form.name || !form.price) {
      setFormError("Name and Price are required.");
      return;
    }
    try {
      await axios.post(`${BASE_URL}/pos-items/`, form, getAuthHeaders());
      setSuccessMsg("Item created successfully!");
      setForm({ name: "", price: "", category: "", description: "", inventory_item: "", deduct_per_sale: 1 });
      fetchItems();
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (err) {
      setFormError(err.response?.data?.detail || "Failed to create item.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this POS item?")) return;
    try {
      await axios.delete(`${BASE_URL}/pos-items/${id}/`, getAuthHeaders());
      setItems((prev) => prev.filter((i) => i.id !== id));
    } catch {
      alert("Failed to delete item.");
    }
  };

  const handleStartEdit = (item) => {
    setEditingId(item.id);
    setEditForm({
      name: item.name,
      price: item.price,
      category: item.category || "",
      description: item.description || "",
      inventory_item: item.inventory_item || "",
      deduct_per_sale: item.deduct_per_sale ?? 1,
    });
  };

  const handleSaveEdit = async (id) => {
    if (!editForm.name || !editForm.price) return;
    try {
      const res = await axios.patch(`${BASE_URL}/pos-items/${id}/`, editForm, getAuthHeaders());
      setItems((prev) => prev.map((i) => (i.id === id ? res.data : i)));
      setEditingId(null);
    } catch {
      alert("Failed to save changes.");
    }
  };

  return (
    <div className="flex-1">
        {/* ── SALES HISTORY ── */}
        {activeSection === "history" && (
          <div>
            <div className="flex items-center justify-between mb-6 max-w-4xl">
              <h1 className="text-3xl font-bold flex items-center gap-2 text-gray-800"><FaHistory /> Sales History</h1>
              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-600 font-medium">Filter by date:</label>
                <input
                  type="date"
                  value={filterDate}
                  onChange={(e) => { setFilterDate(e.target.value); setExpandedTx(null); }}
                  className="border border-gray-700 rounded-md px-3 py-1.5 text-sm bg-gray-900 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            {historyLoading ? (
              <p className="text-gray-400">Loading...</p>
            ) : history.length === 0 ? (
              <p className="text-gray-400">No transactions recorded yet.</p>
            ) : (
              <div className="flex gap-4 max-w-4xl">{(() => { 
                const filtered = filterDate
                  ? history.filter((tx) => tx.created_at.slice(0, 10) === filterDate)
                  : history;
                return [filtered.filter((_, i) => i % 2 === 0), filtered.filter((_, i) => i % 2 !== 0)].map((col, colIdx) => (
                  <div key={colIdx} className="flex-1 flex flex-col gap-4">
                    {col.map((tx) => (
                  <div key={tx.id} className={`rounded-lg shadow overflow-hidden border ${tx.voided ? "border-red-800 bg-gray-900 opacity-60" : "border-gray-800 bg-gray-900"}`}>
                    <button
                      onClick={() => !tx.voided && setExpandedTx(expandedTx === tx.id ? null : tx.id)}
                      style={{ background: "transparent" }}
                      className={`w-full flex items-center justify-between px-4 py-1.5 transition text-left ${tx.voided ? "cursor-default" : "hover:bg-gray-800"}`}
                    >
                      <div className="flex flex-col gap-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs text-gray-400">#{tx.id}</span>
                          {tx.served_by && <span className="text-xs text-gray-300">by {tx.served_by}</span>}
                          {tx.voided && <span className="text-xs font-bold text-red-400 border border-red-600 rounded px-1">VOIDED</span>}
                        </div>
                        <span className="font-semibold text-white text-sm">{new Date(tx.created_at).toLocaleString()}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`font-bold ${tx.voided ? "text-gray-500 line-through" : "text-green-400"}`}>₱{parseFloat(tx.total).toFixed(2)}</span>
                        {!tx.voided && <span className="text-xs text-gray-400">{expandedTx === tx.id ? "▲" : "▼"}</span>}
                      </div>
                    </button>
                    {expandedTx === tx.id && (
                      <div className="px-4 pb-2 bg-gray-800">
                        <table className="w-full text-sm mb-2">
                          <thead>
                            <tr className="text-gray-400 text-xs border-b border-gray-700">
                              <th className="text-left py-1">Item</th>
                              <th className="text-center py-1 w-10">Qty</th>
                              <th className="text-right py-1 w-20">Price</th>
                              <th className="text-right py-1 w-20">Subtotal</th>
                            </tr>
                          </thead>
                          <tbody>
                            {tx.items.map((item) => (
                              <tr key={item.id} className="border-b border-gray-700 last:border-0 text-gray-200">
                                <td className="py-0.5">{item.item_name}</td>
                                <td className="text-center py-0.5">{item.quantity}</td>
                                <td className="text-right py-0.5">₱{parseFloat(item.price).toFixed(2)}</td>
                                <td className="text-right py-0.5 font-semibold">₱{parseFloat(item.subtotal).toFixed(2)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                        <div className="flex flex-wrap justify-end gap-3 text-xs pt-1">
                          {tx.senior_discount > 0 && (
                            <span className="text-yellow-400">Senior Discount ({tx.num_seniors}/{tx.num_pax} pax): <strong>−₱{parseFloat(tx.senior_discount).toFixed(2)}</strong></span>
                          )}
                          {tx.payment_method && tx.payment_method !== "cash" ? (
                            <span className="text-blue-300 font-semibold capitalize">{tx.payment_method === "gcash" ? "GCash" : "Card"}</span>
                          ) : (
                            <>
                              <span className="text-gray-400">Cash: <strong className="text-gray-200">₱{parseFloat(tx.cash_tendered).toFixed(2)}</strong></span>
                              <span className="text-gray-400">Change: <strong className="text-gray-200">₱{parseFloat(tx.change).toFixed(2)}</strong></span>
                            </>
                          )}
                          <span className="text-green-400 font-bold">Total: ₱{parseFloat(tx.total).toFixed(2)}</span>
                        </div>
                        {isSuperUser && (
                          <div className="flex justify-end mt-2">
                            <button
                              onClick={() => handleVoid(tx.id)}
                              className="text-xs bg-red-700 hover:bg-red-800 text-white px-3 py-1 rounded transition"
                            >
                              Void Transaction
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                    ))}
                  </div>
                ));})()}
              </div>
            )}
          </div>
        )}

        {/* ── CASHIER ── */}
        {activeSection === "cashier" && (
           <div className="flex rounded-xl overflow-hidden shadow-2xl" style={{ minHeight: "78vh", background: '#fff' }}>
             {/* LEFT: Items Panel */}
            <div className="flex-1 bg-white flex flex-col p-5">
              <div className="flex items-center mb-5">
                <h1 className="text-gray-800 text-xl font-bold flex items-center gap-2">
                  <FaCashRegister className="text-gray-800" /> Cashier
                </h1>
              </div>

              {/* Category Tabs */}
              {items.length > 0 && (
                <>
                  <div className="mb-3 flex items-center w-full md:w-72 relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                      <FaSearch className="text-lg" />
                    </span>
                    <input
                      type="text"
                      className="flex-1 bg-gray-100 border-none rounded-full pl-10 pr-4 py-2 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-0"
                      placeholder="Search items here..."
                      value={itemSearch}
                      onChange={e => setItemSearch(e.target.value)}
                    />
                  </div>
                  <div className="flex gap-2 mb-5 flex-wrap">
                  <button
                    onClick={() => setActiveCategory("all")}
                    className={`flex flex-col items-center justify-center w-16 h-8 mx-1 my-1 rounded-md shadow transition-all duration-150 cursor-pointer bg-white text-gray-800 border border-gray-900 hover:bg-gray-100 hover:text-black hover:shadow-lg text-xs ${
                      activeCategory === "all"
                        ? "ring-2 ring-gray-900 text-black font-bold bg-gray-100"
                        : ""
                    }`}
                  >
                    All
                  </button>
                  {[...new Set(items.filter((i) => i.category).map((i) => i.category))].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setActiveCategory(cat)}
                      className={`flex flex-col items-center justify-center w-16 h-8 mx-1 my-1 rounded-md shadow transition-all duration-150 cursor-pointer bg-white text-gray-800 border border-gray-900 hover:bg-gray-100 hover:text-black hover:shadow-lg text-xs ${
                          activeCategory === cat
                            ? "ring-2 ring-gray-900 text-black font-bold bg-gray-100"
                            : ""
                        }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
                </>
              )}

              {/* Items Grid */}
              {loading ? (
                <p className="text-gray-400">Loading...</p>
              ) : items.length === 0 ? (
                <p className="text-gray-400">No items available. Create some first.</p>
              ) : (
                <div className="flex flex-wrap gap-3 overflow-y-auto flex-1 pr-1 content-start">
                  {(
                    (activeCategory === "all"
                      ? [...items]
                      : items.filter((i) => i.category === activeCategory)
                    )
                    .filter((item) => item.name.toLowerCase().includes(itemSearch.toLowerCase()))
                    .sort((a, b) => a.name.localeCompare(b.name))
                  ).map((item, idx) => (
                    <button
                      key={item.id}
                      onClick={() => addToCart(item)}
                      className="flex flex-col items-center justify-center rounded-xl bg-gray-800 hover:bg-gray-700 transition px-2 py-3 text-center w-24 border border-white"
                    >
                      <p className="text-gray-100 text-xs leading-tight break-words w-full">{item.name}</p>
                      <p className="text-green-400 text-xs font-semibold mt-1">₱{parseFloat(item.price).toFixed(2)}</p>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* RIGHT: Order Panel */}
            <div className="w-80 flex-shrink-0 bg-gray-800 flex flex-col border-l border-gray-700">
              <div className="p-4 border-b border-gray-700">
                <h2 className="text-white text-lg font-bold flex items-center gap-2">
                  <FaShoppingCart className="text-blue-400" /> Order
                </h2>
              </div>

              <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1">
                {cart.length === 0 ? (
                  <p className="text-gray-500 text-sm text-center mt-10">No items added yet</p>
                ) : (
                  cart.map((c) => (
                    <div key={c.id} className="flex items-center justify-between border-b border-gray-700 py-3 px-1">
                      <div className="flex-1 min-w-0 overflow-hidden mr-3">
                        <p className="text-white text-sm font-semibold">{c.name}</p>
                        <p className="text-blue-400 text-xs font-semibold">₱{parseFloat(c.price).toFixed(2)}</p>
                      </div>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <button onClick={() => updateQty(c.id, -1)} className="bg-blue-600 hover:bg-blue-700 text-white rounded w-5 h-5 flex items-center justify-center transition text-xs font-bold p-0">−</button>
                        <span className="text-white text-sm font-semibold w-5 text-center inline-flex items-center justify-center mt-4">{c.qty}</span>
                        <button onClick={() => updateQty(c.id, 1)} className="bg-blue-600 hover:bg-blue-700 text-white rounded w-5 h-5 flex items-center justify-center transition text-xs font-bold p-0">+</button>
                        <button onClick={() => removeFromCart(c.id)} className="bg-red-500 hover:bg-red-600 text-white rounded w-5 h-5 flex items-center justify-center transition text-xs font-bold p-0 ml-1">×</button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Totals & Charge */}
              <div className="p-4 border-t border-gray-700 space-y-3">
                {cart.length > 0 && (
                  <div className="space-y-1">
                    {cart.map((c) => (
                      <div key={c.id} className="flex justify-between text-xs text-gray-300">
                        <span className="truncate mr-2">{c.name} × {c.qty}</span>
                        <span className="flex-shrink-0 text-white font-semibold">₱{(parseFloat(c.price) * c.qty).toFixed(2)}</span>
                      </div>
                    ))}
                    <div className="border-t border-gray-600 mt-1" />
                  </div>
                )}
                {/* Senior Discount */}
                <div className="flex gap-2">
                  <div className="flex-1">
                    <label className="text-gray-400 text-xs block mb-1">No. of Pax</label>
                    <input
                      type="number" min="1"
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g. 3"
                      value={numPax}
                      onChange={(e) => setNumPax(e.target.value)}
                    />
                  </div>
                  <div className="flex-1">
                    <label className="text-gray-400 text-xs block mb-1">Senior Pax</label>
                    <input
                      type="number" min="0"
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g. 1"
                      value={numSeniors}
                      onChange={(e) => setNumSeniors(e.target.value)}
                    />
                  </div>
                </div>
                {seniorDiscount > 0 && (
                  <div className="space-y-0.5">
                    <div className="flex justify-between text-xs text-gray-400">
                      <span>Subtotal</span>
                      <span>₱{cartTotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-xs text-yellow-400">
                      <span>Senior Discount ({seniors} pax × ₱{perPaxAmount.toFixed(2)} × 20%)</span>
                      <span>−₱{seniorDiscount.toFixed(2)}</span>
                    </div>
                  </div>
                )}
                <div className="flex justify-between font-bold text-white text-lg">
                  <span>Total</span>
                  <span className="text-blue-400">₱{discountedTotal.toFixed(2)}</span>
                </div>
                <div>
                  <label className="text-gray-400 text-xs block mb-1">Payment Method</label>
                  <div className="flex gap-2">
                    {["cash", "gcash", "card"].map((method) => (
                      <button
                        key={method}
                        onClick={() => { setPaymentMethod(method); setCashTendered(""); }}
                        className={`flex-1 py-1.5 rounded-lg text-sm font-semibold border transition capitalize ${paymentMethod === method ? "bg-blue-600 border-blue-600 text-white" : "bg-transparent border-gray-600 text-gray-400 hover:border-gray-400"}`}
                      >
                        {method === "gcash" ? "GCash" : method.charAt(0).toUpperCase() + method.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
                {paymentMethod === "cash" && (
                  <div>
                    <label className="text-gray-400 text-xs block mb-1">Cash Tendered (₱)</label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="0.00"
                      value={cashTendered}
                      onChange={(e) => setCashTendered(e.target.value)}
                    />
                    {cashTendered !== "" && (
                      <div className={`flex justify-between font-semibold text-sm mt-1 ${change >= 0 ? "text-green-400" : "text-red-400"}`}>
                        <span>{change >= 0 ? "Change" : "Shortage"}</span>
                        <span>₱{Math.abs(change).toFixed(2)}</span>
                      </div>
                    )}
                  </div>
                )}
                {saveError && (
                  <div className="p-2 bg-red-900 text-red-300 text-xs rounded">{saveError}</div>
                )}
                <button
                  onClick={handleSaveTransaction}
                  disabled={cart.length === 0 || (paymentMethod === "cash" && change < 0) || (paymentMethod === "cash" && cashTendered === "") || saving}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl transition text-base shadow-lg"
                >
                  {saving ? "Processing..." : `Charge ₱${discountedTotal.toFixed(2)}`}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── ALL ITEMS ── */}
        {activeSection === "items" && (
          <div>
            <h1 className="text-3xl font-bold mb-6 text-gray-800">POS Items</h1>
            {loading ? (
              <p className="text-gray-500">Loading...</p>
            ) : items.length === 0 ? (
              <p className="text-gray-400">No items yet. Create one from the sidebar.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="table-auto w-full border-separate border-spacing-0 bg-white shadow-md rounded border border-gray-300 text-sm">
                  <thead>
                    <tr className="bg-gray-900 text-white">
                      <th className="border border-gray-300 px-4 py-3">Unique Key</th>
                      <th className="border border-gray-300 px-4 py-3">Name</th>
                      <th className="border border-gray-300 px-4 py-3">Category</th>
                      <th className="border border-gray-300 px-4 py-3">Price</th>
                      <th className="border border-gray-300 px-4 py-3">Description</th>
                      <th className="border border-gray-300 px-4 py-3">Linked Inventory</th>
                      <th className="border border-gray-300 px-4 py-3">Deduct/Sale</th>
                      <th className="border border-gray-300 px-4 py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {items.map((item) => (
                      <tr key={item.id} className="hover:bg-gray-100 transition">
                        <td className="border border-gray-300 px-4 py-2 text-center font-mono text-indigo-600 font-bold">
                          {item.item_key}
                        </td>

                        {editingId === item.id ? (
                          <>
                            <td className="border border-gray-300 px-2 py-2">
                              <input
                                className="border border-gray-300 rounded px-2 py-1 text-sm w-full focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                value={editForm.name}
                                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                              />
                            </td>
                            <td className="border border-gray-300 px-2 py-2">
                              <input
                                className="border border-gray-300 rounded px-2 py-1 text-sm w-full focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                value={editForm.category}
                                onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                              />
                            </td>
                            <td className="border border-gray-300 px-2 py-2">
                              <input
                                type="number" min="0" step="0.01"
                                className="border border-gray-300 rounded px-2 py-1 text-sm w-full text-right focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                value={editForm.price}
                                onChange={(e) => setEditForm({ ...editForm, price: e.target.value })}
                              />
                            </td>
                            <td className="border border-gray-300 px-2 py-2">
                              <input
                                className="border border-gray-300 rounded px-2 py-1 text-sm w-full focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                value={editForm.description}
                                onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                              />
                            </td>
                            <td className="border border-gray-300 px-2 py-2">
                              <select
                                className="border border-gray-300 rounded px-2 py-1 text-sm w-full focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                value={editForm.inventory_item}
                                onChange={(e) => setEditForm({ ...editForm, inventory_item: e.target.value })}
                              >
                                <option value="">— None —</option>
                                {inventoryItems.map((inv) => (
                                  <option key={inv.id} value={inv.id}>{inv.body}</option>
                                ))}
                              </select>
                            </td>
                            <td className="border border-gray-300 px-2 py-2 text-center">
                              <input
                                type="number" min="1"
                                className="border border-gray-300 rounded px-2 py-1 text-sm w-20 text-center focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                value={editForm.deduct_per_sale}
                                onChange={(e) => setEditForm({ ...editForm, deduct_per_sale: e.target.value })}
                              />
                            </td>
                            <td className="border border-gray-300 px-4 py-2 text-center">
                              <div className="flex justify-center items-center gap-2">
                                <button onClick={() => handleSaveEdit(item.id)} className="focus:outline-none bg-transparent hover:bg-gray-200 p-1 rounded" title="Save"><FaCheck className="text-green-600 hover:text-green-800" /></button>
                                <button onClick={() => setEditingId(null)} className="focus:outline-none bg-transparent hover:bg-gray-200 p-1 rounded" title="Cancel"><FaTimes className="text-gray-500 hover:text-gray-700" /></button>
                              </div>
                            </td>
                          </>
                        ) : (
                          <>
                            <td className="border border-gray-300 px-4 py-2 text-center text-gray-900">{item.name}</td>
                            <td className="border border-gray-300 px-4 py-2 text-center text-gray-900">{item.category || "—"}</td>
                            <td className="border border-gray-300 px-4 py-2 text-center font-semibold text-green-700">₱{parseFloat(item.price).toFixed(2)}</td>
                            <td className="border border-gray-300 px-4 py-2 text-center max-w-xs truncate text-gray-900">{item.description || "—"}</td>
                            <td className="border border-gray-300 px-4 py-2 text-center text-gray-900">{item.inventory_item_name || "—"}</td>
                            <td className="border border-gray-300 px-4 py-2 text-center text-gray-900">{item.deduct_per_sale}</td>
                            <td className="border border-gray-300 px-4 py-2 text-center">
                              <div className="flex justify-center items-center space-x-2">
                                <button onClick={() => handleStartEdit(item)} className="focus:outline-none bg-transparent hover:bg-gray-200 p-1 rounded" title="Edit">
                                  <MdEditNote className="text-xl text-indigo-600 hover:text-indigo-800" />
                                </button>
                                <button onClick={() => handleDelete(item.id)} className="focus:outline-none bg-transparent hover:bg-gray-200 p-1 rounded" title="Delete">
                                  <MdOutlineDeleteOutline className="text-xl text-red-600 hover:text-red-800" />
                                </button>
                              </div>
                            </td>
                          </>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ── CREATE ITEM ── */}
        {activeSection === "create" && (
          <div className="max-w-lg">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">Create POS Item</h1>

            {formError && (
              <div className="mb-4 p-3 bg-red-900 text-red-300 rounded">{formError}</div>
            )}
            {successMsg && (
              <div className="mb-4 p-3 bg-green-900 text-green-300 rounded">{successMsg}</div>
            )}

            <form onSubmit={handleCreate} className="bg-gray-900 border border-gray-800 p-6 rounded-lg shadow space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  className="w-full border border-gray-700 rounded-md px-3 py-2 text-sm bg-gray-800 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g. Mojito"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Price (₱) <span className="text-red-400">*</span>
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  className="w-full border border-gray-700 rounded-md px-3 py-2 text-sm bg-gray-800 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g. 150.00"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Category</label>
                <input
                  type="text"
                  className="w-full border border-gray-700 rounded-md px-3 py-2 text-sm bg-gray-800 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g. Cocktail"
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
                <textarea
                  rows={3}
                  className="w-full border border-gray-700 rounded-md px-3 py-2 text-sm bg-gray-800 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Optional description"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Linked Inventory Item</label>
                <select
                  className="w-full border border-gray-700 rounded-md px-3 py-2 text-sm bg-gray-800 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={form.inventory_item}
                  onChange={(e) => setForm({ ...form, inventory_item: e.target.value })}
                >
                  <option value="">— None (no deduction) —</option>
                  {inventoryItems.map((inv) => (
                    <option key={inv.id} value={inv.id}>{inv.body}</option>
                  ))}
                </select>
                <p className="text-xs text-gray-500 mt-1">When a sale is recorded, this inventory item's stock will be reduced.</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Deduct per Sale</label>
                <input
                  type="number"
                  min="1"
                  className="w-full border border-gray-700 rounded-md px-3 py-2 text-sm bg-gray-800 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="1"
                  value={form.deduct_per_sale}
                  onChange={(e) => setForm({ ...form, deduct_per_sale: e.target.value })}
                />

              </div>



              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-md transition"
              >
                Create Item
              </button>
            </form>
          </div>
        )}

        {/* ── DAILY SUMMARY ── */}
        {activeSection === "summary" && (
          <DailySummary history={history} historyLoading={historyLoading} />
        )}

        {/* ── RECEIPT MODAL ── */}
        {receiptData && (
          <>
            <style>{`
              @media print {
                body * { visibility: hidden; }
                #receipt-print, #receipt-print * { visibility: visible; }
                #receipt-print { position: fixed; top: 0; left: 0; width: 72mm; margin: 0; padding: 4mm; font-family: monospace; }
              }
            `}</style>
            <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
              <div className="bg-white rounded-xl shadow-2xl w-80 flex flex-col">
                <div id="receipt-print" className="p-5 font-mono text-sm">
                  <div className="text-center mb-3">
                    <p className="font-bold text-lg uppercase tracking-widest">Bevanda</p>
                    <p className="text-xs text-gray-500">Mobile Bar</p>
                    <p className="text-xs text-gray-400 mt-1">{receiptData.date.toLocaleString()}</p>
                    {receiptData.served_by && (
                      <p className="text-xs text-gray-900 font-bold flex items-center gap-1"><FaCashRegister className="text-gray-900" /> Cashier: {receiptData.served_by}</p>
                    )}
                  </div>
                  <div className="border-t-2 border-dashed border-gray-300 my-2" />
                  <table className="w-full text-xs mb-1">
                    <thead>
                      <tr className="text-gray-500">
                        <th className="text-left pb-1">Item</th>
                        <th className="text-center pb-1">Qty</th>
                        <th className="text-right pb-1">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {receiptData.items.map((item, i) => (
                        <tr key={i}>
                          <td className="py-0.5">{item.item_name}</td>
                          <td className="text-center py-0.5">{item.quantity}</td>
                          <td className="text-right py-0.5">₱{parseFloat(item.subtotal).toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="border-t-2 border-dashed border-gray-300 my-2" />
                  <div className="space-y-1 text-sm">
                    {receiptData.senior_discount > 0 && (
                      <>
                        <div className="flex justify-between text-gray-500 text-xs">
                          <span>Subtotal</span>
                          <span>₱{(parseFloat(receiptData.total) + receiptData.senior_discount).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span>Senior Discount ({receiptData.num_seniors}/{receiptData.num_pax} pax × 20%)</span>
                          <span className="text-yellow-600">−₱{receiptData.senior_discount.toFixed(2)}</span>
                        </div>
                      </>
                    )}
                    <div className="flex justify-between font-bold text-base">
                      <span>Total</span>
                      <span>₱{parseFloat(receiptData.total).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-gray-500 text-xs">
                      <span>Payment</span>
                      <span className="capitalize font-semibold">{receiptData.payment_method === "gcash" ? "GCash" : receiptData.payment_method === "card" ? "Card" : "Cash"}</span>
                    </div>
                    {receiptData.payment_method === "cash" && (
                      <>
                        <div className="flex justify-between text-gray-500 text-xs">
                          <span>Cash</span>
                          <span>₱{parseFloat(receiptData.cash_tendered).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-gray-500 text-xs">
                          <span>Change</span>
                          <span>₱{parseFloat(receiptData.change).toFixed(2)}</span>
                        </div>
                      </>
                    )}
                  </div>
                  <div className="border-t-2 border-dashed border-gray-300 my-3" />
                  <p className="text-center text-xs text-gray-400">Thank you for your purchase!</p>
                </div>
                <div className="flex gap-2 p-4 border-t">
                  <button
                    onClick={() => window.print()}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold py-2 rounded-lg transition"
                  >
                    🖨 Print Receipt
                  </button>
                  <button
                    onClick={() => setReceiptData(null)}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-semibold py-2 rounded-lg transition"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
    </div>
  );
}

