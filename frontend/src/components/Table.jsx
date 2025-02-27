import React, { useState } from 'react';
import axios from 'axios';
import { MdOutlineDeleteOutline, MdEditNote, MdOutlineCheckBox, MdOutlineCheckBoxOutlineBlank } from 'react-icons/md';

const Table = ({ todos, setTodos, isLoading }) => {
  const [stockOutData, setStockOutData] = useState({ id: '', quantity: '' });
  const [stockInData, setStockInData] = useState({ id: '', quantity: '' });
  const [filterText, setFilterText] = useState('');
  const filteredTodos = todos.filter(todo =>
    todo.body.toLowerCase().includes(filterText.toLowerCase()) ||
    todo.type.toLowerCase().includes(filterText.toLowerCase()) ||
    todo.quantity.toString().includes(filterText)
  );
  const [editText, setEditText] = useState({
    id: '',
    body: '',
    quantity: '',
    type: '',
  });





  const handleStockOutChange = (e) => {
    const { name, value } = e.target;
    setStockOutData(prev => ({ ...prev, [name]: value }));
  };

  const handleStockInChange = (e) => {
    const { name, value } = e.target;
    setStockInData(prev => ({ ...prev, [name]: value }));
  };
  const handleStockOut = async () => {
    const { id, quantity } = stockOutData;
    
    if (!id || !quantity) {
      alert("Please enter both ID and quantity.");
      return;
    }
    
    try {
      const response = await axios.patch(`http://127.0.0.1:8000/api/todo/${id}/stock_out/`, { quantity });

      // Update state to reflect new quantity
      const updatedTodos = todos.map(todo =>
        todo.id.toString() === id ? { ...todo, quantity: response.data.updated_quantity } : todo
      );
      
      setTodos(updatedTodos);
      setStockOutData({ id: '', quantity: '' });
      document.getElementById('stock-out-modal').close();
      
      alert("Stock updated successfully.");
    } catch (error) {
      alert(error.response?.data?.error || "Failed to update stock.");
    }
  };

  const handleStockIn = async () => {
    const { id, quantity } = stockInData;
    
    if (!id || !quantity) {
      alert("Please enter both ID and quantity.");
      return;
    }

    try {
      const response = await axios.patch(`http://127.0.0.1:8000/api/todo/${id}/stock_in/`, { quantity });

      const updatedTodos = todos.map(todo =>
        todo.id.toString() === id ? { ...todo, quantity: response.data.updated_quantity } : todo
      );
      
      setTodos(updatedTodos);
      setStockInData({ id: '', quantity: '' });
      document.getElementById('stock-in-modal').close();
      
      alert("Stock added successfully.");
    } catch (error) {
      alert(error.response?.data?.error || "Failed to add stock.");
    }
  };
  
  // Function to delete a todo
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/api/todo/${id}/`);
      const newList = todos.filter((todo) => todo.id !== id);
      setTodos(newList);
    } catch (error) {
      console.log(error);
    }
  };

  // Function to handle text change in the modal input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditText((prev) => ({
      ...prev,
      [name]: value, // Dynamically updates the correct field
    }));
  };

  // Function to handle the edit action
  const handleEdit = async (id, updatedTodo) => {
    try {
      const response = await axios.patch(`http://127.0.0.1:8000/api/todo/${id}/`, updatedTodo);
      const updatedTodos = todos.map((todo) =>
        todo.id === id
          ? { ...todo, body: response.data.body, quantity: response.data.quantity, type: response.data.type }
          : todo
      );
      setTodos(updatedTodos);
    } catch (error) {
      console.error(error);
    }
  };

  // Function to handle the "Edit" button click in the modal
  const handleClick = () => {
    handleEdit(editText.id, {
      body: editText.body,
      quantity: editText.quantity,
      type: editText.type,
    });

    setEditText({
      id: '',
      body: '',
      quantity: '',
      type: '',
    });
  };

  


  
  
  return (
    <div className="py-8">
      <div className="flex justify-center items-center mb-4">
        <input
          type="text"
          placeholder="Filter todos..."
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
          className="input input-bordered w-full max-w-md"/>
        <button
          className="btn ml-4"
          onClick={() => document.querySelector('.modal').showModal()}>
          Add Item
        </button>    
        <button
          className="btn ml-4"
          onClick={() => document.getElementById('stock-in-modal').showModal()}>
          Stock - In 
        </button> 
        <button
          className="btn ml-4"
          onClick={() => document.getElementById('stock-out-modal').showModal()}>
          Stock - Out 
        </button>
        


      </div>
      

      <table className="w-11/12 max-w-4x1">
        <thead className="border-b-2 border-black">
          <tr>
            <th className="p-3 text-sm font-semibold tracking-wide text-left">Checkbox</th>
            <th className="p-3 text-sm font-semibold tracking-wide text-left">No ID.</th>
            <th className="p-3 text-sm font-semibold tracking-wide text-left">Product</th>
            <th className="p-3 text-sm font-semibold tracking-wide text-left">Quantity</th>
            <th className="p-3 text-sm font-semibold tracking-wide text-left">Ingredients Type</th>
            <th className="p-3 text-sm font-semibold tracking-wide text-left">Date Added</th>
            <th className="p-3 text-sm font-semibold tracking-wide text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr>
              <td colSpan="7" className="text-center">
                Is Loading
              </td>
            </tr>
          ) : (
            filteredTodos.map((todoItem, index) => (
              <tr key={todoItem.id || index} className="border-b border-black">
                <td className="p-3 text-sm">
                  <span className="inline-block cursor-pointer">
                    {todoItem.completed ? <MdOutlineCheckBox /> : <MdOutlineCheckBoxOutlineBlank />}
                  </span>
                </td>
                <td className="p-3 text-sm">{todoItem.id}</td>
                <td className="p-3 text-sm">{todoItem.body}</td>
                <td className="p-3 text-sm text-center">
                  <span className="p-1.5 text-xs font-medium tracking-wider rounded-md bg-green-300">{todoItem.quantity}</span>
                </td>
                <td className="p-3 text-sm">{todoItem.type}</td>
                <td className="p-3 text-sm">{todoItem.created}</td>
                <td className="p-3 text-xs font-medium grid grid-flow-col items-center mt-5">
                  <span>
                    <label htmlFor="my-modal">
                      <MdEditNote
                        onClick={() => setEditText({
                          id: todoItem.id,
                          body: todoItem.body,
                          quantity: todoItem.quantity,
                          type: todoItem.type,
                        })}
                        className="text-xl cursor-pointer"
                      />
                    </label>
                  </span>
                  <span className="text-x1 cursor-pointer">
                    <MdOutlineDeleteOutline onClick={() => handleDelete(todoItem.id)} />
                  </span>
                </td>
                
              </tr>
            ))
          )}
        </tbody>
      </table>




       {/* Stock-in */}
      <dialog id="stock-in-modal" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Stock In Item</h3>
          <label className="block font-medium mb-2">Enter ID</label>
          <input
            type="text"
            name="id"
            value={stockInData.id}
            onChange={handleStockInChange}
            placeholder="Item ID"
            className="input input-bordered w-full"
          />
          <label className="block font-medium mb-2">Enter Quantity</label>
          <input
            type="number"
            name="quantity"
            value={stockInData.quantity}
            onChange={handleStockInChange}
            placeholder="Quantity"
            className="input input-bordered w-full"
          />
          <div className="modal-action">
            <button className="btn btn-primary" onClick={handleStockIn}>Submit</button>
            <button className="btn" onClick={() => document.getElementById('stock-in-modal').close()}>Close</button>
          </div>
        </div>
      </dialog>

       {/* stock out */}
      <dialog id="stock-out-modal" className="modal">
    <div className="modal-box">
    <h3 className="font-bold text-lg">Stock Out Item</h3>
    <label className="block font-medium mb-2">Enter ID</label>
    <input
      type="text"
      name="id"
      value={stockOutData.id}
      onChange={handleStockOutChange}
      placeholder="Item ID"
      className="input input-bordered w-full"
    />
    <label className="block font-medium mb-2">Enter Quantity</label>
    <input
      type="number"
      name="quantity"
      value={stockOutData.quantity}
      onChange={handleStockOutChange}
      placeholder="Quantity"
      className="input input-bordered w-full"
    />
    <div className="modal-action">
      <button className="btn btn-primary" onClick={handleStockOut}>Submit</button>
      <button className="btn" onClick={() => document.getElementById('stock-out-modal').close()}>Close</button>
    </div>
  </div>
</dialog>

      {/* Modal */}
      <input type="checkbox" id="my-modal" className="modal-toggle" />
      <div className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Edit Todo</h3>
          <label className="block font-medium mb-2">Product</label>
          <input
            type="text"
            name="body"
            value={editText.body}
            onChange={handleChange}
            placeholder="Type here"
            className="input input-bordered w-full "
          />
          <label className="block font-medium mb-2">Quantity</label>
          <input
            type="number"
            name="quantity"
            value={editText.quantity}
            onChange={handleChange}
            placeholder="Quantity"
            className="input input-bordered w-full"
          />
          <label className="block font-medium mb-2">Ingredients Type</label>
          <select
            name="type"
            className="select select-bordered w-full"
            onChange={handleChange}
            value={editText.type || ''}
          >
            <option value="" disabled>
              Select ingredient type
            </option>
            <option value="Beverage">Beverage</option>
            <option value="Fruits">Fruits</option>
            <option value="Non-Perishable Item">Non-Perishable Item</option>
          </select>
          <div className="modal-action">
            <label htmlFor="my-modal" onClick={handleClick} className="btn btn-primary">
              Edit
            </label>
            <label htmlFor="my-modal" className="btn">
              Close
            </label>
          </div>
        </div>
      </div>
      
    </div>
  );
};

export default Table;
