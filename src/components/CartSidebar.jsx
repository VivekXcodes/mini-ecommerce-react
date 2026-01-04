import React from 'react';

export default function CartSidebar({ cart, onAdd, onRemove, onDelete, onCheckout }) {
  const totalPrice = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <aside className="cart-sidebar">
      <h2>Your Cart ({cart.reduce((acc, item) => acc + item.quantity, 0)})</h2>
      {cart.length === 0 ? <p>Cart is empty</p> : (
        <>
          <div className="cart-items">
            {cart.map((item) => (
              <div key={item.id} className="cart-item">
                <img src={item.image} alt="" />
                <div className="cart-item-info">
                  <p className="item-title">{item.title.substring(0, 15)}...</p>
                  <div className="qty-controls">
                    <button onClick={() => onRemove(item.id)}>-</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => onAdd(item)}>+</button>
                  </div>
                  <p className="item-subtotal">${(item.price * item.quantity).toFixed(2)}</p>
                </div>
                <button className="delete-btn" onClick={() => onDelete(item.id)}>×</button>
              </div>
            ))}
          </div>
          <div className="cart-total">
            <h3>Total: ${totalPrice.toFixed(2)}</h3>
            <button className="checkout-btn" onClick={onCheckout}>Checkout</button>
          </div>
        </>
      )}
    </aside>
  );
}