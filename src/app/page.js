// app/page.js
"use client";
import { useState, useEffect } from 'react';
import axios from 'axios';
import AddItemForm from './components/addItems';

export default function Home() {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const res = await axios.get(`/api?page=${page}`);
      const newItems = [...items, ...res.data.items];
      setItems(newItems);
      setFilteredItems(newItems);
      setLoading(false);
    };
    if (!query) {
      fetchData();
    }
  }, [page, query]);

  const handleSearch = (e) => {
    setQuery(e.target.value);
    const searchQuery = e.target.value.toLowerCase();
    setFilteredItems(
      items.filter(
        (item) =>
          item.name.toLowerCase().startsWith(searchQuery) ||
          item.description.toLowerCase().includes(searchQuery) ||
          item.price.toString().startsWith(searchQuery)
      )
    );
  };

  const handleScroll = () => {
    if (
      !query &&
      window.innerHeight + document.documentElement.scrollTop + 1 >=
      document.documentElement.scrollHeight
    ) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [query]);

  return (
    <div className="flex bg-white min-h-screen">
      
      <div className="w-1/4 p-4 border-r border-gray-300">
        <AddItemForm
          items={items}
          setItems={setItems}
          setFilteredItems={setFilteredItems}
          query={query}
        />
      </div>

      <div className="flex-1 p-6">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">Search Demo</h2>
        <input
          type="text"
          placeholder="Search..."
          value={query}
          onChange={handleSearch}
          className="my-6 p-2 border border-gray-300 rounded w-full"
        />

        <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
          {filteredItems.map((product) => (
            <div key={product.id} className="group relative">
              <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md bg-gray-200 group-hover:opacity-75 lg:h-80">
                <img
                  alt={product.description}
                  src={product.image}
                  className="h-full w-full object-cover object-center"
                />
              </div>
              <div className="mt-4 flex justify-between">
                <div>
                  <h3 className="text-sm text-gray-700">
                    <a href="#">
                      <span aria-hidden="true" className="absolute inset-0" />
                      {product.name}
                    </a>
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">{product.description}</p>
                </div>
                <p className="text-sm font-medium text-gray-900">${product.price}</p>
              </div>
            </div>
          ))}
        </div>

        {loading && <p className="text-center mt-4">Loading...</p>}
      </div>
    </div>
  );
}
