import React from 'react';
import { Link } from 'react-router-dom';
import './RelatedProducts.css';

function RelatedProducts({ products = [] }) {
  if (!products || products.length === 0) {
    return <p className="related-products__empty">No related products</p>;
  }

  return (
    <section className="related-products">
      <div className="related-products__header">
        <h2>Related Products</h2>
        <p>More picks you may want to explore.</p>
      </div>

      <div className="related-products__track">
        {products.map((p) => (
          <Link to={`/productdetail/${p.id}`} key={p.id} className="related-products__card">
            <img src={p.thumbnail} alt={p.title} />
            <h3>{p.title}</h3>
            <p className="related-products__price">${Number(p.price).toFixed(2)}</p>
            <p className="related-products__old-price">
              ${(p.price / (1 - p.discountPercentage / 100)).toFixed(2)}
            </p>

            <div className="related-products__stars">
              {Array.from({ length: 5 }, (_, i) => (
                <span
                  key={i}
                  className={i < Math.round(p.rating) ? 'is-active' : ''}
                >
                  ★
                </span>
              ))}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

export default RelatedProducts;
