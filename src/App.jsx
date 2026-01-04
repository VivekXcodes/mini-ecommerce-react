import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("All");
  const [sortOrder, setSortOrder] = useState("");

  useEffect(() => {
    fetch("https://fakestoreapi.com/products")
      .then((res) => res.json())
      .then((data) => {
        // STOCK LOGIC: Add a random stock property to each product
        const productsWithStock = data.map(product => ({
          ...product,
          stock: Math.floor(Math.random() * 10) // Random stock between 0 and 9
        }));
        setProducts(productsWithStock);
        setFilteredProducts(productsWithStock);
        setLoading(false);
      })
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    let result = [...products];
    if (searchTerm) {
      result = result.filter((p) => p.title.toLowerCase().includes(searchTerm.toLowerCase()));
    }
    if (category !== "All") {
      result = result.filter((p) => p.category === category);
    }
    if (sortOrder === "low") result.sort((a, b) => a.price - b.price);
    else if (sortOrder === "high") result.sort((a, b) => b.price - a.price);
    
    setFilteredProducts(result);
  }, [searchTerm, category, sortOrder, products]);

  const addToCart = (product) => {
    setCart((prevCart) => {
      const isItemInCart = prevCart.find((item) => item.id === product.id);
      if (isItemInCart) {
        return prevCart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId) => {
    setCart((prevCart) =>
      prevCart.reduce((ack, item) => {
        if (item.id === productId) {
          if (item.quantity === 1) return ack;
          return [...ack, { ...item, quantity: item.quantity - 1 }];
        } else {
          return [...ack, item];
        }
      }, [])
    );
  };

  const deleteFromCart = (productId) => {
    setCart(cart.filter(item => item.id !== productId));
  };

  const totalPrice = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <div className="container">
      <h1 className="title">Mini E-Commerce Store</h1>

      <div className="filter-bar">
        <input type="text" placeholder="Search products..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="All">All Categories</option>
          <option value="electronics">Electronics</option>
          <option value="jewelery">Jewelery</option>
          <option value="men's clothing">Men's Clothing</option>
          <option value="women's clothing">Women's Clothing</option>
        </select>
        <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
          <option value="">Sort by Price</option>
          <option value="low">Price: Low to High</option>
          <option value="high">Price: High to Low</option>
        </select>
        <button className="clear-btn" onClick={() => {setSearchTerm(""); setCategory("All"); setSortOrder("");}}>Clear Filters</button>
      </div>

      <div className="main-layout">
        <section className="products-section">
          {loading ? (
            <div className="loader">Loading...</div>
          ) : (
            <div className="product-grid">
              {filteredProducts.map((product) => (
                <div key={product.id} className="product-card">
                  <div className="image-container">
                    <img src={product.image} alt={product.title} />
                    {/* STOCK LOGIC: Badge display */}
                    <span className={`stock-badge ${product.stock > 0 ? "in-stock" : "out-of-stock"}`}>
                      {product.stock > 0 ? `In Stock (${product.stock})` : "Out of Stock"}
                    </span>
                  </div>
                  <h3>{product.title.substring(0, 25)}...</h3>
                  <p className="price">${product.price}</p>
                  
                  {/* STOCK LOGIC: Disable button if out of stock */}
                  <button 
                    className="add-btn" 
                    onClick={() => addToCart(product)}
                    disabled={product.stock === 0}
                  >
                    {product.stock > 0 ? "Add to Cart" : "Unavailable"}
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        <aside className="cart-sidebar">
          <h2>Your Cart ({cart.reduce((acc, item) => acc + item.quantity, 0)})</h2>
          {cart.length === 0 ? (
            <p>Cart is empty</p>
          ) : (
            <>
              <div className="cart-items">
                {cart.map((item) => (
                  <div key={item.id} className="cart-item">
                    <img src={item.image} alt={item.title} />
                    <div className="cart-item-info">
                      <p className="item-title">{item.title.substring(0, 15)}...</p>
                      <div className="qty-controls">
                        <button onClick={() => removeFromCart(item.id)}>-</button>
                        <span>{item.quantity}</span>
                        <button onClick={() => addToCart(item)}>+</button>
                      </div>
                      <p className="item-subtotal">${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                    <button className="delete-btn" onClick={() => deleteFromCart(item.id)}>×</button>
                  </div>
                ))}
              </div>
              <div className="cart-total">
                <h3>Total: ${totalPrice.toFixed(2)}</h3>
                <button className="checkout-btn" onClick={() => {alert("Order Placed!"); setCart([]);}}>Checkout</button>
              </div>
            </>
          )}
        </aside>
      </div>
    </div>
  );
}

export default App;