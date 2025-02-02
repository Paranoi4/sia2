import React, { useState } from 'react';
import axios from 'axios';

const TodoForm = ({ todos, setTodos }) => {
 
  const [newTodo, setNewTodo] = useState({
    body: '',
    quantity: '',
    type: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewTodo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const postTodo = async () => {
    try {
      const existingItem = todos.find(todo => todo.body === newTodo.body);
  
      if (existingItem) {
        // Update existing item quantity
        const updatedQuantity = parseInt(existingItem.quantity) + parseInt(newTodo.quantity);
  
        const response = await axios.patch(`http://127.0.0.1:8000/api/todo/${existingItem.id}/`, {
          quantity: updatedQuantity
        });
  
        setTodos(todos.map(todo => todo.id === existingItem.id ? { ...todo, quantity: updatedQuantity } : todo));
      } else {
        // Create new item
        const response = await axios.post('http://127.0.0.1:8000/api/todo/', newTodo);
        setTodos([...todos, response.data]);
      }
  
      setNewTodo({
        body: '',
        quantity: '',
        type: '',
      });
  
      document.querySelector('.modal').close();
    } catch (error) {
      console.error(error);
    }
  };
  

  return (
    <div> 
      <dialog className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Fill Up Details</h3>
          <form
            method="dialog"
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              postTodo();
            }}
          >
            <div>
              <label className="label">
                <span className="label-text">Product</span>
              </label>
              <input
                type="text"
                name="body"
                onChange={handleChange}
                value={newTodo.body}
                placeholder="Enter product name"
                className="input input-bordered w-full"
              />
            </div>
            <div>
              <label className="label">
                <span className="label-text">Quantity</span>
              </label>
              <input
                type="text"
                name="quantity"
                onChange={handleChange}
                value={newTodo.quantity}
                placeholder="Enter quantity"
                className="input input-bordered w-full"
              />
            </div>
            <div>
              <label className="label">
                <span className="label-text">Ingredients Type</span>
              </label>
              <select
                name="type"
                onChange={handleChange}
                value={newTodo.type}
                className="select select-bordered w-full"
              >
                <option disabled value="">
                  Select ingredient type
                </option>
                <option value="Beverage">Beverage</option>
                <option value="Fruits">Fruits</option>
                <option value="Non-Perishable Item">Non-Perishable Item</option>
              </select>
            </div>
            <div className="modal-action">
              <button type="submit" className="btn btn-primary">
                Submit
              </button>
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => document.querySelector('.modal').close()}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </dialog>
    </div>
  );
};

export default TodoForm;
