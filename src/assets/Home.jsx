import React, { useEffect, useState } from 'react';
import axios from 'axios';
import TopBar from '../TopBar';
import Navbar from '../Navbar';
import HeroSection from '../HeroSection';
import Cards from '../Cards';
import './Home.css';

function Home() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const productsPerPage = 8;
  const indexOfLast = currentPage * productsPerPage;
  const indexOfFirst = indexOfLast - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirst, indexOfLast);

  useEffect(() => {
    axios
      .get('https://dummyjson.com/products')
      .then((res) => {
        setProducts(res.data.products);
        setFilteredProducts(res.data.products);
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <div className="home-page">
      <div className="home-page__inner">
        <TopBar />

        <div className="home-page__panel">
          <Navbar
            products={products}
            setFilteredProduct={setFilteredProducts}
            setCurrentPage={setCurrentPage}
          />

          <HeroSection />

          <div className="home-page__section-head">
            <div>
              <span className="home-page__eyebrow">Curated products</span>
              <h2>Fresh deals for your everyday cart</h2>
            </div>
            <p>{filteredProducts.length} products found</p>
          </div>

          <Cards products={currentProducts} />

          <div className="home-page__pagination">
            <button
              type="button"
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Prev
            </button>

            <span>Page {currentPage}</span>

            <button
              type="button"
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={indexOfLast >= filteredProducts.length}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
