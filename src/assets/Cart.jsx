import React, { useContext } from 'react';
import { FaCartArrowDown } from 'react-icons/fa';
import { CartContext } from '../CartContext';
import Navbar from '../Navbar';
import './Cart.css';

function Cart() {
  const { cart } = useContext(CartContext);
  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <div className="cart-page">
      <div className="cart-page__inner">
        <Navbar />

        <section className="cart">
          <div className="cart__banner">Hurry up! Your items are reserved for 10 minutes.</div>

          <div className="cart__body">
            {cart.length === 0 ? (
              <div className="cart__empty">
                <FaCartArrowDown />
                <span>Your cart is empty</span>
              </div>
            ) : (
              cart.map((item, index) => (
                <article
                  key={item.id}
                  className="cart__item"
                  style={{ animationDelay: `${index * 90}ms` }}
                >
                  <div className="cart__product">
                    <img src={item.thumbnail} alt={item.title} />
                    <div>
                      <h2>{item.title}</h2>
                      <p>Qty: {item.quantity}</p>
                    </div>
                  </div>

                  <p className="cart__price">${(item.price * item.quantity).toFixed(2)}</p>
                </article>
              ))
            )}
          </div>

          <div className="cart__footer">
            <h1>Total Price: ${total.toFixed(2)}</h1>
            {cart.length !== 0 && <button type="button">Buy Now</button>}
          </div>
        </section>
      </div>
    </div>
  );
}

export default Cart;
