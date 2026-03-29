import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import RelatedProducts from './RelatedProducts';
import { CartContext } from './CartContext';
import Navbar from './Navbar';
import './ProductDetail.css';

function ProductDetail() {
  const { id } = useParams();
  const [product, setProducts] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [qty, setQty] = useState(1);
  const { addToCart } = useContext(CartContext);

  const filteredProduct = product
    ? relatedProducts.filter((p) => p.id !== product.id)
    : [];

  const decreaseQty = () => {
    if (qty > 1) {
      setQty(qty - 1);
    }
  };

  useEffect(() => {
    axios
      .get(`https://dummyjson.com/products/${id}`)
      .then((res) => setProducts(res.data))
      .catch((err) => console.log(err));
  }, [id]);

  useEffect(() => {
    if (product) {
      axios
        .get(`https://dummyjson.com/products/category/${product.category}`)
        .then((res) => setRelatedProducts(res.data.products))
        .catch((err) => console.log(err));
    }
  }, [product]);

  if (!product) {
    return <p className="product-detail__loading">Loading...</p>;
  }

  return (
    <div className="product-detail-page">
      <div className="product-detail-page__inner">
        <Navbar />

        <section className="product-detail">
          <div className="product-detail__media">
            <img src={product.thumbnail} alt={product.title} />
          </div>

          <div className="product-detail__content">
            <span className="product-detail__category">
              {product.category?.replace('-', ' ')}
            </span>
            <h1>{product.title}</h1>
            <p className="product-detail__rating">★ {Number(product.rating ?? 0).toFixed(1)}</p>
            <p className="product-detail__price">${(product.price * qty).toFixed(2)}</p>
            <p className="product-detail__description">{product.description}</p>

            <div className="product-detail__qty">
              <button type="button" onClick={decreaseQty}>
                -
              </button>
              <span>{qty}</span>
              <button type="button" onClick={() => setQty(qty + 1)}>
                +
              </button>
            </div>

            <div className="product-detail__actions">
              <button
                type="button"
                className="product-detail__button product-detail__button--primary"
                onClick={() => addToCart(product, qty)}
              >
                Add To Cart
              </button>
              <button type="button" className="product-detail__button product-detail__button--secondary">
                Buy Now
              </button>
            </div>
          </div>
        </section>

        <RelatedProducts products={filteredProduct} />
      </div>
    </div>
  );
}

export default ProductDetail;
