import React from 'react';

export default function FilterBar({ filters, setFilters, clearFilters }) {
  return (
    <div className="filter-bar">
      <input 
        type="text" 
        placeholder="Search products..." 
        value={filters.searchTerm} 
        onChange={(e) => setFilters({...filters, searchTerm: e.target.value})} 
      />
      <select 
        value={filters.category} 
        onChange={(e) => setFilters({...filters, category: e.target.value})}
      >
        <option value="All">All Categories</option>
        <option value="electronics">Electronics</option>
        <option value="jewelery">Jewelery</option>
        <option value="men's clothing">Men's Clothing</option>
        <option value="women's clothing">Women's Clothing</option>
      </select>
      <select 
        value={filters.sortOrder} 
        onChange={(e) => setFilters({...filters, sortOrder: e.target.value})}
      >
        <option value="">Sort by Price</option>
        <option value="low">Price: Low to High</option>
        <option value="high">Price: High to Low</option>
      </select>
      <button className="clear-btn" onClick={clearFilters}>Clear Filters</button>
    </div>
  );
}