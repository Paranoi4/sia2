import React, { useState } from 'react';
import axios from 'axios';
import { MdOutlineDeleteOutline, MdEditNote } from 'react-icons/md';

const Table = ({ todos, setTodos, isLoading }) => {
  const [stockOutData, setStockOutData] = useState({ id: '', quantity: '' });
  const [stockInData, setStockInData] = useState({ id: '', quantity: '' });
  const [stockOutEventData, setStockOutEventData] = useState({ id: '', quantity: '' });
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
      const response = await axios.patch(`http://127.0.0.1:8000/api/todo/${id}/`, updatedTodo);
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
    try {
      await axios.delete(`http://127.0.0.1:8000/api/todo/${id}/`);
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
      const response = await axios.patch(`http://127.0.0.1:8000/api/todo/${data.id}/${endpoint}/`, { quantity: data.quantity });
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
      <div className="flex flex-wrap gap-3 justify-center mb-6">
        <input
          type="text"
          placeholder="Search inventory..."
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
          className="input input-bordered w-full max-w-md"
        />
       <button
  className="btn btn-success ml-4"
  onClick={() => document.querySelector('.modal').showModal()}
>
  Add Item
</button>
        <button className="btn btn-primary" onClick={() => document.getElementById('stock-in-modal').showModal()}>
          Stock In
        </button>
        <button className="btn btn-secondary" onClick={() => document.getElementById('stock-out-modal').showModal()}>
          Stock Out
        </button>
        <button className="btn btn-info" onClick={() => document.getElementById('stock-out-event-modal').showModal()}>
          Stock Out (Event)
        </button>
        <button className="btn btn-accent" onClick={() => document.getElementById('stock-in-return-modal').showModal()}>
          Stock-In Return
        </button>
      </div>

      {/* Table */}
      <div className="bg-white p-4 rounded-lg shadow-md overflow-x-auto">
        <table className="w-full table-auto text-sm text-left">
          <thead className="bg-gray-800 text-white uppercase text-xs">
            <tr>
              <th className="px-4 py-2">No ID.</th>
              <th className="px-4 py-2">Product</th>
              <th className="px-4 py-2">Quantity</th>
              <th className="px-4 py-2">Volume</th>
              <th className="px-4 py-2">Type</th>
              <th className="px-4 py-2">Date Added</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {isLoading ? (
              <tr><td colSpan="7" className="text-center py-4">Loading...</td></tr>
            ) : (
              filteredTodos.map((todo) => (
                <tr key={todo.id} className="hover:bg-gray-100">
                  <td className="px-4 py-2">{todo.id}</td>
                  <td className="px-4 py-2">{todo.body}</td>
                  <td className="px-4 py-2">
                    <span className="bg-green-200 text-green-800 px-2 py-1 rounded text-xs font-medium">
                      {todo.quantity}
                    </span>
                  </td>
                  <td className="px-4 py-2">{todo.volume}</td>
                  <td className="px-4 py-2">{todo.type}</td>
                  <td className="px-4 py-2">{todo.created}</td>
                  <td className="px-4 py-2 space-x-2">
                  <button
  onClick={() => {
    setEditText(todo);
    document.getElementById("edit-modal").showModal();
  }}
  className="text-blue-600 hover:text-blue-800"
>
  <MdEditNote className="text-xl" />
</button>

                    <button onClick={() => handleDelete(todo.id)} className="text-red-600 hover:text-red-800">
                      <MdOutlineDeleteOutline className="text-xl" />
                    </button>
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
    <h3 className="font-bold text-lg mb-4">Edit Todo</h3>
    <label className="block font-medium mb-2">Product</label>
    <input
      type="text"
      name="body"
      value={editText.body}
      onChange={handleChange}
      placeholder="Type here"
      className="input input-bordered w-full mb-3"
    />
    <label className="block font-medium mb-2">Quantity</label>
    <input
      type="number"
      name="quantity"
      value={editText.quantity}
      onChange={handleChange}
      placeholder="Quantity"
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
