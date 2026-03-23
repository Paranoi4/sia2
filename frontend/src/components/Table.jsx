import React, { useState } from 'react';
import axios from 'axios';
import { MdOutlineDeleteOutline, MdEditNote } from 'react-icons/md';

const Table = ({ todos, setTodos, isLoading }) => {
  const [stockOutData, setStockOutData] = useState({ id: '', quantity: '' });
  const [stockInData, setStockInData] = useState({ id: '', quantity: '' });
  const [stockOutEventData, setStockOutEventData] = useState({ id: '', quantity: '', reason: ''  });
  const [stockInReturnData, setStockInReturnData] = useState({ id: '', quantity: '' });
  const [editText, setEditText] = useState({ id: '', body: '', quantity: '', volume: '', type: '' });
  const [filterText, setFilterText] = useState('');

  const filteredTodos = todos.filter(todo =>
    todo.body.toLowerCase().includes(filterText.toLowerCase()) ||
    todo.type.toLowerCase().includes(filterText.toLowerCase()) ||
    todo.quantity.toString().includes(filterText) ||
    (todo.volume && todo.volume.toString().includes(filterText))
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditText(prev => ({ ...prev, [name]: value }));
  };

  const handleEdit = async (id, updatedTodo) => {
    try {
      const response = await axios.patch(`http://192.168.254.101:8000/api/todo/${id}/`, updatedTodo);
      const updatedTodos = todos.map(todo =>
        todo.id === id ? { ...todo, ...response.data } : todo
      );
      setTodos(updatedTodos);
    } catch (error) {
      console.error(error);
    }
  };

  const handleClick = () => {
    handleEdit(editText.id, editText);
    setEditText({ id: '', body: '', quantity: '', volume: '', type: '' });
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this item?");
  if (!confirmDelete) return;
    try {
      await axios.delete(`http://192.168.254.101:8000/api/todo/${id}/`);
      setTodos(todos.filter(todo => todo.id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  const handleStockChange = (e, setter) => {
    const { name, value } = e.target;
    setter(prev => ({ ...prev, [name]: value }));
  };

  const handleStockAction = async (endpoint, data, modalId, successMsg, errorMsg) => {
    if (!data.id || !data.quantity) return alert("Please enter both ID and quantity.");
    try {
      const response = await axios.patch(
        `http://192.168.254.101:8000/api/todo/${data.id}/${endpoint}/`,
        data
      );
      const updatedTodos = todos.map(todo =>
        todo.id.toString() === data.id ? { ...todo, quantity: response.data.updated_quantity } : todo
      );
      setTodos(updatedTodos);
      document.getElementById(modalId).close();
      alert(successMsg);
    } catch (error) {
      alert(error.response?.data?.error || errorMsg);
    }
  };

  return (
    <div className="py-8 px-4 font-sans text-gray-800">
      {/* Search and Actions */}
      {/* Search and Actions */}
<div className="flex flex-wrap gap-3 justify-center items-center mb-6 mt-2">
  <input
    type="text"
    placeholder="Search inventory..."
    value={filterText}
    onChange={(e) => setFilterText(e.target.value)}
    className="input input-bordered w-full max-w-md mt-5 ml-1"
  />
  <button
    className="bg-green-600 text-white px-4 py-2 rounded-lg shadow-sm hover:bg-green-700 transition-all duration-200"
    onClick={() => document.querySelector('.modal').showModal()}
  >
    Add Item
  </button>
  <button
    className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-sm hover:bg-blue-700 transition-all duration-200"
    onClick={() => document.getElementById('stock-in-modal').showModal()}
  >
    Stock In
  </button>
  
  <button
    className="bg-cyan-600 text-white px-4 py-2 rounded-lg shadow-sm hover:bg-cyan-700 transition-all duration-200"
    onClick={() => document.getElementById('stock-out-event-modal').showModal()}
  >
    Stock Out
  </button>
  <button
    className="bg-teal-600 text-white px-4 py-2 rounded-lg shadow-sm hover:bg-teal-700 transition-all duration-200"
    onClick={() => document.getElementById('stock-in-return-modal').showModal()}
  >
    Stock-In Return
  </button>
</div>


      {/* Table */}
      <div className="overflow-x-auto">
          <table className="table-auto w-full border-separate border-spacing-0 bg-white shadow-md rounded border border-gray-300">
            <thead>
              <tr className="bg-gray-900 text-white">
                <th className="border border-gray-300 px-4 py-3">No ID.</th>
                <th className="border border-gray-300 px-4 py-3">Product</th>
                <th className="border border-gray-300 px-4 py-3">Quantity</th>
                <th className="border border-gray-300 px-4 py-3">Volume</th>
                <th className="border border-gray-300 px-4 py-3">Type</th>
                <th className="border border-gray-300 px-4 py-3">Date Added</th>
                
                <th className="border border-gray-300 px-4 py-3">Actions</th>
              </tr>
            </thead>
          <tbody className="divide-y">
            {isLoading ? (
              <tr><td colSpan="7" className="text-center py-4">Loading...</td></tr>
            ) : (
              [...filteredTodos].reverse().map((todo) => (

                <tr key={todo.id} className="hover:bg-gray-100 transition">
                <td className="border border-gray-300 px-4 py-2 text-center">{todo.id}</td>
                <td className="border border-gray-300 px-4 py-2 text-center">{todo.body}</td>
                <td className="border border-gray-300 px-4 py-2 text-center">{todo.quantity}</td>
                <td className="border border-gray-300 px-4 py-2 text-center">{todo.volume}</td>
                <td className="border border-gray-300 px-4 py-2 text-center">{todo.type}</td>
                <td className="border border-gray-300 px-4 py-2 text-center">
  {new Date(todo.created).toLocaleString("en-US", {
    timeZone: "Asia/Manila",
    month: "short",
    day: "2-digit",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true
  })}
</td>
                <td className="border border-gray-300 px-4 py-2 text-center w-1/6">
                  <div className="flex justify-center items-center space-x-2 relative -translate-y-3">
                    <button
                      onClick={() => { setEditText(todo); document.getElementById("edit-modal").showModal(); }}
                      className="focus:outline-none bg-transparent hover:bg-gray-200 p-1 rounded"
                    >
                      <MdEditNote className="text-xl text-indigo-600 hover:text-indigo-800" />
                    </button>
                    <button
                      onClick={() => handleDelete(todo.id)}
                      className="focus:outline-none bg-transparent hover:bg-gray-200 p-1 rounded"
                    >
                      <MdOutlineDeleteOutline className="text-xl text-red-600 hover:text-red-800" />
                    </button>
                  </div>
                </td>
              </tr>
              
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modals (Stock In, Out, etc.) */}
      <dialog id="stock-in-modal" className="modal">
        <form method="dialog" className="modal-box">
          <h3 className="font-bold text-lg mb-4">Stock In</h3>
          <input name="id" placeholder="Item ID" onChange={(e) => handleStockChange(e, setStockInData)} className="input input-bordered w-full mb-3" />
          <input name="quantity" placeholder="Quantity" type="number" onChange={(e) => handleStockChange(e, setStockInData)} className="input input-bordered w-full mb-3" />
          
          <div className="modal-action">
            <button type="button" className="btn btn-primary" onClick={() => handleStockAction("stock_in", stockInData, "stock-in-modal", "Stock added", "Failed to stock in")}>Submit</button>
            <button className="btn">Cancel</button>
          </div>
        </form>
      </dialog>

      <dialog id="stock-out-modal" className="modal">
        <form method="dialog" className="modal-box">
          <h3 className="font-bold text-lg mb-4">Stock Out</h3>
          <input name="id" placeholder="Item ID" onChange={(e) => handleStockChange(e, setStockOutData)} className="input input-bordered w-full mb-3" />
          <input name="quantity" placeholder="Quantity" type="number" onChange={(e) => handleStockChange(e, setStockOutData)} className="input input-bordered w-full mb-3" />
         
          <div className="modal-action">
            <button type="button" className="btn btn-secondary" onClick={() => handleStockAction("stock_out", stockOutData, "stock-out-modal", "Stock updated", "Failed to stock out")}>Submit</button>
            <button className="btn">Cancel</button>
          </div>
        </form>
      </dialog>

      <dialog id="stock-out-event-modal" className="modal">
        <form method="dialog" className="modal-box">
          <h3 className="font-bold text-lg mb-4">Stock Out (Event)</h3>
          <input name="id" placeholder="Item ID" onChange={(e) => handleStockChange(e, setStockOutEventData)} className="input input-bordered w-full mb-3" />
          <input name="quantity" placeholder="Quantity" type="number" onChange={(e) => handleStockChange(e, setStockOutEventData)} className="input input-bordered w-full mb-3" />
          <input
  name="reason"
  placeholder="Reason for stock-out"
  onChange={(e) => handleStockChange(e, setStockOutEventData)}
  className="input input-bordered w-full mb-3"
/>
          <div className="modal-action">
            <button type="button" className="btn btn-info" onClick={() => handleStockAction("stockoutevent", stockOutEventData, "stock-out-event-modal", "Event stock updated", "Failed to update")}>Submit</button>
            <button className="btn">Cancel</button>
          </div>
        </form>
      </dialog>

      <dialog id="stock-in-return-modal" className="modal">
        <form method="dialog" className="modal-box">
          <h3 className="font-bold text-lg mb-4">Stock-In Return</h3>
          <input name="id" placeholder="Item ID" onChange={(e) => handleStockChange(e, setStockInReturnData)} className="input input-bordered w-full mb-3" />
          <input name="quantity" placeholder="Quantity" type="number" onChange={(e) => handleStockChange(e, setStockInReturnData)} className="input input-bordered w-full mb-3" />
          <div className="modal-action">
            <button type="button" className="btn btn-accent" onClick={() => handleStockAction("stockinreturn", stockInReturnData, "stock-in-return-modal", "Return updated", "Failed to return stock")}>Submit</button>
            <button className="btn">Cancel</button>
          </div>
        </form>
      </dialog>

    <dialog id="edit-modal" className="modal">
    <form method="dialog" className="modal-box">
    <h3 className="font-bold text-lg mb-4">Edit Item</h3>
    <label className="block font-medium mb-2">Product</label>
    <input
      type="text"
      name="body"
      value={editText.body}
      onChange={handleChange}
      placeholder="Type here"
      className="input input-bordered w-full mb-3"
    />

    <label className="block font-medium mb-2">Volume</label>
    <input
      type="text"
      name="volume"
      value={editText.volume}
      onChange={handleChange}
      placeholder="Volume"
      className="input input-bordered w-full mb-3"
    />
    <label className="block font-medium mb-2">Ingredients Type</label>
    <select
      name="type"
      className="select select-bordered w-full mb-3"
      onChange={handleChange}
      value={editText.type || ''}
    >
      <option value="" disabled>Select ingredient type</option>
      <option value="Beverage">Beverage</option>
      <option value="Fruits">Fruits</option>
      <option value="Non-Perishable Item">Non-Perishable Item</option>
    </select>
    <div className="modal-action">
      <button
        type="button"
        className="btn btn-primary"
        onClick={() => {
          handleClick();
          document.getElementById('edit-modal').close();
        }}
      >
        Save Changes
      </button>
      <button className="btn">Cancel</button>
    </div>
  </form>
</dialog>


    </div>
  );
};

export default Table;
