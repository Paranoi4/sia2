import React, { useEffect, useState } from "react";
import axios from "axios";

const ManagePackages = () => {
  const [packages, setPackages] = useState([]);
  const [newPackage, setNewPackage] = useState({ pax: "", price: "", available: true });
  const [drinkCategories, setDrinkCategories] = useState([]);
  const [newCategory, setNewCategory] = useState({ name: "", items: "" });

  useEffect(() => {
    axios.get("http://127.0.0.1:8000/api/packages/")
      .then((res) => setPackages(res.data))
      .catch((err) => console.error("Failed to load packages", err));

    axios.get("http://127.0.0.1:8000/api/drink-categories/")
      .then((res) => setDrinkCategories(res.data))
      .catch((err) => console.error("Failed to load drink categories", err));
  }, []);

  const handlePackageChange = (index, field, value) => {
    const updated = [...packages];
    updated[index][field] = field === "price" ? parseInt(value) : value;
    setPackages(updated);
  };

  const toggleAvailability = (index) => {
    const updated = [...packages];
    updated[index].available = !updated[index].available;
    setPackages(updated);
  };

  const handleSavePackages = async () => {
    try {
      for (const pkg of packages) {
        await axios.put(`http://127.0.0.1:8000/api/packages/${pkg.id}/`, pkg);
      }
      alert("Packages updated!");
    } catch (error) {
      console.error("Failed to save packages", error);
    }
  };

  const handleAddPackage = async () => {
    if (!newPackage.pax || !newPackage.price) {
      alert("Please enter pax and price.");
      return;
    }
    try {
      const res = await axios.post("http://127.0.0.1:8000/api/packages/", newPackage);
      setPackages([...packages, res.data]);
      setNewPackage({ pax: "", price: "", available: true });
    } catch (error) {
      console.error("Failed to add package", error);
    }
  };

  const handleCategoryChange = (index, field, value) => {
    const updated = [...drinkCategories];
    updated[index][field] = value;
    setDrinkCategories(updated);
  };

  const handleSaveDrinkCategories = async () => {
    try {
      for (const category of drinkCategories) {
        await axios.put(`http://127.0.0.1:8000/api/drink-categories/${category.id}/`, category);
      }
      alert("Drink categories updated!");
    } catch (error) {
      console.error("Failed to update drink categories", error);
    }
  };

  const handleAddCategory = async () => {
    if (!newCategory.name || !newCategory.items) {
      alert("Please enter both name and items.");
      return;
    }
    try {
      const res = await axios.post("http://127.0.0.1:8000/api/drink-categories/", newCategory);
      setDrinkCategories([...drinkCategories, res.data]);
      setNewCategory({ name: "", items: "" });
    } catch (err) {
      console.error("Failed to add new category", err);
    }
  };

  const handleDeleteCategory = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this category?");
    if (!confirmDelete) return;
  
    try {
      await axios.delete(`http://127.0.0.1:8000/api/drink-categories/${id}/`);
      setDrinkCategories(drinkCategories.filter(category => category.id !== id));
      alert("Category deleted successfully.");
    } catch (error) {
      console.error("Failed to delete category", error);
    }
  };
  

  return (
    <div className="p-4 bg-white rounded shadow">
      <h2 className="text-4xl font-bold mb-6 text-gray-800">Manage Packages</h2>

      <table className="table-auto w-full border-separate border-spacing-0 bg-white shadow-md rounded border border-gray-300 mb-6">
  <thead>
    <tr className="bg-gray-900 text-white">
      <th className="border border-gray-300 px-4 py-3 text-center">PAX</th>
      <th className="border border-gray-300 px-4 py-3 text-center">Price</th>
      <th className="border border-gray-300 px-4 py-3 text-center">Available</th>
    </tr>
  </thead>
        <tbody>
          {packages.map((pkg, index) => (
            <tr key={pkg.id} className="hover:bg-gray-100 transition">
            <td className="border border-gray-300 px-4 py-2">
              <input
                type="text"
                value={pkg.pax}
                onChange={(e) => handlePackageChange(index, "pax", e.target.value)}
                className="border border-gray-300 rounded px-4 py-2 w-full"
              />
            </td>
            <td className="border border-gray-300 px-4 py-2">
              <input
                type="number"
                value={pkg.price}
                onChange={(e) => handlePackageChange(index, "price", e.target.value)}
                className="border border-gray-300 rounded px-4 py-2 w-full"
              />
            </td>
            <td className="border border-gray-300 px-4 py-2 text-center">
              <input
                type="checkbox"
                checked={pkg.available}
                onChange={() => toggleAvailability(index)}
              />
            </td>
          </tr>
        ))}
      </tbody>
    </table>

      <button
        onClick={handleSavePackages}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mb-8"
      >
        Save Package Changes
      </button>

      <h3 className="text-xl font-semibold mb-2">Add New Package</h3>
      <div className="flex items-center gap-4 mb-10">
        <input
          type="text"
          placeholder="e.g. 50 pax"
          value={newPackage.pax}
          onChange={(e) => setNewPackage({ ...newPackage, pax: e.target.value })}
          className="border rounded p-2 w-1/3"
        />
        <input
          type="number"
          placeholder="e.g. 15000"
          value={newPackage.price}
          onChange={(e) => setNewPackage({ ...newPackage, price: e.target.value })}
          className="border rounded p-2 w-1/3"
        />
        <label className="flex items-center gap-1">
          <input
            type="checkbox"
            checked={newPackage.available}
            onChange={(e) => setNewPackage({ ...newPackage, available: e.target.checked })}
          />
          Available
        </label>
        <button
          onClick={handleAddPackage}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 -mt-1"
        >
          Add Package
        </button>
      </div>

      <h2 className="text-4xl font-bold mb-6 text-gray-800">Manage Beverages</h2>

      <table className="table-auto w-full border-separate border-spacing-0 bg-white shadow-md rounded border border-gray-300 mb-6">
  <thead>
    <tr className="bg-gray-900 text-white">
      <th className="border border-gray-300 px-4 py-3 text-center">Category</th>
      <th className="border border-gray-300 px-4 py-3 text-center">Items (comma separated)</th>
      <th className="border border-gray-300 px-4 py-3 text-center">Action</th>
    </tr>
  </thead>
  <tbody>
    {drinkCategories.map((category, index) => (
      <tr key={category.id} className="hover:bg-gray-100 transition">
        <td className="border border-gray-300 px-4 py-2">
          <input
            type="text"
            value={category.name}
            onChange={(e) => handleCategoryChange(index, "name", e.target.value)}
            className="border border-gray-300 rounded px-4 py-2 w-full"
          />
        </td>
        <td className="border border-gray-300 px-4 py-2">
          <textarea
            value={category.items}
            onChange={(e) => handleCategoryChange(index, "items", e.target.value)}
            className="border border-gray-300 rounded px-4 py-2 w-full"
            rows={2}
          />
        </td>
        <td className="border border-gray-300 px-4 py-2 text-center">
        <button
          onClick={() => handleDeleteCategory(category.id)}
          className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600 -mt-1"
        >
          Delete
        </button>
      </td>
      </tr>
    ))}
  </tbody>
</table>

      <button
        onClick={handleSaveDrinkCategories}
        className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
      >
        Save Drink Categories
      </button>

      <h3 className="text-xl font-semibold mb-2 mt-10">Add New Drink Category</h3>
      <div className="flex flex-col md:flex-row items-start md:items-center gap-4 mb-6">
        <input
          type="text"
          placeholder="Category Name (e.g. Mocktail)"
          value={newCategory.name}
          onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
          className="border rounded p-2 w-full md:w-1/3"
        />
        <textarea
          placeholder="Drink items (e.g. Margarita, Mojito)"
          value={newCategory.items}
          onChange={(e) => setNewCategory({ ...newCategory, items: e.target.value })}
          className="border rounded p-2 w-full md:w-1/2"
          rows={2}
        />
        <button
          onClick={handleAddCategory}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 -mt-1"
        >
          Add Drink Category
        </button>
      </div>
    </div>
  );
};

export default ManagePackages;