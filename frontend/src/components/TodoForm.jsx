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
      const response = await axios.post('http://127.0.0.1:8000/api/todo/', newTodo);

      // Update the todos state directly by appending the new todo
      setTodos((prev) => [...prev, response.data]);

      // Clear the input fields after submission
      setNewTodo({
        body: '',
        quantity: '',
        type: '',
      });

      // Close the modal (if using a modal to add items)
      document.querySelector('.modal').close();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <button className="btn ml-4" onClick={() => document.querySelector('.modal').showModal()}>
        Add Item
      </button>
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
