import React, { useState, useEffect } from "react";
import FilterBar from "./components/FilterBar";
import ProductCard from "./components/ProductCard";
import CartSidebar from "./components/CartSidebar";
import "./App.css";

function App() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [filters, setFilters] = useState({ searchTerm: "", category: "All", sortOrder: "" });

  useEffect(() => {
    fetch("https://fakestoreapi.com/products")
      .then(res => res.json())
      .then(data => {
        const withStock = data.map(p => ({ ...p, stock: Math.floor(Math.random() * 6) }));
        setProducts(withStock);
        setFilteredProducts(withStock);
      });
  }, []);

  useEffect(() => {
    let result = products.filter(p => 
      p.title.toLowerCase().includes(filters.searchTerm.toLowerCase()) &&
      (filters.category === "All" || p.category === filters.category)
    );
    if (filters.sortOrder === "low") result.sort((a, b) => a.price - b.price);
    if (filters.sortOrder === "high") result.sort((a, b) => b.price - a.price);
    setFilteredProducts(result);
  }, [filters, products]);

  const addToCart = (product) => {
    setCart(prev => {
      const exists = prev.find(i => i.id === product.id);
      return exists 
        ? prev.map(i => i.id === product.id ? {...i, quantity: i.quantity + 1} : i)
        : [...prev, {...product, quantity: 1}];
    });
  };

  const removeFromCart = (id) => {
    setCart(prev => prev.reduce((ack, item) => {
      if (item.id === id) {
        if (item.quantity === 1) return ack;
        return [...ack, { ...item, quantity: item.quantity - 1 }];
      }
      return [...ack, item];
    }, []));
  };

  return (
    <div className="container">
      <h1 className="title">Premium E-Commerce</h1>
      <FilterBar 
        filters={filters} 
        setFilters={setFilters} 
        clearFilters={() => setFilters({searchTerm: "", category: "All", sortOrder: ""})} 
      />
      <div className="main-layout">
        <section className="products-section">
          <div className="product-grid">
            {filteredProducts.map(p => (
              <ProductCard key={p.id} product={p} onAdd={addToCart} />
            ))}
          </div>
        </section>
        <CartSidebar 
          cart={cart} 
          onAdd={addToCart} 
          onRemove={removeFromCart} 
          onDelete={(id) => setCart(cart.filter(i => i.id !== id))}
          onCheckout={() => {alert("Order Placed!"); setCart([]);}}
        />
      </div>
    </div>
  );
}

export default App;