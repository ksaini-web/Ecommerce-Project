import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from './CartContext';
import './Cards.css';

function Cards({ products = [] }) {
  const { addToCart } = useContext(CartContext);

  const categoryStyles = {
    smartphones: 'from-sky-500 via-cyan-400 to-blue-600',
    laptops: 'from-violet-500 via-fuchsia-500 to-indigo-600',
    fragrances: 'from-rose-400 via-pink-400 to-orange-300',
    beauty: 'from-emerald-400 via-lime-300 to-teal-500',
    groceries: 'from-amber-400 via-yellow-300 to-orange-400',
    'home-decoration': 'from-slate-500 via-zinc-400 to-stone-500',
    others: 'from-slate-600 via-slate-500 to-slate-400',
  };

  const renderStars = (rating) =>
    Array.from({ length: 5 }, (_, index) => (
      <span
        key={index}
        className={index < Math.round(rating) ? 'cards-star is-active' : 'cards-star'}
      >
        ★
      </span>
    ));

  return (
    <section className="cards-shell">
      <div className="cards-grid">
        {products.map((product) => {
          const price = Number(product.price ?? 0);
          const discount = Number(product.discountPercentage ?? 0);
          const oldPrice = discount
            ? (price / (1 - discount / 100)).toFixed(2)
            : price.toFixed(2);
          const accent = categoryStyles[product.category] || categoryStyles.others;

          return (
            <article key={product.id} className="product-card">
              <div className={`product-card__glow bg-gradient-to-br ${accent}`} />

              <Link to={`/productdetail/${product.id}`} className="product-card__link">
                <div className="product-card__top">
                  <span className={`product-card__badge bg-gradient-to-r ${accent}`}>
                    {discount.toFixed(0)}% OFF
                  </span>
                  <span className="product-card__meta">
                    {product.category?.replace('-', ' ')}
                  </span>
                </div>

                <div className="product-card__image-wrap">
                  <div className="product-card__orb" />
                  <img
                    src={product.thumbnail}
                    alt={product.title}
                    className="product-card__image"
                  />
                </div>

                <div className="product-card__content">
                  <h2 className="product-card__title">{product.title}</h2>
                  <p className="product-card__description">{product.description}</p>

                  <div className="product-card__price-row">
                    <div>
                      <p className="product-card__old-price">${oldPrice}</p>
                      <p className="product-card__price">${price.toFixed(2)}</p>
                    </div>
                    <div className="product-card__rating-box">
                      <div className="product-card__stars">{renderStars(product.rating)}</div>
                      <span>{Number(product.rating ?? 0).toFixed(1)}</span>
                    </div>
                  </div>

                  <div className="product-card__footer">
                    <span className="product-card__stock">
                      {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                    </span>
                    <span className="product-card__shipping">Fast delivery</span>
                  </div>
                </div>
              </Link>

              <button className="product-card__button" onClick={() => addToCart(product, 1)}>
                Add To Cart
              </button>
            </article>
          );
        })}
      </div>
    </section>
  );
}

export default Cards;
