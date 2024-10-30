"use client";
import { useState, useEffect } from 'react';
import axios from 'axios';

export default function Home() {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  // Fetch data on load and on page change for infinite scroll
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

  // Handle search
  const handleSearch = (e) => {
    setQuery(e.target.value);
    if (e.target.value) {
      const filtered = items.filter(
        (item) =>
          item.name.toLowerCase().startsWith(e.target.value.toLowerCase(), 0) ||
          item.description.toLowerCase().includes(e.target.value.toLowerCase(), 0) ||
          item.price.toString().startsWith(e.target.value, 0)
      );
      setFilteredItems(filtered);
    } else {
      setFilteredItems(items);
    }
  };

  // Infinite scrolling
  const handleScroll = () => {
    if (
      !query && // Only lazy load if there’s no active search query
      window.innerHeight + document.documentElement.scrollTop + 1 >=
      document.documentElement.scrollHeight
    ) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    // Crrectively need this clean-up here.
    return () => window.removeEventListener('scroll', handleScroll);
  }, [query]); // Depend on query so it re-evaluates on search change

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">Search Demo</h2>

        <input
          type="text"
          placeholder="Search..."
          value={query}
          onChange={handleSearch}
          className="my-6 p-2 border border-gray-300 rounded w-full"
        />

        <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
          {filteredItems.map((product) => (
            <div key={product.id} className="group relative">
              <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md bg-gray-200 lg:aspect-none group-hover:opacity-75 lg:h-80">
                <img
                  alt={product.description} 
                  src={product.image || 'https://via.placeholder.com/150'} // Placeholder for images
                  className="h-full w-full object-cover object-center lg:h-full lg:w-full"
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
                  <p className="mt-1 text-sm text-gray-500">{product.description || 'Default Color'}</p>
                </div>
                <p className="text-sm font-medium text-gray-900">${product.price}</p>
              </div>
            </div>
          ))}
       
    </div>
    </div>
    </div>
  );
}
