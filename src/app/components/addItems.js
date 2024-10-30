// app/components/addItems.js
"use client";
import { useState } from 'react';
import { faker } from '@faker-js/faker';

export default function AddItemForm({ items, setItems, setFilteredItems, query }) {
  const [formData, setFormData] = useState({ name: '', description: '', price: '' });

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle new item addition
  const addItem = (e) => {
    e.preventDefault();
    const { name, description, price } = formData;

    if (!name || !description || !price) {
      alert("Please fill out all fields.");
      return;
    }

    const newItem = {
      id: faker.string.uuid(),
      name,
      description,
      price: parseFloat(price).toFixed(2),
      image: faker.image.urlPicsumPhotos({ width: 200, height: 200 })
    };

    const updatedItems = [newItem, ...items];
    setItems(updatedItems);

    // Filtered items logic based on the query
    setFilteredItems(
      updatedItems.filter(
        (item) =>
          item.name.toLowerCase().startsWith(query.toLowerCase()) ||
          item.description.toLowerCase().includes(query.toLowerCase()) ||
          item.price.toString().startsWith(query)
      )
    );

    setFormData({ name: '', description: '', price: '' });
  };

  return (
    <form onSubmit={addItem} className="space-y-4">
      <h3 className="text-xl font-semibold text-gray-800">Add New Item</h3>
      <input
        type="text"
        name="name"
        value={formData.name}
        onChange={handleInputChange}
        placeholder="Item Name"
        className="p-2 border border-gray-300 rounded w-full"
      />
      <input
        type="text"
        name="description"
        value={formData.description}
        onChange={handleInputChange}
        placeholder="Item Description"
        className="p-2 border border-gray-300 rounded w-full"
      />
      <input
        type="number"
        name="price"
        value={formData.price}
        onChange={handleInputChange}
        placeholder="Item Price"
        className="p-2 border border-gray-300 rounded w-full"
      />
      <button
        type="submit"
        className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Add Item
      </button>
    </form>
  );
}
