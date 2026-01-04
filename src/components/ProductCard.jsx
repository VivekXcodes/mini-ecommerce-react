import React from 'react';

export default function ProductCard({ product, onAdd }) {
  return (
    <div className="product-card">
      <div className="image-container">
        <img src={product.image} alt={product.title} />
        <span className={`stock-badge ${product.stock > 0 ? "in-stock" : "out-of-stock"}`}>
          {product.stock > 0 ? `In Stock (${product.stock})` : "Out of Stock"}
        </span>
      </div>
      <h3>{product.title.substring(0, 25)}...</h3>
      <p className="price">${product.price}</p>
      <button 
        className="add-btn" 
        onClick={() => onAdd(product)}
        disabled={product.stock === 0}
      >
        {product.stock > 0 ? "Add to Cart" : "Unavailable"}
      </button>
    </div>
  );
}
